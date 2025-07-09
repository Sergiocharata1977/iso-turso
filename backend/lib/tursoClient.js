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

// Valida que las variables de entorno requeridas existan
if (!process.env.DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error(
    'Error Crítico: Las variables de entorno DATABASE_URL y/o TURSO_AUTH_TOKEN no están definidas en el archivo .env.'
  );
  process.exit(1);
}

// Crea y exporta el cliente de Turso
export const tursoClient = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Función para probar la conexión
export async function testConnection() {
  try {
    console.log('Probando conexión con la base de datos Turso...');
    const result = await tursoClient.execute('SELECT 1');
    if (result.rows.length > 0) {
      console.log('✅ Conexión con la base de datos Turso establecida exitosamente.');
    } else {
      throw new Error('La consulta de prueba no devolvió resultados.');
    }
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos Turso:', error.message);
    throw error; 
  }
}
