import { tursoClient } from '../lib/tursoClient.js';

// Listar todas las programaciones
export const getProgramaciones = async (req, res) => {
  try {
    const { organization_id } = req.query;
    const query = organization_id
      ? 'SELECT * FROM evalcompe_programacion WHERE organization_id = ? ORDER BY fecha_programada DESC'
      : 'SELECT * FROM evalcompe_programacion ORDER BY fecha_programada DESC';
    const params = organization_id ? [organization_id] : [];
    const result = await tursoClient.execute({ sql: query, args: params });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener programaciones', details: error.message });
  }
};

// Crear una nueva programación y los detalles para cada empleado
export const createProgramacion = async (req, res) => {
  try {
    const { competencia_id, evaluador_id, fecha_programada, observaciones, organization_id, empleados } = req.body;
    if (!competencia_id || !evaluador_id || !fecha_programada || !organization_id || !Array.isArray(empleados) || empleados.length === 0) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o empleados' });
    }
    // Insertar la programación
    const progResult = await tursoClient.execute({
      sql: `INSERT INTO evalcompe_programacion (competencia_id, evaluador_id, fecha_programada, observaciones, estado, organization_id) VALUES (?, ?, ?, ?, 'programada', ?)` ,
      args: [competencia_id, evaluador_id, fecha_programada, observaciones || '', organization_id]
    });
    const programacion_id = progResult.lastInsertRowid;
    // Insertar los detalles para cada empleado
    for (const persona_id of empleados) {
      await tursoClient.execute({
        sql: `INSERT INTO evalcompe_detalle (programacion_id, persona_id, estado) VALUES (?, ?, 'pendiente')`,
        args: [programacion_id, persona_id]
      });
    }
    res.status(201).json({ id: programacion_id, competencia_id, evaluador_id, fecha_programada, observaciones, organization_id, empleados });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear programación', details: error.message });
  }
};

// Obtener detalle de una programación (incluye empleados)
export const getProgramacion = async (req, res) => {
  try {
    const { id } = req.params;
    const progResult = await tursoClient.execute({
      sql: 'SELECT * FROM evalcompe_programacion WHERE id = ?',
      args: [id]
    });
    if (progResult.rows.length === 0) {
      return res.status(404).json({ error: 'Programación no encontrada' });
    }
    // Obtener empleados detalle
    const detalleResult = await tursoClient.execute({
      sql: 'SELECT * FROM evalcompe_detalle WHERE programacion_id = ?',
      args: [id]
    });
    res.json({ ...progResult.rows[0], empleados: detalleResult.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener programación', details: error.message });
  }
};

// Actualizar programación (solo campos generales, no empleados)
export const updateProgramacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { competencia_id, evaluador_id, fecha_programada, observaciones, estado } = req.body;
    await tursoClient.execute({
      sql: `UPDATE evalcompe_programacion SET competencia_id = ?, evaluador_id = ?, fecha_programada = ?, observaciones = ?, estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [competencia_id, evaluador_id, fecha_programada, observaciones || '', estado || 'programada', id]
    });
    res.json({ id, competencia_id, evaluador_id, fecha_programada, observaciones, estado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar programación', details: error.message });
  }
};

// Eliminar programación y sus detalles
export const deleteProgramacion = async (req, res) => {
  try {
    const { id } = req.params;
    await tursoClient.execute({ sql: 'DELETE FROM evalcompe_detalle WHERE programacion_id = ?', args: [id] });
    await tursoClient.execute({ sql: 'DELETE FROM evalcompe_programacion WHERE id = ?', args: [id] });
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar programación', details: error.message });
  }
};

export default {
  getProgramaciones,
  createProgramacion,
  getProgramacion,
  updateProgramacion,
  deleteProgramacion
}; 