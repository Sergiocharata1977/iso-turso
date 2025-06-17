import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = Router();

// GET /api/departamentos - Listar todos los departamentos
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute('SELECT * FROM departamentos ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/departamentos - Crear un nuevo departamento
router.post('/', async (req, res) => {
  const { nombre, descripcion, responsable_id } = req.body; // Añadido responsable_id por coherencia

  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }

  try {
    // Verificar si ya existe un departamento con el mismo nombre
    const existing = await tursoClient.execute({
      sql: 'SELECT id FROM departamentos WHERE nombre = ?',
      args: [nombre],
    });

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un departamento con ese nombre.' });
    }

    const result = await tursoClient.execute({
      sql: 'INSERT INTO departamentos (nombre, descripcion, responsable_id) VALUES (?, ?, ?)',
      args: [nombre, descripcion || null, responsable_id || null],
    });

    // Devolver el departamento recién creado
    const newDeptId = result.lastInsertRowid;
    if (newDeptId) {
      const newDept = await tursoClient.execute({
          sql: 'SELECT * FROM departamentos WHERE id = ?',
          args: [newDeptId]
      });
      res.status(201).json(newDept.rows[0]);
    } else {
      // Fallback si lastInsertRowid no está disponible (aunque debería con Turso/libSQL)
      res.status(201).json({ id: 'Desconocido', nombre, descripcion, responsable_id });
    }
  } catch (error) {
    console.error('Error al crear el departamento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/departamentos/:id - Obtener un departamento por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM departamentos WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Departamento no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener el departamento ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/departamentos/:id - Actualizar un departamento
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, responsable_id } = req.body;

  console.log(`[PUT /api/departamentos/${id}] Recibido:`, req.body); // Log: Body recibido

  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }

  try {
    // Opcional: Verificar si el nuevo nombre ya está en uso por otro departamento
    const existing = await tursoClient.execute({
        sql: 'SELECT id FROM departamentos WHERE nombre = ? AND id != ?',
        args: [nombre, id]
    });

    if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Ya existe otro departamento con ese nombre.' });
    }

    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(`[PUT /api/departamentos/${id}] Generado updatedAt:`, updatedAt); // Log: Timestamp generado
    console.log(`[PUT /api/departamentos/${id}] responsable_id a usar:`, responsable_id || null); // Log: responsable_id

    const updateStatement = {
      sql: 'UPDATE departamentos SET nombre = ?, descripcion = ?, responsable_id = ?, updated_at = ? WHERE id = ?',
      args: [nombre, descripcion || null, responsable_id || null, updatedAt, id],
    };
    console.log(`[PUT /api/departamentos/${id}] SQL Update Statement:`, updateStatement); // Log: SQL y args

    const result = await tursoClient.execute(updateStatement);
    console.log(`[PUT /api/departamentos/${id}] Resultado del UPDATE:`, result); // Log: Resultado del UPDATE

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Departamento no encontrado.' });
    }

    // Devolver el departamento actualizado
    const updatedDeptResult = await tursoClient.execute({
        sql: 'SELECT * FROM departamentos WHERE id = ?',
        args: [id]
    });
    console.log(`[PUT /api/departamentos/${id}] Departamento recuperado POST-UPDATE:`, updatedDeptResult.rows[0]); // Log: Depto recuperado

    res.json(updatedDeptResult.rows[0]);
  } catch (error) {
    console.error(`[PUT /api/departamentos/${id}] Error al actualizar el departamento:`, error); // Log: Error
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/departamentos/:id - Eliminar un departamento
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Opcional: Verificar si hay entidades relacionadas (ej. puestos) antes de eliminar
    // Esta lógica dependerá de tus otras tablas y cómo quieras manejar las restricciones

    const result = await tursoClient.execute({
      sql: 'DELETE FROM departamentos WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Departamento no encontrado.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error al eliminar el departamento ${id}:`, error);
    // Manejo específico para errores de clave foránea si SQLite/libSQL los devuelve así
    if (error.message && error.message.includes('FOREIGN KEY constraint failed')) {
        return res.status(409).json({ error: 'No se puede eliminar el departamento porque tiene entidades asociadas (ej. puestos).' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;