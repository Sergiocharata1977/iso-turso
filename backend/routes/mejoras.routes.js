import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/hallazgos - Listar todos los hallazgos
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT h.*
        FROM hallazgos h
        ORDER BY h.fechaRegistro DESC
      `,
    });
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener hallazgos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/hallazgos/:id - Obtener un hallazgo por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT h.*
        FROM hallazgos h
        WHERE h.id = ?
      `,
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hallazgo no encontrado.' });        
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener el hallazgo ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/hallazgos - Crear un nuevo hallazgo
router.post('/', async (req, res) => {
  console.log('API POST /hallazgos - Recibido:', req.body);
  let {
    titulo, descripcion, estado, origen, categoria,
    fechaRegistro, requisitoIncumplido
  } = req.body;

  // Asignar estado por defecto si no se proporciona
  estado = estado || 'PENDIENTE';

  // Asegurarse de que los campos opcionales tengan un valor nulo si no se proporcionan
  const fechaCierre = req.body.fechaCierre || null;

  if (!titulo || !fechaRegistro || !origen || !categoria) {
    return res.status(400).json({ error: 'Los campos título, fecha de registro, origen y categoría son obligatorios.' });
  }

  try {
    // 1. Obtener el último número de hallazgo
    const lastHallazgoResult = await tursoClient.execute('SELECT numeroHallazgo FROM hallazgos ORDER BY id DESC LIMIT 1');
    let nextNumeroHallazgo = 'H-001';
    if (lastHallazgoResult.rows.length > 0 && lastHallazgoResult.rows[0].numeroHallazgo) {
      const lastNumero = lastHallazgoResult.rows[0].numeroHallazgo;
      const lastId = parseInt(lastNumero.split('-')[1], 10);
      nextNumeroHallazgo = `H-${(lastId + 1).toString().padStart(3, '0')}`;
    }

    const existing = await tursoClient.execute({
      sql: 'SELECT id FROM hallazgos WHERE numeroHallazgo = ?',
      args: [nextNumeroHallazgo]
    });

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un hallazgo con ese número.' });
    }

    const id = crypto.randomUUID();
    
    await tursoClient.execute({
      sql: `INSERT INTO hallazgos (
        id, numeroHallazgo, titulo, descripcion, estado, origen, categoria,
        fechaRegistro, fechaCierre, requisitoIncumplido
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // 10 values
      args: [
        id, nextNumeroHallazgo, titulo, descripcion, estado, origen, categoria,
        fechaRegistro, fechaCierre, requisitoIncumplido
      ],
    });

    const newHallazgoResult = await tursoClient.execute({
        sql: 'SELECT * FROM hallazgos WHERE id = ?',
        args: [id]
    });

    res.status(201).json(newHallazgoResult.rows[0]);
  } catch (error) {
    console.error('Error al crear el hallazgo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/hallazgos/:id - Actualizar un hallazgo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { ...fieldsToUpdate } = req.body;

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron campos para actualizar.' });
  }

  const allowedFields = [
    'titulo', 'descripcion', 'estado', 'origen', 'categoria',
    'fechaRegistro', 'fechaCierre', 'requisitoIncumplido'
  ];

  const fields = Object.keys(fieldsToUpdate)
    .filter(key => allowedFields.includes(key));

  const sqlSetParts = fields.map(key => `${key} = ?`);
  const sqlArgs = fields.map(key => fieldsToUpdate[key]);
  sqlArgs.push(id);

  try {
    await tursoClient.execute({
      sql: `UPDATE hallazgos SET ${sqlSetParts.join(', ')} WHERE id = ?`,
      args: sqlArgs,
    });

    const updatedHallazgoResult = await tursoClient.execute({
        sql: 'SELECT * FROM hallazgos WHERE id = ?',
        args: [id]
    });

    res.json(updatedHallazgoResult.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar el hallazgo ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/hallazgos/:id - Eliminar un hallazgo y sus registros asociados
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const tx = await tursoClient.transaction();
  try {

    
    // Luego eliminar el hallazgo principal
    const result = await tx.execute({ sql: 'DELETE FROM hallazgos WHERE id = ?', args: [id] });

    await tx.commit();

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Hallazgo no encontrado.' });
    }
    
    res.status(204).send();
  } catch (error) {
    await tx.rollback();
    console.error(`Error al eliminar el hallazgo ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
