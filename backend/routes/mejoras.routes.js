import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';

// Helper function to convert BigInt to string in objects
function convertBigIntToString(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return String(obj);
  if (Array.isArray(obj)) return obj.map(convertBigIntToString);
  if (typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToString(value);
    }
    return converted;
  }
  return obj;
}

const router = Router();

// GET /api/mejoras - Listar todos los hallazgos
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT id, numeroHallazgo, titulo, descripcion, origen, categoria, 
               requisitoIncumplido, fechaRegistro, fechaCierre, orden, estado
        FROM hallazgos
        ORDER BY orden ASC, fechaRegistro DESC NULLS LAST
      `,
    });
    const convertedRows = convertBigIntToString(result.rows);
    res.json(convertedRows);
  } catch (error) {
    console.error('Error al obtener hallazgos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/mejoras/:id - Obtener un hallazgo por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT *
        FROM hallazgos
        WHERE id = ?
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

// POST /api/mejoras - Crear un nuevo hallazgo
router.post('/', async (req, res) => {
  const { titulo, descripcion, origen, categoria, requisitoIncumplido, estado } = req.body;

  if (!titulo || !descripcion || !origen || !categoria || !estado) {
    return res.status(400).json({ error: 'Los campos titulo, descripcion, origen, categoria y estado son obligatorios' });
  }

  try {
    console.log('🔍 Iniciando creación de hallazgo con datos:', { titulo, descripcion, origen, categoria, requisitoIncumplido, estado });
    
    // 1. Generate new numeroHallazgo
    const allHallazgosResult = await tursoClient.execute('SELECT numeroHallazgo FROM hallazgos WHERE numeroHallazgo LIKE "H-%" ORDER BY numeroHallazgo DESC LIMIT 1');
    let nextNumero = 'H-001';
    if (allHallazgosResult.rows.length > 0 && allHallazgosResult.rows[0].numeroHallazgo) {
      const lastNumero = allHallazgosResult.rows[0].numeroHallazgo;
      const lastId = parseInt(lastNumero.split('-')[1], 10);
      nextNumero = `H-${(lastId + 1).toString().padStart(3, '0')}`;
    }
    console.log('📝 Número generado:', nextNumero);

    // 2. Get new order value
    const countResult = await tursoClient.execute('SELECT COUNT(*) as count FROM hallazgos');
    const newOrder = countResult.rows.length > 0 ? countResult.rows[0].count : 0;

    // 3. Insert new hallazgo
    const result = await tursoClient.execute({
      sql: `INSERT INTO hallazgos (numeroHallazgo, titulo, descripcion, origen, categoria, requisitoIncumplido, fechaRegistro, estado, orden) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      args: [nextNumero, titulo, descripcion, origen, categoria, requisitoIncumplido || null, new Date().toISOString(), estado, newOrder],
    });

    console.log('✅ Hallazgo insertado exitosamente, lastInsertRowid:', result.lastInsertRowid);
    
    // 4. Return the newly created hallazgo
    const newHallazgoResult = await tursoClient.execute({
        sql: 'SELECT * FROM hallazgos WHERE id = ?',
        args: [result.lastInsertRowid],
    });
    
    console.log('📄 Resultado de consulta:', newHallazgoResult.rows);
    
    if (newHallazgoResult.rows && newHallazgoResult.rows.length > 0) {
      const hallazgoData = convertBigIntToString(newHallazgoResult.rows[0]);
      res.status(201).json(hallazgoData);
    } else {
      // Fallback: crear el objeto de respuesta manualmente
      const responseData = {
        id: String(result.lastInsertRowid), // Convertir BigInt a string
        numeroHallazgo: nextNumero,
        titulo,
        descripcion,
        origen,
        categoria,
        requisitoIncumplido: requisitoIncumplido || null,
        fechaRegistro: new Date().toISOString(),
        estado,
        orden: newOrder
      };
      console.log('📋 Enviando respuesta fallback:', responseData);
      res.status(201).json(responseData);
    }
  } catch (error) {
    console.error('Error al crear el hallazgo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/mejoras/:id - Actualizar un hallazgo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { ...fieldsToUpdate } = req.body;

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron campos para actualizar.' });
  }

  const allowedFields = [
    'titulo', 'descripcion', 'origen', 'categoria', 'requisitoIncumplido', 'fechaRegistro', 'fechaCierre', 'estado'
  ];

  const fields = Object.keys(fieldsToUpdate)
    .filter(key => allowedFields.includes(key));
  
  if (fields.length === 0) {
      return res.status(400).json({ error: 'Ninguno de los campos proporcionados es actualizable.' });
  }

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

// PUT /api/mejoras/orden - Actualizar el orden de los hallazgos
router.put('/orden', async (req, res) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'Se esperaba un array de IDs ordenados.' });
  }

  try {
    const statements = orderedIds.map((id, index) => ({
      sql: 'UPDATE hallazgos SET orden = ? WHERE id = ?',
      args: [index, id],
    }));

    await tursoClient.batch(statements, 'write');

    res.status(200).json({ message: 'Orden de hallazgos actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el orden de los hallazgos:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el orden.' });
  }
});

// PUT /api/mejoras/:id/estado - Actualizar solo el estado de un hallazgo
router.put('/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ error: 'El campo estado es obligatorio.' });
  }

  try {
    const result = await tursoClient.execute({
      sql: 'UPDATE hallazgos SET estado = ? WHERE id = ?',
      args: [estado, id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Hallazgo no encontrado.' });
    }

    const updatedHallazgoResult = await tursoClient.execute({
      sql: 'SELECT * FROM hallazgos WHERE id = ?',
      args: [id],
    });

    res.status(200).json(updatedHallazgoResult.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar el estado del hallazgo con id ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el estado.' });
  }
});

// DELETE /api/mejoras/:id - Eliminar un hallazgo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await tursoClient.execute({ sql: 'DELETE FROM hallazgos WHERE id = ?', args: [id] });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Hallazgo no encontrado.' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar el hallazgo ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
