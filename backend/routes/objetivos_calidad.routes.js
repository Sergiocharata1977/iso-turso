import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/objetivos-calidad - Listar todos los objetivos de calidad
router.get('/', async (req, res, next) => {
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM objetivos_calidad ORDER BY fecha_creacion DESC'
    });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/objetivos-calidad/:id - Obtener un objetivo de calidad por ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM objetivos_calidad WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) {
      const err = new Error('Objetivo de calidad no encontrado');
      err.statusCode = 404;
      return next(err);
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/objetivos-calidad - Crear un nuevo objetivo de calidad
router.post('/', async (req, res, next) => {
  const { 
    codigo, 
    descripcion, 
    meta, 
    responsable, 
    fecha_inicio, 
    fecha_fin, 
    estado 
  } = req.body;

  if (!codigo || !descripcion) {
    const err = new Error('Los campos "codigo" y "descripcion" son obligatorios.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const existingObjetivo = await tursoClient.execute({
      sql: 'SELECT id FROM objetivos_calidad WHERE codigo = ?',
      args: [codigo]
    });

    if (existingObjetivo.rows.length > 0) {
      const err = new Error('Ya existe un objetivo de calidad con ese código.');
      err.statusCode = 400;
      return next(err);
    }

    const id = crypto.randomUUID();
    const fechaCreacion = new Date().toISOString();
    
    await tursoClient.execute({
      sql: `INSERT INTO objetivos_calidad (
              id, codigo, descripcion, meta, responsable, 
              fecha_inicio, fecha_fin, estado, fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        codigo,
        descripcion,
        meta || null,
        responsable || null,
        fecha_inicio || null,
        fecha_fin || null,
        estado || 'activo',
        fechaCreacion
      ]
    });

    const newObjetivoResult = await tursoClient.execute({
      sql: 'SELECT * FROM objetivos_calidad WHERE id = ?',
      args: [id]
    });
    
    res.status(201).json(newObjetivoResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/objetivos-calidad/:id - Actualizar un objetivo de calidad
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { 
    codigo, 
    descripcion, 
    meta, 
    responsable, 
    fecha_inicio, 
    fecha_fin, 
    estado 
  } = req.body;

  if (!codigo || !descripcion) {
    const err = new Error('Los campos "codigo" y "descripcion" son obligatorios.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM objetivos_calidad WHERE id = ?',
      args: [id]
    });
    
    if (existsCheck.rows.length === 0) {
      const err = new Error('Objetivo de calidad no encontrado');
      err.statusCode = 404;
      return next(err);
    }

    const duplicateCheck = await tursoClient.execute({
      sql: 'SELECT id FROM objetivos_calidad WHERE codigo = ? AND id != ?',
      args: [codigo, id]
    });

    if (duplicateCheck.rows.length > 0) {
      const err = new Error('Ya existe otro objetivo de calidad con ese código.');
      err.statusCode = 400;
      return next(err);
    }

    await tursoClient.execute({
      sql: `UPDATE objetivos_calidad SET 
              codigo = ?, descripcion = ?, meta = ?, responsable = ?,
              fecha_inicio = ?, fecha_fin = ?, estado = ?
            WHERE id = ?`,
      args: [
        codigo,
        descripcion,
        meta || null,
        responsable || null,
        fecha_inicio || null,
        fecha_fin || null,
        estado || 'activo',
        id
      ]
    });

    const updatedObjetivoResult = await tursoClient.execute({
      sql: 'SELECT * FROM objetivos_calidad WHERE id = ?',
      args: [id]
    });

    res.json(updatedObjetivoResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/objetivos-calidad/:id - Eliminar un objetivo de calidad
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM objetivos_calidad WHERE id = ?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      const err = new Error('Objetivo de calidad no encontrado');
      err.statusCode = 404;
      return next(err);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/objetivos-calidad/estado/:estado - Obtener objetivos por estado
router.get('/estado/:estado', async (req, res, next) => {
  const { estado } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM objetivos_calidad WHERE estado = ? ORDER BY fecha_creacion DESC',
      args: [estado]
    });

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
