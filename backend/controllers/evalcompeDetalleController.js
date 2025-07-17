import { tursoClient } from '../lib/tursoClient.js';

// Listar todos los detalles de una programación
export const getDetallesByProgramacion = async (req, res) => {
  try {
    const { programacion_id } = req.query;
    if (!programacion_id) return res.status(400).json({ error: 'Falta programacion_id' });
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM evalcompe_detalle WHERE programacion_id = ?',
      args: [programacion_id]
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalles', details: error.message });
  }
};

// Obtener detalle individual
export const getDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM evalcompe_detalle WHERE id = ?',
      args: [id]
    });
    if (result.rows.length === 0) return res.status(404).json({ error: 'Detalle no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalle', details: error.message });
  }
};

// Actualizar detalle (ejecución de evaluación)
export const updateDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    const { puntaje, observaciones, fecha_realizada, estado } = req.body;
    await tursoClient.execute({
      sql: `UPDATE evalcompe_detalle SET puntaje = ?, observaciones = ?, fecha_realizada = ?, estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [puntaje, observaciones || '', fecha_realizada, estado || 'realizada', id]
    });
    res.json({ id, puntaje, observaciones, fecha_realizada, estado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar detalle', details: error.message });
  }
};

// Eliminar detalle
export const deleteDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    await tursoClient.execute({ sql: 'DELETE FROM evalcompe_detalle WHERE id = ?', args: [id] });
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar detalle', details: error.message });
  }
};

export default {
  getDetallesByProgramacion,
  getDetalle,
  updateDetalle,
  deleteDetalle
}; 