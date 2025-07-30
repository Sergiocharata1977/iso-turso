import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import simpleAuth from '../middleware/simpleAuth.js';

const router = express.Router();

/**
 * GET /api/suscripciones/debug
 * Endpoint de debug para verificar autenticación
 */
router.get('/debug', simpleAuth, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: 'Debug endpoint - Usuario autenticado correctamente'
  });
});

/**
 * GET /api/suscripciones
 * Obtener suscripciones (filtrado por organización del usuario)
 */
router.get('/', simpleAuth, async (req, res) => {
  try {
    const { organization_id } = req.user;
    const { estado, plan_id } = req.query;

    let sql = `
      SELECT 
        s.id, s.organization_id, s.plan_id, s.estado, s.fecha_inicio,
        s.fecha_fin, s.fecha_renovacion, s.precio_pagado, s.moneda,
        s.metodo_pago, s.periodo, s.cancelada_por_usuario, s.motivo_cancelacion,
        s.created_at, s.updated_at,
        p.nombre as plan_nombre, p.descripcion as plan_descripcion,
        p.precio_mensual, p.precio_anual, p.max_usuarios, p.max_departamentos
      FROM suscripciones s
      LEFT JOIN planes p ON s.plan_id = p.id
      WHERE s.organization_id = ?
    `;
    
    const args = [organization_id];

    if (estado) {
      sql += ' AND s.estado = ?';
      args.push(estado);
    }

    if (plan_id) {
      sql += ' AND s.plan_id = ?';
      args.push(plan_id);
    }

    sql += ' ORDER BY s.created_at DESC';

    const { rows } = await tursoClient.execute({ sql, args });

    res.json({
      success: true,
      data: rows,
      message: 'Suscripciones obtenidas correctamente'
    });
  } catch (error) {
    console.error('Error al obtener suscripciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener suscripciones',
      error: error.message
    });
  }
});

/**
 * GET /api/suscripciones/:id
 * Obtener una suscripción específica
 */
router.get('/:id', simpleAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.user;

    const { rows } = await tursoClient.execute({
      sql: `
        SELECT 
          s.id, s.organization_id, s.plan_id, s.estado, s.fecha_inicio,
          s.fecha_fin, s.fecha_renovacion, s.precio_pagado, s.moneda,
          s.metodo_pago, s.periodo, s.cancelada_por_usuario, s.motivo_cancelacion,
          s.created_at, s.updated_at,
          p.nombre as plan_nombre, p.descripcion as plan_descripcion,
          p.precio_mensual, p.precio_anual, p.max_usuarios, p.max_departamentos,
          p.max_documentos, p.max_auditorias, p.max_hallazgos, p.max_acciones
        FROM suscripciones s
        LEFT JOIN planes p ON s.plan_id = p.id
        WHERE s.id = ? AND s.organization_id = ?
      `,
      args: [id, organization_id]
    });

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Suscripción no encontrada'
      });
    }

    res.json({
      success: true,
      data: rows[0],
      message: 'Suscripción obtenida correctamente'
    });
  } catch (error) {
    console.error('Error al obtener suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener suscripción',
      error: error.message
    });
  }
});

/**
 * POST /api/suscripciones
 * Crear una nueva suscripción
 */
router.post('/', simpleAuth, async (req, res) => {
  try {
    const { organization_id } = req.user;
    
    const {
      plan_id,
      fecha_inicio,
      fecha_fin,
      precio_pagado,
      moneda = 'USD',
      metodo_pago,
      periodo = 'mensual'
    } = req.body;

    // Validaciones básicas
    if (!plan_id) {
      return res.status(400).json({
        success: false,
        message: 'El ID del plan es requerido'
      });
    }

    if (!fecha_inicio) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio es requerida'
      });
    }

    // Verificar que el plan existe
    const { rows: plan } = await tursoClient.execute({
      sql: 'SELECT id, nombre FROM planes WHERE id = ? AND estado = "activo"',
      args: [plan_id]
    });

    if (plan.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Plan no encontrado o inactivo'
      });
    }

    // Verificar si ya existe una suscripción activa
    const { rows: existingSubscription } = await tursoClient.execute({
      sql: 'SELECT id, plan_id FROM suscripciones WHERE organization_id = ? AND estado = "activa"',
      args: [organization_id]
    });

    if (existingSubscription.length > 0) {
      console.log('🔍 DEBUG - Suscripción existente:', existingSubscription[0]);
      return res.status(400).json({
        success: false,
        message: 'Ya existe una suscripción activa para esta organización',
        data: {
          existing_subscription: existingSubscription[0]
        }
      });
    }

    // Crear la suscripción
    const result = await tursoClient.execute({
      sql: `
        INSERT INTO suscripciones (
          organization_id, plan_id, estado, fecha_inicio, fecha_fin,
          precio_pagado, moneda, metodo_pago, periodo
        ) VALUES (?, ?, 'activa', ?, ?, ?, ?, ?, ?)
      `,
      args: [
        organization_id,
        plan_id,
        fecha_inicio,
        fecha_fin || null,
        precio_pagado || 0,
        moneda,
        metodo_pago || null,
        periodo
      ]
    });

    // Obtener el ID de la suscripción creada
    const { rows: newSubscription } = await tursoClient.execute({
      sql: 'SELECT id FROM suscripciones WHERE organization_id = ? AND plan_id = ? ORDER BY created_at DESC LIMIT 1',
      args: [organization_id, plan_id]
    });

    res.status(201).json({
      success: true,
      data: { id: newSubscription[0]?.id },
      message: 'Suscripción creada correctamente'
    });
  } catch (error) {
    console.error('Error al crear suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear suscripción',
      error: error.message
    });
  }
});

/**
 * PUT /api/suscripciones/:id
 * Actualizar una suscripción
 */
router.put('/:id', simpleAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.user;
    const {
      plan_id,
      estado,
      fecha_fin,
      fecha_renovacion,
      precio_pagado,
      metodo_pago,
      periodo,
      motivo_cancelacion
    } = req.body;

    // Verificar que la suscripción existe y pertenece a la organización
    const { rows: existingSubscription } = await tursoClient.execute({
      sql: 'SELECT id FROM suscripciones WHERE id = ? AND organization_id = ?',
      args: [id, organization_id]
    });

    if (existingSubscription.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Suscripción no encontrada'
      });
    }

    // Actualizar la suscripción
    await tursoClient.execute({
      sql: `
        UPDATE suscripciones SET
          plan_id = COALESCE(?, plan_id),
          estado = COALESCE(?, estado),
          fecha_fin = COALESCE(?, fecha_fin),
          fecha_renovacion = COALESCE(?, fecha_renovacion),
          precio_pagado = COALESCE(?, precio_pagado),
          metodo_pago = COALESCE(?, metodo_pago),
          periodo = COALESCE(?, periodo),
          motivo_cancelacion = COALESCE(?, motivo_cancelacion),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        plan_id,
        estado,
        fecha_fin,
        fecha_renovacion,
        precio_pagado,
        metodo_pago,
        periodo,
        motivo_cancelacion,
        id
      ]
    });

    res.json({
      success: true,
      message: 'Suscripción actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar suscripción',
      error: error.message
    });
  }
});

/**
 * DELETE /api/suscripciones/:id
 * Cancelar una suscripción
 */
router.delete('/:id', simpleAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.user;
    const { motivo_cancelacion } = req.body;
    
    console.log('🔍 DEBUG DELETE - ID:', id);
    console.log('🔍 DEBUG DELETE - Organization ID:', organization_id);
    console.log('🔍 DEBUG DELETE - Body:', req.body);

    // Verificar que la suscripción existe y pertenece a la organización
    const { rows: existingSubscription } = await tursoClient.execute({
      sql: 'SELECT id, estado FROM suscripciones WHERE id = ? AND organization_id = ?',
      args: [id, organization_id]
    });

    if (existingSubscription.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Suscripción no encontrada'
      });
    }

    if (existingSubscription[0].estado === 'cancelada') {
      return res.status(400).json({
        success: false,
        message: 'La suscripción ya está cancelada'
      });
    }

    // Cancelar la suscripción
    await tursoClient.execute({
      sql: `
        UPDATE suscripciones SET
          estado = 'cancelada',
          cancelada_por_usuario = TRUE,
          motivo_cancelacion = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [motivo_cancelacion || 'Cancelada por el usuario', id]
    });

    res.json({
      success: true,
      message: 'Suscripción cancelada correctamente'
    });
  } catch (error) {
    console.error('Error al cancelar suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cancelar suscripción',
      error: error.message
    });
  }
});

/**
 * GET /api/suscripciones/organizacion/actual
 * Obtener la suscripción actual de la organización
 */
router.get('/organizacion/actual', simpleAuth, async (req, res) => {
  try {
    const { organization_id } = req.user;

    const { rows } = await tursoClient.execute({
      sql: `
        SELECT 
          s.id, s.organization_id, s.plan_id, s.estado, s.fecha_inicio,
          s.fecha_fin, s.fecha_renovacion, s.precio_pagado, s.moneda,
          s.metodo_pago, s.periodo, s.cancelada_por_usuario, s.motivo_cancelacion,
          s.created_at, s.updated_at,
          p.nombre as plan_nombre, p.descripcion as plan_descripcion,
          p.precio_mensual, p.precio_anual, p.max_usuarios, p.max_departamentos,
          p.max_documentos, p.max_auditorias, p.max_hallazgos, p.max_acciones,
          p.caracteristicas
        FROM suscripciones s
        LEFT JOIN planes p ON s.plan_id = p.id
        WHERE s.organization_id = ? AND s.estado = 'activa'
        ORDER BY s.created_at DESC
        LIMIT 1
      `,
      args: [organization_id]
    });

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No hay suscripción activa'
      });
    }

    res.json({
      success: true,
      data: rows[0],
      message: 'Suscripción actual obtenida correctamente'
    });
  } catch (error) {
    console.error('Error al obtener suscripción actual:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener suscripción actual',
      error: error.message
    });
  }
});

export default router; 