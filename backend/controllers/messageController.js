import db from '../db.js';

// @desc    Obtener todos los mensajes para el usuario
// @route   GET /api/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.execute({
      sql: `
        SELECT 
          m.id, 
          m.subject, 
          m.created_at, 
          m.priority,
          u.nombre as sender_name,
          mr.is_read
        FROM messages m
        JOIN message_recipients mr ON m.id = mr.message_id
        JOIN usuarios u ON m.sender_id = u.id
        WHERE mr.recipient_id = ?
        ORDER BY m.created_at DESC
      `,
      args: [userId]
    });

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ message: 'Error al obtener mensajes', error: error.message });
  }
};

// @desc    Crear un nuevo mensaje
// @route   POST /api/messages
// @access  Private
export const createMessage = async (req, res) => {
  const { subject, content, priority, recipientIds, tags } = req.body;
  const sender_id = req.user.id;

  if (!subject || !content || !recipientIds || recipientIds.length === 0) {
    return res.status(400).json({ message: 'Faltan campos requeridos (asunto, contenido y al menos un destinatario).' });
  }

  let tx;
  try {
    tx = await db.transaction('write');

    // 1. Insertar el mensaje principal
    const messageResult = await tx.execute({
      sql: 'INSERT INTO messages (sender_id, subject, content, priority, created_at) VALUES (?, ?, ?, ?, ?)',
      args: [sender_id, subject, content, priority || 'media', new Date().toISOString()]
    });
    const messageId = messageResult.lastInsertRowid;

    // 2. Insertar los destinatarios
    for (const recipientId of recipientIds) {
      await tx.execute({
        sql: 'INSERT INTO message_recipients (message_id, recipient_id) VALUES (?, ?)',
        args: [messageId, recipientId]
      });
    }

    // 3. Insertar las etiquetas (si existen)
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await tx.execute({
          sql: 'INSERT INTO message_tags (message_id, tag_type, tag_id) VALUES (?, ?, ?)',
          args: [messageId, tag.type, tag.id]
        });
      }
    }

    await tx.commit();

    res.status(201).json({ message: 'Mensaje creado exitosamente', messageId });

  } catch (error) {
    console.error('Error al crear mensaje:', error);
    if (tx) await tx.rollback();
    res.status(500).json({ message: 'Error al crear el mensaje', error: error.message });
  }
};

// @desc    Obtener un mensaje por ID
// @route   GET /api/messages/:id
// @access  Private
export const getMessageById = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    // Obtener el mensaje y verificar si el usuario es el emisor
    const messageResult = await db.execute({
      sql: `SELECT m.*, u.nombre as sender_name 
            FROM messages m 
            JOIN usuarios u ON m.sender_id = u.id 
            WHERE m.id = ?`,
      args: [messageId]
    });

    if (messageResult.rows.length === 0) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }

    const message = messageResult.rows[0];

    // Obtener los destinatarios y verificar si el usuario es uno de ellos
    const recipientsResult = await db.execute({
      sql: 'SELECT recipient_id FROM message_recipients WHERE message_id = ?',
      args: [messageId]
    });
    const recipientIds = recipientsResult.rows.map(r => r.recipient_id);

    if (message.sender_id !== userId && !recipientIds.includes(userId)) {
      return res.status(403).json({ message: 'No autorizado para ver este mensaje' });
    }

    // Obtener etiquetas
    const tagsResult = await db.execute({
        sql: 'SELECT tag_type, tag_id FROM message_tags WHERE message_id = ?',
        args: [messageId]
    });

    const fullMessage = {
        ...message,
        recipients: recipientIds,
        tags: tagsResult.rows
    };

    res.status(200).json(fullMessage);

  } catch (error) {
    console.error('Error al obtener mensaje por ID:', error);
    res.status(500).json({ message: 'Error al obtener mensaje', error: error.message });
  }
};

// @desc    Marcar un mensaje como leído
// @route   PUT /api/messages/:id/read
// @access  Private
export const markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    const result = await db.execute({
      sql: 'UPDATE message_recipients SET is_read = 1, read_at = ? WHERE message_id = ? AND recipient_id = ?',
      args: [new Date().toISOString(), messageId, userId]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'No se encontró el mensaje para marcar como leído.'});
    }

    res.status(200).json({ message: 'Mensaje marcado como leído' });
  } catch (error) {
    console.error('Error al marcar mensaje como leído:', error);
    res.status(500).json({ message: 'Error al marcar como leído', error: error.message });
  }
};

// @desc    Eliminar un mensaje
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    // Elimina la entrada del destinatario, no el mensaje en sí (soft delete)
    const result = await db.execute({
      sql: 'DELETE FROM message_recipients WHERE message_id = ? AND recipient_id = ?',
      args: [messageId, userId]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'No se encontró el mensaje para eliminar.'});
    }

    res.status(200).json({ message: 'Mensaje eliminado para el usuario' });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    res.status(500).json({ message: 'Error al eliminar mensaje', error: error.message });
  }
};
