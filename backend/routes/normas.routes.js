import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET - Obtener todas las normas/puntos normativos
router.get('/', async (req, res) => {
  try {
    console.log('[GET /api/normas] Obteniendo lista de normas');
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM normas ORDER BY codigo`
    });
    
    console.log(`[GET /api/normas] ${result.rows.length} registros encontrados`);
    res.json(result.rows);
  } catch (error) {
    console.error('[GET /api/normas] Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET - Obtener norma por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(`[GET /api/normas/${id}] Obteniendo norma`);
    
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM normas WHERE id = ?',
      args: [id]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Norma no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[GET /api/normas/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST - Crear nueva norma/punto normativo
router.post('/', async (req, res) => {
  const { 
    codigo, 
    titulo, 
    descripcion, 
    observaciones
  } = req.body;

  console.log('[POST /api/normas] Datos recibidos:', req.body);

  // Validaciones
  if (!codigo) {
    return res.status(400).json({ error: 'El código es obligatorio.' });
  }

  if (!titulo) {
    return res.status(400).json({ error: 'El título es obligatorio.' });
  }

  try {
    // Verificar que el código no esté duplicado
    const codeCheck = await tursoClient.execute({
      sql: 'SELECT id FROM normas WHERE codigo = ?',
      args: [codigo]
    });

    if (codeCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe una norma con este código.' });
    }

    const id = crypto.randomUUID();

    const result = await tursoClient.execute({
      sql: `INSERT INTO normas (
              id, codigo, titulo, descripcion, observaciones
            ) VALUES (?, ?, ?, ?, ?)`,
      args: [
        id, codigo, titulo, descripcion, observaciones
      ]
    });

    // Obtener el registro creado
    const newNorma = await tursoClient.execute({
      sql: 'SELECT * FROM normas WHERE id = ?',
      args: [id]
    });

    console.log('[POST /api/normas] Norma creada exitosamente:', newNorma.rows[0]);
    res.status(201).json(newNorma.rows[0]);
  } catch (error) {
    console.error('[POST /api/normas] Error:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear la norma.' });
  }
});

// PUT - Actualizar norma
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    codigo, 
    titulo, 
    descripcion, 
    observaciones
  } = req.body;

  console.log(`[PUT /api/normas/${id}] Datos recibidos:`, req.body);

  if (!codigo) {
    return res.status(400).json({ error: 'El código es obligatorio.' });
  }

  if (!titulo) {
    return res.status(400).json({ error: 'El título es obligatorio.' });
  }

  try {
    // Verificar que la norma existe
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM normas WHERE id = ?',
      args: [id]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Norma no encontrada.' });
    }

    // Verificar código único (excluyendo el registro actual)
    const codeCheck = await tursoClient.execute({
      sql: 'SELECT id FROM normas WHERE codigo = ? AND id != ?',
      args: [codigo, id]
    });

    if (codeCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe otra norma con este código.' });
    }

    await tursoClient.execute({
      sql: `UPDATE normas SET 
            codigo = ?, titulo = ?, descripcion = ?, observaciones = ?
            WHERE id = ?`,
      args: [
        codigo, titulo, descripcion, observaciones, id
      ]
    });

    // Obtener el registro actualizado
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM normas WHERE id = ?',
      args: [id]
    });

    console.log(`[PUT /api/normas/${id}] Norma actualizada exitosamente`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[PUT /api/normas/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE - Eliminar norma
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`[DELETE /api/normas/${id}] Eliminando norma`);

    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id, codigo, titulo FROM normas WHERE id = ?',
      args: [id]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Norma no encontrada.' });
    }

    await tursoClient.execute({
      sql: 'DELETE FROM normas WHERE id = ?',
      args: [id]
    });

    console.log(`[DELETE /api/normas/${id}] Norma eliminada exitosamente`);
    res.json({ message: 'Norma eliminada exitosamente' });
  } catch (error) {
    console.error(`[DELETE /api/normas/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
