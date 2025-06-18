import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/capacitaciones - Listar todas las capacitaciones
router.get('/', async (req, res, next) => {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT * FROM capacitaciones ORDER BY fecha_inicio DESC`
    });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/capacitaciones - Crear una nueva capacitación
router.post('/', async (req, res, next) => {
  const { 
    titulo, 
    descripcion, 
    tipo,
    fecha_inicio,
    fecha_fin,
    instructor,
    participantes,
    estado,
    duracion,
    lugar,
    evaluacion
  } = req.body;

  if (!titulo) {
    const err = new Error('El campo "titulo" es obligatorio.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const fechaCreacion = new Date().toISOString();
    const id = crypto.randomUUID();
    
    await tursoClient.execute({
      sql: `INSERT INTO capacitaciones (
              id, titulo, descripcion, tipo, fecha_inicio, fecha_fin,
              instructor, participantes, estado, duracion, lugar,
              evaluacion, fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      args: [
        id,
        titulo, 
        descripcion || null, 
        tipo || 'Interna',
        fecha_inicio || fechaCreacion,
        fecha_fin || null,
        instructor || null,
        participantes ? JSON.stringify(participantes) : null,
        estado || 'planificada',
        duracion || null,
        lugar || null,
        evaluacion || null,
        fechaCreacion
      ],
    });

    const newCapacitacionResult = await tursoClient.execute({
        sql: `SELECT * FROM capacitaciones WHERE id = ?`,
        args: [id]
    });
    
    if (newCapacitacionResult.rows.length > 0) {
      res.status(201).json(newCapacitacionResult.rows[0]);
    } else {
      res.status(201).json({ 
        id, 
        titulo, 
        descripcion, 
        tipo: tipo || 'Interna',
        fecha_inicio: fecha_inicio || fechaCreacion,
        fecha_fin,
        instructor,
        participantes: participantes ? JSON.stringify(participantes) : null,
        estado: estado || 'planificada',
        duracion: duracion || null,
        lugar: lugar || null,
        evaluacion: evaluacion || null,
        fecha_creacion: fechaCreacion
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/capacitaciones/:id - Obtener una capacitación por ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `SELECT * FROM capacitaciones WHERE id = ?`,
      args: [id],
    });

    if (result.rows.length === 0) {
      const err = new Error('Capacitación no encontrada.');
      err.statusCode = 404;
      return next(err);
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/capacitaciones/:id - Actualizar una capacitación
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { 
    titulo, 
    descripcion, 
    tipo,
    fecha_inicio,
    fecha_fin,
    instructor,
    participantes,
    estado,
    duracion,
    lugar,
    evaluacion
  } = req.body;

  if (!titulo) {
    const err = new Error('El campo "titulo" es obligatorio.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM capacitaciones WHERE id = ?',
      args: [id]
    });
    
    if (existsCheck.rows.length === 0) {
      const err = new Error('Capacitación no encontrada.');
      err.statusCode = 404;
      return next(err);
    }

    await tursoClient.execute({
      sql: `UPDATE capacitaciones SET 
              titulo = ?, descripcion = ?, tipo = ?, fecha_inicio = ?, 
              fecha_fin = ?, instructor = ?, participantes = ?, 
              estado = ?, duracion = ?, lugar = ?, evaluacion = ?
            WHERE id = ?`,
      args: [
        titulo, 
        descripcion || null, 
        tipo || 'Interna',
        fecha_inicio || null,
        fecha_fin || null,
        instructor || null,
        participantes ? JSON.stringify(participantes) : null,
        estado || 'planificada',
        duracion || null,
        lugar || null,
        evaluacion || null,
        id
      ],
    });

    const updatedCapacitacionResult = await tursoClient.execute({
        sql: `SELECT * FROM capacitaciones WHERE id = ?`,
        args: [id]
    });

    res.json(updatedCapacitacionResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/capacitaciones/:id - Eliminar una capacitación
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM capacitaciones WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      const err = new Error('Capacitación no encontrada.');
      err.statusCode = 404;
      return next(err);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/capacitaciones/personal/:personalId - Obtener capacitaciones por ID de personal
router.get('/personal/:personalId', async (req, res, next) => {
  const { personalId } = req.params;
  try {
    const personalResult = await tursoClient.execute({
      sql: `SELECT id, nombre, apellido FROM personal WHERE id = ?`,
      args: [personalId],
    });

    if (personalResult.rows.length === 0) {
      const err = new Error('Personal no encontrado.');
      err.statusCode = 404;
      return next(err);
    }

    const result = await tursoClient.execute({
      sql: `SELECT * FROM capacitaciones WHERE participantes LIKE ?`,
      args: [`%${personalId}%`],
    });

    res.json({
      personal: personalResult.rows[0],
      capacitaciones: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/capacitaciones/:id/participantes - Añadir participantes a una capacitación
router.post('/:id/participantes', async (req, res, next) => {
  const { id } = req.params;
  const { participantes } = req.body;

  if (!participantes || !Array.isArray(participantes) || participantes.length === 0) {
    const err = new Error('Se requiere un array de IDs de participantes.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const capacitacionResult = await tursoClient.execute({
      sql: 'SELECT id, participantes FROM capacitaciones WHERE id = ?',
      args: [id]
    });
    
    if (capacitacionResult.rows.length === 0) {
      const err = new Error('Capacitación no encontrada.');
      err.statusCode = 404;
      return next(err);
    }

    let participantesActuales = [];
    if (capacitacionResult.rows[0].participantes) {
      try {
        participantesActuales = JSON.parse(capacitacionResult.rows[0].participantes);
        if (!Array.isArray(participantesActuales)) {
          participantesActuales = [];
        }
      } catch (e) {
        participantesActuales = [];
      }
    }

    const todosParticipantes = [...new Set([...participantesActuales, ...participantes])];

    await tursoClient.execute({
      sql: `UPDATE capacitaciones SET participantes = ? WHERE id = ?`,
      args: [JSON.stringify(todosParticipantes), id],
    });

    const updatedCapacitacionResult = await tursoClient.execute({
      sql: `SELECT * FROM capacitaciones WHERE id = ?`,
      args: [id]
    });

    res.json(updatedCapacitacionResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
