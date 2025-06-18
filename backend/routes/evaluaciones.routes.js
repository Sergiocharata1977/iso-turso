import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = Router();

// GET /api/evaluaciones - Listar todas las evaluaciones
router.get('/', async (req, res) => {
  const { personal_id } = req.query;
  try {
    let sql = `
      SELECT e.*, p.nombre as personal_nombre, p.apellido as personal_apellido
      FROM evaluaciones e
      LEFT JOIN personal p ON e.personal_id = p.id
    `;
    const params = [];

    if (personal_id) {
      sql += ' WHERE e.personal_id = ?';
      params.push(personal_id);
    }

    sql += ' ORDER BY e.fecha DESC';

    const result = await tursoClient.execute({ sql, args: params });
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/evaluaciones - Crear una nueva evaluación
router.post('/', async (req, res) => {
  const { 
    personal_id, 
    tipo_evaluacion, 
    fecha,
    evaluador,
    resultado,
    comentarios,
    objetivos,
    areas_mejora,
    puntuacion
  } = req.body;

  if (!personal_id || !tipo_evaluacion) {
    return res.status(400).json({ error: 'Los campos "personal_id" y "tipo_evaluacion" son obligatorios.' });
  }

  try {
    // Verificar que el personal existe
    const personal = await tursoClient.execute({
      sql: 'SELECT id FROM personal WHERE id = ?',
      args: [personal_id],
    });

    if (personal.rows.length === 0) {
      return res.status(404).json({ error: 'El personal especificado no existe.' });
    }

    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const fechaEvaluacion = fecha || createdAt;
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO evaluaciones (
              personal_id, tipo_evaluacion, fecha, evaluador,
              resultado, comentarios, objetivos, areas_mejora,
              puntuacion, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        personal_id, 
        tipo_evaluacion, 
        fechaEvaluacion,
        evaluador || null,
        resultado || null,
        comentarios || null,
        objetivos ? JSON.stringify(objetivos) : null,
        areas_mejora || null,
        puntuacion || 0,
        createdAt
      ],
    });

    // Devolver la evaluación recién creada
    const newId = result.lastInsertRowid;
    if (newId) {
      const newEvaluacion = await tursoClient.execute({
          sql: `
            SELECT e.*, p.nombre as personal_nombre, p.apellido as personal_apellido
            FROM evaluaciones e
            LEFT JOIN personal p ON e.personal_id = p.id
            WHERE e.id = ?
          `,
          args: [newId]
      });
      res.status(201).json(newEvaluacion.rows[0]);
    } else {
      res.status(201).json({ 
        id: 'Desconocido', 
        personal_id, 
        tipo_evaluacion, 
        fecha: fechaEvaluacion,
        evaluador,
        resultado,
        comentarios,
        objetivos: objetivos ? JSON.stringify(objetivos) : null,
        areas_mejora,
        puntuacion: puntuacion || 0,
        created_at: createdAt
      });
    }
  } catch (error) {
    console.error('Error al crear la evaluación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/evaluaciones/:id - Obtener una evaluación por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT e.*, p.nombre as personal_nombre, p.apellido as personal_apellido
        FROM evaluaciones e
        LEFT JOIN personal p ON e.personal_id = p.id
        WHERE e.id = ?
      `,
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evaluación no encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener la evaluación ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/evaluaciones/:id - Actualizar una evaluación
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    personal_id, 
    tipo_evaluacion, 
    fecha,
    evaluador,
    resultado,
    comentarios,
    objetivos,
    areas_mejora,
    puntuacion,
    acciones_seguimiento
  } = req.body;

  if (!personal_id || !tipo_evaluacion) {
    return res.status(400).json({ error: 'Los campos "personal_id" y "tipo_evaluacion" son obligatorios.' });
  }

  try {
    // Verificar que el personal existe
    const personal = await tursoClient.execute({
      sql: 'SELECT id FROM personal WHERE id = ?',
      args: [personal_id],
    });

    if (personal.rows.length === 0) {
      return res.status(404).json({ error: 'El personal especificado no existe.' });
    }

    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const result = await tursoClient.execute({
      sql: `UPDATE evaluaciones SET 
              personal_id = ?, tipo_evaluacion = ?, fecha = ?, evaluador = ?,
              resultado = ?, comentarios = ?, objetivos = ?, areas_mejora = ?,
              puntuacion = ?, acciones_seguimiento = ?, updated_at = ?
            WHERE id = ?`,
      args: [
        personal_id, 
        tipo_evaluacion, 
        fecha || null,
        evaluador || null,
        resultado || null,
        comentarios || null,
        objetivos ? JSON.stringify(objetivos) : null,
        areas_mejora || null,
        puntuacion || 0,
        acciones_seguimiento || null,
        updatedAt,
        id
      ],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Evaluación no encontrada.' });
    }

    // Devolver la evaluación actualizada
    const updatedEvaluacion = await tursoClient.execute({
        sql: `
          SELECT e.*, p.nombre as personal_nombre, p.apellido as personal_apellido
          FROM evaluaciones e
          LEFT JOIN personal p ON e.personal_id = p.id
          WHERE e.id = ?
        `,
        args: [id]
    });

    res.json(updatedEvaluacion.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar la evaluación ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/evaluaciones/:id - Eliminar una evaluación
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM evaluaciones WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Evaluación no encontrada.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error al eliminar la evaluación ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
