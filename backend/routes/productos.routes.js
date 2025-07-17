import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import { randomUUID } from 'crypto';
import authMiddleware from '../middleware/authMiddleware.js';
import { ensureTenant, secureQuery, logTenantOperation, checkPermission } from '../middleware/tenantMiddleware.js';

const router = Router();

// ✅ OBLIGATORIO: Aplicar middlewares en orden correcto
router.use(authMiddleware);
router.use(ensureTenant);

// GET /api/productos - Listar todos los productos de la organización
router.get('/', async (req, res) => {
  try {
    const query = secureQuery(req);
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM productos WHERE ${query.where()} ORDER BY fecha_creacion DESC`,
      args: query.args()
    });
    
    logTenantOperation(req, 'GET_PRODUCTOS', { count: result.rows.length });
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/productos/:id - Obtener un producto específico de la organización
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = secureQuery(req);
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM productos WHERE id = ? AND ${query.where()}`,
      args: [id, ...query.args()]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    logTenantOperation(req, 'GET_PRODUCTO', { productId: id });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/productos - Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    if (!checkPermission(req, 'employee')) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }

    const { nombre, descripcion, codigo, estado } = req.body;
    const query = secureQuery(req);

    if (!nombre) {
      return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
    }

    // Verificar si ya existe un producto con ese código en la organización
    if (codigo) {
      const existing = await tursoClient.execute({
        sql: `SELECT id FROM productos WHERE codigo = ? AND ${query.where()}`,
        args: [codigo, ...query.args()]
      });
      
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Ya existe un producto con ese código en la organización.' });
      }
    }

    const newId = randomUUID();
    const now = new Date().toISOString();
    
    await tursoClient.execute({
      sql: `INSERT INTO productos (id, nombre, descripcion, codigo, estado, organization_id, created_at, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [newId, nombre, descripcion || null, codigo || null, estado || 'En Desarrollo', query.organizationId, now, req.user.id]
    });

    const newProducto = await tursoClient.execute({
      sql: `SELECT * FROM productos WHERE id = ? AND ${query.where()}`,
      args: [newId, ...query.args()]
    });

    logTenantOperation(req, 'CREATE_PRODUCTO', { productId: newId, nombre });
    res.status(201).json(newProducto.rows[0]);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/productos/:id - Actualizar un producto existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!checkPermission(req, 'employee')) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }

    const { nombre, descripcion, codigo, estado } = req.body;
    const query = secureQuery(req);

    if (!nombre) {
      return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
    }

    // Verificar si ya existe otro producto con ese código en la organización
    if (codigo) {
      const existing = await tursoClient.execute({
        sql: `SELECT id FROM productos WHERE codigo = ? AND id != ? AND ${query.where()}`,
        args: [codigo, id, ...query.args()]
      });
      
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Ya existe otro producto con ese código en la organización.' });
      }
    }

    const now = new Date().toISOString();
    
    const result = await tursoClient.execute({
      sql: `UPDATE productos 
            SET nombre = ?, descripcion = ?, codigo = ?, estado = ?, updated_at = ?, updated_by = ?
            WHERE id = ? AND ${query.where()} RETURNING *`,
      args: [nombre, descripcion || null, codigo || null, estado || 'En Desarrollo', now, req.user.id, id, ...query.args()]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    logTenantOperation(req, 'UPDATE_PRODUCTO', { productId: id, nombre });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!checkPermission(req, 'manager')) {
      return res.status(403).json({ error: 'Permisos insuficientes - se requiere rol manager o superior' });
    }

    const query = secureQuery(req);
    
    const result = await tursoClient.execute({
      sql: `DELETE FROM productos WHERE id = ? AND ${query.where()}`,
      args: [id, ...query.args()]
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    logTenantOperation(req, 'DELETE_PRODUCTO', { productId: id });
    res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
