import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import simpleAuth from '../middleware/simpleAuth.js';

const router = express.Router();

/**
 * GET /api/planes
 * Obtener todos los planes disponibles
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await tursoClient.execute({
      sql: `
        SELECT 
          id, nombre, descripcion, precio_mensual, precio_anual,
          max_usuarios, max_departamentos, max_documentos, max_auditorias,
          max_hallazgos, max_acciones, caracteristicas, estado,
          es_plan_gratuito, orden_display, created_at, updated_at
        FROM planes 
        WHERE estado = 'activo' 
        ORDER BY orden_display ASC
      `
    });

    res.json({
      success: true,
      data: rows,
      message: 'Planes obtenidos correctamente'
    });
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener planes',
      error: error.message
    });
  }
});

/**
 * GET /api/planes/:id
 * Obtener un plan específico
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { rows } = await tursoClient.execute({
      sql: `
        SELECT 
          id, nombre, descripcion, precio_mensual, precio_anual,
          max_usuarios, max_departamentos, max_documentos, max_auditorias,
          max_hallazgos, max_acciones, caracteristicas, estado,
          es_plan_gratuito, orden_display, created_at, updated_at
        FROM planes 
        WHERE id = ? AND estado = 'activo'
      `,
      args: [id]
    });

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plan no encontrado'
      });
    }

    res.json({
      success: true,
      data: rows[0],
      message: 'Plan obtenido correctamente'
    });
  } catch (error) {
    console.error('Error al obtener plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener plan',
      error: error.message
    });
  }
});

/**
 * POST /api/planes
 * Crear un nuevo plan (solo super admin)
 */
router.post('/', simpleAuth, async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio_mensual,
      precio_anual,
      max_usuarios,
      max_departamentos,
      max_documentos,
      max_auditorias,
      max_hallazgos,
      max_acciones,
      caracteristicas,
      es_plan_gratuito,
      orden_display
    } = req.body;

    // Validaciones básicas
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del plan es requerido'
      });
    }

    const { rows } = await tursoClient.execute({
      sql: `
        INSERT INTO planes (
          nombre, descripcion, precio_mensual, precio_anual,
          max_usuarios, max_departamentos, max_documentos, max_auditorias,
          max_hallazgos, max_acciones, caracteristicas, es_plan_gratuito, orden_display
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        nombre,
        descripcion || null,
        precio_mensual || 0,
        precio_anual || 0,
        max_usuarios || 10,
        max_departamentos || 5,
        max_documentos || 100,
        max_auditorias || 10,
        max_hallazgos || 50,
        max_acciones || 100,
        caracteristicas ? JSON.stringify(caracteristicas) : null,
        es_plan_gratuito || false,
        orden_display || 0
      ]
    });

    res.status(201).json({
      success: true,
      data: { id: rows[0].id },
      message: 'Plan creado correctamente'
    });
  } catch (error) {
    console.error('Error al crear plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear plan',
      error: error.message
    });
  }
});

/**
 * PUT /api/planes/:id
 * Actualizar un plan (solo super admin)
 */
router.put('/:id', simpleAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      precio_mensual,
      precio_anual,
      max_usuarios,
      max_departamentos,
      max_documentos,
      max_auditorias,
      max_hallazgos,
      max_acciones,
      caracteristicas,
      es_plan_gratuito,
      orden_display,
      estado
    } = req.body;

    // Verificar que el plan existe
    const { rows: existingPlan } = await tursoClient.execute({
      sql: 'SELECT id FROM planes WHERE id = ?',
      args: [id]
    });

    if (existingPlan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plan no encontrado'
      });
    }

    await tursoClient.execute({
      sql: `
        UPDATE planes SET
          nombre = COALESCE(?, nombre),
          descripcion = COALESCE(?, descripcion),
          precio_mensual = COALESCE(?, precio_mensual),
          precio_anual = COALESCE(?, precio_anual),
          max_usuarios = COALESCE(?, max_usuarios),
          max_departamentos = COALESCE(?, max_departamentos),
          max_documentos = COALESCE(?, max_documentos),
          max_auditorias = COALESCE(?, max_auditorias),
          max_hallazgos = COALESCE(?, max_hallazgos),
          max_acciones = COALESCE(?, max_acciones),
          caracteristicas = COALESCE(?, caracteristicas),
          es_plan_gratuito = COALESCE(?, es_plan_gratuito),
          orden_display = COALESCE(?, orden_display),
          estado = COALESCE(?, estado),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        nombre,
        descripcion,
        precio_mensual,
        precio_anual,
        max_usuarios,
        max_departamentos,
        max_documentos,
        max_auditorias,
        max_hallazgos,
        max_acciones,
        caracteristicas ? JSON.stringify(caracteristicas) : null,
        es_plan_gratuito,
        orden_display,
        estado,
        id
      ]
    });

    res.json({
      success: true,
      message: 'Plan actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar plan',
      error: error.message
    });
  }
});

/**
 * DELETE /api/planes/:id
 * Eliminar un plan (solo super admin)
 */
router.delete('/:id', simpleAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el plan existe
    const { rows: existingPlan } = await tursoClient.execute({
      sql: 'SELECT id FROM planes WHERE id = ?',
      args: [id]
    });

    if (existingPlan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plan no encontrado'
      });
    }

    // Verificar si hay suscripciones activas con este plan
    const { rows: activeSubscriptions } = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM suscripciones WHERE plan_id = ? AND estado = "activa"',
      args: [id]
    });

    if (activeSubscriptions[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el plan porque tiene suscripciones activas'
      });
    }

    // Eliminar el plan (soft delete)
    await tursoClient.execute({
      sql: 'UPDATE planes SET estado = "eliminado", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [id]
    });

    res.json({
      success: true,
      message: 'Plan eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar plan',
      error: error.message
    });
  }
});

export default router; 