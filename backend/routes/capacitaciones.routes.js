import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/capacitaciones - Listar todas las capacitaciones
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT * FROM capacitaciones ORDER BY fecha_inicio DESC`
    });
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener capacitaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/capacitaciones - Crear una nueva capacitación
router.post('/', async (req, res) => {
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
    return res.status(400).json({ error: 'El campo "titulo" es obligatorio.' });
  }

  try {
    const fechaCreacion = new Date().toISOString();
    const id = crypto.randomUUID();
    
    const result = await tursoClient.execute({
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

    // Devolver la capacitación recién creada
    const newCapacitacion = await tursoClient.execute({
        sql: `SELECT * FROM capacitaciones WHERE id = ?`,
        args: [id]
    });
    
    if (newCapacitacion.rows.length > 0) {
      res.status(201).json(newCapacitacion.rows[0]);
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
    console.error('Error al crear la capacitación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/capacitaciones/:id - Obtener una capacitación por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `SELECT * FROM capacitaciones WHERE id = ?`,
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Capacitación no encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener la capacitación ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/capacitaciones/:id - Actualizar una capacitación
router.put('/:id', async (req, res) => {
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
    return res.status(400).json({ error: 'El campo "titulo" es obligatorio.' });
  }

  try {
    // Verificar que la capacitación existe
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM capacitaciones WHERE id = ?',
      args: [id]
    });
    
    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Capacitación no encontrada.' });
    }

    const result = await tursoClient.execute({
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

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Capacitación no encontrada.' });
    }

    // Devolver la capacitación actualizada
    const updatedCapacitacion = await tursoClient.execute({
        sql: `SELECT * FROM capacitaciones WHERE id = ?`,
        args: [id]
    });

    res.json(updatedCapacitacion.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar la capacitación ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/capacitaciones/:id - Eliminar una capacitación
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM capacitaciones WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Capacitación no encontrada.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error al eliminar la capacitación ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/capacitaciones/personal/:personalId - Obtener capacitaciones por ID de personal
router.get('/personal/:personalId', async (req, res) => {
  const { personalId } = req.params;
  try {
    // Obtenemos primero los datos del personal
    const personalResult = await tursoClient.execute({
      sql: `SELECT id, nombre, apellido FROM personal WHERE id = ?`,
      args: [personalId],
    });

    if (personalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Personal no encontrado.' });
    }

    // Buscamos capacitaciones donde este personal aparezca como participante
    const result = await tursoClient.execute({
      sql: `SELECT * FROM capacitaciones WHERE participantes LIKE ?`,
      args: [`%${personalId}%`],
    });

    res.json({
      personal: personalResult.rows[0],
      capacitaciones: result.rows
    });
  } catch (error) {
    console.error(`Error al obtener capacitaciones para el personal ${personalId}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/capacitaciones/:id/participantes - Añadir participantes a una capacitación
router.post('/:id/participantes', async (req, res) => {
  const { id } = req.params;
  const { participantes } = req.body;

  if (!participantes || !Array.isArray(participantes) || participantes.length === 0) {
    return res.status(400).json({ error: 'Se requiere un array de IDs de participantes.' });
  }

  try {
    // Verificar que la capacitación existe
    const capacitacionResult = await tursoClient.execute({
      sql: 'SELECT id, participantes FROM capacitaciones WHERE id = ?',
      args: [id]
    });
    
    if (capacitacionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Capacitación no encontrada.' });
    }

    // Obtener participantes actuales
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

    // Combinar participantes actuales con nuevos (sin duplicados)
    const todosParticipantes = [...new Set([...participantesActuales, ...participantes])];

    // Actualizar la capacitación con los nuevos participantes
    await tursoClient.execute({
      sql: `UPDATE capacitaciones SET participantes = ? WHERE id = ?`,
      args: [JSON.stringify(todosParticipantes), id],
    });

    // Devolver la capacitación actualizada
    const updatedCapacitacion = await tursoClient.execute({
      sql: `SELECT * FROM capacitaciones WHERE id = ?`,
      args: [id]
    });

    res.json(updatedCapacitacion.rows[0]);
  } catch (error) {
    console.error(`Error al añadir participantes a la capacitación ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
