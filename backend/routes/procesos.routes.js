import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { ensureTenant, secureQuery, logTenantOperation, checkPermission } from '../middleware/tenantMiddleware.js';
import crypto from 'crypto';

const router = Router();

// Aplicar middlewares de autenticación y tenant a todas las rutas
router.use(authMiddleware);
router.use(ensureTenant);

// GET - Obtener todos los procesos de la organización
router.get('/', async (req, res) => {
  try {
    console.log('[GET /api/procesos] Obteniendo lista de procesos');
    
    const query = secureQuery(req);
    
    const result = await tursoClient.execute({
      sql: `SELECT id, nombre, responsable, descripcion FROM procesos 
            WHERE ${query.where()} 
            ORDER BY nombre`,
      args: query.args()
    });
    
    logTenantOperation(req, 'GET_PROCESOS', { count: result.rows.length });
    
    console.log(`[GET /api/procesos] ${result.rows.length} registros encontrados`);
    res.json(result.rows);
  } catch (error) {
    console.error('[GET /api/procesos] Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET - Obtener proceso por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(`[GET /api/procesos/${id}] Obteniendo proceso`);
    
    const query = secureQuery(req);
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM procesos WHERE id = ? AND ${query.where()}`,
      args: [id, ...query.args()]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proceso no encontrado' });
    }
    
    logTenantOperation(req, 'GET_PROCESO', { procesoId: id });
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[GET /api/procesos/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST - Crear nuevo proceso
router.post('/', async (req, res) => {
  try {
    // Verificar permisos - solo manager y admin pueden crear procesos
    if (!checkPermission(req, 'manager')) {
      return res.status(403).json({ 
        error: 'No tienes permisos para crear procesos' 
      });
    }

  const { nombre, responsable, descripcion } = req.body;

  console.log('[POST /api/procesos] Datos recibidos:', req.body);

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

    const query = secureQuery(req);
    const id = `proc-${crypto.randomUUID()}`;

    await tursoClient.execute({
      sql: `INSERT INTO procesos (id, nombre, responsable, descripcion, organization_id) 
            VALUES (?, ?, ?, ?, ?)`, 
      args: [id, nombre, responsable, descripcion, query.organizationId]
    });

    const newProceso = { id, nombre, responsable, descripcion };
    
    logTenantOperation(req, 'CREATE_PROCESO', { procesoId: id, nombre });
    
    console.log('[POST /api/procesos] Proceso creado exitosamente:', newProceso);
    res.status(201).json(newProceso);
  } catch (error) {
    console.error('[POST /api/procesos] Error:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el proceso.' });
  }
});

// PUT - Actualizar proceso
router.put('/:id', async (req, res) => {
  try {
    // Verificar permisos - solo manager y admin pueden actualizar procesos
    if (!checkPermission(req, 'manager')) {
      return res.status(403).json({ 
        error: 'No tienes permisos para actualizar procesos' 
      });
    }

  const { id } = req.params;
  const { nombre, responsable, descripcion } = req.body;

  console.log(`[PUT /api/procesos/${id}] Datos recibidos:`, req.body);

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

    const query = secureQuery(req);

    // Verificar que el proceso existe y pertenece a la organización
    const existsCheck = await tursoClient.execute({
      sql: `SELECT id FROM procesos WHERE id = ? AND ${query.where()}`,
      args: [id, ...query.args()]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Proceso no encontrado.' });
    }

    await tursoClient.execute({
      sql: `UPDATE procesos SET nombre = ?, responsable = ?, descripcion = ? 
            WHERE id = ? AND ${query.where()}`,
      args: [nombre, responsable, descripcion, id, ...query.args()]
    });

    const updatedProceso = { id, nombre, responsable, descripcion };
    
    logTenantOperation(req, 'UPDATE_PROCESO', { procesoId: id, nombre });
    
    console.log(`[PUT /api/procesos/${id}] Proceso actualizado exitosamente`);
    res.json(updatedProceso);
  } catch (error) {
    console.error(`[PUT /api/procesos/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE - Eliminar proceso
router.delete('/:id', async (req, res) => {
  try {
    // Verificar permisos - solo admin puede eliminar procesos
    if (!checkPermission(req, 'admin')) {
      return res.status(403).json({ 
        error: 'No tienes permisos para eliminar procesos' 
      });
    }

  const { id } = req.params;
    const query = secureQuery(req);

    console.log(`[DELETE /api/procesos/${id}] Eliminando proceso`);

    // Verificar que el proceso existe y pertenece a la organización
    const existsCheck = await tursoClient.execute({
      sql: `SELECT id FROM procesos WHERE id = ? AND ${query.where()}`,
      args: [id, ...query.args()]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Proceso no encontrado.' });
    }

    const result = await tursoClient.execute({
      sql: `DELETE FROM procesos WHERE id = ? AND ${query.where()}`,
      args: [id, ...query.args()]
    });

    if (result.rowsAffected === 0) {
        return res.status(404).json({ error: 'Proceso no encontrado.' });
    }

    logTenantOperation(req, 'DELETE_PROCESO', { procesoId: id });

    console.log(`[DELETE /api/procesos/${id}] Proceso eliminado exitosamente`);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(`[DELETE /api/procesos/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;