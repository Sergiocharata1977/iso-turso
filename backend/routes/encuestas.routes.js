import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = Router();

// GET /api/encuestas - Listar todas las encuestas
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute(`
      SELECT * FROM encuestas
      ORDER BY fecha_creacion DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener encuestas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/encuestas - Crear una nueva encuesta
router.post('/', async (req, res) => {
  const { 
    titulo, 
    descripcion, 
    tipo,
    estado,
    fecha_inicio,
    fecha_fin,
    preguntas,
    publico_objetivo
  } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'El campo "titulo" es obligatorio.' });
  }

  try {
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO encuestas (
              titulo, descripcion, tipo, estado,
              fecha_inicio, fecha_fin, preguntas, publico_objetivo,
              fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        titulo, 
        descripcion || null, 
        tipo || 'Satisfacción',
        estado || 'Borrador',
        fecha_inicio || null,
        fecha_fin || null,
        preguntas ? JSON.stringify(preguntas) : null,
        publico_objetivo || null,
        createdAt
      ],
    });

    // Devolver la encuesta recién creada
    const newId = result.lastInsertRowid;
    if (newId) {
      const newEncuesta = await tursoClient.execute({
          sql: 'SELECT * FROM encuestas WHERE id = ?',
          args: [newId]
      });
      res.status(201).json(newEncuesta.rows[0]);
    } else {
      res.status(201).json({ 
        id: 'Desconocido', 
        titulo, 
        descripcion, 
        tipo: tipo || 'Satisfacción',
        estado: estado || 'Borrador',
        fecha_inicio,
        fecha_fin,
        preguntas: preguntas ? JSON.stringify(preguntas) : null,
        publico_objetivo,
        fecha_creacion: createdAt
      });
    }
  } catch (error) {
    console.error('Error al crear la encuesta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/encuestas/:id - Obtener una encuesta por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM encuestas WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Encuesta no encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener la encuesta ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/encuestas/:id - Actualizar una encuesta
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    titulo, 
    descripcion, 
    tipo,
    estado,
    fecha_inicio,
    fecha_fin,
    preguntas,
    publico_objetivo,
    resultados
  } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'El campo "titulo" es obligatorio.' });
  }

  try {
    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const result = await tursoClient.execute({
      sql: `UPDATE encuestas SET 
              titulo = ?, descripcion = ?, tipo = ?, estado = ?,
              fecha_inicio = ?, fecha_fin = ?, preguntas = ?, 
              publico_objetivo = ?, resultados = ?, updated_at = ?
            WHERE id = ?`,
      args: [
        titulo, 
        descripcion || null, 
        tipo || 'Satisfacción',
        estado || 'Borrador',
        fecha_inicio || null,
        fecha_fin || null,
        preguntas ? JSON.stringify(preguntas) : null,
        publico_objetivo || null,
        resultados ? JSON.stringify(resultados) : null,
        updatedAt,
        id
      ],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Encuesta no encontrada.' });
    }

    // Devolver la encuesta actualizada
    const updatedEncuesta = await tursoClient.execute({
        sql: 'SELECT * FROM encuestas WHERE id = ?',
        args: [id]
    });

    res.json(updatedEncuesta.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar la encuesta ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/encuestas/:id - Eliminar una encuesta
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM encuestas WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Encuesta no encontrada.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error al eliminar la encuesta ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/encuestas/:id/respuestas - Añadir respuestas a una encuesta
router.post('/:id/respuestas', async (req, res) => {
  const { id } = req.params;
  const { respuestas, respondente_id, comentarios } = req.body;

  if (!respuestas || !Array.isArray(respuestas)) {
    return res.status(400).json({ error: 'Se requiere un array de respuestas.' });
  }

  try {
    // Verificar que la encuesta existe
    const encuesta = await tursoClient.execute({
      sql: 'SELECT id, estado FROM encuestas WHERE id = ?',
      args: [id],
    });

    if (encuesta.rows.length === 0) {
      return res.status(404).json({ error: 'Encuesta no encontrada.' });
    }

    if (encuesta.rows[0].estado !== 'Activa') {
      return res.status(400).json({ error: 'La encuesta no está activa para recibir respuestas.' });
    }

    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO encuestas_respuestas (
              encuesta_id, respuestas, respondente_id, 
              comentarios, fecha_respuesta
            ) VALUES (?, ?, ?, ?, ?)`,
      args: [
        id,
        JSON.stringify(respuestas),
        respondente_id || null,
        comentarios || null,
        createdAt
      ],
    });

    res.status(201).json({ 
      id: result.lastInsertRowid || 'Desconocido',
      encuesta_id: id,
      fecha_respuesta: createdAt,
      mensaje: 'Respuestas registradas correctamente'
    });
  } catch (error) {
    console.error(`Error al registrar respuestas para la encuesta ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
