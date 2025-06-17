import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = Router();

// GET /api/indicadores - Listar todos los indicadores
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute('SELECT * FROM indicadores ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener indicadores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/indicadores - Crear un nuevo indicador
router.post('/', async (req, res) => {
  const { nombre, descripcion, formula, meta, proceso_id, responsable_id } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }

  try {
    // Verificar si ya existe un indicador con el mismo nombre
    const existing = await tursoClient.execute({
      sql: 'SELECT id FROM indicadores WHERE nombre = ?',
      args: [nombre],
    });

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un indicador con ese nombre.' });
    }

    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const result = await tursoClient.execute({
      sql: 'INSERT INTO indicadores (nombre, descripcion, formula, meta, proceso_id, responsable_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [nombre, descripcion || null, formula || null, meta || null, proceso_id || null, responsable_id || null, createdAt],
    });

    // Devolver el indicador recién creado
    const newId = result.lastInsertRowid;
    if (newId) {
      const newIndicador = await tursoClient.execute({
          sql: 'SELECT * FROM indicadores WHERE id = ?',
          args: [newId]
      });
      res.status(201).json(newIndicador.rows[0]);
    } else {
      res.status(201).json({ 
        id: 'Desconocido', 
        nombre, 
        descripcion, 
        formula, 
        meta, 
        proceso_id, 
        responsable_id, 
        created_at: createdAt 
      });
    }
  } catch (error) {
    console.error('Error al crear el indicador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/indicadores/:id - Obtener un indicador por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM indicadores WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Indicador no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener el indicador ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/indicadores/:id - Actualizar un indicador
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, formula, meta, proceso_id, responsable_id } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }

  try {
    // Verificar si el nuevo nombre ya está en uso por otro indicador
    const existing = await tursoClient.execute({
        sql: 'SELECT id FROM indicadores WHERE nombre = ? AND id != ?',
        args: [nombre, id]
    });

    if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Ya existe otro indicador con ese nombre.' });
    }

    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const result = await tursoClient.execute({
      sql: 'UPDATE indicadores SET nombre = ?, descripcion = ?, formula = ?, meta = ?, proceso_id = ?, responsable_id = ?, updated_at = ? WHERE id = ?',
      args: [nombre, descripcion || null, formula || null, meta || null, proceso_id || null, responsable_id || null, updatedAt, id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Indicador no encontrado.' });
    }

    // Devolver el indicador actualizado
    const updatedIndicador = await tursoClient.execute({
        sql: 'SELECT * FROM indicadores WHERE id = ?',
        args: [id]
    });

    res.json(updatedIndicador.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar el indicador ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/indicadores/:id - Eliminar un indicador
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Opcional: Verificar si hay mediciones asociadas antes de eliminar
    const mediciones = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM mediciones WHERE indicador_id = ?',
      args: [id],
    });

    if (mediciones.rows[0]?.count > 0) {
      return res.status(409).json({ 
        error: 'No se puede eliminar el indicador porque tiene mediciones asociadas.' 
      });
    }

    const result = await tursoClient.execute({
      sql: 'DELETE FROM indicadores WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Indicador no encontrado.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error al eliminar el indicador ${id}:`, error);
    // Manejo específico para errores de clave foránea
    if (error.message && error.message.includes('FOREIGN KEY constraint failed')) {
        return res.status(409).json({ 
          error: 'No se puede eliminar el indicador porque tiene entidades asociadas.' 
        });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
