import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = express.Router();

// ===============================================
// RUTAS ESPECÍFICAS (deben ir antes de las rutas con parámetros)
// ===============================================

// Buscar minutas
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Término de búsqueda requerido'
      });
    }

    const result = await tursoClient.execute({
      sql: `SELECT * FROM minutas 
             WHERE titulo LIKE ? OR responsable LIKE ? OR descripcion LIKE ?
             ORDER BY created_at DESC`,
      args: [`%${q}%`, `%${q}%`, `%${q}%`]
    });

    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error al buscar minutas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al buscar minutas',
      error: error.message
    });
  }
});

// Obtener estadísticas de minutas
router.get('/stats', async (req, res) => {
  try {
    const [totalResult, responsablesResult, esteMesResult] = await Promise.all([
      tursoClient.execute({
        sql: `SELECT COUNT(*) as total FROM minutas`
      }),
      tursoClient.execute({
        sql: `SELECT COUNT(DISTINCT responsable) as responsables FROM minutas WHERE responsable IS NOT NULL AND responsable != ''`
      }),
      tursoClient.execute({
        sql: `SELECT COUNT(*) as esteMes FROM minutas 
              WHERE created_at >= datetime('now', 'start of month')`
      })
    ]);

    const stats = {
      total: totalResult.rows[0]?.total || 0,
      responsables: responsablesResult.rows[0]?.responsables || 0,
      esteMes: esteMesResult.rows[0]?.esteMes || 0,
      documentos: 0 // Por ahora 0, se conectará con tabla de documentos
    };

    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// Obtener minutas recientes
router.get('/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM minutas ORDER BY created_at DESC LIMIT ?`,
      args: [parseInt(limit)]
    });

    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener minutas recientes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener minutas recientes',
      error: error.message
    });
  }
});

// Exportar minutas
router.get('/export', async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM minutas ORDER BY created_at DESC`
    });

    if (format === 'json') {
      res.json({
        status: 'success',
        data: result.rows
      });
    } else {
      // Por ahora solo JSON, en el futuro se agregarán otros formatos
      res.json({
        status: 'success',
        data: result.rows
      });
    }
  } catch (error) {
    console.error('Error al exportar minutas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al exportar minutas',
      error: error.message
    });
  }
});

// ===============================================
// RUTAS CON PARÁMETROS
// ===============================================

// Obtener todas las minutas
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT * FROM minutas ORDER BY created_at DESC`
    });

    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener minutas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener minutas',
      error: error.message
    });
  }
});

// Obtener una minuta por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM minutas WHERE id = ?`,
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Minuta no encontrada'
      });
    }

    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener minuta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener minuta',
      error: error.message
    });
  }
});

// Crear nueva minuta
router.post('/', async (req, res) => {
  try {
    const {
      titulo,
      responsable,
      descripcion
    } = req.body;

    if (!titulo) {
      return res.status(400).json({
        status: 'error',
        message: 'Faltan campos obligatorios: titulo'
      });
    }

    const result = await tursoClient.execute({
      sql: `INSERT INTO minutas (
        titulo, responsable, descripcion, created_at
      ) VALUES (?, ?, ?, datetime('now', 'localtime'))`,
      args: [
        titulo,
        responsable || '',
        descripcion || ''
      ]
    });

    // Obtener la minuta creada
    const createdMinuta = await tursoClient.execute({
      sql: `SELECT * FROM minutas WHERE id = ?`,
      args: [result.lastInsertRowid]
    });

    res.status(201).json({
      status: 'success',
      message: 'Minuta creada exitosamente',
      data: createdMinuta.rows[0]
    });
  } catch (error) {
    console.error('Error al crear minuta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear minuta',
      error: error.message
    });
  }
});

// Actualizar minuta
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      responsable,
      descripcion
    } = req.body;

    if (!titulo) {
      return res.status(400).json({
        status: 'error',
        message: 'Faltan campos obligatorios: titulo'
      });
    }

    // Verificar que la minuta existe
    const existingMinuta = await tursoClient.execute({
      sql: `SELECT * FROM minutas WHERE id = ?`,
      args: [id]
    });

    if (existingMinuta.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Minuta no encontrada'
      });
    }

    // Actualizar la minuta
    await tursoClient.execute({
      sql: `UPDATE minutas SET 
        titulo = ?, 
        responsable = ?, 
        descripcion = ?
        WHERE id = ?`,
      args: [
        titulo,
        responsable || '',
        descripcion || '',
        id
      ]
    });

    // Obtener la minuta actualizada
    const updatedMinuta = await tursoClient.execute({
      sql: `SELECT * FROM minutas WHERE id = ?`,
      args: [id]
    });

    res.json({
      status: 'success',
      message: 'Minuta actualizada exitosamente',
      data: updatedMinuta.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar minuta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar minuta',
      error: error.message
    });
  }
});

// Eliminar minuta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la minuta existe
    const existingMinuta = await tursoClient.execute({
      sql: `SELECT * FROM minutas WHERE id = ?`,
      args: [id]
    });

    if (existingMinuta.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Minuta no encontrada'
      });
    }

    // Eliminar la minuta
    await tursoClient.execute({
      sql: `DELETE FROM minutas WHERE id = ?`,
      args: [id]
    });

    res.json({
      status: 'success',
      message: 'Minuta eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar minuta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar minuta',
      error: error.message
    });
  }
});

// Obtener documentos de una minuta
router.get('/:id/documentos', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Por ahora retornamos un array vacío ya que no tenemos tabla de documentos
    // En el futuro esto se conectará con la tabla de documentos
    res.json({
      status: 'success',
      data: []
    });
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener documentos',
      error: error.message
    });
  }
});

// Obtener historial de cambios de una minuta
router.get('/:id/historial', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Por ahora retornamos un historial básico
    // En el futuro esto se conectará con una tabla de historial
    const minuta = await tursoClient.execute({
      sql: `SELECT * FROM minutas WHERE id = ?`,
      args: [id]
    });

    if (minuta.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Minuta no encontrada'
      });
    }

    const historial = [
      {
        id: 1,
        action: 'create',
        description: 'Minuta creada',
        user_name: 'Sistema',
        timestamp: minuta.rows[0].created_at,
        changed_fields: ['titulo', 'responsable', 'descripcion']
      }
    ];

    res.json({
      status: 'success',
      data: historial
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener historial',
      error: error.message
    });
  }
});

// Descargar minuta como PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    
    const minuta = await tursoClient.execute({
      sql: `SELECT * FROM minutas WHERE id = ?`,
      args: [id]
    });

    if (minuta.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Minuta no encontrada'
      });
    }

    // Por ahora retornamos un JSON con los datos de la minuta
    // En el futuro esto generará un PDF real
    res.json({
      status: 'success',
      data: minuta.rows[0],
      message: 'PDF generado exitosamente'
    });
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al generar PDF',
      error: error.message
    });
  }
});

// Obtener minutas por responsable
router.get('/responsable/:responsable', async (req, res) => {
  try {
    const { responsable } = req.params;
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM minutas WHERE responsable LIKE ? ORDER BY created_at DESC`,
      args: [`%${responsable}%`]
    });

    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener minutas por responsable:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener minutas por responsable',
      error: error.message
    });
  }
});

// Duplicar minuta
router.post('/:id/duplicate', async (req, res) => {
  try {
    const { id } = req.params;
    
    const minuta = await tursoClient.execute({
      sql: `SELECT * FROM minutas WHERE id = ?`,
      args: [id]
    });

    if (minuta.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Minuta no encontrada'
      });
    }

    const originalMinuta = minuta.rows[0];
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO minutas (
        titulo, responsable, descripcion, created_at
      ) VALUES (?, ?, ?, datetime('now', 'localtime'))`,
      args: [
        `${originalMinuta.titulo} (Copia)`,
        originalMinuta.responsable,
        originalMinuta.descripcion
      ]
    });

    // Obtener la minuta duplicada
    const duplicatedMinuta = await tursoClient.execute({
      sql: `SELECT * FROM minutas WHERE id = ?`,
      args: [result.lastInsertRowid]
    });

    res.status(201).json({
      status: 'success',
      message: 'Minuta duplicada exitosamente',
      data: duplicatedMinuta.rows[0]
    });
  } catch (error) {
    console.error('Error al duplicar minuta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al duplicar minuta',
      error: error.message
    });
  }
});

export default router; 