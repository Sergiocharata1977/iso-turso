import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/objetivos-calidad - Listar todos los objetivos de calidad
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM objetivos_calidad ORDER BY fecha_creacion DESC'
    });
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los objetivos de calidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/objetivos-calidad/:id - Obtener un objetivo de calidad por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM objetivos_calidad WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Objetivo de calidad no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener el objetivo de calidad ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/objetivos-calidad - Crear un nuevo objetivo de calidad
router.post('/', async (req, res) => {
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
    return res.status(400).json({ error: 'Los campos "codigo" y "descripcion" son obligatorios.' });
  }

  try {
    // Verificar si ya existe un objetivo con el mismo código
    const existingObjetivo = await tursoClient.execute({
      sql: 'SELECT id FROM objetivos_calidad WHERE codigo = ?',
      args: [codigo]
    });

    if (existingObjetivo.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un objetivo de calidad con ese código.' });
    }

    const id = crypto.randomUUID();
    const fechaCreacion = new Date().toISOString();
    
    const result = await tursoClient.execute({
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

    // Devolver el objetivo recién creado
    const newObjetivo = await tursoClient.execute({
      sql: 'SELECT * FROM objetivos_calidad WHERE id = ?',
      args: [id]
    });
    
    res.status(201).json(newObjetivo.rows[0]);
  } catch (error) {
    console.error('Error al crear el objetivo de calidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/objetivos-calidad/:id - Actualizar un objetivo de calidad
router.put('/:id', async (req, res) => {
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
    return res.status(400).json({ error: 'Los campos "codigo" y "descripcion" son obligatorios.' });
  }

  try {
    // Verificar que el objetivo existe
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM objetivos_calidad WHERE id = ?',
      args: [id]
    });
    
    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Objetivo de calidad no encontrado' });
    }

    // Verificar que no exista otro objetivo con el mismo código (excepto este mismo)
    const duplicateCheck = await tursoClient.execute({
      sql: 'SELECT id FROM objetivos_calidad WHERE codigo = ? AND id != ?',
      args: [codigo, id]
    });

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe otro objetivo de calidad con ese código.' });
    }

    const result = await tursoClient.execute({
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

    // Devolver el objetivo actualizado
    const updatedObjetivo = await tursoClient.execute({
      sql: 'SELECT * FROM objetivos_calidad WHERE id = ?',
      args: [id]
    });

    res.json(updatedObjetivo.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar el objetivo de calidad ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/objetivos-calidad/:id - Eliminar un objetivo de calidad
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM objetivos_calidad WHERE id = ?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Objetivo de calidad no encontrado' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error al eliminar el objetivo de calidad ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/objetivos-calidad/estado/:estado - Obtener objetivos por estado
router.get('/estado/:estado', async (req, res) => {
  const { estado } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM objetivos_calidad WHERE estado = ? ORDER BY fecha_creacion DESC',
      args: [estado]
    });

    res.json(result.rows);
  } catch (error) {
    console.error(`Error al obtener objetivos de calidad con estado ${estado}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
