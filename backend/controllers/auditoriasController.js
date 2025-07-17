import { tursoClient } from '../lib/tursoClient.js';
import { randomUUID } from 'crypto';

// ===============================================
// CONTROLADOR DE AUDITORÍAS - SGC PRO
// ===============================================

// Obtener todas las auditorías
export const getAllAuditorias = async (req, res) => {
  try {
    console.log('🔍 Obteniendo auditorías...');
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM auditorias WHERE organization_id = '2' ORDER BY fecha_programada DESC`,
      args: []
    });

    console.log(`✅ ${result.rows.length} auditorías encontradas`);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo auditorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener auditorías',
      error: error.message
    });
  }
};

// Obtener auditoría por ID
export const getAuditoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Obteniendo auditoría ${id}...`);
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM auditorias WHERE id = ? AND organization_id = '2'`,
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    console.log(`✅ Auditoría ${id} encontrada`);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener auditoría',
      error: error.message
    });
  }
};

// Crear nueva auditoría
export const createAuditoria = async (req, res) => {
  try {
    console.log('🆕 Creando nueva auditoría...');
    console.log('📋 Datos recibidos:', req.body);
    
    const {
      codigo,
      titulo,
      area,
      responsable_id,
      fecha_programada,
      objetivos,
      alcance,
      criterios,
      estado = 'planificada'
    } = req.body;

    // Validaciones básicas
    if (!titulo || !area || !fecha_programada || !objetivos) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: título, área, fecha programada, objetivos'
      });
    }

    const auditoriaId = randomUUID();
    const timestamp = new Date().toISOString();

    const result = await tursoClient.execute({
      sql: `
        INSERT INTO auditorias (
          id, codigo, titulo, area, responsable_id, fecha_programada,
          objetivos, alcance, criterios, estado, organization_id,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        auditoriaId,
        codigo || `AUD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        titulo,
        area,
        responsable_id || null,
        fecha_programada,
        objetivos,
        alcance || null,
        criterios || null,
        estado,
        req.user.organization_id,
        timestamp,
        timestamp
      ]
    });

    console.log(`✅ Auditoría creada con ID: ${auditoriaId}`);
    
    res.status(201).json({
      success: true,
      data: {
        id: auditoriaId,
        codigo,
        titulo,
        area
      },
      message: 'Auditoría creada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error creando auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear auditoría',
      error: error.message
    });
  }
};

// Actualizar auditoría
export const updateAuditoria = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`✏️ Actualizando auditoría ${id}...`);
    
    const {
      titulo,
      area,
      responsable_id,
      fecha_programada,
      fecha_ejecucion,
      objetivos,
      alcance,
      criterios,
      resultados,
      observaciones,
      estado
    } = req.body;

    const timestamp = new Date().toISOString();

    const result = await tursoClient.execute({
      sql: `
        UPDATE auditorias SET
          titulo = COALESCE(?, titulo),
          area = COALESCE(?, area),
          responsable_id = ?,
          fecha_programada = COALESCE(?, fecha_programada),
          fecha_ejecucion = ?,
          objetivos = COALESCE(?, objetivos),
          alcance = ?,
          criterios = ?,
          resultados = ?,
          observaciones = ?,
          estado = COALESCE(?, estado),
          updated_at = ?
        WHERE id = ? AND organization_id = ?
      `,
      args: [
        titulo,
        area,
        responsable_id || null,
        fecha_programada,
        fecha_ejecucion || null,
        objetivos,
        alcance || null,
        criterios || null,
        resultados || null,
        observaciones || null,
        estado,
        timestamp,
        id,
        req.user.organization_id
      ]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    console.log(`✅ Auditoría ${id} actualizada`);
    
    res.json({
      success: true,
      message: 'Auditoría actualizada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error actualizando auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar auditoría',
      error: error.message
    });
  }
};

// Eliminar auditoría
export const deleteAuditoria = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando auditoría ${id}...`);
    
    const result = await tursoClient.execute({
      sql: 'DELETE FROM auditorias WHERE id = ? AND organization_id = ?',
      args: [id, req.user.organization_id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    console.log(`✅ Auditoría ${id} eliminada`);
    
    res.json({
      success: true,
      message: 'Auditoría eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error eliminando auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar auditoría',
      error: error.message
    });
  }
};

// ===============================================
// GESTIÓN DE ASPECTOS
// ===============================================

// Obtener aspectos de una auditoría
export const getAspectos = async (req, res) => {
  try {
    const { auditoriaId } = req.params;
    console.log(`🔍 Obteniendo aspectos de auditoría ${auditoriaId}...`);
    
    const result = await tursoClient.execute({
      sql: `
        SELECT aa.*, p.nombre as proceso_original
        FROM auditoria_aspectos aa
        LEFT JOIN procesos p ON aa.proceso_id = p.id
        WHERE aa.auditoria_id = ?
        ORDER BY aa.created_at ASC
      `,
      args: [auditoriaId]
    });

    console.log(`✅ ${result.rows.length} aspectos encontrados`);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo aspectos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener aspectos',
      error: error.message
    });
  }
};

// Agregar aspecto a auditoría
export const addAspecto = async (req, res) => {
  try {
    const { auditoriaId } = req.params;
    console.log(`➕ Agregando aspecto a auditoría ${auditoriaId}...`);
    
    const {
      proceso_id,
      proceso_nombre,
      documentacion_referenciada,
      auditor_nombre,
      observaciones,
      conformidad
    } = req.body;

    if (!proceso_nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del proceso es obligatorio'
      });
    }

    const aspectoId = randomUUID();
    const timestamp = new Date().toISOString();

    const result = await tursoClient.execute({
      sql: `
        INSERT INTO auditoria_aspectos (
          id, auditoria_id, proceso_id, proceso_nombre,
          documentacion_referenciada, auditor_nombre,
          observaciones, conformidad, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        aspectoId,
        auditoriaId,
        proceso_id || null,
        proceso_nombre,
        documentacion_referenciada || null,
        auditor_nombre || null,
        observaciones || null,
        conformidad || null,
        timestamp
      ]
    });

    console.log(`✅ Aspecto agregado con ID: ${aspectoId}`);
    
    res.status(201).json({
      success: true,
      data: {
        id: aspectoId,
        proceso_nombre
      },
      message: 'Aspecto agregado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error agregando aspecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar aspecto',
      error: error.message
    });
  }
};

// Actualizar aspecto
export const updateAspecto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`✏️ Actualizando aspecto ${id}...`);
    
    const {
      proceso_id,
      proceso_nombre,
      documentacion_referenciada,
      auditor_nombre,
      observaciones,
      conformidad
    } = req.body;

    const result = await tursoClient.execute({
      sql: `
        UPDATE auditoria_aspectos SET
          proceso_id = ?,
          proceso_nombre = COALESCE(?, proceso_nombre),
          documentacion_referenciada = ?,
          auditor_nombre = ?,
          observaciones = ?,
          conformidad = ?
        WHERE id = ?
      `,
      args: [
        proceso_id || null,
        proceso_nombre,
        documentacion_referenciada || null,
        auditor_nombre || null,
        observaciones || null,
        conformidad || null,
        id
      ]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aspecto no encontrado'
      });
    }

    console.log(`✅ Aspecto ${id} actualizado`);
    
    res.json({
      success: true,
      message: 'Aspecto actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error actualizando aspecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar aspecto',
      error: error.message
    });
  }
};

// Eliminar aspecto
export const deleteAspecto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando aspecto ${id}...`);
    
    const result = await tursoClient.execute({
      sql: 'DELETE FROM auditoria_aspectos WHERE id = ?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aspecto no encontrado'
      });
    }

    console.log(`✅ Aspecto ${id} eliminado`);
    
    res.json({
      success: true,
      message: 'Aspecto eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error eliminando aspecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar aspecto',
      error: error.message
    });
  }
};
