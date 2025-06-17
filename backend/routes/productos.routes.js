import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = Router();

// GET /api/productos - Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute(`
      SELECT * FROM productos
      ORDER BY nombre
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/productos - Crear un nuevo producto
router.post('/', async (req, res) => {
  const { 
    nombre, 
    descripcion, 
    codigo,
    categoria,
    estado,
    responsable_id,
    especificaciones,
    fecha_creacion,
    version
  } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }

  try {
    // Verificar si ya existe un producto con el mismo código
    if (codigo) {
      const existing = await tursoClient.execute({
        sql: 'SELECT id FROM productos WHERE codigo = ?',
        args: [codigo],
      });

      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Ya existe un producto con ese código.' });
      }
    }

    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO productos (
              nombre, descripcion, codigo, categoria,
              estado, responsable_id, especificaciones,
              fecha_creacion, version, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        nombre, 
        descripcion || null, 
        codigo || null,
        categoria || null,
        estado || 'Activo',
        responsable_id || null,
        especificaciones ? JSON.stringify(especificaciones) : null,
        fecha_creacion || createdAt,
        version || '1.0',
        createdAt
      ],
    });

    // Devolver el producto recién creado
    const newId = result.lastInsertRowid;
    if (newId) {
      const newProducto = await tursoClient.execute({
          sql: 'SELECT * FROM productos WHERE id = ?',
          args: [newId]
      });
      res.status(201).json(newProducto.rows[0]);
    } else {
      res.status(201).json({ 
        id: 'Desconocido', 
        nombre, 
        descripcion, 
        codigo,
        categoria,
        estado: estado || 'Activo',
        responsable_id,
        especificaciones: especificaciones ? JSON.stringify(especificaciones) : null,
        fecha_creacion: fecha_creacion || createdAt,
        version: version || '1.0',
        created_at: createdAt
      });
    }
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM productos WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    nombre, 
    descripcion, 
    codigo,
    categoria,
    estado,
    responsable_id,
    especificaciones,
    version,
    historial_cambios
  } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }

  try {
    // Verificar si el nuevo código ya está en uso por otro producto
    if (codigo) {
      const existing = await tursoClient.execute({
          sql: 'SELECT id FROM productos WHERE codigo = ? AND id != ?',
          args: [codigo, id]
      });

      if (existing.rows.length > 0) {
          return res.status(409).json({ error: 'Ya existe otro producto con ese código.' });
      }
    }

    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const result = await tursoClient.execute({
      sql: `UPDATE productos SET 
              nombre = ?, descripcion = ?, codigo = ?, categoria = ?,
              estado = ?, responsable_id = ?, especificaciones = ?,
              version = ?, historial_cambios = ?, updated_at = ?
            WHERE id = ?`,
      args: [
        nombre, 
        descripcion || null, 
        codigo || null,
        categoria || null,
        estado || 'Activo',
        responsable_id || null,
        especificaciones ? JSON.stringify(especificaciones) : null,
        version || '1.0',
        historial_cambios ? JSON.stringify(historial_cambios) : null,
        updatedAt,
        id
      ],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Devolver el producto actualizado
    const updatedProducto = await tursoClient.execute({
        sql: 'SELECT * FROM productos WHERE id = ?',
        args: [id]
    });

    res.json(updatedProducto.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM productos WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error al eliminar el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
