import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/personal - Obtener todo el personal
router.get('/', async (req, res, next) => {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT *, (nombres || ' ' || apellidos) AS nombre_completo FROM personal ORDER BY apellidos, nombres`
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
      sql: `SELECT *, (nombres || ' ' || apellidos) AS nombre_completo FROM personal WHERE id = ?`,
      args: [id]
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Personal no encontrado' });
    }
    // Parse JSON fields
    const personal = result.rows[0];
    personal.formacion_academica = JSON.parse(personal.formacion_academica || '[]');
    personal.experiencia_laboral = JSON.parse(personal.experiencia_laboral || '[]');
    personal.habilidades_idiomas = JSON.parse(personal.habilidades_idiomas || '[]');
    res.json(personal);
  } catch (error) {
    next(error);
  }
});

// POST /api/personal - Crear nuevo personal
router.post('/', async (req, res, next) => {
  const {
    nombres,
    apellidos,
    email,
    telefono,
    documento_identidad,
    fecha_nacimiento,
    nacionalidad,
    direccion,
    telefono_emergencia,
    fecha_contratacion,
    numero_legajo,
    estado = 'Activo',
    formacion_academica = [],
    experiencia_laboral = [],
    habilidades_idiomas = []
  } = req.body;

  if (!nombres || !apellidos) {
    return res.status(400).json({ error: 'Nombres y apellidos son obligatorios.' });
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

    const id = crypto.randomUUID();
    const result = await tursoClient.execute({
      sql: `INSERT INTO personal (
              id, nombres, apellidos, email, telefono, documento_identidad, fecha_nacimiento, 
              nacionalidad, direccion, telefono_emergencia, fecha_contratacion, 
              numero_legajo, estado, formacion_academica, experiencia_laboral, habilidades_idiomas
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;`,
      args: [
        id, nombres, apellidos, email, telefono, documento_identidad, fecha_nacimiento, 
        nacionalidad, direccion, telefono_emergencia, fecha_contratacion, 
        numero_legajo, estado,
        JSON.stringify(formacion_academica),
        JSON.stringify(experiencia_laboral),
        JSON.stringify(habilidades_idiomas)
      ]
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});


// PUT /api/personal/:id - Actualizar personal
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron datos para actualizar.' });
  }

  try {
    const personalCheck = await tursoClient.execute({ sql: 'SELECT id FROM personal WHERE id = ?', args: [id] });
    if (personalCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Personal no encontrado.' });
    }

    if (updateData.email) {
      const emailCheck = await tursoClient.execute({ sql: 'SELECT id FROM personal WHERE email = ? AND id != ?', args: [updateData.email, id] });
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ error: 'Ya existe otro personal con este email.' });
      }
    }

    const fields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        // Stringify JSON fields before saving
        if (['formacion_academica', 'experiencia_laboral', 'habilidades_idiomas'].includes(key)) {
          values.push(JSON.stringify(updateData[key]));
        } else {
          values.push(updateData[key]);
        }
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No hay campos válidos para actualizar.' });
    }

    fields.push('fecha_actualizacion = CURRENT_TIMESTAMP');
    const sqlUpdate = `UPDATE personal SET ${fields.join(', ')} WHERE id = ? RETURNING *;`;
    values.push(id);

    const result = await tursoClient.execute({ sql: sqlUpdate, args: values });
    
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
