import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/personal - Obtener todo el personal
router.get('/', async (req, res, next) => {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT p.*, d.nombre as departamento_nombre, pu.titulo_puesto as puesto_nombre
            FROM personal p
            LEFT JOIN departamentos d ON p.departamentoId = d.id
            LEFT JOIN puestos pu ON p.puestoId = pu.id
            ORDER BY p.nombre_completo`
    });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/personal/:id - Obtener personal por ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `SELECT p.*, d.nombre as departamento_nombre, pu.titulo_puesto as puesto_nombre
            FROM personal p
            LEFT JOIN departamentos d ON p.departamentoId = d.id
            LEFT JOIN puestos pu ON p.puestoId = pu.id
            WHERE p.id = ?`,
      args: [id]
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Personal no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/personal - Crear nuevo personal
router.post('/', async (req, res, next) => {
  const {
    nombre_completo,
    email,
    telefono,
    departamentoId,
    puestoId,
    fecha_contratacion,
    numero_legajo,
    estado = 'activo'
  } = req.body;

  if (!nombre_completo) {
    return res.status(400).json({ error: 'El nombre completo es obligatorio.' });
  }
  if (!email) {
    return res.status(400).json({ error: 'El email es obligatorio.' });
  }

  try {
    const emailCheck = await tursoClient.execute({
      sql: 'SELECT id FROM personal WHERE email = ?',
      args: [email]
    });
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe personal con este email.' });
    }

    if (departamentoId) {
      const deptCheck = await tursoClient.execute({
        sql: 'SELECT id FROM departamentos WHERE id = ?',
        args: [departamentoId]
      });
      if (deptCheck.rows.length === 0) {
        return res.status(404).json({ error: 'El departamento especificado no existe.' });
      }
    }

    if (puestoId) {
      const puestoCheck = await tursoClient.execute({
        sql: 'SELECT id FROM puestos WHERE id = ?',
        args: [puestoId]
      });
      if (puestoCheck.rows.length === 0) {
        return res.status(404).json({ error: 'El puesto especificado no existe.' });
      }
    }

    const id = crypto.randomUUID();
    await tursoClient.execute({
      sql: `INSERT INTO personal (
              id, nombre_completo, email, telefono, departamentoId, puestoId, 
              fecha_contratacion, numero_legajo, estado, fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      args: [
        id, nombre_completo, email, telefono, departamentoId, puestoId,
        fecha_contratacion, numero_legajo, estado
      ]
    });

    const fullResult = await tursoClient.execute({
      sql: `SELECT p.*, d.nombre as departamento_nombre, pu.titulo_puesto as puesto_nombre
            FROM personal p
            LEFT JOIN departamentos d ON p.departamentoId = d.id
            LEFT JOIN puestos pu ON p.puestoId = pu.id
            WHERE p.id = ?`,
      args: [id]
    });
    res.status(201).json(fullResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/personal/:id - Actualizar personal
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { 
    nombre_completo, 
    email, 
    telefono, 
    departamentoId, 
    puestoId, 
    fecha_contratacion,
    numero_legajo,
    estado
  } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron datos para actualizar.' });
  }

  try {
    const personalCheck = await tursoClient.execute({ sql: 'SELECT id FROM personal WHERE id = ?', args: [id] });
    if (personalCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Personal no encontrado.' });
    }

    if (email) {
      const emailCheck = await tursoClient.execute({ sql: 'SELECT id FROM personal WHERE email = ? AND id != ?', args: [email, id] });
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ error: 'Ya existe otro personal con este email.' });
      }
    }
    if (departamentoId) {
      const deptCheck = await tursoClient.execute({ sql: 'SELECT id FROM departamentos WHERE id = ?', args: [departamentoId] });
      if (deptCheck.rows.length === 0) {
        return res.status(404).json({ error: 'El departamento especificado no existe.' });
      }
    }
    if (puestoId) {
      const puestoCheck = await tursoClient.execute({ sql: 'SELECT id FROM puestos WHERE id = ?', args: [puestoId] });
      if (puestoCheck.rows.length === 0) {
        return res.status(404).json({ error: 'El puesto especificado no existe.' });
      }
    }

    const fields = [];
    const values = [];
    if (nombre_completo !== undefined) { fields.push('nombre_completo = ?'); values.push(nombre_completo); }
    if (email !== undefined) { fields.push('email = ?'); values.push(email); }
    if (telefono !== undefined) { fields.push('telefono = ?'); values.push(telefono); }
    if (departamentoId !== undefined) { fields.push('departamentoId = ?'); values.push(departamentoId); }
    if (puestoId !== undefined) { fields.push('puestoId = ?'); values.push(puestoId); }
    if (fecha_contratacion !== undefined) { fields.push('fecha_contratacion = ?'); values.push(fecha_contratacion); }
    if (numero_legajo !== undefined) { fields.push('numero_legajo = ?'); values.push(numero_legajo); }
    if (estado !== undefined) { fields.push('estado = ?'); values.push(estado); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No hay campos válidos para actualizar.' });
    }

    fields.push('fecha_actualizacion = CURRENT_TIMESTAMP');
    const sqlUpdate = `UPDATE personal SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    await tursoClient.execute({ sql: sqlUpdate, args: values });

    const result = await tursoClient.execute({
      sql: `SELECT p.*, d.nombre as departamento_nombre, pu.titulo_puesto as puesto_nombre
            FROM personal p
            LEFT JOIN departamentos d ON p.departamentoId = d.id
            LEFT JOIN puestos pu ON p.puestoId = pu.id
            WHERE p.id = ?`,
      args: [id]
    });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/personal/:id - Eliminar personal
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const existsCheck = await tursoClient.execute({ sql: 'SELECT id FROM personal WHERE id = ?', args: [id] });
    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Personal no encontrado.' });
    }

    await tursoClient.execute({ sql: 'DELETE FROM personal WHERE id = ?', args: [id] });
    res.status(200).json({ message: 'Personal eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
});

export default router;
