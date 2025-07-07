import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Cargar variables de entorno desde el archivo .env del backend
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

async function checkTables() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_DB_TOKEN,
  });

  try {
    console.log('🔍 Verificando tablas en la base de datos...');
    
    const result = await client.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      args: []
    });

    console.log('\n📋 Tablas encontradas:');
    if (result.rows.length > 0) {
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.name}`);
      });
    } else {
      console.log('❌ No se encontraron tablas');
    }

    // Verificar específicamente si existe la tabla users
    const usersCheck = await client.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
      args: []
    });

    console.log('\n🔍 Tabla users:', usersCheck.rows.length > 0 ? '✅ Existe' : '❌ No existe');

  } catch (error) {
    console.error('❌ Error al verificar tablas:', error.message);
  } finally {
    client.close();
  }
}

checkTables();
