import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Construye la ruta al archivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

// Carga las variables de entorno
dotenv.config({ path: envPath });

// Crea el cliente de Turso
const tursoClient = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

// Tablas a eliminar relacionadas con usuarios, planificación, revisión y mensajes
const TABLES_TO_DELETE = [
  'usuarios',
  'messages', 
  'message_recipients',
  'message_tags',
  'auditorias',
  'comunicaciones',
  'eventos_calendario',
  'noticias'
];

async function eliminateModules() {
  console.log('🗑️  ELIMINANDO MÓDULOS COMPLETOS...\n');
  
  try {
    // Eliminar tablas en orden inverso para evitar problemas de dependencias
    for (const tableName of TABLES_TO_DELETE.reverse()) {
      try {
        console.log(`🗑️  Eliminando tabla: ${tableName}`);
        await tursoClient.execute(`DROP TABLE IF EXISTS ${tableName}`);
        console.log(`✅ Tabla ${tableName} eliminada exitosamente`);
      } catch (error) {
        console.log(`⚠️  Error al eliminar tabla ${tableName}: ${error.message}`);
      }
    }
    
    console.log('\n🎯 ELIMINACIÓN COMPLETADA');
    console.log('📋 Tablas eliminadas:');
    TABLES_TO_DELETE.forEach(table => console.log(`   - ${table}`));
    
  } catch (error) {
    console.error('❌ Error durante la eliminación:', error);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url.endsWith(process.argv[1])) {
  eliminateModules();
}

export default eliminateModules;
