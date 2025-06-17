import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/mejoras - Listar todas las mejoras
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT m.*, p.nombre as proceso_nombre 
        FROM mejoras m
        LEFT JOIN procesos p ON m.proceso_id = p.id
        ORDER BY m.fecha_creacion DESC
      `
    });
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener mejoras:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/mejoras - Crear una nueva mejora
router.post('/', async (req, res) => {
  const { 
    codigo,
    titulo, 
    descripcion, 
    tipo, 
    origen,
    estado, 
    proceso_id, 
    responsable,
    fecha_identificacion,
    fecha_implementacion,
    resultado
  } = req.body;

  if (!codigo || !titulo) {
    return res.status(400).json({ error: 'Los campos "codigo" y "titulo" son obligatorios.' });
  }

  try {
    // Verificar si ya existe una mejora con el mismo código
    const existingMejora = await tursoClient.execute({
      sql: 'SELECT id FROM mejoras WHERE codigo = ?',
      args: [codigo]
    });

    if (existingMejora.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe una mejora con ese código.' });
    }

    const id = crypto.randomUUID();
    const fechaCreacion = new Date().toISOString();
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO mejoras (
              id, codigo, titulo, descripcion, tipo, origen, 
              proceso_id, responsable, fecha_identificacion, 
              fecha_implementacion, estado, resultado, fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        codigo,
        titulo, 
        descripcion || null, 
        tipo || null, 
        origen || null,
        proceso_id || null, 
        responsable || null,
        fecha_identificacion || null,
        fecha_implementacion || null,
        estado || 'identificada',
        resultado || null,
        fechaCreacion
      ],
    });

    // Devolver la mejora recién creada
    const newMejora = await tursoClient.execute({
      sql: `
        SELECT m.*, p.nombre as proceso_nombre 
        FROM mejoras m
        LEFT JOIN procesos p ON m.proceso_id = p.id
        WHERE m.id = ?
      `,
      args: [id]
    });
    
    if (newMejora.rows.length > 0) {
      res.status(201).json(newMejora.rows[0]);
    } else {
      res.status(201).json({ 
        id, 
        codigo,
        titulo, 
        descripcion, 
        tipo, 
        origen,
        proceso_id, 
        responsable,
        fecha_identificacion,
        fecha_implementacion,
        estado: estado || 'identificada',
        resultado,
        fecha_creacion: fechaCreacion
      });
    }
  } catch (error) {
    console.error('Error al crear la mejora:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/mejoras/:id - Obtener una mejora por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT m.*, p.nombre as proceso_nombre 
        FROM mejoras m
        LEFT JOIN procesos p ON m.proceso_id = p.id
        WHERE m.id = ?
      `,
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mejora no encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener la mejora ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/mejoras/:id - Actualizar una mejora
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    codigo,
    titulo, 
    descripcion, 
    tipo, 
    origen,
    estado, 
    proceso_id, 
    responsable,
    fecha_identificacion,
    fecha_implementacion,
    resultado
  } = req.body;

  if (!codigo || !titulo) {
    return res.status(400).json({ error: 'Los campos "codigo" y "titulo" son obligatorios.' });
  }

  try {
    // Verificar que la mejora existe
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM mejoras WHERE id = ?',
      args: [id]
    });
    
    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Mejora no encontrada.' });
    }

    // Verificar que no exista otra mejora con el mismo código (excepto esta misma)
    const duplicateCheck = await tursoClient.execute({
      sql: 'SELECT id FROM mejoras WHERE codigo = ? AND id != ?',
      args: [codigo, id]
    });

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe otra mejora con ese código.' });
    }

    const result = await tursoClient.execute({
      sql: `UPDATE mejoras SET 
              codigo = ?, titulo = ?, descripcion = ?, tipo = ?, 
              origen = ?, proceso_id = ?, responsable = ?, 
              fecha_identificacion = ?, fecha_implementacion = ?,
              estado = ?, resultado = ?
            WHERE id = ?`,
      args: [
        codigo,
        titulo, 
        descripcion || null, 
        tipo || null, 
        origen || null,
        proceso_id || null, 
        responsable || null,
        fecha_identificacion || null,
        fecha_implementacion || null,
        estado || 'identificada',
        resultado || null,
        id
      ],
    });

    // Devolver la mejora actualizada
    const updatedMejora = await tursoClient.execute({
      sql: `
        SELECT m.*, p.nombre as proceso_nombre 
        FROM mejoras m
        LEFT JOIN procesos p ON m.proceso_id = p.id
        WHERE m.id = ?
      `,
      args: [id]
    });

    res.json(updatedMejora.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar la mejora ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/mejoras/:id - Eliminar una mejora
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM mejoras WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Mejora no encontrada.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error al eliminar la mejora ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/mejoras/estado/:estado - Obtener mejoras por estado
router.get('/estado/:estado', async (req, res) => {
  const { estado } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT m.*, p.nombre as proceso_nombre 
        FROM mejoras m
        LEFT JOIN procesos p ON m.proceso_id = p.id
        WHERE m.estado = ?
        ORDER BY m.fecha_creacion DESC
      `,
      args: [estado]
    });

    res.json(result.rows);
  } catch (error) {
    console.error(`Error al obtener mejoras con estado ${estado}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/mejoras/proceso/:procesoId - Obtener mejoras por proceso
router.get('/proceso/:procesoId', async (req, res) => {
  const { procesoId } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT m.*, p.nombre as proceso_nombre 
        FROM mejoras m
        LEFT JOIN procesos p ON m.proceso_id = p.id
        WHERE m.proceso_id = ?
        ORDER BY m.fecha_creacion DESC
      `,
      args: [procesoId]
    });

    res.json(result.rows);
  } catch (error) {
    console.error(`Error al obtener mejoras para el proceso ${procesoId}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
