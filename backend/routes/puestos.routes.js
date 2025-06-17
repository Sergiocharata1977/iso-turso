import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/puestos - Obtener todos los puestos con el nombre del departamento
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT
          p.id,
          p.nombre,
          p.descripcion,
          p.departamentoId,
          d.nombre AS departamento_nombre,
          p.fecha_creacion
        FROM
          puestos p
        LEFT JOIN
          departamentos d ON p.departamentoId = d.id
        ORDER BY p.nombre ASC;
      `,
      args: []
    });

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los puestos:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener los puestos.' });
  }
});

// POST /api/puestos - Crear un nuevo puesto
router.post('/', async (req, res) => {
  const { nombre, departamentoId, descripcion } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre del puesto es obligatorio.' });
  }
  if (departamentoId === undefined || departamentoId === null) {
    return res.status(400).json({ error: 'El ID del departamento es obligatorio.' });
  }

  const fechaCreacion = new Date().toISOString();

  try {
    const deptCheck = await tursoClient.execute({
      sql: 'SELECT id FROM departamentos WHERE id = ?',
      args: [departamentoId]
    });
    if (deptCheck.rows.length === 0) {
      return res.status(404).json({ error: `El departamento con ID ${departamentoId} no existe.` });
    }

    const puestoExistente = await tursoClient.execute({
      sql: 'SELECT id FROM puestos WHERE nombre = ?',
      args: [nombre.trim()]
    });
    if (puestoExistente.rows.length > 0) {
      return res.status(409).json({ error: `El puesto con nombre '${nombre.trim()}' ya existe.` });
    }

    const result = await tursoClient.execute({
      sql: `INSERT INTO puestos (id, nombre, departamentoId, descripcion, fecha_creacion)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        crypto.randomUUID(),
        nombre.trim(),
        departamentoId,
        descripcion || null,
        fechaCreacion
      ]
    });

    // Obtener el puesto recién creado
    const nuevoPuesto = await tursoClient.execute({
      sql: `SELECT id, nombre, departamentoId, descripcion, fecha_creacion 
            FROM puestos WHERE nombre = ? AND departamentoId = ? 
            ORDER BY fecha_creacion DESC LIMIT 1`,
      args: [nombre.trim(), departamentoId]
    });

    if (nuevoPuesto.rows.length > 0) {
      res.status(201).json(nuevoPuesto.rows[0]);
    } else {
      res.status(201).json({ message: 'Puesto creado exitosamente (sin retorno de fila).', nombre: nombre.trim(), departamentoId });
    }

  } catch (error) {
    console.error('Error al crear el puesto:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el puesto.' });
  }
});

// GET /api/puestos/:id - Obtener un puesto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT
          p.id,
          p.nombre,
          p.descripcion,
          p.departamentoId,
          d.nombre AS departamento_nombre,
          p.fecha_creacion
        FROM
          puestos p
        LEFT JOIN
          departamentos d ON p.departamentoId = d.id
        WHERE
          p.id = ?
      `,
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Puesto con ID ${id} no encontrado.` });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener el puesto con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor al obtener el puesto.' });
  }
});

// PUT /api/puestos/:id - Actualizar un puesto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, departamentoId, descripcion } = req.body;

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
    const puestoActual = puestoActualResult.rows[0];

    if (nombre !== undefined) {
      const nombreTrimmed = nombre.trim();
      if (nombreTrimmed === '') {
        return res.status(400).json({ error: 'El nombre del puesto no puede estar vacío.' });
      }
      if (nombreTrimmed.toLowerCase() !== puestoActual.nombre.toLowerCase()) {
        const nombreExistente = await tursoClient.execute({
          sql: 'SELECT id FROM puestos WHERE nombre = ? AND id != ?',
          args: [nombreTrimmed, id]
        });
        if (nombreExistente.rows.length > 0) {
          return res.status(409).json({ error: `El nombre de puesto '${nombreTrimmed}' ya existe.` });
        }
      }
    }

    if (departamentoId !== undefined) {
      if (departamentoId === null) {
         return res.status(400).json({ error: 'El ID del departamento no puede ser nulo si se proporciona para actualizar.' });
      }
      const deptCheck = await tursoClient.execute({
        sql: 'SELECT id FROM departamentos WHERE id = ?',
        args: [departamentoId]
      });
      if (deptCheck.rows.length === 0) {
        return res.status(404).json({ error: `El departamento con ID ${departamentoId} no existe.` });
      }
    }

    if (descripcion !== undefined) {
    }

    const sqlUpdate = `UPDATE puestos SET nombre = ?, departamentoId = ?, descripcion = ? WHERE id = ? RETURNING *;`;

    const result = await tursoClient.execute({
      sql: sqlUpdate,
      args: [nombre, departamentoId, descripcion, id]
    });

    if (result.rows.length > 0) {
      // Para que la respuesta incluya el nombre del departamento, como en el GET
      const updatedPuesto = result.rows[0];
      if (updatedPuesto.departamentoId) {
        const deptInfo = await tursoClient.execute({
            sql: 'SELECT nombre FROM departamentos WHERE id = ?',
            args: [updatedPuesto.departamentoId]
        });
        if (deptInfo.rows.length > 0) {
            updatedPuesto.departamento_nombre = deptInfo.rows[0].nombre;
        } else {
            updatedPuesto.departamento_nombre = null; // O manejar como prefieras
        }
      } else {
        updatedPuesto.departamento_nombre = null;
      }
      res.json(updatedPuesto);
    } else {
      return res.status(404).json({ error: `Puesto con ID ${id} no encontrado después de intentar actualizar.` });
    }

  } catch (error) {
    console.error(`Error al actualizar el puesto con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el puesto.' });
  }
});

// DELETE /api/puestos/:id - Eliminar un puesto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el puesto existe
    const puestoExistente = await tursoClient.execute({
      sql: 'SELECT id FROM puestos WHERE id = ?',
      args: [id]
    });

    if (puestoExistente.rows.length === 0) {
      return res.status(404).json({ error: `Puesto con ID ${id} no encontrado.` });
    }

    // Verificar si hay personal asociado a este puesto
    const personalAsociado = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM personal WHERE puesto_id = ?',
      args: [id]
    });

    if (personalAsociado.rows[0].count > 0) {
      return res.status(409).json({
        error: `No se puede eliminar el puesto porque hay ${personalAsociado.rows[0].count} personas asociadas a él.`
      });
    }

    // Eliminar el puesto
    await tursoClient.execute({
      sql: 'DELETE FROM puestos WHERE id = ?',
      args: [id]
    });

    res.json({ message: `Puesto con ID ${id} eliminado exitosamente.` });
  } catch (error) {
    console.error(`Error al eliminar el puesto con ID ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el puesto.' });
  }
});

export default router;