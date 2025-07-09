import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import { randomUUID } from 'crypto';

const router = Router();

// GET /api/productos - Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute(`
      SELECT * FROM productos
      ORDER BY fecha_creacion DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/productos - Crear un nuevo producto
router.post('/', async (req, res) => {
  const { nombre, descripcion, codigo, estado } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }

  try {
    if (codigo) {
      const existing = await tursoClient.execute({
        sql: 'SELECT id FROM productos WHERE codigo = ?',
        args: [codigo],
      });
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Ya existe un producto con ese código.' });
      }
    }

    const newId = randomUUID();
    await tursoClient.execute({
      sql: 'INSERT INTO productos (id, nombre, descripcion, codigo, estado) VALUES (?, ?, ?, ?, ?)',
      args: [newId, nombre, descripcion || null, codigo || null, estado || 'En Desarrollo'],
    });

    const newProducto = await tursoClient.execute({
      sql: 'SELECT * FROM productos WHERE id = ?',
      args: [newId],
    });

    res.status(201).json(newProducto.rows[0]);
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

// PUT /api/productos/:id - Actualizar un producto con historial de cambios
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, codigo, estado } = req.body;
  const usuario_responsable = 'admin'; // Placeholder for user management

  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }

  const tx = await tursoClient.transaction();
  try {
    const currentProductResult = await tx.execute({
      sql: 'SELECT * FROM productos WHERE id = ?',
      args: [id],
    });

    if (currentProductResult.rows.length === 0) {
      await tx.rollback();
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    const productoAnterior = currentProductResult.rows[0];

    if (codigo && codigo !== productoAnterior.codigo) {
      const existing = await tx.execute({
        sql: 'SELECT id FROM productos WHERE codigo = ? AND id != ?',
        args: [codigo, id],
      });
      if (existing.rows.length > 0) {
        await tx.rollback();
        return res.status(409).json({ error: 'Ya existe otro producto con ese código.' });
      }
    }

    const batchStatements = [];
    const camposAComparar = { nombre, descripcion, codigo, estado };

    for (const campo in camposAComparar) {
      const valorNuevo = camposAComparar[campo] ?? null;
      const valorAnterior = productoAnterior[campo] ?? null;

      if (String(valorNuevo) !== String(valorAnterior)) {
        batchStatements.push({
          sql: 'INSERT INTO productos_historial_cambios (id, producto_id, campo_modificado, valor_anterior, valor_nuevo, usuario_responsable) VALUES (?, ?, ?, ?, ?, ?)',
          args: [randomUUID(), id, campo, String(valorAnterior), String(valorNuevo), usuario_responsable],
        });
      }
    }

    if (batchStatements.length > 0) {
      batchStatements.push({
        sql: 'UPDATE productos SET nombre = ?, descripcion = ?, codigo = ?, estado = ? WHERE id = ?',
        args: [nombre, descripcion || null, codigo || null, estado || 'En Desarrollo', id],
      });
      await tx.batch(batchStatements);
    } else {
      // No changes, but we still commit to close the transaction
      await tx.commit();
      return res.json(productoAnterior); // Return old product if no changes
    }

    await tx.commit();

    const updatedProduct = await tursoClient.execute({
      sql: 'SELECT * FROM productos WHERE id = ?',
      args: [id],
    });

    res.json(updatedProduct.rows[0]);
  } catch (error) {
    if (tx && !tx.closed) {
      await tx.rollback();
    }
    console.error(`Error al actualizar el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await tursoClient.execute({ sql: 'DELETE FROM productos WHERE id = ?', args: [id] });
    res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar el producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/productos/:id/historial - Obtener el historial de cambios de un producto
router.get('/:id/historial', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM productos_historial_cambios WHERE producto_id = ? ORDER BY fecha_cambio DESC',
      args: [id],
    });
    res.json(result.rows);
  } catch (error) {
    console.error(`Error al obtener el historial del producto ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
