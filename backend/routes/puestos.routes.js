import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = Router();

// GET /api/puestos - Obtener todos los puestos
router.get('/', async (req, res, next) => {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT * FROM puestos ORDER BY titulo_puesto ASC;`,
      args: []
    });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/puestos - Crear un nuevo puesto
router.post('/', async (req, res, next) => {
  const {
    titulo_puesto,
    codigo_puesto,
    proposito_general,
    principales_responsabilidades,
    requisitos,
    formacion_requerida,
    experiencia_requerida,
    conocimientos_especificos,
    competencias_necesarias,
    nivel,
    documento_descripcion_puesto_url,
    estado_puesto = 'Activo'
  } = req.body;

  if (!titulo_puesto || titulo_puesto.trim() === '') {
    return res.status(400).json({ error: 'El título del puesto es obligatorio.' });
  }

  try {
    const tituloExistente = await tursoClient.execute({
      sql: 'SELECT id FROM puestos WHERE LOWER(TRIM(titulo_puesto)) = LOWER(TRIM(?))',
      args: [titulo_puesto]
    });
    if (tituloExistente.rows.length > 0) {
      return res.status(409).json({ error: `El puesto con título '${titulo_puesto.trim()}' ya existe.` });
    }

    if (codigo_puesto && codigo_puesto.trim() !== '') {
      const codigoExistente = await tursoClient.execute({
        sql: 'SELECT id FROM puestos WHERE LOWER(TRIM(codigo_puesto)) = LOWER(TRIM(?))',
        args: [codigo_puesto]
      });
      if (codigoExistente.rows.length > 0) {
        return res.status(409).json({ error: `El puesto con código '${codigo_puesto.trim()}' ya existe.` });
      }
    }

    const result = await tursoClient.execute({
      sql: `INSERT INTO puestos (
                titulo_puesto, codigo_puesto, 
                proposito_general, principales_responsabilidades, requisitos,
                formacion_requerida, experiencia_requerida, conocimientos_especificos,
                competencias_necesarias, nivel, documento_descripcion_puesto_url, estado_puesto
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;`,
      args: [
        titulo_puesto.trim(),
        codigo_puesto ? codigo_puesto.trim() : null,
        proposito_general || null,
        principales_responsabilidades || null,
        requisitos || null,
        formacion_requerida || null,
        experiencia_requerida || null,
        conocimientos_especificos || null,
        competencias_necesarias || null,
        nivel || null,
        documento_descripcion_puesto_url || null,
        estado_puesto
      ]
    });

    if (result.rows.length > 0) {
      res.status(201).json(result.rows[0]);
    } else {
      res.status(500).json({ error: 'Error al crear el puesto, no se pudo obtener el registro guardado.' });
    }

  } catch (error) {
    next(error);
  }
});

// GET /api/puestos/:id - Obtener un puesto por ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `SELECT * FROM puestos WHERE id = ?;`,
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Puesto con ID ${id} no encontrado.` });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/puestos/:id - Actualizar un puesto
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const {
    titulo_puesto,
    codigo_puesto,
    proposito_general,
    principales_responsabilidades,
    requisitos,
    formacion_requerida,
    experiencia_requerida,
    conocimientos_especificos,
    competencias_necesarias,
    nivel,
    documento_descripcion_puesto_url,
    estado_puesto
  } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron datos para actualizar.' });
  }

  try {
    const puestoActualResult = await tursoClient.execute({
      sql: 'SELECT * FROM puestos WHERE id = ?',
      args: [id]
    });

    if (puestoActualResult.rows.length === 0) {
      return res.status(404).json({ error: `Puesto con ID ${id} no encontrado.` });
    }

    if (titulo_puesto && titulo_puesto.trim() !== puestoActualResult.rows[0].titulo_puesto) {
      const tituloExistente = await tursoClient.execute({
        sql: 'SELECT id FROM puestos WHERE LOWER(TRIM(titulo_puesto)) = LOWER(TRIM(?)) AND id != ?',
        args: [titulo_puesto, id]
      });
      if (tituloExistente.rows.length > 0) {
        return res.status(409).json({ error: `El puesto con título '${titulo_puesto.trim()}' ya existe.` });
      }
    }

    if (codigo_puesto && codigo_puesto.trim() !== puestoActualResult.rows[0].codigo_puesto) {
      const codigoExistente = await tursoClient.execute({
        sql: 'SELECT id FROM puestos WHERE LOWER(TRIM(codigo_puesto)) = LOWER(TRIM(?)) AND id != ?',
        args: [codigo_puesto, id]
      });
      if (codigoExistente.rows.length > 0) {
        return res.status(409).json({ error: `El puesto con código '${codigo_puesto.trim()}' ya existe.` });
      }
    }

    const fieldsToUpdate = [];
    const valuesToUpdate = [];
    let fieldIndex = 1;

    if (titulo_puesto !== undefined) { fieldsToUpdate.push(`titulo_puesto = ?${fieldIndex++}`); valuesToUpdate.push(titulo_puesto.trim()); }
    if (codigo_puesto !== undefined) { fieldsToUpdate.push(`codigo_puesto = ?${fieldIndex++}`); valuesToUpdate.push(codigo_puesto ? codigo_puesto.trim() : null); }
    if (proposito_general !== undefined) { fieldsToUpdate.push(`proposito_general = ?${fieldIndex++}`); valuesToUpdate.push(proposito_general || null); }
    if (principales_responsabilidades !== undefined) { fieldsToUpdate.push(`principales_responsabilidades = ?${fieldIndex++}`); valuesToUpdate.push(principales_responsabilidades || null); }
    if (requisitos !== undefined) { fieldsToUpdate.push(`requisitos = ?${fieldIndex++}`); valuesToUpdate.push(requisitos || null); }
    if (formacion_requerida !== undefined) { fieldsToUpdate.push(`formacion_requerida = ?${fieldIndex++}`); valuesToUpdate.push(formacion_requerida || null); }
    if (experiencia_requerida !== undefined) { fieldsToUpdate.push(`experiencia_requerida = ?${fieldIndex++}`); valuesToUpdate.push(experiencia_requerida || null); }
    if (conocimientos_especificos !== undefined) { fieldsToUpdate.push(`conocimientos_especificos = ?${fieldIndex++}`); valuesToUpdate.push(conocimientos_especificos || null); }
    if (competencias_necesarias !== undefined) { fieldsToUpdate.push(`competencias_necesarias = ?${fieldIndex++}`); valuesToUpdate.push(competencias_necesarias || null); }
    if (nivel !== undefined) { fieldsToUpdate.push(`nivel = ?${fieldIndex++}`); valuesToUpdate.push(nivel || null); }
    if (documento_descripcion_puesto_url !== undefined) { fieldsToUpdate.push(`documento_descripcion_puesto_url = ?${fieldIndex++}`); valuesToUpdate.push(documento_descripcion_puesto_url || null); }
    if (estado_puesto !== undefined) { fieldsToUpdate.push(`estado_puesto = ?${fieldIndex++}`); valuesToUpdate.push(estado_puesto); }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: 'No hay campos válidos para actualizar.' });
    }

    fieldsToUpdate.push(`updated_at = CURRENT_TIMESTAMP`);

    const sqlUpdate = `UPDATE puestos SET ${fieldsToUpdate.join(', ')} WHERE id = ?${fieldIndex} RETURNING *;`;
    valuesToUpdate.push(id);

    const result = await tursoClient.execute({
      sql: sqlUpdate,
      args: valuesToUpdate
    });

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: `Puesto con ID ${id} no encontrado después de intentar actualizar.` });
    }

  } catch (error) {
    next(error);
  }
});

// DELETE /api/puestos/:id - Eliminar un puesto
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const puestoExistente = await tursoClient.execute({
      sql: 'SELECT id FROM puestos WHERE id = ?',
      args: [id]
    });

    if (puestoExistente.rows.length === 0) {
      return res.status(404).json({ error: `Puesto con ID ${id} no encontrado.` });
    }

    await tursoClient.execute({
      sql: 'DELETE FROM puestos WHERE id = ?',
      args: [id]
    });

    res.status(200).json({ message: `Puesto con ID ${id} eliminado exitosamente.` });

  } catch (error) {
    if (error.message && error.message.includes('FOREIGN KEY constraint failed')) {
      return res.status(409).json({ error: 'No se puede eliminar el puesto porque es referenciado por otras entidades (ej. personal asignado).' });
    }
    next(error);
  }
});

export default router;