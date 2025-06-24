import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = Router();

// GET /api/evaluaciones-grupales - Listar todas las evaluaciones grupales
router.get('/', async (req, res) => {
  const { estado } = req.query;
  try {
    let sql = `
      SELECT eg.*, 
        (SELECT COUNT(*) FROM empleados_evaluados ee WHERE ee.evaluacion_grupal_id = eg.id) as total_empleados
      FROM evaluaciones_grupales eg
    `;
    const params = [];

    if (estado) {
      sql += ' WHERE eg.estado = ?';
      params.push(estado);
    }

    sql += ' ORDER BY eg.fecha_evaluacion DESC';

    const result = await tursoClient.execute({ sql, args: params });
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener evaluaciones grupales:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/evaluaciones-grupales/:id - Obtener una evaluación grupal por ID con empleados
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener evaluación grupal
    const evaluacion = await tursoClient.execute({
      sql: 'SELECT * FROM evaluaciones_grupales WHERE id = ?',
      args: [id],
    });

    if (evaluacion.rows.length === 0) {
      return res.status(404).json({ error: 'Evaluación grupal no encontrada.' });
    }

    // Obtener empleados evaluados
    const empleados = await tursoClient.execute({
      sql: 'SELECT * FROM empleados_evaluados WHERE evaluacion_grupal_id = ? ORDER BY nombre_empleado',
      args: [id],
    });

    // Parsear JSON de competencias
    const empleadosConCompetencias = empleados.rows.map(emp => ({
      ...emp,
      competencias: emp.competencias_json ? JSON.parse(emp.competencias_json) : {}
    }));

    res.json({
      ...evaluacion.rows[0],
      empleados: empleadosConCompetencias
    });
  } catch (error) {
    console.error(`Error al obtener la evaluación grupal ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/evaluaciones-grupales - Crear nueva evaluación grupal
router.post('/', async (req, res) => {
  const { 
    titulo, 
    descripcion,
    proceso_capacitacion,
    fecha_evaluacion,
    estado,
    observaciones_generales,
    empleados
  } = req.body;

  if (!titulo || !fecha_evaluacion) {
    return res.status(400).json({ 
      error: 'Los campos "titulo" y "fecha_evaluacion" son obligatorios.' 
    });
  }

  try {
    // Crear evaluación grupal
    const result = await tursoClient.execute({
      sql: `INSERT INTO evaluaciones_grupales (
              titulo, descripcion, proceso_capacitacion, fecha_evaluacion, 
              estado, observaciones_generales
            ) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        titulo, 
        descripcion || null,
        proceso_capacitacion || null,
        fecha_evaluacion,
        estado || 'planificada',
        observaciones_generales || null
      ],
    });

    const evaluacionId = result.lastInsertRowid;

    // Agregar empleados si se proporcionaron
    if (empleados && Array.isArray(empleados)) {
      for (const empleado of empleados) {
        const competenciasJson = empleado.competencias ? JSON.stringify(empleado.competencias) : null;
        
        await tursoClient.execute({
          sql: `INSERT INTO empleados_evaluados (
                  evaluacion_grupal_id, nombre_empleado, puesto, 
                  competencias_json, observaciones_individuales
                ) VALUES (?, ?, ?, ?, ?)`,
          args: [
            evaluacionId,
            empleado.nombre_empleado,
            empleado.puesto || null,
            competenciasJson,
            empleado.observaciones_individuales || null
          ],
        });
      }
    }

    // Devolver la evaluación creada
    const nuevaEvaluacion = await tursoClient.execute({
      sql: `SELECT eg.*, 
              (SELECT COUNT(*) FROM empleados_evaluados ee WHERE ee.evaluacion_grupal_id = eg.id) as total_empleados
            FROM evaluaciones_grupales eg WHERE eg.id = ?`,
      args: [evaluacionId]
    });

    res.status(201).json(nuevaEvaluacion.rows[0]);
  } catch (error) {
    console.error('Error al crear la evaluación grupal:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/evaluaciones-grupales/:id - Actualizar evaluación grupal
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    titulo, 
    descripcion,
    proceso_capacitacion,
    fecha_evaluacion,
    estado,
    observaciones_generales,
    empleados
  } = req.body;

  if (!titulo || !fecha_evaluacion) {
    return res.status(400).json({ 
      error: 'Los campos "titulo" y "fecha_evaluacion" son obligatorios.' 
    });
  }

  try {
    // Actualizar evaluación grupal
    const result = await tursoClient.execute({
      sql: `UPDATE evaluaciones_grupales SET 
              titulo = ?, descripcion = ?, proceso_capacitacion = ?, 
              fecha_evaluacion = ?, estado = ?, observaciones_generales = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [
        titulo, 
        descripcion || null,
        proceso_capacitacion || null,
        fecha_evaluacion,
        estado || 'planificada',
        observaciones_generales || null,
        id
      ],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Evaluación grupal no encontrada.' });
    }

    // Actualizar empleados si se proporcionaron
    if (empleados && Array.isArray(empleados)) {
      // Eliminar empleados existentes
      await tursoClient.execute({
        sql: 'DELETE FROM empleados_evaluados WHERE evaluacion_grupal_id = ?',
        args: [id]
      });

      // Agregar empleados actualizados
      for (const empleado of empleados) {
        const competenciasJson = empleado.competencias ? JSON.stringify(empleado.competencias) : null;
        
        await tursoClient.execute({
          sql: `INSERT INTO empleados_evaluados (
                  evaluacion_grupal_id, nombre_empleado, puesto, 
                  competencias_json, observaciones_individuales
                ) VALUES (?, ?, ?, ?, ?)`,
          args: [
            id,
            empleado.nombre_empleado,
            empleado.puesto || null,
            competenciasJson,
            empleado.observaciones_individuales || null
          ],
        });
      }
    }

    // Devolver la evaluación actualizada
    const evaluacionActualizada = await tursoClient.execute({
      sql: `SELECT eg.*, 
              (SELECT COUNT(*) FROM empleados_evaluados ee WHERE ee.evaluacion_grupal_id = eg.id) as total_empleados
            FROM evaluaciones_grupales eg WHERE eg.id = ?`,
      args: [id]
    });

    res.json(evaluacionActualizada.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar la evaluación grupal ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/evaluaciones-grupales/:id - Eliminar evaluación grupal
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM evaluaciones_grupales WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Evaluación grupal no encontrada.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar la evaluación grupal ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/evaluaciones-grupales/competencias/estandar - Obtener competencias estándar
router.get('/competencias/estandar', async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM competencias_estandar WHERE activa = 1 ORDER BY nombre'
    });
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener competencias estándar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
