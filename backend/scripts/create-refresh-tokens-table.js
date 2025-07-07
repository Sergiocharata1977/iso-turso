import { tursoClient } from '../lib/tursoClient.js';

async function createRefreshTokensTable() {
  try {
    console.log('🔄 Creando tabla refresh_tokens...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );
    `;

    await tursoClient.execute(createTableSQL);
    console.log('✅ Tabla refresh_tokens creada exitosamente');

    // Crear índices para optimizar consultas
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
    `);
    
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
    `);
    
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
    `);

    console.log('✅ Índices creados exitosamente');

  } catch (error) {
    console.error('❌ Error al crear tabla refresh_tokens:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createRefreshTokensTable()
    .then(() => {
      console.log('🎉 Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en el script:', error);
      process.exit(1);
    });
}

export default createRefreshTokensTable; 