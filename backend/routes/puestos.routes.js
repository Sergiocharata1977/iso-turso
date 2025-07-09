import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';
import ActivityLogService from '../services/activityLogService.js';

const router = Router();

// GET /api/puestos - Obtener todos los puestos
router.get('/', async (req, res, next) => {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT * FROM puestos ORDER BY created_at DESC;`,
      args: []
    });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/puestos - Crear un nuevo puesto
router.post('/', async (req, res, next) => {
  console.log('📝 POST /api/puestos - Datos recibidos:', req.body);
  console.log('👤 Usuario:', req.user);

  const {
    nombre,
    descripcion,
    organization_id,
    requisitos_experiencia,
    requisitos_formacion
  } = req.body;

  const usuario = req.user || { id: null, nombre: 'Sistema' };

  console.log('🔍 Validando campos obligatorios:', { nombre, organization_id });
  if (!nombre || !organization_id) {
    console.log('❌ Error: Faltan campos obligatorios');
    return res.status(400).json({ error: 'Los campos "nombre" y "organization_id" son obligatorios.' });
  }

  try {
    // Verificar si ya existe un puesto con el mismo nombre en la misma organización
    console.log('🔍 Verificando si existe puesto:', { nombre, organization_id });
    const existente = await tursoClient.execute({
      sql: 'SELECT id FROM puestos WHERE nombre = ? AND organization_id = ?',
      args: [nombre, organization_id]
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
      organization_id,
      requisitos_experiencia,
      requisitos_formacion
    });

    const sql = `INSERT INTO puestos (
      id, nombre, descripcion_responsabilidades, organization_id,
      requisitos_experiencia, requisitos_formacion, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const args = [
      id,
      nombre.trim(),
      descripcion || null,
      organization_id,
      requisitos_experiencia || null,
      requisitos_formacion || null,
      now,
      now
    ];

    console.log('🔍 SQL:', sql);
    console.log('📊 Args:', args);

    await tursoClient.execute({ sql, args });

    // Registrar en la bitácora
    console.log('📝 Registrando en bitácora');
    await ActivityLogService.registrarCreacion(
      'puesto',
      id,
      { nombre, descripcion_responsabilidades: descripcion, organization_id, requisitos_experiencia, requisitos_formacion },
      usuario,
      organization_id
    );

    // Devolver el objeto recién creado
    const newPuesto = {
      id,
      nombre,
      descripcion_responsabilidades: descripcion || null,
      organization_id,
      requisitos_experiencia: requisitos_experiencia || null,
      requisitos_formacion: requisitos_formacion || null,
      created_at: now,
      updated_at: now
    };

    console.log('✅ Puesto creado exitosamente:', newPuesto);
    res.status(201).json(newPuesto);

  } catch (error) {
    console.error('❌ Error al crear puesto:', error);
    console.error('Stack:', error.stack);
    next(error);
  }
});

// GET /api/puestos/:id - Obtener un puesto por ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `SELECT * FROM puestos WHERE id = ?;`,
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Puesto con ID ${id} no encontrado.` });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/puestos/:id - Actualizar un puesto
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    requisitos_experiencia,
    requisitos_formacion
  } = req.body;
  const usuario = req.user || { id: null, nombre: 'Sistema' };

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron datos para actualizar.' });
  }

  try {
    const puestoActual = await tursoClient.execute({
      sql: 'SELECT * FROM puestos WHERE id = ?',
      args: [id]
    });

    if (puestoActual.rows.length === 0) {
      return res.status(404).json({ error: `Puesto con ID ${id} no encontrado.` });
    }

    // Verificar nombre único si se está cambiando
    if (nombre && nombre !== puestoActual.rows[0].nombre) {
      const nombreExistente = await tursoClient.execute({
        sql: 'SELECT id FROM puestos WHERE nombre = ? AND organization_id = ? AND id != ?',
        args: [nombre, puestoActual.rows[0].organization_id, id]
      });
      
      if (nombreExistente.rows.length > 0) {
        return res.status(409).json({ error: `Ya existe otro puesto con el nombre '${nombre}' en la organización.` });
      }
    }

    // Obtener datos anteriores para la bitácora
    const prevData = puestoActual.rows[0];

    const fieldsToUpdate = [];
    const valuesToUpdate = [];

    if (nombre !== undefined) { fieldsToUpdate.push('nombre = ?'); valuesToUpdate.push(nombre.trim()); }
    if (descripcion !== undefined) { fieldsToUpdate.push('descripcion_responsabilidades = ?'); valuesToUpdate.push(descripcion || null); }
    if (requisitos_experiencia !== undefined) { fieldsToUpdate.push('requisitos_experiencia = ?'); valuesToUpdate.push(requisitos_experiencia || null); }
    if (requisitos_formacion !== undefined) { fieldsToUpdate.push('requisitos_formacion = ?'); valuesToUpdate.push(requisitos_formacion || null); }

    fieldsToUpdate.push('updated_at = ?');
    valuesToUpdate.push(new Date().toISOString());

    valuesToUpdate.push(id); // Para el WHERE id = ?

    const sql = `UPDATE puestos SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    await tursoClient.execute({ sql, args: valuesToUpdate });

    // Registrar en la bitácora
    await ActivityLogService.registrarModificacion(
      'puesto',
      id,
      prevData,
      { nombre, descripcion_responsabilidades: descripcion, requisitos_experiencia, requisitos_formacion },
      usuario,
      puestoActual.rows[0].organization_id
    );

    // Obtener y devolver el puesto actualizado
    const updated = await tursoClient.execute({
      sql: 'SELECT * FROM puestos WHERE id = ?',
      args: [id]
    });

    res.json(updated.rows[0]);

  } catch (error) {
    next(error);
  }
});

// DELETE /api/puestos/:id - Eliminar un puesto
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const usuario = req.user || { id: null, nombre: 'Sistema' };

  try {
    // Obtener el puesto antes de eliminarlo para la bitácora
    const puestoActual = await tursoClient.execute({
      sql: 'SELECT * FROM puestos WHERE id = ?',
      args: [id]
    });

    if (puestoActual.rows.length === 0) {
      return res.status(404).json({ error: `Puesto con ID ${id} no encontrado.` });
    }

    const prevData = puestoActual.rows[0];

    // Eliminar el puesto
    await tursoClient.execute({
      sql: 'DELETE FROM puestos WHERE id = ?',
      args: [id]
    });

    // Registrar en la bitácora
    await ActivityLogService.registrarEliminacion(
      'puesto',
      id,
      prevData,
      usuario,
      prevData.organization_id
    );

    res.json({ message: 'Puesto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
});

export default router;