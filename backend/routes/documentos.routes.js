import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import multer from 'multer';

// Configurar Multer para manejar la subida de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

// --- RUTAS CRUD PARA DOCUMENTOS ---

// 1. OBTENER TODOS LOS DOCUMENTOS (METADATA SOLAMENTE)
router.get('/', async (req, res) => {
  try {
    // Seleccionamos todos los campos excepto el contenido del archivo para no sobrecargar la respuesta
    const result = await tursoClient.execute('SELECT id, titulo, version, descripcion, fecha_creacion, archivo_nombre, archivo_mime_type FROM documentos ORDER BY fecha_creacion DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener documentos' });
  }
});

// 2. OBTENER UN DOCUMENTO POR ID (METADATA SOLAMENTE)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT id, titulo, version, descripcion, fecha_creacion, archivo_nombre, archivo_mime_type FROM documentos WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Documento no encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener el documento ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener el documento' });
  }
});

// 3. DESCARGAR UN ARCHIVO DE DOCUMENTO ESPECÍFICO
router.get('/:id/download', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT archivo_nombre, archivo_mime_type, archivo_contenido FROM documentos WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0 || !result.rows[0].archivo_contenido) {
      return res.status(404).json({ message: 'Archivo no encontrado o el documento no tiene contenido.' });
    }

    const doc = result.rows[0];
    const nombreArchivo = doc.archivo_nombre || 'documento.bin';
    const mimeType = doc.archivo_mime_type || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.send(doc.archivo_contenido);

  } catch (error) {
    console.error(`Error al descargar el archivo del documento ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al descargar el archivo' });
  }
});

// 4. CREAR UN NUEVO DOCUMENTO (CON ARCHIVO)
router.post('/', upload.single('archivo'), async (req, res) => {
  const { titulo, version, descripcion } = req.body;
  const archivo = req.file;

  if (!titulo || !version) {
    return res.status(400).json({ message: 'Los campos título y versión son obligatorios.' });
  }

  if (!archivo) {
    return res.status(400).json({ message: 'Se requiere un archivo para crear el documento.' });
  }

  try {
    await tursoClient.execute({
      sql: `
        INSERT INTO documentos (titulo, version, descripcion, archivo_nombre, archivo_mime_type, archivo_contenido)
        VALUES (?, ?, ?, ?, ?, ?);
      `,
      args: [titulo, version, descripcion || null, archivo.originalname, archivo.mimetype, archivo.buffer]
    });
    res.status(201).json({ message: 'Documento creado exitosamente.' });
  } catch (error) {
    console.error('Error al crear el documento:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear el documento' });
  }
});

// 5. ACTUALIZAR UN DOCUMENTO
router.put('/:id', upload.single('archivo'), async (req, res) => {
  const { id } = req.params;
  const { titulo, version, descripcion } = req.body;
  const archivo = req.file;

  if (!titulo || !version) {
    return res.status(400).json({ message: 'Los campos título y versión son obligatorios.' });
  }

  try {
    if (archivo) {
      // Si se sube un nuevo archivo, actualizar todo
      await tursoClient.execute({
        sql: `
          UPDATE documentos
          SET titulo = ?, version = ?, descripcion = ?, archivo_nombre = ?, archivo_mime_type = ?, archivo_contenido = ?
          WHERE id = ?;
        `,
        args: [titulo, version, descripcion || null, archivo.originalname, archivo.mimetype, archivo.buffer, id]
      });
    } else {
      // Si no se sube archivo, actualizar solo los metadatos
      await tursoClient.execute({
        sql: `
          UPDATE documentos
          SET titulo = ?, version = ?, descripcion = ?
          WHERE id = ?;
        `,
        args: [titulo, version, descripcion || null, id]
      });
    }
    res.json({ message: 'Documento actualizado exitosamente.' });
  } catch (error) {
    console.error(`Error al actualizar el documento ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el documento' });
  }
});

// 6. ELIMINAR UN DOCUMENTO
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await tursoClient.execute({
      sql: 'DELETE FROM documentos WHERE id = ?',
      args: [id]
    });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(`Error al eliminar el documento ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar el documento' });
  }
});

export default router;
