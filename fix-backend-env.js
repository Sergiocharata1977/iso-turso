#!/usr/bin/env node

/**
 * Script para arreglar el problema del archivo .env faltante
 * Ejecutar: node fix-backend-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function print(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

function main() {
  print(colors.bold + colors.blue, '🔧 ARREGLANDO PROBLEMA DE CONFIGURACIÓN BACKEND');
  print(colors.blue, 'Verificando y creando archivo .env...\n');

  const backendPath = path.join(__dirname, 'backend');
  const envPath = path.join(backendPath, '.env');
  const envExamplePath = path.join(backendPath, 'env.example');

  // Verificar si ya existe .env
  if (fs.existsSync(envPath)) {
    print(colors.green, '✅ El archivo .env ya existe en backend/');
    return;
  }

  // Verificar si existe env.example
  if (!fs.existsSync(envExamplePath)) {
    print(colors.red, '❌ No se encontró env.example en backend/');
    print(colors.yellow, '📝 Creando archivo .env con configuración básica...');
    
    // Crear .env básico
    const basicEnv = `# Configuración del entorno
NODE_ENV=development
PORT=3001

# Base de datos
DB_PATH=./data.db

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# OpenAI (opcional)
OPENAI_API_KEY=your-openai-api-key

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
`;

    try {
      fs.writeFileSync(envPath, basicEnv);
      print(colors.green, '✅ Archivo .env creado exitosamente');
      print(colors.yellow, '⚠️  IMPORTANTE: Revisa y modifica las variables según tu entorno');
    } catch (error) {
      print(colors.red, `❌ Error al crear .env: ${error.message}`);
      return;
    }
  } else {
    print(colors.blue, '📋 Copiando desde env.example...');
    
    try {
      const envExample = fs.readFileSync(envExamplePath, 'utf8');
      fs.writeFileSync(envPath, envExample);
      print(colors.green, '✅ Archivo .env copiado desde env.example');
    } catch (error) {
      print(colors.red, `❌ Error al copiar .env: ${error.message}`);
      return;
    }
  }

  // Verificar que el archivo se creó correctamente
  if (fs.existsSync(envPath)) {
    const stats = fs.statSync(envPath);
    const sizeInBytes = stats.size;
    print(colors.green, `✅ Archivo .env creado (${sizeInBytes} bytes)`);
    
    print(colors.bold, '\n📋 PRÓXIMOS PASOS:');
    print(colors.blue, '1. Revisa el archivo .env y ajusta las variables según tu entorno');
    print(colors.blue, '2. Asegúrate de que .env esté en .gitignore');
    print(colors.blue, '3. Reinicia el servidor backend');
    print(colors.blue, '4. Ejecuta el control técnico nuevamente');
    
    print(colors.bold, '\n🔒 NOTA DE SEGURIDAD:');
    print(colors.yellow, '⚠️  Cambia las claves secretas en producción');
    print(colors.yellow, '⚠️  No subas el archivo .env al repositorio');
  } else {
    print(colors.red, '❌ Error: El archivo .env no se pudo crear');
  }
}

main();