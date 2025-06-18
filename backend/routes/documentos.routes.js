import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET - Obtener todos los documentos
router.get('/', async (req, res, next) => {
  try {
    console.log('[GET /api/documentos] Obteniendo lista de documentos');
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM documentos ORDER BY titulo`
    });
    
    console.log(`[GET /api/documentos] ${result.rows.length} registros encontrados`);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET - Obtener documento por ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  
  try {
    console.log(`[GET /api/documentos/${id}] Obteniendo documento`);
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM documentos WHERE id = ?`,
      args: [id]
    });
    
    if (result.rows.length === 0) {
      const err = new Error('Documento no encontrado');
      err.statusCode = 404;
      return next(err);
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST - Crear nuevo documento
router.post('/', async (req, res, next) => {
  const { 
    titulo, 
    descripcion, 
    version = '1.0',
    categoria,
    autor,
    estado = 'borrador',
    archivo_url,
    fecha_revision,
    codigo
  } = req.body;

  console.log('[POST /api/documentos] Datos recibidos:', req.body);

  if (!titulo) {
    const err = new Error('El título es obligatorio.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const titleCheck = await tursoClient.execute({
      sql: 'SELECT id FROM documentos WHERE titulo = ?',
      args: [titulo]
    });

    if (titleCheck.rows.length > 0) {
      const err = new Error('Ya existe un documento con este título.');
      err.statusCode = 409;
      return next(err);
    }

    const fechaCreacion = new Date().toISOString();
    const id = crypto.randomUUID();

    await tursoClient.execute({
      sql: `INSERT INTO documentos (
              id, codigo, titulo, descripcion, version, categoria, autor, estado, 
              url_documento, fecha_creacion, fecha_revision
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      args: [
        id, codigo || '', titulo, descripcion || null, version, 
        categoria || null, autor || null, estado,
        archivo_url || null, fechaCreacion, fecha_revision || null
      ]
    });

    const newDocResult = await tursoClient.execute({
      sql: `SELECT * FROM documentos WHERE id = ?`,
      args: [id]
    });

    console.log('[POST /api/documentos] Documento creado exitosamente:', newDocResult.rows[0]);
    res.status(201).json(newDocResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT - Actualizar documento
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { 
    titulo, 
    descripcion, 
    version,
    categoria,
    autor,
    estado,
    archivo_url,
    fecha_revision,
    codigo
  } = req.body;

  console.log(`[PUT /api/documentos/${id}] Datos recibidos:`, req.body);

  if (!titulo) {
    const err = new Error('El título es obligatorio.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM documentos WHERE id = ?',
      args: [id]
    });

    if (existsCheck.rows.length === 0) {
      const err = new Error('Documento no encontrado.');
      err.statusCode = 404;
      return next(err);
    }

    const titleCheck = await tursoClient.execute({
      sql: 'SELECT id FROM documentos WHERE titulo = ? AND id != ?',
      args: [titulo, id]
    });

    if (titleCheck.rows.length > 0) {
      const err = new Error('Ya existe otro documento con este título.');
      err.statusCode = 409;
      return next(err);
    }

    await tursoClient.execute({
      sql: `UPDATE documentos SET 
            codigo = ?, titulo = ?, descripcion = ?, version = ?, 
            categoria = ?, autor = ?, estado = ?, url_documento = ?, 
            fecha_revision = ?
            WHERE id = ?`, 
      args: [
        codigo || '', titulo, descripcion || null, version || '1.0', 
        categoria || null, autor || null, estado || 'borrador',
        archivo_url || null, fecha_revision || null, id
      ]
    });

    const updatedDocResult = await tursoClient.execute({
      sql: `SELECT * FROM documentos WHERE id = ?`,
      args: [id]
    });

    console.log(`[PUT /api/documentos/${id}] Documento actualizado exitosamente`);
    res.json(updatedDocResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE - Eliminar documento
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    console.log(`[DELETE /api/documentos/${id}] Eliminando documento`);

    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id, titulo FROM documentos WHERE id = ?',
      args: [id]
    });

    if (existsCheck.rows.length === 0) {
      const err = new Error('Documento no encontrado.');
      err.statusCode = 404;
      return next(err);
    }

    await tursoClient.execute({
      sql: 'DELETE FROM documentos WHERE id = ?',
      args: [id]
    });

    console.log(`[DELETE /api/documentos/${id}] Documento eliminado exitosamente`);
    res.json({ message: 'Documento eliminado exitosamente' }); // Considerar res.status(204).send() para DELETE exitoso sin contenido
  } catch (error) {
    next(error);
  }
});

export default router;
