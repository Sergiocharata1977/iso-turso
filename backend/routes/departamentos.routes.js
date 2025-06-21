import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/departamentos - Listar todos los departamentos
router.get('/', async (req, res, next) => {
  try {
    // TODO: Considerar un JOIN para obtener el nombre del responsable si es necesario en el listado
    const result = await tursoClient.execute('SELECT * FROM departamentos ORDER BY nombre');
    res.json(result.rows);
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

// POST /api/departamentos - Crear un nuevo departamento
router.post('/', async (req, res, next) => {
  const { nombre, descripcion, responsableId, objetivos } = req.body;

  if (!nombre) {
    const err = new Error('El campo "nombre" es obligatorio.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    // Verificar si ya existe un departamento con el mismo nombre
    const existing = await tursoClient.execute({
      sql: 'SELECT id FROM departamentos WHERE nombre = ?',
      args: [nombre],
    });

    if (existing.rows.length > 0) {
      const err = new Error('Ya existe un departamento con ese nombre.');
      err.statusCode = 409; // Conflict
      return next(err);
    }

    const id = crypto.randomUUID();
    const fecha_creacion = new Date().toISOString();

    const sql = `
      INSERT INTO departamentos (id, nombre, descripcion, objetivos, responsableId, fecha_creacion, fecha_actualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const args = [id, nombre, descripcion || null, objetivos || null, responsableId || null, fecha_creacion, fecha_creacion];

    await tursoClient.execute({ sql, args });

    // Devolver el objeto recién creado
    const newDept = {
      id,
      nombre,
      descripcion: descripcion || null,
      objetivos: objetivos || null,
      responsableId: responsableId || null,
      fecha_creacion,
      fecha_actualizacion: fecha_creacion
    };

    res.status(201).json(newDept);

  } catch (error) {
    next(error);
  }
});

// PUT /api/departamentos/:id - Actualizar un departamento (dinámico)
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { nombre, descripcion, responsableId, objetivos } = req.body;

  try {
    // Si se proporciona un nombre, verificar que no entre en conflicto con otro departamento
    if (nombre) {
      const existing = await tursoClient.execute({
        sql: 'SELECT id FROM departamentos WHERE nombre = ? AND id != ?',
        args: [nombre, id],
      });
      if (existing.rows.length > 0) {
        const err = new Error('Ya existe otro departamento con ese nombre.');
        err.statusCode = 409;
        return next(err);
      }
    }

    const fields = [];
    const args = [];

    if (nombre !== undefined) {
      fields.push('nombre = ?');
      args.push(nombre);
    }
    if (descripcion !== undefined) {
      fields.push('descripcion = ?');
      args.push(descripcion === '' ? null : descripcion);
    }
    if (responsableId !== undefined) {
      fields.push('responsableId = ?');
      args.push(responsableId === '' ? null : responsableId);
    }
    if (objetivos !== undefined) {
      fields.push('objetivos = ?');
      args.push(objetivos === '' ? null : objetivos);
    }

    if (fields.length === 0) {
      const err = new Error('No se proporcionaron campos para actualizar.');
      err.statusCode = 400;
      return next(err);
    }

    // Actualizar la fecha de modificación
    fields.push('fecha_actualizacion = ?');
    args.push(new Date().toISOString());

    args.push(id); // Argumento para el WHERE

    const sql = `UPDATE departamentos SET ${fields.join(', ')} WHERE id = ?`;

    const result = await tursoClient.execute({ sql, args });

    if (result.rowsAffected === 0) {
      const err = new Error('Departamento no encontrado.');
      err.statusCode = 404;
      return next(err);
    }

    // Devolver el departamento actualizado
    const updatedDeptResult = await tursoClient.execute({
      sql: 'SELECT * FROM departamentos WHERE id = ?',
      args: [id],
    });

    res.json(updatedDeptResult.rows[0]);

  } catch (error) {
    next(error);
  }
});

// DELETE /api/departamentos/:id - Eliminar un departamento
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    // 1. Verificar si hay puestos asociados
    const puestosCheck = await tursoClient.execute({
      sql: 'SELECT 1 FROM puestos WHERE departamentoId = ? LIMIT 1',
      args: [id],
    });

    if (puestosCheck.rows.length > 0) {
      const err = new Error('No se puede eliminar: El departamento tiene puestos asociados.');
      err.statusCode = 409; // Conflict
      return next(err);
    }

    // 2. Verificar si hay personal asociado
    const personalCheck = await tursoClient.execute({
      sql: 'SELECT 1 FROM personal WHERE departamentoId = ? LIMIT 1',
      args: [id],
    });

    if (personalCheck.rows.length > 0) {
      const err = new Error('No se puede eliminar: El departamento tiene personal asociado.');
      err.statusCode = 409; // Conflict
      return next(err);
    }

    // 3. Si no hay dependencias, proceder con la eliminación
    const result = await tursoClient.execute({
      sql: 'DELETE FROM departamentos WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      const err = new Error('Departamento no encontrado.');
      err.statusCode = 404;
      return next(err);
    }

    res.status(204).send(); // No Content

  } catch (error) {
    // Captura de errores generales, aunque las validaciones explícitas son preferibles
    next(error);
  }
});

export default router;