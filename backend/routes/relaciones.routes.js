import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Proteger todas las rutas
router.use(authMiddleware);

// GET /api/relaciones - Listar relaciones (por organización y filtros opcionales)
router.get('/', async (req, res) => {
  try {
    const organization_id = req.user?.organization_id;
    if (!organization_id) {
      return res.status(400).json({ message: 'No se encontró la organización del usuario.' });
    }
    const { origen_tipo, origen_id, destino_tipo, destino_id } = req.query;
    let sql = 'SELECT * FROM relaciones_sgc WHERE organization_id = ?';
    const args = [organization_id];
    if (origen_tipo) { sql += ' AND origen_tipo = ?'; args.push(origen_tipo); }
    if (origen_id)   { sql += ' AND origen_id = ?';   args.push(Number(origen_id)); }
    if (destino_tipo){ sql += ' AND destino_tipo = ?';args.push(destino_tipo); }
    if (destino_id)  { sql += ' AND destino_id = ?';  args.push(Number(destino_id)); }
    sql += ' ORDER BY fecha_creacion DESC';
    const result = await tursoClient.execute({ sql, args });
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar relaciones:', error);
    res.status(500).json({ message: 'Error interno al listar relaciones.' });
  }
});

// POST /api/relaciones - Crear nueva relación
router.post('/', async (req, res) => {
  try {
    const organization_id = req.user?.organization_id;
    const usuario_creador = req.user?.nombre || req.user?.email || 'Sistema';
    if (!organization_id) {
      return res.status(400).json({ message: 'No se encontró la organización del usuario.' });
    }
    const { origen_tipo, origen_id, destino_tipo, destino_id, descripcion } = req.body;
    if (!origen_tipo || !origen_id || !destino_tipo || !destino_id) {
      return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }
    const sql = `INSERT INTO relaciones_sgc (organization_id, origen_tipo, origen_id, destino_tipo, destino_id, descripcion, usuario_creador) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const args = [organization_id, origen_tipo, origen_id, destino_tipo, destino_id, descripcion || null, usuario_creador];
    await tursoClient.execute({ sql, args });
    res.status(201).json({ message: 'Relación creada exitosamente.' });
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE')) {
      return res.status(409).json({ message: 'La relación ya existe.' });
    }
    console.error('Error al crear relación:', error);
    res.status(500).json({ message: 'Error interno al crear relación.' });
  }
});

// DELETE /api/relaciones/:id - Eliminar relación por ID
router.delete('/:id', async (req, res) => {
  try {
    const organization_id = req.user?.organization_id;
    if (!organization_id) {
      return res.status(400).json({ message: 'No se encontró la organización del usuario.' });
    }
    const { id } = req.params;
    const sql = 'DELETE FROM relaciones_sgc WHERE id = ? AND organization_id = ?';
    const args = [id, organization_id];
    const result = await tursoClient.execute({ sql, args });
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Relación no encontrada o no pertenece a la organización.' });
    }
    res.json({ message: 'Relación eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar relación:', error);
    res.status(500).json({ message: 'Error interno al eliminar relación.' });
  }
});

export default router; 