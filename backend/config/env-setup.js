import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 🔍 Cargar variables de entorno en orden de prioridad
function loadEnvConfig() {
  const envFiles = [
    '.env.local',      // 1️⃣ Prioridad: Configuración local
    '.env.development', // 2️⃣ Configuración de desarrollo
    '.env'             // 3️⃣ Configuración por defecto
  ];

  // Buscar y cargar el primer archivo .env que exista
  for (const envFile of envFiles) {
    const envPath = join(__dirname, '..', envFile);
    if (existsSync(envPath)) {
      console.log(`📄 Cargando configuración desde: ${envFile}`);
      dotenv.config({ path: envPath });
      
      // Verificar que tenemos las variables críticas
      if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
        console.warn(`⚠️  Faltan variables críticas en ${envFile}`);
        console.log('📝 Necesitas configurar:');
        console.log('   - TURSO_DATABASE_URL');
        console.log('   - TURSO_AUTH_TOKEN');
      }
      
      return;
    }
  }

  console.error('❌ No se encontró ningún archivo de configuración (.env.local, .env.development, .env)');
  console.log('📝 Crea un archivo .env.local con tus credenciales de desarrollo');
}

// Exportar función para usar en otros archivos
export { loadEnvConfig };