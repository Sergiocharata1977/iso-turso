import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/auditorias - Listar todas las auditorías
router.get('/', async (req, res, next) => {
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT * FROM auditorias
        ORDER BY fecha_inicio DESC
      `
    });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/auditorias - Crear una nueva auditoría
router.post('/', async (req, res, next) => {
  const { 
    codigo,
    titulo, 
    tipo, 
    alcance, 
    fecha_inicio,
    fecha_fin,
    responsable,
    auditores,
    resultado,
    estado
  } = req.body;

  if (!codigo || !titulo) {
    const err = new Error('Los campos "codigo" y "titulo" son obligatorios.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const existingAuditoria = await tursoClient.execute({
      sql: 'SELECT id FROM auditorias WHERE codigo = ?',
      args: [codigo]
    });

    if (existingAuditoria.rows.length > 0) {
      const err = new Error('Ya existe una auditoría con ese código.');
      err.statusCode = 400;
      return next(err);
    }

    const fechaCreacion = new Date().toISOString();
    const id = crypto.randomUUID();
    
    await tursoClient.execute({
      sql: `INSERT INTO auditorias (
              id, codigo, titulo, tipo, alcance, 
              fecha_inicio, fecha_fin, responsable, auditores, 
              resultado, estado, fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      args: [
        id,
        codigo,
        titulo, 
        tipo || null, 
        alcance || null, 
        fecha_inicio || null,
        fecha_fin || null,
        responsable || null,
        auditores || null,
        resultado || null,
        estado || 'planificada',
        fechaCreacion
      ],
    });

    const newAuditoriaResult = await tursoClient.execute({
      sql: 'SELECT * FROM auditorias WHERE id = ?',
      args: [id]
    });
    
    // Aunque la inserción fue exitosa, la consulta SELECT podría no devolver filas si hay replicación o algún delay.
    // Es más robusto devolver el objeto construido con los datos de entrada si la inserción no falló.
    if (newAuditoriaResult.rows.length > 0) {
        res.status(201).json(newAuditoriaResult.rows[0]);
    } else {
        // Si la SELECT no devuelve nada, pero la inserción fue OK, devolvemos los datos que teníamos.
        // Esto es un fallback, idealmente la SELECT siempre debería funcionar tras un INSERT exitoso.
        res.status(201).json({ 
            id, codigo, titulo, tipo, alcance, fecha_inicio, fecha_fin, 
            responsable, auditores, resultado, estado: estado || 'planificada', fecha_creacion: fechaCreacion
        });
    }

  } catch (error) {
    next(error);
  }
});

// GET /api/auditorias/:id - Obtener una auditoría por ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM auditorias WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      const err = new Error('Auditoría no encontrada.');
      err.statusCode = 404;
      return next(err);
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/auditorias/:id - Actualizar una auditoría
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { 
    codigo,
    titulo, 
    tipo, 
    alcance, 
    fecha_inicio,
    fecha_fin,
    responsable,
    auditores,
    resultado,
    estado
  } = req.body;

  if (!codigo || !titulo) {
    const err = new Error('Los campos "codigo" y "titulo" son obligatorios.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM auditorias WHERE id = ?',
      args: [id]
    });
    
    if (existsCheck.rows.length === 0) {
      const err = new Error('Auditoría no encontrada.');
      err.statusCode = 404;
      return next(err);
    }

    const duplicateCheck = await tursoClient.execute({
      sql: 'SELECT id FROM auditorias WHERE codigo = ? AND id != ?',
      args: [codigo, id]
    });

    if (duplicateCheck.rows.length > 0) {
      const err = new Error('Ya existe otra auditoría con ese código.');
      err.statusCode = 400;
      return next(err);
    }

    await tursoClient.execute({
      sql: `UPDATE auditorias SET 
              codigo = ?, titulo = ?, tipo = ?, alcance = ?, 
              fecha_inicio = ?, fecha_fin = ?, responsable = ?,
              auditores = ?, resultado = ?, estado = ?
            WHERE id = ?`, 
      args: [
        codigo,
        titulo, 
        tipo || null, 
        alcance || null, 
        fecha_inicio || null,
        fecha_fin || null,
        responsable || null,
        auditores || null,
        resultado || null,
        estado || 'planificada',
        id
      ],
    });

    const updatedAuditoriaResult = await tursoClient.execute({
      sql: 'SELECT * FROM auditorias WHERE id = ?',
      args: [id]
    });

    res.json(updatedAuditoriaResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/auditorias/:id - Eliminar una auditoría
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM auditorias WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      const err = new Error('Auditoría no encontrada.');
      err.statusCode = 404;
      return next(err);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/auditorias/estado/:estado - Obtener auditorías por estado
router.get('/estado/:estado', async (req, res, next) => {
  const { estado } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM auditorias WHERE estado = ? ORDER BY fecha_inicio DESC',
      args: [estado],
    });

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
