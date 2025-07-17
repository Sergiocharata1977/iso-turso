import { db } from './lib/tursoClient.js';

const createAuthTables = async () => {
  try {
    console.log('🔧 Creando tablas de autenticación...');

    // Crear tabla organizations
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS organizations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          type TEXT DEFAULT 'empresa',
          industry TEXT DEFAULT 'general',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `
    });
    console.log('✅ Tabla organizations creada');

    // Crear tabla users
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'employee',
          organization_id INTEGER NOT NULL,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (organization_id) REFERENCES organizations(id)
        )
      `
    });
    console.log('✅ Tabla users creada');

    // Crear tabla refresh_tokens
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token TEXT NOT NULL UNIQUE,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `
    });
    console.log('✅ Tabla refresh_tokens creada');

    console.log('🎉 Todas las tablas de autenticación han sido creadas exitosamente');

  } catch (error) {
    console.error('❌ Error al crear tablas:', error);
  }
};

createAuthTables();