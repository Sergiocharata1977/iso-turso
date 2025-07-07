import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Construye la ruta al archivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');

// Carga las variables de entorno
dotenv.config({ path: envPath });

// Valida que las variables de entorno requeridas existan
if (!process.env.DATABASE_URL || !process.env.TURSO_DB_TOKEN) {
  console.error(
    'Error Crítico: Las variables de entorno DATABASE_URL y/o TURSO_DB_TOKEN no están definidas en el archivo .env.'
  );
  process.exit(1);
}

console.log('Conectando a la base de datos TursoDB...');

// Crea y exporta el cliente de Turso
const tursoClient = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

export default tursoClient;
