import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET - Obtener todos los documentos
router.get('/', async (req, res) => {
  try {
    console.log('[GET /api/documentos] Obteniendo lista de documentos');
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM documentos ORDER BY titulo`
    });
    
    console.log(`[GET /api/documentos] ${result.rows.length} registros encontrados`);
    res.json(result.rows);
  } catch (error) {
    console.error('[GET /api/documentos] Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET - Obtener documento por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(`[GET /api/documentos/${id}] Obteniendo documento`);
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM documentos WHERE id = ?`,
      args: [id]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[GET /api/documentos/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST - Crear nuevo documento
router.post('/', async (req, res) => {
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

  // Validaciones
  if (!titulo) {
    return res.status(400).json({ error: 'El título es obligatorio.' });
  }

  try {
    // Verificar que el título no esté duplicado
    const titleCheck = await tursoClient.execute({
      sql: 'SELECT id FROM documentos WHERE titulo = ?',
      args: [titulo]
    });

    if (titleCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un documento con este título.' });
    }

    const fechaCreacion = new Date().toISOString();
    const id = crypto.randomUUID();

    const result = await tursoClient.execute({
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

    // Obtener el registro creado
    const newDoc = await tursoClient.execute({
      sql: `SELECT * FROM documentos WHERE id = ?`,
      args: [id]
    });

    console.log('[POST /api/documentos] Documento creado exitosamente:', newDoc.rows[0]);
    res.status(201).json(newDoc.rows[0]);
  } catch (error) {
    console.error('[POST /api/documentos] Error:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el documento.' });
  }
});

// PUT - Actualizar documento
router.put('/:id', async (req, res) => {
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
    return res.status(400).json({ error: 'El título es obligatorio.' });
  }

  try {
    // Verificar que el documento existe
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM documentos WHERE id = ?',
      args: [id]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Documento no encontrado.' });
    }

    // Verificar título único (excluyendo el registro actual)
    const titleCheck = await tursoClient.execute({
      sql: 'SELECT id FROM documentos WHERE titulo = ? AND id != ?',
      args: [titulo, id]
    });

    if (titleCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe otro documento con este título.' });
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

    // Obtener el registro actualizado
    const result = await tursoClient.execute({
      sql: `SELECT * FROM documentos WHERE id = ?`,
      args: [id]
    });

    console.log(`[PUT /api/documentos/${id}] Documento actualizado exitosamente`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[PUT /api/documentos/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE - Eliminar documento
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`[DELETE /api/documentos/${id}] Eliminando documento`);

    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id, titulo FROM documentos WHERE id = ?',
      args: [id]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Documento no encontrado.' });
    }

    await tursoClient.execute({
      sql: 'DELETE FROM documentos WHERE id = ?',
      args: [id]
    });

    console.log(`[DELETE /api/documentos/${id}] Documento eliminado exitosamente`);
    res.json({ message: 'Documento eliminado exitosamente' });
  } catch (error) {
    console.error(`[DELETE /api/documentos/${id}] Error:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
