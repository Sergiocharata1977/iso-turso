import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

async function fixRefreshTokensTable() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_DB_TOKEN,
  });

  try {
    console.log('🔄 Verificando y creando tabla refresh_tokens...');
    
    // Verificar si la tabla existe
    const checkTable = await client.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='refresh_tokens'",
      args: []
    });

    if (checkTable.rows.length === 0) {
      console.log('❌ Tabla refresh_tokens no existe. Creándola...');
      
      // Crear la tabla
      await client.execute(`
        CREATE TABLE refresh_tokens (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          token TEXT NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES usuarios (id) ON DELETE CASCADE
        );
      `);
      
      console.log('✅ Tabla refresh_tokens creada exitosamente');
    } else {
      console.log('✅ Tabla refresh_tokens ya existe');
    }

    // Verificar estructura de la tabla
    const tableInfo = await client.execute({
      sql: "PRAGMA table_info(refresh_tokens)",
      args: []
    });

    console.log('📋 Estructura de la tabla refresh_tokens:');
    tableInfo.rows.forEach(row => {
      console.log(`  - ${row.name}: ${row.type} ${row.notnull ? 'NOT NULL' : ''} ${row.pk ? 'PRIMARY KEY' : ''}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.close();
  }
}

// Ejecutar
fixRefreshTokensTable()
  .then(() => {
    console.log('🎉 Verificación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
