import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = express.Router();

// ===========================================
// RUTAS ULTRA SIMPLES SIN RESTRICCIONES
// ===========================================

// Obtener TODAS las normas de TODA la base de datos
router.get('/', async (req, res) => {
  try {
    console.log('🔓 Obteniendo TODAS las normas sin restricciones');
    
    const result = await tursoClient.execute({
      sql: `SELECT n.*, o.name as organization_name 
            FROM normas n 
            LEFT JOIN organizations o ON n.organization_id = o.id 
            ORDER BY n.created_at DESC`,
      args: []
    });

    console.log(`✅ Encontradas ${result.rows.length} normas en TODA la base`);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: `${result.rows.length} normas encontradas (TODAS las organizaciones)`
    });
    
  } catch (error) {
    console.error('Error obteniendo normas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener normas',
      error: error.message
    });
  }
});

// Obtener norma específica por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔓 Obteniendo norma ${id} sin restricciones`);
    
    const result = await tursoClient.execute({
      sql: `SELECT n.*, o.name as organization_name 
            FROM normas n 
            LEFT JOIN organizations o ON n.organization_id = o.id 
            WHERE n.id = ?`,
      args: [id]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Norma no encontrada'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error obteniendo norma:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener norma',
      error: error.message
    });
  }
});

// Crear nueva norma
router.post('/', async (req, res) => {
  try {
  const { 
    codigo, 
    titulo, 
    descripcion, 
      version, 
      tipo, 
      estado = 'activo', 
      categoria,
      responsable,
      fecha_revision,
    observaciones
  } = req.body;

    console.log('🔓 Creando nueva norma sin restricciones');

    const result = await tursoClient.execute({
      sql: `INSERT INTO normas (
        codigo, titulo, descripcion, version, tipo, estado, categoria,
        responsable, fecha_revision, observaciones, organization_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      args: [
        codigo, titulo, descripcion, version, tipo, estado, categoria,
        responsable, fecha_revision, observaciones, req.user.organization_id
      ]
    });

    console.log(`✅ Norma creada con ID: ${result.lastInsertRowid}`);
    
    res.status(201).json({
      success: true,
      data: { id: result.lastInsertRowid, codigo, titulo },
      message: 'Norma creada exitosamente'
    });
    
  } catch (error) {
    console.error('Error creando norma:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear norma',
      error: error.message
    });
  }
});

// Actualizar norma
router.put('/:id', async (req, res) => {
  try {
  const { id } = req.params;
  const { 
    codigo, 
    titulo, 
    descripcion, 
      version, 
      tipo, 
      estado, 
      categoria,
      responsable,
      fecha_revision,
    observaciones
  } = req.body;

    console.log(`🔓 Actualizando norma ${id} sin restricciones`);
    
    const result = await tursoClient.execute({
      sql: `UPDATE normas SET 
        codigo = ?, titulo = ?, descripcion = ?, version = ?, tipo = ?, 
        estado = ?, categoria = ?, responsable = ?, fecha_revision = ?, 
        observaciones = ?, updated_at = datetime('now')
            WHERE id = ?`,
      args: [
        codigo, titulo, descripcion, version, tipo, estado, categoria,
        responsable, fecha_revision, observaciones, id
      ]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Norma no encontrada'
      });
    }

    console.log(`✅ Norma ${id} actualizada`);
    
    res.json({
      success: true,
      message: 'Norma actualizada exitosamente'
    });
    
  } catch (error) {
    console.error('Error actualizando norma:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar norma',
      error: error.message
    });
  }
});

// Eliminar norma
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔓 Eliminando norma ${id} sin restricciones`);

    const result = await tursoClient.execute({
      sql: `DELETE FROM normas WHERE id = ?`,
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Norma no encontrada'
      });
    }

    console.log(`✅ Norma ${id} eliminada`);
    
    res.json({
      success: true,
      message: 'Norma eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('Error eliminando norma:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar norma',
      error: error.message
    });
  }
});

export default router;
