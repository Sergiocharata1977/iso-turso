import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';
import { secureQuery, logTenantOperation, checkPermission } from '../middleware/tenantMiddleware.js';
import ActivityLogService from '../services/activityLogService.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// GET /api/puestos - Obtener todos los puestos de la organización
router.get('/', async (req, res, next) => {
  try {
    const organizationId = req.user?.organization_id || req.organizationId;
    console.log('🔓 Obteniendo puestos para organización:', organizationId);
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM puestos WHERE organization_id = ? ORDER BY created_at DESC`,
      args: [String(organizationId)]
    });
    
    console.log(`🔓 Puestos cargados para organización ${organizationId}: ${result.rows.length} registros`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al cargar puestos:', error);
    next(error);
  }
});

// GET /api/puestos/:id - Obtener un puesto específico de la organización
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const query = secureQuery(req);
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM puestos WHERE id = ? AND ${query.where()}`,
      args: [id, ...query.args()]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Puesto no encontrado' });
    }

    logTenantOperation(req, 'GET_PUESTO', { puestoId: id });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/puestos - Crear un nuevo puesto
router.post('/', async (req, res, next) => {
  console.log('📝 POST /api/puestos - Datos recibidos:', req.body);
  console.log('👤 Usuario:', req.user);

  try {
    if (!checkPermission(req, 'employee')) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }

    const {
      nombre,
      descripcion,
      requisitos_experiencia,
      requisitos_formacion
    } = req.body;

    const query = secureQuery(req);
    const usuario = req.user || { id: null, nombre: 'Sistema' };

    console.log('🔍 Validando campos obligatorios:', { nombre, organization_id: query.organizationId });
    if (!nombre) {
      console.log('❌ Error: Falta campo nombre');
      return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
    }

    // Verificar si ya existe un puesto con el mismo nombre en la organización
    console.log('🔍 Verificando si existe puesto:', { nombre, organization_id: query.organizationId });
    const existente = await tursoClient.execute({
      sql: `SELECT id FROM puestos WHERE nombre = ? AND ${query.where()}`,
      args: [nombre, ...query.args()]
    });
    
    if (existente.rows.length > 0) {
      console.log('❌ Error: Puesto ya existe');
      return res.status(409).json({ error: `Ya existe un puesto con el nombre '${nombre}' en la organización.` });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Insertar el nuevo puesto
    console.log('📝 Insertando nuevo puesto:', {
      id,
      nombre,
      descripcion,
      organization_id: query.organizationId,
      requisitos_experiencia,
      requisitos_formacion
    });

    const sql = `INSERT INTO puestos (
      id, nombre, descripcion_responsabilidades, organization_id,
      requisitos_experiencia, requisitos_formacion, created_at, updated_at, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const args = [
      id,
      nombre.trim(),
      descripcion || null,
      query.organizationId,
      requisitos_experiencia || null,
      requisitos_formacion || null,
      now,
      now,
      usuario.id
    ];

    await tursoClient.execute({ sql, args });

    // Obtener el puesto recién creado
    const nuevoPuesto = await tursoClient.execute({
      sql: `SELECT * FROM puestos WHERE id = ? AND ${query.where()}`,
      args: [id, ...query.args()]
    });

    console.log('✅ Puesto creado exitosamente:', nuevoPuesto.rows[0]);

    // Registrar actividad
    await ActivityLogService.logActivity({
      userId: usuario.id,
      action: 'CREATE',
      resource: 'puestos',
      resourceId: id,
      details: `Creado puesto: ${nombre}`,
      organizationId: query.organizationId
    });

    logTenantOperation(req, 'CREATE_PUESTO', { puestoId: id, nombre });
    res.status(201).json(nuevoPuesto.rows[0]);
  } catch (error) {
    console.error('❌ Error al crear puesto:', error);
    next(error);
  }
});

// PUT /api/puestos/:id - Actualizar un puesto existente
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!checkPermission(req, 'employee')) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }

    const {
      nombre,
      descripcion,
      requisitos_experiencia,
      requisitos_formacion
    } = req.body;

    const query = secureQuery(req);
    const usuario = req.user || { id: null, nombre: 'Sistema' };

    if (!nombre) {
      return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
    }

    // Verificar si ya existe otro puesto con el mismo nombre en la organización
    const existente = await tursoClient.execute({
      sql: `SELECT id FROM puestos WHERE nombre = ? AND id != ? AND ${query.where()}`,
      args: [nombre, id, ...query.args()]
    });
    
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: `Ya existe otro puesto con el nombre '${nombre}' en la organización.` });
    }

    const now = new Date().toISOString();
    
    const result = await tursoClient.execute({
      sql: `UPDATE puestos 
            SET nombre = ?, descripcion_responsabilidades = ?, requisitos_experiencia = ?, 
                requisitos_formacion = ?, updated_at = ?, updated_by = ?
            WHERE id = ? AND ${query.where()} RETURNING *`,
      args: [nombre.trim(), descripcion || null, requisitos_experiencia || null, 
             requisitos_formacion || null, now, usuario.id, id, ...query.args()]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Puesto no encontrado' });
    }

    // Registrar actividad
    await ActivityLogService.logActivity({
      userId: usuario.id,
      action: 'UPDATE',
      resource: 'puestos',
      resourceId: id,
      details: `Actualizado puesto: ${nombre}`,
      organizationId: query.organizationId
    });

    logTenantOperation(req, 'UPDATE_PUESTO', { puestoId: id, nombre });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`❌ Error al actualizar puesto ${id}:`, error);
    next(error);
  }
});

// DELETE /api/puestos/:id - Eliminar un puesto
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!checkPermission(req, 'manager')) {
      return res.status(403).json({ error: 'Permisos insuficientes - se requiere rol manager o superior' });
    }

    const query = secureQuery(req);
    const usuario = req.user || { id: null, nombre: 'Sistema' };
    
    const result = await tursoClient.execute({
      sql: `DELETE FROM puestos WHERE id = ? AND ${query.where()}`,
      args: [id, ...query.args()]
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Puesto no encontrado' });
    }

    // Registrar actividad
    await ActivityLogService.logActivity({
      userId: usuario.id,
      action: 'DELETE',
      resource: 'puestos',
      resourceId: id,
      details: `Eliminado puesto`,
      organizationId: query.organizationId
    });

    logTenantOperation(req, 'DELETE_PUESTO', { puestoId: id });
    res.status(204).send();
  } catch (error) {
    console.error(`❌ Error al eliminar puesto ${id}:`, error);
    next(error);
  }
});

export default router;