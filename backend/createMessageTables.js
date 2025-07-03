// Script para crear solo las tablas del sistema de mensajería
import { tursoClient } from './lib/tursoClient.js';

async function createMessageTables() {
  try {
    console.log('Creando tablas para el sistema de mensajería...');

    // Definiciones de las tablas de mensajería
    const tableDefinitions = [
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        priority TEXT CHECK(priority IN ('baja', 'media', 'alta')) DEFAULT 'media',
        organization_id INTEGER,
        FOREIGN KEY (sender_id) REFERENCES usuarios(id)
      );`,
      `CREATE TABLE IF NOT EXISTS message_recipients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id INTEGER NOT NULL,
        recipient_id INTEGER NOT NULL,
        is_read INTEGER NOT NULL DEFAULT 0,
        read_at TEXT,
        FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
        FOREIGN KEY (recipient_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS message_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id INTEGER NOT NULL,
        tag_type TEXT NOT NULL CHECK(tag_type IN ('department', 'process', 'person')),
        tag_id TEXT NOT NULL,
        FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
      );`
    ];

    for (const tableDef of tableDefinitions) {
      await tursoClient.execute(tableDef);
      const tableName = tableDef.match(/TABLE IF NOT EXISTS (\w+)/)[1];
      console.log(`✅ Tabla ${tableName} creada correctamente`);
    }

    console.log('✨ Tablas del sistema de mensajería creadas exitosamente');
  } catch (error) {
    console.error('❌ Error al crear las tablas de mensajería:', error);
  } finally {
    tursoClient.close();
    console.log('Conexión con la base de datos cerrada.');
  }
}

// Ejecutar la función
createMessageTables();
