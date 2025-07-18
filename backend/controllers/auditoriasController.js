import { tursoClient } from '../lib/tursoClient.js';
import { randomUUID } from 'crypto';

// ===============================================
// CONTROLADOR DE AUDITORÍAS - SGC PRO
// ===============================================

// Obtener todas las auditorías con relaciones
export const getAllAuditorias = async (req, res) => {
  try {
    console.log('🔍 Obteniendo auditorías con relaciones...');
    
    const result = await tursoClient.execute({
      sql: `
        SELECT 
          a.*,
          p.nombres || ' ' || p.apellidos as responsable_nombre,
          COUNT(DISTINCT asp.id) as total_aspectos,
          COUNT(DISTINCT r.id) as total_relaciones
        FROM auditorias a
        LEFT JOIN personal p ON a.responsable_id = p.id
        LEFT JOIN auditoria_aspectos asp ON a.id = asp.auditoria_id
        LEFT JOIN relaciones_sgc r ON (r.origen_tipo = 'auditoria' AND r.origen_id = a.id)
        WHERE a.organization_id = ?
        GROUP BY a.id
        ORDER BY a.fecha_programada DESC
      `,
      args: [req.user?.organization_id || 2]
    });

    // Parsear las áreas como JSON para cada auditoría
    const auditoriasConAreas = result.rows.map(auditoria => {
      try {
        const areas = JSON.parse(auditoria.area || '[]');
        return {
          ...auditoria,
          areas: areas
        };
      } catch (error) {
        // Si no es JSON válido, tratar como string simple
        return {
          ...auditoria,
          areas: auditoria.area ? [auditoria.area] : []
        };
      }
    });

    console.log(`✅ ${auditoriasConAreas.length} auditorías encontradas con relaciones`);
    
    res.json({
      success: true,
      data: auditoriasConAreas,
      total: auditoriasConAreas.length
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

// Obtener auditoría por ID con relaciones completas
export const getAuditoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Obteniendo auditoría ${id} con relaciones...`);
    
    // Obtener auditoría principal
    const auditoriaResult = await tursoClient.execute({
      sql: `
        SELECT 
          a.*,
          p.nombres || ' ' || p.apellidos as responsable_nombre
        FROM auditorias a
        LEFT JOIN personal p ON a.responsable_id = p.id
        WHERE a.id = ? AND a.organization_id = ?
      `,
      args: [id, req.user?.organization_id || 2]
    });

    if (auditoriaResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    const auditoria = auditoriaResult.rows[0];

    // Parsear las áreas como JSON
    let areas = [];
    try {
      areas = JSON.parse(auditoria.area || '[]');
    } catch (error) {
      // Si no es JSON válido, tratar como string simple
      areas = auditoria.area ? [auditoria.area] : [];
    }

    // Obtener aspectos de la auditoría
    const aspectosResult = await tursoClient.execute({
      sql: `
        SELECT 
          asp.*,
          p.nombre as proceso_nombre_completo
        FROM auditoria_aspectos asp
        LEFT JOIN procesos p ON asp.proceso_id = p.id
        WHERE asp.auditoria_id = ?
      `,
      args: [id]
    });

    // Obtener relaciones con otros registros
    const relacionesResult = await tursoClient.execute({
      sql: `
        SELECT 
          r.*,
          CASE 
            WHEN r.destino_tipo = 'proceso' THEN (SELECT nombre FROM procesos WHERE id = r.destino_id)
            WHEN r.destino_tipo = 'documento' THEN (SELECT titulo FROM documentos WHERE id = r.destino_id)
            WHEN r.destino_tipo = 'hallazgo' THEN (SELECT titulo FROM hallazgos WHERE id = r.destino_id)
            WHEN r.destino_tipo = 'accion' THEN (SELECT descripcion_accion FROM acciones WHERE id = r.destino_id)
            ELSE 'Registro no encontrado'
          END as destino_nombre
        FROM relaciones_sgc r
        WHERE r.origen_tipo = 'auditoria' AND r.origen_id = ? AND r.organization_id = ?
      `,
      args: [id, req.user?.organization_id || 2]
    });

    console.log(`✅ Auditoría ${id} encontrada con ${aspectosResult.rows.length} aspectos y ${relacionesResult.rows.length} relaciones`);
    
    res.json({
      success: true,
      data: {
        ...auditoria,
        areas: areas,
        aspectos: aspectosResult.rows,
        relaciones: relacionesResult.rows
      }
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

// Crear nueva auditoría con relaciones
export const createAuditoria = async (req, res) => {
  try {
    console.log('🆕 Creando nueva auditoría con relaciones...');
    console.log('📋 Datos recibidos:', req.body);
    
    const {
      codigo,
      titulo,
      areas,
      responsable_id,
      fecha_programada,
      objetivos,
      alcance,
      criterios,
      estado = 'planificada',
      aspectos = [],
      relaciones = []
    } = req.body;

    // Validaciones básicas
    if (!titulo || !areas || areas.length === 0 || !fecha_programada || !objetivos) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: título, áreas, fecha programada, objetivos'
      });
    }

    // Convertir áreas a formato JSON para almacenar en la base de datos
    const areaJson = JSON.stringify(areas);

    const auditoriaId = randomUUID();
    const timestamp = new Date().toISOString();
    const organizationId = req.user?.organization_id || 2;

    // Crear auditoría principal
    await tursoClient.execute({
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
        areaJson, // Ahora almacenamos el JSON de áreas
        responsable_id || null,
        fecha_programada,
        objetivos,
        alcance || null,
        criterios || null,
        estado,
        organizationId,
        timestamp,
        timestamp
      ]
    });

    // Crear aspectos si se proporcionan
    if (aspectos && aspectos.length > 0) {
      for (const aspecto of aspectos) {
        if (aspecto.proceso_nombre) {
          const aspectoId = randomUUID();
          await tursoClient.execute({
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
              aspecto.proceso_id || null,
              aspecto.proceso_nombre,
              aspecto.documentacion_referenciada || null,
              aspecto.auditor_nombre || null,
              aspecto.observaciones || null,
              aspecto.conformidad || null,
              timestamp
            ]
          });
        }
      }
    }

    // Crear relaciones si se proporcionan
    if (relaciones && relaciones.length > 0) {
      for (const relacion of relaciones) {
        if (relacion.destino_tipo && relacion.destino_id) {
          const relacionId = randomUUID();
          await tursoClient.execute({
            sql: `
              INSERT INTO relaciones_sgc (
                id, organization_id, origen_tipo, origen_id,
                destino_tipo, destino_id, descripcion, fecha_creacion, usuario_creador
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
              relacionId,
              organizationId,
              'auditoria',
              auditoriaId,
              relacion.destino_tipo,
              relacion.destino_id,
              relacion.descripcion || `Relación con ${relacion.destino_tipo}`,
              timestamp,
              req.user?.nombre || 'Sistema'
            ]
          });
        }
      }
    }

    console.log(`✅ Auditoría creada con ID: ${auditoriaId}`);
    
    res.status(201).json({
      success: true,
      data: {
        id: auditoriaId,
        codigo,
        titulo,
        areas,
        aspectos_creados: aspectos.length,
        relaciones_creadas: relaciones.length
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

// Agregar relación a auditoría
export const addRelacion = async (req, res) => {
  try {
    const { auditoriaId } = req.params;
    console.log(`🔗 Agregando relación a auditoría ${auditoriaId}...`);
    
    const {
      destino_tipo,
      destino_id,
      descripcion
    } = req.body;

    if (!destino_tipo || !destino_id) {
      return res.status(400).json({
        success: false,
        message: 'Los campos destino_tipo y destino_id son obligatorios'
      });
    }

    // Verificar que la auditoría existe
    const auditoriaExists = await tursoClient.execute({
      sql: 'SELECT id FROM auditorias WHERE id = ? AND organization_id = ?',
      args: [auditoriaId, req.user?.organization_id || 2]
    });

    if (auditoriaExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    // Verificar que no existe ya la relación
    const relacionExists = await tursoClient.execute({
      sql: `
        SELECT id FROM relaciones_sgc 
        WHERE origen_tipo = 'auditoria' AND origen_id = ? 
        AND destino_tipo = ? AND destino_id = ? 
        AND organization_id = ?
      `,
      args: [auditoriaId, destino_tipo, destino_id, req.user?.organization_id || 2]
    });

    if (relacionExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Esta relación ya existe'
      });
    }

    const relacionId = randomUUID();
    const timestamp = new Date().toISOString();

    await tursoClient.execute({
      sql: `
        INSERT INTO relaciones_sgc (
          id, organization_id, origen_tipo, origen_id,
          destino_tipo, destino_id, descripcion, fecha_creacion, usuario_creador
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        relacionId,
        req.user?.organization_id || 2,
        'auditoria',
        auditoriaId,
        destino_tipo,
        destino_id,
        descripcion || `Relación con ${destino_tipo}`,
        timestamp,
        req.user?.nombre || 'Sistema'
      ]
    });

    console.log(`✅ Relación agregada con ID: ${relacionId}`);
    
    res.status(201).json({
      success: true,
      data: {
        id: relacionId,
        origen_tipo: 'auditoria',
        origen_id: auditoriaId,
        destino_tipo,
        destino_id,
        descripcion
      },
      message: 'Relación agregada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error agregando relación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar relación',
      error: error.message
    });
  }
};

// Obtener relaciones de una auditoría
export const getRelaciones = async (req, res) => {
  try {
    const { auditoriaId } = req.params;
    console.log(`🔗 Obteniendo relaciones de auditoría ${auditoriaId}...`);
    
    const result = await tursoClient.execute({
      sql: `
        SELECT 
          r.*,
          CASE 
            WHEN r.destino_tipo = 'proceso' THEN (SELECT nombre FROM procesos WHERE id = r.destino_id)
            WHEN r.destino_tipo = 'documento' THEN (SELECT titulo FROM documentos WHERE id = r.destino_id)
            WHEN r.destino_tipo = 'hallazgo' THEN (SELECT titulo FROM hallazgos WHERE id = r.destino_id)
            WHEN r.destino_tipo = 'accion' THEN (SELECT descripcion_accion FROM acciones WHERE id = r.destino_id)
            WHEN r.destino_tipo = 'personal' THEN (SELECT nombres || ' ' || apellidos FROM personal WHERE id = r.destino_id)
            WHEN r.destino_tipo = 'departamento' THEN (SELECT nombre FROM departamentos WHERE id = r.destino_id)
            ELSE 'Registro no encontrado'
          END as destino_nombre
        FROM relaciones_sgc r
        WHERE r.origen_tipo = 'auditoria' 
        AND r.origen_id = ? 
        AND r.organization_id = ?
        ORDER BY r.fecha_creacion DESC
      `,
      args: [auditoriaId, req.user?.organization_id || 2]
    });

    console.log(`✅ ${result.rows.length} relaciones encontradas`);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo relaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener relaciones',
      error: error.message
    });
  }
};

// Eliminar relación de auditoría
export const deleteRelacion = async (req, res) => {
  try {
    const { relacionId } = req.params;
    console.log(`🗑️ Eliminando relación ${relacionId}...`);
    
    const result = await tursoClient.execute({
      sql: `
        DELETE FROM relaciones_sgc 
        WHERE id = ? AND organization_id = ? AND origen_tipo = 'auditoria'
      `,
      args: [relacionId, req.user?.organization_id || 2]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Relación no encontrada'
      });
    }

    console.log(`✅ Relación ${relacionId} eliminada`);
    
    res.json({
      success: true,
      message: 'Relación eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error eliminando relación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar relación',
      error: error.message
    });
  }
};

// Obtener registros relacionables disponibles para auditoría
export const getRegistrosRelacionables = async (req, res) => {
  try {
    const { tipo } = req.query;
    console.log(`🔍 Obteniendo registros relacionables de tipo: ${tipo}`);
    
    let sql = '';
    let args = [req.user?.organization_id || 2];
    
    switch (tipo) {
      case 'procesos':
        sql = 'SELECT id, nombre as titulo FROM procesos WHERE organization_id = ? ORDER BY nombre';
        break;
      case 'documentos':
        sql = 'SELECT id, titulo FROM documentos WHERE organization_id = ? ORDER BY titulo';
        break;
      case 'hallazgos':
        sql = 'SELECT id, titulo FROM hallazgos WHERE organization_id = ? ORDER BY titulo';
        break;
      case 'acciones':
        sql = 'SELECT id, descripcion_accion as titulo FROM acciones WHERE organization_id = ? ORDER BY descripcion_accion';
        break;
      case 'personal':
        sql = 'SELECT id, nombres || " " || apellidos as titulo FROM personal WHERE organization_id = ? ORDER BY nombres';
        break;
      case 'departamentos':
        sql = 'SELECT id, nombre as titulo FROM departamentos WHERE organization_id = ? ORDER BY nombre';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de registro no válido'
        });
    }

    const result = await tursoClient.execute({ sql, args });

    console.log(`✅ ${result.rows.length} registros de tipo ${tipo} encontrados`);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo registros relacionables:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener registros relacionables',
      error: error.message
    });
  }
};
