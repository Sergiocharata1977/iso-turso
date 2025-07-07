import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

const tursoClient = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

async function dropTables() {
  console.log('🗑️ ELIMINANDO TABLAS...');
  
  const tables = [
    'message_tags',
    'message_recipients', 
    'messages',
    'usuarios',
    'auditorias',
    'comunicaciones',
    'eventos_calendario',
    'noticias'
  ];
  
  for (const table of tables) {
    try {
      await tursoClient.execute(`DROP TABLE IF EXISTS ${table}`);
      console.log(`✅ Eliminada: ${table}`);
    } catch (error) {
      console.log(`❌ Error eliminando ${table}: ${error.message}`);
    }
  }
  
  console.log('🎯 ELIMINACIÓN COMPLETADA');
}

dropTables();
