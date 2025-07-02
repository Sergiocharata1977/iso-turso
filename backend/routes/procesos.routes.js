import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET - Obtener todos los procesos
router.get('/', async (req, res) => {
  try {
    console.log('[GET /api/procesos] Obteniendo lista de procesos');
    
    const result = await tursoClient.execute({
      sql: `SELECT id, nombre, responsable, descripcion FROM procesos ORDER BY nombre`
    });
    
    console.log(`[GET /api/procesos] ${result.rows.length} registros encontrados`);
    res.json(result.rows);
  } catch (error) {
    console.error('[GET /api/procesos] Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET - Obtener proceso por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(`[GET /api/procesos/${id}] Obteniendo proceso`);
    
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM procesos WHERE id = ?',
      args: [id]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proceso no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[GET /api/procesos/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST - Crear nuevo proceso
router.post('/', async (req, res) => {
  const { nombre, responsable, descripcion } = req.body;

  console.log('[POST /api/procesos] Datos recibidos:', req.body);

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  try {
    const id = `proc-${crypto.randomUUID()}`;

    await tursoClient.execute({
      sql: `INSERT INTO procesos (id, nombre, responsable, descripcion) VALUES (?, ?, ?, ?)`, 
      args: [id, nombre, responsable, descripcion]
    });

    const newProceso = { id, nombre, responsable, descripcion };
    console.log('[POST /api/procesos] Proceso creado exitosamente:', newProceso);
    res.status(201).json(newProceso);
  } catch (error) {
    console.error('[POST /api/procesos] Error:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el proceso.' });
  }
});

// PUT - Actualizar proceso
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, responsable, descripcion } = req.body;

  console.log(`[PUT /api/procesos/${id}] Datos recibidos:`, req.body);

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  try {
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM procesos WHERE id = ?',
      args: [id]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Proceso no encontrado.' });
    }

    await tursoClient.execute({
      sql: `UPDATE procesos SET nombre = ?, responsable = ?, descripcion = ? WHERE id = ?`,
      args: [nombre, responsable, descripcion, id]
    });

    const updatedProceso = { id, nombre, responsable, descripcion };
    console.log(`[PUT /api/procesos/${id}] Proceso actualizado exitosamente`);
    res.json(updatedProceso);
  } catch (error) {
    console.error(`[PUT /api/procesos/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE - Eliminar proceso
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`[DELETE /api/procesos/${id}] Eliminando proceso`);

    const result = await tursoClient.execute({
        sql: 'DELETE FROM procesos WHERE id = ?',
        args: [id]
    });

    if (result.rowsAffected === 0) {
        return res.status(404).json({ error: 'Proceso no encontrado.' });
    }

    console.log(`[DELETE /api/procesos/${id}] Proceso eliminado exitosamente`);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(`[DELETE /api/procesos/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
