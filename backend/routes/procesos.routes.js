import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET - Obtener todos los procesos
router.get('/', async (req, res) => {
  try {
    console.log('[GET /api/procesos] Obteniendo lista de procesos');
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM procesos ORDER BY codigo, nombre`
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
  const { 
    codigo, 
    nombre, 
    version = '1.0',
    objetivo,
    alcance,
    funciones_involucradas,
    definiciones_abreviaturas,
    desarrollo
  } = req.body;

  console.log('[POST /api/procesos] Datos recibidos:', req.body);

  // Validaciones
  if (!codigo) {
    return res.status(400).json({ error: 'El código es obligatorio.' });
  }

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  try {
    // Verificar que el código no esté duplicado
    const codeCheck = await tursoClient.execute({
      sql: 'SELECT id FROM procesos WHERE codigo = ?',
      args: [codigo]
    });

    if (codeCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un proceso con este código.' });
    }

    const fechaCreacion = new Date().toISOString();
    const id = crypto.randomUUID();

    const result = await tursoClient.execute({
      sql: `INSERT INTO procesos (
              id, codigo, nombre, version, objetivo, alcance, funciones_involucradas, definiciones_abreviaturas, desarrollo, fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      args: [
        id, codigo, nombre, version, objetivo, alcance, funciones_involucradas, definiciones_abreviaturas, desarrollo, fechaCreacion
      ]
    });

    // Obtener el registro creado
    const newProceso = await tursoClient.execute({
      sql: 'SELECT * FROM procesos WHERE id = ?',
      args: [id]
    });

    console.log('[POST /api/procesos] Proceso creado exitosamente:', newProceso.rows[0]);
    res.status(201).json(newProceso.rows[0]);
  } catch (error) {
    console.error('[POST /api/procesos] Error:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el proceso.' });
  }
});

// PUT - Actualizar proceso
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    codigo, 
    nombre, 
    version = '1.o',
    objetivo,
    alcance,
    funciones_involucradas,
    definiciones_abreviaturas,
    desarrollo,
    estado
  } = req.body;

  console.log(`[PUT /api/procesos/${id}] Datos recibidos:`, req.body);

  if (!codigo) {
    return res.status(400).json({ error: 'El código es obligatorio.' });
  }

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  try {
    // Verificar que el proceso existe
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM procesos WHERE id = ?',
      args: [id]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Proceso no encontrado.' });
    }

    // Verificar código único (excluyendo el registro actual)
    const codeCheck = await tursoClient.execute({
      sql: 'SELECT id FROM procesos WHERE codigo = ? AND id != ?',
      args: [codigo, id]
    });

    if (codeCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe otro proceso con este código.' });
    }

    await tursoClient.execute({
      sql: `UPDATE procesos SET 
            codigo = ?, nombre = ?, version = ?, objetivo = ?, alcance = ?, funciones_involucradas = ?, definiciones_abreviaturas = ?, desarrollo = ?, estado = ?
            WHERE id = ?`,
      args: [
        codigo, nombre, version, objetivo, alcance, funciones_involucradas, definiciones_abreviaturas, desarrollo, estado, id
      ]
    });

    // Obtener el registro actualizado
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM procesos WHERE id = ?',
      args: [id]
    });

    console.log(`[PUT /api/procesos/${id}] Proceso actualizado exitosamente`);
    res.json(result.rows[0]);
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

    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id, codigo, nombre FROM procesos WHERE id = ?',
      args: [id]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Proceso no encontrado.' });
    }

    await tursoClient.execute({
      sql: 'DELETE FROM procesos WHERE id = ?',
      args: [id]
    });

    console.log(`[DELETE /api/procesos/${id}] Proceso eliminado exitosamente`);
    res.json({ message: 'Proceso eliminado exitosamente' });
  } catch (error) {
    console.error(`[DELETE /api/procesos/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
