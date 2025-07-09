import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import { auditMiddleware, auditActions, resourceTypes } from '../middleware/auditMiddleware.js';

const router = express.Router();

// ===========================================
// RUTAS ULTRA SIMPLES SIN RESTRICCIONES
// ===========================================

// Obtener TODO el personal de TODA la base de datos
router.get('/', async (req, res) => {
  try {
    console.log('🔓 Obteniendo TODO el personal sin restricciones');
    
    const result = await tursoClient.execute({
      sql: `SELECT p.*, o.name as organization_name 
            FROM personal p 
            LEFT JOIN organizations o ON p.organization_id = o.id 
            ORDER BY p.id DESC`,
      args: []
    });

    console.log(`✅ Encontradas ${result.rows.length} personas en TODA la base`);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: `${result.rows.length} personas encontradas (TODAS las organizaciones)`
    });
    
  } catch (error) {
    console.error('Error obteniendo personal:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener personal',
      error: error.message
    });
  }
});

// Obtener persona específica por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔓 Obteniendo persona ${id} sin restricciones`);
    
    const result = await tursoClient.execute({
      sql: `SELECT p.*, o.name as organization_name 
            FROM personal p 
            LEFT JOIN organizations o ON p.organization_id = o.id 
            WHERE p.id = ?`,
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error obteniendo persona:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener persona',
      error: error.message
    });
  }
});

// Crear nueva persona
router.post('/', auditMiddleware(auditActions.CREATE, resourceTypes.PERSONAL), async (req, res) => {
  try {
    console.log('\n======= INICIO CREACIÓN PERSONAL =======');
    console.log('📋 Datos recibidos (RAW):', JSON.stringify(req.body, null, 2));
    console.log('👤 Usuario autenticado (RAW):', JSON.stringify(req.user, null, 2));
    
    const {
      nombres, 
      apellidos, 
      documento_identidad, 
      email, 
      telefono, 
      puesto, 
      departamento,
      fecha_contratacion,
      estado = 'Activo',
      direccion,
      telefono_emergencia,
      fecha_nacimiento,
      nacionalidad,
      numero_legajo
    } = req.body;

    console.log('🔓 Creando nueva persona sin restricciones');
    console.log('📋 Datos procesados:', {
      nombres, apellidos, documento_identidad, email, telefono,
      direccion, telefono_emergencia, fecha_nacimiento, nacionalidad,
      fecha_contratacion, numero_legajo, estado
    });
    
    // Validar que el usuario tenga organization_id
    if (!req.user?.organization_id) {
      console.log('❌ Usuario sin organización asignada');
      return res.status(400).json({
        success: false,
        message: 'Usuario sin organización asignada'
      });
    }
    
    console.log('✅ Usuario válido con organización:', req.user.organization_id);
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO personal (
        nombres, apellidos, documento_identidad, email, telefono, 
        direccion, telefono_emergencia, fecha_nacimiento, nacionalidad,
        fecha_contratacion, numero_legajo, estado, 
        organization_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      args: [
        nombres || null, 
        apellidos || null, 
        documento_identidad || null, 
        email || null, 
        telefono || null,
        direccion || null, 
        telefono_emergencia || null, 
        fecha_nacimiento || null, 
        nacionalidad || null,
        fecha_contratacion || null, 
        numero_legajo || null, 
        estado || 'Activo', 
        req.user.organization_id
      ]
    });

    console.log(`✅ Persona creada con ID: ${result.lastInsertRowid}`);
    
    res.status(201).json({
      success: true,
      data: { 
        id: Number(result.lastInsertRowid), // Convertir BigInt a número
        nombres, 
        apellidos 
      },
      message: 'Persona creada exitosamente'
    });
    
  } catch (error) {
    console.error('Error creando persona:', error);
    
    // Manejar errores específicos de restricciones UNIQUE
    if (error.code === 'SQLITE_CONSTRAINT') {
      if (error.message.includes('documento_identidad')) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una persona con este documento de identidad',
          error: 'DUPLICATE_DOCUMENTO_IDENTIDAD'
        });
      }
      if (error.message.includes('email')) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una persona con este email',
          error: 'DUPLICATE_EMAIL'
        });
      }
      if (error.message.includes('numero_legajo')) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una persona con este número de legajo',
          error: 'DUPLICATE_NUMERO_LEGAJO'
        });
      }
      
      // Error genérico de restricción UNIQUE
      return res.status(400).json({
        success: false,
        message: 'Ya existe un registro con estos datos',
        error: 'DUPLICATE_CONSTRAINT'
      });
    }
    
    // Error genérico
    res.status(500).json({
      success: false,
      message: 'Error al crear persona',
      error: error.message
    });
  }
});

// Actualizar persona
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      apellido, 
      dni, 
      email, 
      telefono, 
      puesto, 
      departamento,
      fecha_ingreso,
      estado
    } = req.body;

    console.log(`🔓 Actualizando persona ${id} sin restricciones`);
    
    const result = await tursoClient.execute({
      sql: `UPDATE personal SET 
        nombre = ?, apellido = ?, dni = ?, email = ?, telefono = ?, 
        puesto = ?, departamento = ?, fecha_ingreso = ?, estado = ?, 
        updated_at = datetime('now')
        WHERE id = ?`,
      args: [
        nombre, apellido, dni, email, telefono, puesto, departamento,
        fecha_ingreso, estado, id
      ]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }

    console.log(`✅ Persona ${id} actualizada`);
    
    res.json({
      success: true,
      message: 'Persona actualizada exitosamente'
    });
    
  } catch (error) {
    console.error('Error actualizando persona:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar persona',
      error: error.message
    });
  }
});

// Eliminar persona
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔓 Eliminando persona ${id} sin restricciones`);
    
    const result = await tursoClient.execute({
      sql: `DELETE FROM personal WHERE id = ?`,
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }

    console.log(`✅ Persona ${id} eliminada`);
    
    res.json({
      success: true,
      message: 'Persona eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('Error eliminando persona:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar persona',
      error: error.message
    });
  }
});

export default router;
