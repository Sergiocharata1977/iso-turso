import { tursoClient } from '../lib/tursoClient.js';

// Listar todas las evaluaciones de competencias de la organización
export const getEvaluacionesCompetencias = async (req, res) => {
  try {
    const { organization_id } = req.query;
    const query = organization_id
      ? 'SELECT * FROM evaluaciones_competencias WHERE organization_id = ? ORDER BY fecha_programada DESC'
      : 'SELECT * FROM evaluaciones_competencias ORDER BY fecha_programada DESC';
    const params = organization_id ? [organization_id] : [];
    const result = await tursoClient.execute({ sql: query, args: params });
    res.json(result.rows);
  } catch (error) {
    console.error('[EvaluacionesCompetencias] Error al listar:', error);
    res.status(500).json({ error: 'Error al obtener evaluaciones de competencias', details: error.message });
  }
};

// Programar una nueva evaluación de competencia
export const createEvaluacionCompetencia = async (req, res) => {
  try {
    const { competencia_id, persona_id, evaluador_id, fecha_programada, observaciones, organization_id } = req.body;
    if (!competencia_id || !persona_id || !evaluador_id || !fecha_programada || !organization_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const result = await tursoClient.execute({
      sql: `INSERT INTO evaluaciones_competencias 
            (competencia_id, persona_id, evaluador_id, fecha_programada, observaciones, estado, notificado, organization_id) 
            VALUES (?, ?, ?, ?, ?, 'programada', 0, ?)` ,
      args: [competencia_id, persona_id, evaluador_id, fecha_programada, observaciones || '', organization_id]
    });
    res.status(201).json({ id: result.lastInsertRowid, competencia_id, persona_id, evaluador_id, fecha_programada, observaciones, estado: 'programada', organization_id });
  } catch (error) {
    console.error('[EvaluacionesCompetencias] Error al programar:', error);
    res.status(500).json({ error: 'Error al programar evaluación', details: error.message });
  }
};

// Obtener detalle de una evaluación
export const getEvaluacionCompetencia = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM evaluaciones_competencias WHERE id = ?',
      args: [id]
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evaluación no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener evaluación', details: error.message });
  }
};

// Ejecutar (realizar) una evaluación
export const updateEvaluacionCompetencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { puntaje, observaciones, fecha_realizada } = req.body;
    if (puntaje == null || !fecha_realizada) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para ejecutar la evaluación' });
    }
    await tursoClient.execute({
      sql: `UPDATE evaluaciones_competencias SET puntaje = ?, observaciones = ?, fecha_realizada = ?, estado = 'realizada', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [puntaje, observaciones || '', fecha_realizada, id]
    });
    res.json({ id, puntaje, observaciones, fecha_realizada, estado: 'realizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al ejecutar evaluación', details: error.message });
  }
};

// Eliminar una evaluación
export const deleteEvaluacionCompetencia = async (req, res) => {
  try {
    const { id } = req.params;
    await tursoClient.execute({
      sql: 'DELETE FROM evaluaciones_competencias WHERE id = ?',
      args: [id]
    });
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar evaluación', details: error.message });
  }
};

export default {
  getEvaluacionesCompetencias,
  createEvaluacionCompetencia,
  getEvaluacionCompetencia,
  updateEvaluacionCompetencia,
  deleteEvaluacionCompetencia
}; 