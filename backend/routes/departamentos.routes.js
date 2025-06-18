import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = Router();

// GET /api/departamentos - Listar todos los departamentos
router.get('/', async (req, res, next) => {
  try {
    const result = await tursoClient.execute('SELECT * FROM departamentos ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/departamentos - Crear un nuevo departamento
router.post('/', async (req, res, next) => {
  const { nombre, descripcion, responsable_id } = req.body;

  if (!nombre) {
    const err = new Error('El campo "nombre" es obligatorio.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const existing = await tursoClient.execute({
      sql: 'SELECT id FROM departamentos WHERE nombre = ?',
      args: [nombre],
    });

    if (existing.rows.length > 0) {
      const err = new Error('Ya existe un departamento con ese nombre.');
      err.statusCode = 409;
      return next(err);
    }

    const result = await tursoClient.execute({
      sql: 'INSERT INTO departamentos (nombre, descripcion, responsable_id) VALUES (?, ?, ?)',
      args: [nombre, descripcion || null, responsable_id || null],
    });

    const newDeptId = result.lastInsertRowid;
    if (newDeptId) {
      const newDept = await tursoClient.execute({
          sql: 'SELECT * FROM departamentos WHERE id = ?',
          args: [newDeptId]
      });
      res.status(201).json(newDept.rows[0]);
    } else {
      // Fallback si lastInsertRowid no está disponible
      // Este caso es improbable con Turso/libSQL pero se mantiene por robustez.
      // Considerar loguear una advertencia aquí si ocurre.
      const createdDeptForFallback = {
        // No podemos obtener el ID real aquí sin otra query, lo cual podría fallar.
        // Devolver los datos de entrada puede ser lo más sensato.
        nombre,
        descripcion: descripcion || null,
        responsable_id: responsable_id || null
        // Podríamos intentar obtener el ID con una query por nombre si es único y crítico.
      };
      res.status(201).json(createdDeptForFallback);
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/departamentos/:id - Obtener un departamento por ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM departamentos WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      const err = new Error('Departamento no encontrado.');
      err.statusCode = 404;
      return next(err);
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/departamentos/:id - Actualizar un departamento
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { nombre, descripcion, responsable_id } = req.body;

  console.log(`[PUT /api/departamentos/${id}] Recibido:`, req.body);

  if (!nombre) {
    const err = new Error('El campo "nombre" es obligatorio.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const existing = await tursoClient.execute({
        sql: 'SELECT id FROM departamentos WHERE nombre = ? AND id != ?',
        args: [nombre, id]
    });

    if (existing.rows.length > 0) {
        const err = new Error('Ya existe otro departamento con ese nombre.');
        err.statusCode = 409;
        return next(err);
    }

    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(`[PUT /api/departamentos/${id}] Generado updatedAt:`, updatedAt);
    console.log(`[PUT /api/departamentos/${id}] responsable_id a usar:`, responsable_id || null);

    const updateStatement = {
      sql: 'UPDATE departamentos SET nombre = ?, descripcion = ?, responsable_id = ?, updated_at = ? WHERE id = ?',
      args: [nombre, descripcion || null, responsable_id || null, updatedAt, id],
    };
    console.log(`[PUT /api/departamentos/${id}] SQL Update Statement:`, updateStatement);

    const result = await tursoClient.execute(updateStatement);
    console.log(`[PUT /api/departamentos/${id}] Resultado del UPDATE:`, result);

    if (result.rowsAffected === 0) {
      const err = new Error('Departamento no encontrado.');
      err.statusCode = 404;
      return next(err);
    }

    const updatedDeptResult = await tursoClient.execute({
        sql: 'SELECT * FROM departamentos WHERE id = ?',
        args: [id]
    });
    console.log(`[PUT /api/departamentos/${id}] Departamento recuperado POST-UPDATE:`, updatedDeptResult.rows[0]);

    res.json(updatedDeptResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/departamentos/:id - Eliminar un departamento
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM departamentos WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      const err = new Error('Departamento no encontrado.');
      err.statusCode = 404;
      return next(err);
    }
    res.status(204).send();
  } catch (error) {
    if (error.message && error.message.includes('FOREIGN KEY constraint failed')) {
        const err = new Error('No se puede eliminar el departamento porque tiene entidades asociadas (ej. puestos).');
        err.statusCode = 409;
        return next(err);
    }
    next(error);
  }
});

export default router;