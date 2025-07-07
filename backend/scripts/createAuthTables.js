import db from '../db.js';

const createAuthTables = async () => {
  try {
    // Crear tabla de organizaciones si no existe
    await db.execute(`
      CREATE TABLE IF NOT EXISTS organizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla de usuarios si no existe
    await db.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        organization_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'manager', 'employee')) NOT NULL DEFAULT 'employee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organizations (id) ON DELETE CASCADE
      );
    `);

    // Crear tabla de refresh tokens si no existe
    await db.execute(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES usuarios (id) ON DELETE CASCADE
      );
    `);

    console.log('-> Tablas de autenticación (organizations, usuarios, refresh_tokens) verificadas.');

  } catch (err) {
    console.error('Error verificando tablas de autenticación:', err.message);
    throw err; // Re-lanzar el error para que el llamador lo maneje
  }
};

export default createAuthTables;
