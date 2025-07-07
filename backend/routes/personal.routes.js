import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';

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
router.post('/', async (req, res) => {
  try {
    const { 
      nombre, 
      apellido, 
      dni, 
      email, 
      telefono, 
      puesto, 
      departamento,
      fecha_ingreso,
      estado = 'activo',
      observaciones
    } = req.body;

    console.log('🔓 Creando nueva persona sin restricciones');
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO personal (
        nombre, apellido, dni, email, telefono, puesto, departamento,
        fecha_ingreso, estado, observaciones, organization_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      args: [
        nombre, apellido, dni, email, telefono, puesto, departamento,
        fecha_ingreso, estado, observaciones, req.user.organization_id
      ]
    });

    console.log(`✅ Persona creada con ID: ${result.lastInsertRowid}`);
    
    res.status(201).json({
      success: true,
      data: { id: result.lastInsertRowid, nombre, apellido },
      message: 'Persona creada exitosamente'
    });
    
  } catch (error) {
    console.error('Error creando persona:', error);
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
      estado,
      observaciones
    } = req.body;

    console.log(`🔓 Actualizando persona ${id} sin restricciones`);
    
    const result = await tursoClient.execute({
      sql: `UPDATE personal SET 
        nombre = ?, apellido = ?, dni = ?, email = ?, telefono = ?, 
        puesto = ?, departamento = ?, fecha_ingreso = ?, estado = ?, 
        observaciones = ?, updated_at = datetime('now')
        WHERE id = ?`,
      args: [
        nombre, apellido, dni, email, telefono, puesto, departamento,
        fecha_ingreso, estado, observaciones, id
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
