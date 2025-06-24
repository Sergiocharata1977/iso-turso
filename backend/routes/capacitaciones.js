import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = express.Router();

// GET /api/capacitaciones - Obtener todas las capacitaciones
router.get('/', async (req, res) => {
  try {
    console.log('📋 Obteniendo todas las capacitaciones...');
    const result = await tursoClient.execute('SELECT * FROM capacitaciones ORDER BY created_at DESC');
    
    console.log(`✅ Encontradas ${result.rows.length} capacitaciones`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener capacitaciones:', error);
    res.status(500).json({ 
      status: 'error', 
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
      sql: 'SELECT * FROM capacitaciones WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Capacitación no encontrada' 
      });
    }

    console.log(`✅ Capacitación encontrada: ${result.rows[0].titulo}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener capacitación:', error);
    res.status(500).json({ 
      status: 'error', 
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
      sql: 'INSERT INTO capacitaciones (titulo, descripcion, fecha_inicio, estado) VALUES (?, ?, ?, ?) RETURNING *',
      args: [titulo, descripcion || '', fecha_inicio, estado]
    });

    console.log(`✅ Capacitación creada con ID: ${result.rows[0].id}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al crear capacitación:', error);
    res.status(500).json({ 
      status: 'error', 
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

    console.log(`✏️ Actualizando capacitación ID: ${id}`);

    const result = await tursoClient.execute({
      sql: 'UPDATE capacitaciones SET titulo = ?, descripcion = ?, fecha_inicio = ?, estado = ?, updated_at = datetime("now", "localtime") WHERE id = ? RETURNING *',
      args: [titulo, descripcion, fecha_inicio, estado, id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Capacitación no encontrada' 
      });
    }

    console.log(`✅ Capacitación actualizada: ${result.rows[0].titulo}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar capacitación:', error);
    res.status(500).json({ 
      status: 'error', 
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
      sql: 'DELETE FROM capacitaciones WHERE id = ? RETURNING *',
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Capacitación no encontrada' 
      });
    }

    console.log(`✅ Capacitación eliminada: ${result.rows[0].titulo}`);
    res.json({ 
      status: 'success', 
      message: 'Capacitación eliminada exitosamente' 
    });
  } catch (error) {
    console.error('❌ Error al eliminar capacitación:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error al eliminar capacitación',
      error: error.message 
    });
  }
});

export default router;
