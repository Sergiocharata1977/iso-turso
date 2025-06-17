import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET - Obtener todo el personal
router.get('/', async (req, res) => {
  try {
    console.log('[GET /api/personal] Obteniendo lista de personal');
    
    const result = await tursoClient.execute({
      sql: `SELECT p.*, d.nombre as departamento_nombre, pu.nombre as puesto_nombre
            FROM personal p
            LEFT JOIN departamentos d ON p.departamentoId = d.id
            LEFT JOIN puestos pu ON p.puestoId = pu.id
            ORDER BY p.nombre`
    });
    
    console.log(`[GET /api/personal] ${result.rows.length} registros encontrados`);
    res.json(result.rows);
  } catch (error) {
    console.error('[GET /api/personal] Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET - Obtener personal por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(`[GET /api/personal/${id}] Obteniendo personal`);
    
    const result = await tursoClient.execute({
      sql: `SELECT p.*, d.nombre as departamento_nombre, pu.nombre as puesto_nombre
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
    console.error(`[GET /api/personal/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST - Crear nuevo personal
router.post('/', async (req, res) => {
  const { 
    nombre, 
    email, 
    telefono, 
    departamentoId, 
    puestoId, 
    fecha_contratacion,
    numero,
    estado = 'activo'
  } = req.body;

  console.log('[POST /api/personal] Datos recibidos:', req.body);

  // Validaciones
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  if (!email) {
    return res.status(400).json({ error: 'El email es obligatorio.' });
  }

  try {
    // Verificar que el email no esté duplicado
    const emailCheck = await tursoClient.execute({
      sql: 'SELECT id FROM personal WHERE email = ?',
      args: [email]
    });

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe personal con este email.' });
    }

    // Verificar que el departamento existe (si se proporciona)
    if (departamentoId) {
      const deptCheck = await tursoClient.execute({
        sql: 'SELECT id FROM departamentos WHERE id = ?',
        args: [departamentoId]
      });

      if (deptCheck.rows.length === 0) {
        return res.status(404).json({ error: 'El departamento especificado no existe.' });
      }
    }

    // Verificar que el puesto existe (si se proporciona)
    if (puestoId) {
      const puestoCheck = await tursoClient.execute({
        sql: 'SELECT id FROM puestos WHERE id = ?',
        args: [puestoId]
      });

      if (puestoCheck.rows.length === 0) {
        return res.status(404).json({ error: 'El puesto especificado no existe.' });
      }
    }

    const fechaCreacion = new Date().toISOString();
    const id = crypto.randomUUID();

    const result = await tursoClient.execute({
      sql: `INSERT INTO personal (
              id, nombre, email, telefono, departamentoId, puestoId, 
              fecha_contratacion, numero, estado, fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, nombre, email, telefono, departamentoId, puestoId,
        fecha_contratacion, numero, estado, fechaCreacion
      ]
    });

    // Obtener el registro completo con datos relacionados
    const fullResult = await tursoClient.execute({
      sql: `SELECT p.*, d.nombre as departamento_nombre, pu.nombre as puesto_nombre
            FROM personal p
            LEFT JOIN departamentos d ON p.departamentoId = d.id
            LEFT JOIN puestos pu ON p.puestoId = pu.id
            WHERE p.id = ?`,
      args: [id]
    });

    console.log('[POST /api/personal] Personal creado exitosamente:', fullResult.rows[0]);
    res.status(201).json(fullResult.rows[0]);
  } catch (error) {
    console.error('[POST /api/personal] Error:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el personal.' });
  }
});

// PUT - Actualizar personal
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    nombre, 
    email, 
    telefono, 
    departamentoId, 
    puestoId, 
    fecha_contratacion,
    numero,
    estado
  } = req.body;

  console.log(`[PUT /api/personal/${id}] Datos recibidos:`, req.body);

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  try {
    // Verificar que el personal existe
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM personal WHERE id = ?',
      args: [id]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Personal no encontrado.' });
    }

    // Verificar email único (excluyendo el registro actual)
    if (email) {
      const emailCheck = await tursoClient.execute({
        sql: 'SELECT id FROM personal WHERE email = ? AND id != ?',
        args: [email, id]
      });

      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ error: 'Ya existe otro personal con este email.' });
      }
    }

    await tursoClient.execute({
      sql: `UPDATE personal SET 
            nombre = ?, email = ?, telefono = ?, departamentoId = ?, 
            puestoId = ?, fecha_contratacion = ?, numero = ?, estado = ?
            WHERE id = ?`,
      args: [
        nombre, email, telefono, departamentoId, puestoId,
        fecha_contratacion, numero, estado, id
      ]
    });

    // Obtener el registro actualizado con datos relacionados
    const result = await tursoClient.execute({
      sql: `SELECT p.*, d.nombre as departamento_nombre, pu.nombre as puesto_nombre
            FROM personal p
            LEFT JOIN departamentos d ON p.departamentoId = d.id
            LEFT JOIN puestos pu ON p.puestoId = pu.id
            WHERE p.id = ?`,
      args: [id]
    });

    console.log(`[PUT /api/personal/${id}] Personal actualizado exitosamente`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[PUT /api/personal/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE - Eliminar personal
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`[DELETE /api/personal/${id}] Eliminando personal`);

    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id, nombre FROM personal WHERE id = ?',
      args: [id]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Personal no encontrado.' });
    }

    await tursoClient.execute({
      sql: 'DELETE FROM personal WHERE id = ?',
      args: [id]
    });

    console.log(`[DELETE /api/personal/${id}] Personal eliminado exitosamente`);
    res.json({ message: 'Personal eliminado exitosamente' });
  } catch (error) {
    console.error(`[DELETE /api/personal/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
