import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/auditorias - Listar todas las auditorías
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT * FROM auditorias
        ORDER BY fecha_inicio DESC
      `
    });
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener auditorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auditorias - Crear una nueva auditoría
router.post('/', async (req, res) => {
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
    return res.status(400).json({ error: 'Los campos "codigo" y "titulo" son obligatorios.' });
  }

  try {
    // Verificar si ya existe una auditoría con el mismo código
    const existingAuditoria = await tursoClient.execute({
      sql: 'SELECT id FROM auditorias WHERE codigo = ?',
      args: [codigo]
    });

    if (existingAuditoria.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe una auditoría con ese código.' });
    }

    const fechaCreacion = new Date().toISOString();
    const id = crypto.randomUUID();
    
    const result = await tursoClient.execute({
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

    // Devolver la auditoría recién creada
    const newAuditoria = await tursoClient.execute({
      sql: 'SELECT * FROM auditorias WHERE id = ?',
      args: [id]
    });
    
    if (newAuditoria.rows.length > 0) {
      res.status(201).json(newAuditoria.rows[0]);
    } else {
      res.status(201).json({ 
        id, 
        codigo,
        titulo, 
        tipo, 
        alcance, 
        fecha_inicio,
        fecha_fin,
        responsable,
        auditores,
        resultado,
        estado: estado || 'planificada',
        fecha_creacion: fechaCreacion
      });
    }
  } catch (error) {
    console.error('Error al crear la auditoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auditorias/:id - Obtener una auditoría por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM auditorias WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Auditoría no encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener la auditoría ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/auditorias/:id - Actualizar una auditoría
router.put('/:id', async (req, res) => {
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
    return res.status(400).json({ error: 'Los campos "codigo" y "titulo" son obligatorios.' });
  }

  try {
    // Verificar que la auditoría existe
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM auditorias WHERE id = ?',
      args: [id]
    });
    
    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Auditoría no encontrada.' });
    }

    // Verificar que no exista otra auditoría con el mismo código (excepto esta misma)
    const duplicateCheck = await tursoClient.execute({
      sql: 'SELECT id FROM auditorias WHERE codigo = ? AND id != ?',
      args: [codigo, id]
    });

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe otra auditoría con ese código.' });
    }

    const result = await tursoClient.execute({
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

    // Devolver la auditoría actualizada
    const updatedAuditoria = await tursoClient.execute({
      sql: 'SELECT * FROM auditorias WHERE id = ?',
      args: [id]
    });

    res.json(updatedAuditoria.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar la auditoría ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/auditorias/:id - Eliminar una auditoría
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM auditorias WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Auditoría no encontrada.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error al eliminar la auditoría ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auditorias/estado/:estado - Obtener auditorías por estado
router.get('/estado/:estado', async (req, res) => {
  const { estado } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM auditorias WHERE estado = ? ORDER BY fecha_inicio DESC',
      args: [estado],
    });

    res.json(result.rows);
  } catch (error) {
    console.error(`Error al obtener auditorías con estado ${estado}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
