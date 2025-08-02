import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = express.Router();

// GET /api/procesos - Obtener todos los procesos
router.get('/', async (req, res) => {
  try {
    console.log('📋 Obteniendo todos los procesos...');
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM procesos WHERE organization_id = ? ORDER BY nombre',
      args: [req.user?.organization_id || 2]
    });
    
    console.log(`✅ Encontrados ${result.rows.length} procesos`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener procesos:', error);
    res.status(500).json({ 
      status: 'error', 
      statusCode: 500,
      message: 'Error al obtener procesos',
      error: error.message 
    });
  }
});

// GET /api/procesos/:id - Obtener proceso por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Buscando proceso con ID: ${id}`);
    
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM procesos WHERE id = ? AND organization_id = ?',
      args: [id, req.user?.organization_id || 2]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Proceso no encontrado' 
      });
    }

    console.log(`✅ Proceso encontrado: ${result.rows[0].nombre}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener proceso:', error);
    res.status(500).json({ 
      status: 'error', 
      statusCode: 500,
      message: 'Error al obtener proceso',
      error: error.message 
    });
  }
});

// POST /api/procesos - Crear nuevo proceso
router.post('/', async (req, res) => {
  try {
    const { nombre, responsable, descripcion } = req.body;
    
    console.log('➕ Creando nuevo proceso:', { nombre, responsable, descripcion });

    // Validación básica
    if (!nombre) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'El nombre es obligatorio' 
      });
    }

    // Generar ID único simple
    const id = `proc-${Date.now()}`;

    const result = await tursoClient.execute({
      sql: 'INSERT INTO procesos (id, nombre, responsable, descripcion, organization_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime("now", "localtime"), datetime("now", "localtime")) RETURNING *',
      args: [id, nombre, responsable || '', descripcion || '', req.user?.organization_id || 2]
    });

    console.log(`✅ Proceso creado con ID: ${result.rows[0].id}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al crear proceso:', error);
    res.status(500).json({ 
      status: 'error', 
      statusCode: 500,
      message: 'Error al crear proceso',
      error: error.message 
    });
  }
});

// PUT /api/procesos/:id - Actualizar proceso
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, responsable, descripcion } = req.body;
    
    console.log(`✏️ Actualizando proceso ID: ${id}`, { nombre, responsable, descripcion });

    // Validación básica
    if (!nombre) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'El nombre es obligatorio' 
      });
    }

    const result = await tursoClient.execute({
      sql: `UPDATE procesos 
            SET nombre = ?, responsable = ?, descripcion = ?, 
                updated_at = datetime('now', 'localtime')
            WHERE id = ? AND organization_id = ?
            RETURNING *`,
      args: [nombre, responsable || '', descripcion || '', id, req.user?.organization_id || 1]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Proceso no encontrado' 
      });
    }

    console.log(`✅ Proceso actualizado: ${result.rows[0].nombre}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar proceso:', error);
    res.status(500).json({ 
      status: 'error', 
      statusCode: 500,
      message: 'Error al actualizar proceso',
      error: error.message 
    });
  }
});

// DELETE /api/procesos/:id - Eliminar proceso
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando proceso ID: ${id}`);

    const result = await tursoClient.execute({
      sql: 'DELETE FROM procesos WHERE id = ? AND organization_id = ? RETURNING id',
      args: [id, req.user?.organization_id || 1]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Proceso no encontrado' 
      });
    }

    console.log(`✅ Proceso eliminado exitosamente`);
    res.status(204).send(); // No content response
  } catch (error) {
    console.error('❌ Error al eliminar proceso:', error);
    res.status(500).json({ 
      status: 'error', 
      statusCode: 500,
      message: 'Error al eliminar proceso',
      error: error.message 
    });
  }
});

export default router;