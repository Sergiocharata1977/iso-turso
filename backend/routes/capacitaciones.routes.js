import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// GET /api/capacitaciones - Obtener todas las capacitaciones
router.get('/', async (req, res) => {
  try {
    console.log('📋 Obteniendo todas las capacitaciones...');
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM capacitaciones WHERE organization_id = ? ORDER BY created_at DESC',
      args: [req.user?.organization_id || 1]
    });
    
    console.log(`✅ Encontradas ${result.rows.length} capacitaciones`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener capacitaciones:', error);
    res.status(500).json({ 
      status: 'error', 
      statusCode: 500,
      message: 'Error al obtener capacitaciones',
      error: error.message 
    });
  }
});

// GET /api/capacitaciones/:id - Obtener capacitación por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Buscando capacitación con ID: ${id}`);
    
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM capacitaciones WHERE id = ? AND organization_id = ?',
      args: [id, req.user?.organization_id || 1]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Capacitación no encontrada' 
      });
    }

    console.log(`✅ Capacitación encontrada: ${result.rows[0].nombre}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener capacitación:', error);
    res.status(500).json({ 
      status: 'error', 
      statusCode: 500,
      message: 'Error al obtener capacitación',
      error: error.message 
    });
  }
});

// POST /api/capacitaciones - Crear nueva capacitación
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, fecha_inicio, estado = 'Programada' } = req.body;
    
    console.log('➕ Creando nueva capacitación:', { titulo, fecha_inicio, estado });

    // Validación básica
    if (!titulo || !fecha_inicio) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Título y fecha de inicio son obligatorios' 
      });
    }

    const result = await tursoClient.execute({
      sql: 'INSERT INTO capacitaciones (nombre, descripcion, fecha_programada, estado, organization_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime("now", "localtime"), datetime("now", "localtime")) RETURNING *',
      args: [titulo, descripcion || '', fecha_inicio, estado, req.user?.organization_id || 1]
    });

    console.log(`✅ Capacitación creada con ID: ${result.rows[0].id}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al crear capacitación:', error);
    res.status(500).json({ 
      status: 'error', 
      statusCode: 500,
      message: 'Error al crear capacitación',
      error: error.message 
    });
  }
});

// PUT /api/capacitaciones/:id - Actualizar capacitación
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fecha_inicio, estado } = req.body;
    
    console.log(`✏️ Actualizando capacitación ID: ${id}`, { titulo, fecha_inicio, estado });

    // Validación básica
    if (!titulo || !fecha_inicio) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Título y fecha de inicio son obligatorios' 
      });
    }

    const result = await tursoClient.execute({
      sql: `UPDATE capacitaciones 
            SET nombre = ?, descripcion = ?, fecha_programada = ?, estado = ?, 
                updated_at = datetime('now', 'localtime')
            WHERE id = ? AND organization_id = ?
            RETURNING *`,
      args: [titulo, descripcion || '', fecha_inicio, estado, id, req.user?.organization_id || 1]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Capacitación no encontrada' 
      });
    }

    console.log(`✅ Capacitación actualizada: ${result.rows[0].nombre}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar capacitación:', error);
    res.status(500).json({ 
      status: 'error', 
      statusCode: 500,
      message: 'Error al actualizar capacitación',
      error: error.message 
    });
  }
});

// DELETE /api/capacitaciones/:id - Eliminar capacitación
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando capacitación ID: ${id}`);

    const result = await tursoClient.execute({
      sql: 'DELETE FROM capacitaciones WHERE id = ? AND organization_id = ? RETURNING id',
      args: [id, req.user?.organization_id || 1]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Capacitación no encontrada' 
      });
    }

    console.log(`✅ Capacitación eliminada exitosamente`);
    res.status(204).send(); // No content response
  } catch (error) {
    console.error('❌ Error al eliminar capacitación:', error);
    res.status(500).json({ 
      status: 'error', 
      statusCode: 500,
      message: 'Error al eliminar capacitación',
      error: error.message 
    });
  }
});

// --- TEMAS DE CAPACITACIÓN ---

// GET /api/capacitaciones/:id/temas - Obtener todos los temas de una capacitación
router.get('/:id/temas', async (req, res) => {
  try {
    const { id } = req.params;
    const organization_id = req.user?.organization_id || 1;
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM temas_capacitacion WHERE capacitacion_id = ? AND organization_id = ? ORDER BY orden, created_at',
      args: [id, organization_id]
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener temas de capacitación', error: error.message });
  }
});

// POST /api/capacitaciones/:id/temas - Crear un tema para una capacitación
router.post('/:id/temas', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, orden } = req.body;
    const organization_id = req.user?.organization_id || 1;
    if (!titulo) {
      return res.status(400).json({ message: 'El título del tema es obligatorio' });
    }
    const temaId = randomUUID();
    const result = await tursoClient.execute({
      sql: 'INSERT INTO temas_capacitacion (id, capacitacion_id, organization_id, titulo, descripcion, orden, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now", "localtime"), datetime("now", "localtime")) RETURNING *',
      args: [temaId, id, organization_id, titulo, descripcion || '', orden || 0]
    });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tema de capacitación', error: error.message });
  }
});

// PUT /api/capacitaciones/:id/temas/:temaId - Actualizar un tema
router.put('/:id/temas/:temaId', async (req, res) => {
  try {
    const { id, temaId } = req.params;
    const { titulo, descripcion, orden } = req.body;
    const organization_id = req.user?.organization_id || 1;
    const result = await tursoClient.execute({
      sql: 'UPDATE temas_capacitacion SET titulo = ?, descripcion = ?, orden = ?, updated_at = datetime("now", "localtime") WHERE id = ? AND capacitacion_id = ? AND organization_id = ? RETURNING *',
      args: [titulo, descripcion || '', orden || 0, temaId, id, organization_id]
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tema no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tema de capacitación', error: error.message });
  }
});

// DELETE /api/capacitaciones/:id/temas/:temaId - Eliminar un tema
router.delete('/:id/temas/:temaId', async (req, res) => {
  try {
    const { id, temaId } = req.params;
    const organization_id = req.user?.organization_id || 1;
    const result = await tursoClient.execute({
      sql: 'DELETE FROM temas_capacitacion WHERE id = ? AND capacitacion_id = ? AND organization_id = ? RETURNING id',
      args: [temaId, id, organization_id]
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tema no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tema de capacitación', error: error.message });
  }
});

// --- ASISTENTES DE CAPACITACIÓN ---
// GET /api/capacitaciones/:id/asistentes - Listar asistentes de una capacitación
router.get('/:id/asistentes', async (req, res) => {
  try {
    const { id } = req.params;
    const organization_id = req.user?.organization_id || 1;
    const result = await tursoClient.execute({
      sql: `SELECT ca.*, p.nombres, p.apellidos, p.email FROM capacitacion_asistentes ca
            JOIN personal p ON ca.empleado_id = p.id
            WHERE ca.capacitacion_id = ? AND ca.organization_id = ?`,
      args: [id, organization_id]
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener asistentes', error: error.message });
  }
});

// POST /api/capacitaciones/:id/asistentes - Agregar un asistente
router.post('/:id/asistentes', async (req, res) => {
  try {
    const { id } = req.params;
    const { empleado_id } = req.body;
    const organization_id = req.user?.organization_id || 1;
    if (!empleado_id) {
      return res.status(400).json({ message: 'Falta el empleado_id' });
    }
    const asistenteId = randomUUID();
    const result = await tursoClient.execute({
      sql: `INSERT INTO capacitacion_asistentes (id, capacitacion_id, empleado_id, organization_id, asistencia, created_at, updated_at)
            VALUES (?, ?, ?, ?, 1, datetime('now', 'localtime'), datetime('now', 'localtime')) RETURNING *`,
      args: [asistenteId, id, empleado_id, organization_id]
    });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar asistente', error: error.message });
  }
});

// DELETE /api/capacitaciones/:id/asistentes/:asistenteId - Quitar un asistente
router.delete('/:id/asistentes/:asistenteId', async (req, res) => {
  try {
    const { id, asistenteId } = req.params;
    const organization_id = req.user?.organization_id || 1;
    const result = await tursoClient.execute({
      sql: `DELETE FROM capacitacion_asistentes WHERE id = ? AND capacitacion_id = ? AND organization_id = ? RETURNING id`,
      args: [asistenteId, id, organization_id]
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Asistente no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al quitar asistente', error: error.message });
  }
});

// --- EVALUACIONES DE CAPACITACIÓN ---
// GET /api/capacitaciones/:id/evaluaciones - Listar evaluaciones de una capacitación
router.get('/:id/evaluaciones', async (req, res) => {
  try {
    const { id } = req.params;
    const organization_id = req.user?.organization_id || 1;
    const result = await tursoClient.execute({
      sql: `SELECT e.*, p.nombres, p.apellidos, t.titulo as tema_titulo FROM evaluaciones_capacitacion e
            JOIN personal p ON e.empleado_id = p.id
            JOIN temas_capacitacion t ON e.tema_id = t.id
            WHERE e.capacitacion_id = ? AND e.organization_id = ?`,
      args: [id, organization_id]
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener evaluaciones', error: error.message });
  }
});

// POST /api/capacitaciones/:id/evaluaciones - Crear evaluación
router.post('/:id/evaluaciones', async (req, res) => {
  try {
    const { id } = req.params;
    const { empleado_id, tema_id, calificacion, comentarios, fecha_evaluacion } = req.body;
    const organization_id = req.user?.organization_id || 1;
    if (!empleado_id || !tema_id) {
      return res.status(400).json({ message: 'Faltan datos obligatorios (empleado_id, tema_id)' });
    }
    const evalId = randomUUID();
    const result = await tursoClient.execute({
      sql: `INSERT INTO evaluaciones_capacitacion (id, capacitacion_id, empleado_id, tema_id, calificacion, comentarios, fecha_evaluacion, organization_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime')) RETURNING *`,
      args: [evalId, id, empleado_id, tema_id, calificacion || null, comentarios || '', fecha_evaluacion || null, organization_id]
    });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear evaluación', error: error.message });
  }
});

// PUT /api/capacitaciones/:id/evaluaciones/:evalId - Actualizar evaluación
router.put('/:id/evaluaciones/:evalId', async (req, res) => {
  try {
    const { id, evalId } = req.params;
    const { calificacion, comentarios, fecha_evaluacion } = req.body;
    const organization_id = req.user?.organization_id || 1;
    const result = await tursoClient.execute({
      sql: `UPDATE evaluaciones_capacitacion SET calificacion = ?, comentarios = ?, fecha_evaluacion = ?, updated_at = datetime('now', 'localtime')
            WHERE id = ? AND capacitacion_id = ? AND organization_id = ? RETURNING *`,
      args: [calificacion || null, comentarios || '', fecha_evaluacion || null, evalId, id, organization_id]
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar evaluación', error: error.message });
  }
});

// DELETE /api/capacitaciones/:id/evaluaciones/:evalId - Eliminar evaluación
router.delete('/:id/evaluaciones/:evalId', async (req, res) => {
  try {
    const { id, evalId } = req.params;
    const organization_id = req.user?.organization_id || 1;
    const result = await tursoClient.execute({
      sql: `DELETE FROM evaluaciones_capacitacion WHERE id = ? AND capacitacion_id = ? AND organization_id = ? RETURNING id`,
      args: [evalId, id, organization_id]
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar evaluación', error: error.message });
  }
});

export default router;
