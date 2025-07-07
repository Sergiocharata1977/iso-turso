import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

async function createMissingTable() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_DB_TOKEN,
  });

  try {
    console.log('Creando tabla refresh_tokens...');
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES usuarios (id) ON DELETE CASCADE
      )
    `);
    
    console.log('✅ Tabla refresh_tokens creada exitosamente');
    
    // Verificar que se creó
    const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='refresh_tokens'");
    
    if (result.rows.length > 0) {
      console.log('✅ Confirmado: tabla refresh_tokens existe en la base de datos');
    } else {
      console.log('❌ Error: tabla refresh_tokens no se pudo crear');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.close();
  }
}

createMissingTable();
