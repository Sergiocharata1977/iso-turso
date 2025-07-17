import { tursoClient } from '../lib/tursoClient.js';

// Listar todas las competencias
export const getCompetencias = async (req, res) => {
  try {
    const { organizacion_id } = req.query;
    const query = organizacion_id
      ? 'SELECT * FROM competencias WHERE organizacion_id = ?'
      : 'SELECT * FROM competencias';
    const params = organizacion_id ? [organizacion_id] : [];
    console.log('🔎 [Competencias] Ejecutando query:', query, 'con params:', params);
    const result = await tursoClient.execute({ sql: query, args: params });
    console.log('🔎 [Competencias] Resultados:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ [Competencias] Error al obtener competencias:', error);
    res.status(500).json({ error: 'Error al obtener competencias', details: error.message });
  }
};

// Crear una competencia
export const createCompetencia = async (req, res) => {
  try {
    const { nombre, descripcion, organizacion_id } = req.body;
    if (!nombre || !organizacion_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const result = await tursoClient.execute({
      sql: 'INSERT INTO competencias (nombre, descripcion, organizacion_id) VALUES (?, ?, ?)',
      args: [nombre, descripcion || '', organizacion_id]
    });
    console.log('✅ [Competencias] Competencia guardada:', { id: result.lastInsertRowid, nombre, descripcion, organizacion_id });
    res.status(201).json({ id: result.lastInsertRowid, nombre, descripcion, organizacion_id });
  } catch (error) {
    console.error('❌ [Competencias] Error al crear competencia:', error);
    res.status(500).json({ error: 'Error al crear competencia', details: error.message });
  }
};

// Actualizar una competencia
export const updateCompetencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    await tursoClient.execute({
      sql: 'UPDATE competencias SET nombre = ?, descripcion = ? WHERE id = ?',
      args: [nombre, descripcion || '', id]
    });
    res.json({ id, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar competencia', details: error.message });
  }
};

// Eliminar una competencia
export const deleteCompetencia = async (req, res) => {
  try {
    const { id } = req.params;
    await tursoClient.execute({
      sql: 'DELETE FROM competencias WHERE id = ?',
      args: [id]
    });
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar competencia', details: error.message });
  }
};

export default {
  getCompetencias,
  createCompetencia,
  updateCompetencia,
  deleteCompetencia
}; 