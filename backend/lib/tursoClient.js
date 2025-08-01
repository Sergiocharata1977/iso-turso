import { createClient } from '@libsql/client';
import { loadEnvConfig } from '../config/env-setup.js';

// Cargar configuración de entorno
loadEnvConfig();

// Verificar credenciales
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error('❌ Error: Faltan credenciales de Turso');
  console.log('📝 Crea un archivo .env.local con:');
  console.log('   TURSO_DATABASE_URL=libsql://tu-base-desarrollo.turso.io');
  console.log('   TURSO_AUTH_TOKEN=tu-token-aqui');
  process.exit(1);
}

// Crear el cliente de Turso
export const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

console.log('🌐 Conectado a Turso:', process.env.TURSO_DATABASE_URL);
console.log('🔧 Entorno:', process.env.NODE_ENV || 'development');
