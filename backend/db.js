import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Forzar el uso de una base de datos SQLite local
const dbUrl = `file:${path.join(__dirname, 'data.db')}`;

console.log(`Conectando a la base de datos local: ${dbUrl}`);

const tursoClient = createClient({
  url: dbUrl
});

export default tursoClient;
