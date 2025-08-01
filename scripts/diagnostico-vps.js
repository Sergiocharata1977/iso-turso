#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DEL PACKAGE.JSON EN VPS');
console.log('==========================================');

// Función para validar JSON
function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    console.log(`✅ ${filePath} es válido`);
    return true;
  } catch (error) {
    console.log(`❌ Error en ${filePath}: ${error.message}`);
    return false;
  }
}

// Función para corregir package.json común
function fixPackageJSON(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Detectar problemas comunes
    const problems = [];
    
    // Verificar comas extra al final
    if (content.includes(',\n  }')) {
      content = content.replace(/,\s*\n\s*}/g, '\n  }');
      problems.push('Comas extra removidas');
    }
    
    // Verificar llaves mal cerradas
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      problems.push(`Llaves desbalanceadas: ${openBraces} abiertas, ${closeBraces} cerradas`);
    }
    
    // Verificar si hay caracteres extraños
    const invalidChars = content.match(/[^\x00-\x7F]/g);
    if (invalidChars) {
      problems.push('Caracteres no ASCII detectados');
      content = content.replace(/[^\x00-\x7F]/g, '');
    }
    
    // Intentar parsear para verificar
    JSON.parse(content);
    
    if (problems.length > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`🔧 ${filePath} corregido:`, problems.join(', '));
    } else {
      console.log(`✅ ${filePath} no necesita correcciones`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ No se pudo corregir ${filePath}: ${error.message}`);
    return false;
  }
}

// Función para crear un package.json de respaldo
function createBackupPackageJSON(filePath) {
  const backupPath = filePath + '.backup';
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`📦 Backup creado: ${backupPath}`);
  }
}

// Función para crear un package.json limpio
function createCleanPackageJSON(filePath) {
  const cleanPackage = {
    "name": "isoflow-backend",
    "version": "1.0.0",
    "description": "Backend para Sistema de Gestión de Calidad ISO 9001",
    "main": "index.js",
    "type": "module",
    "scripts": {
      "start": "node index.js",
      "dev": "nodemon index.js",
      "test": "jest",
      "security-check": "npm audit",
      "lint": "eslint .",
      "format": "prettier --write ."
    },
    "dependencies": {
      "express": "^4.18.2",
      "cors": "^2.8.5",
      "dotenv": "^16.3.1",
      "jsonwebtoken": "^9.0.2",
      "bcryptjs": "^2.4.3",
      "helmet": "^7.1.0",
      "express-rate-limit": "^7.1.5",
      "express-validator": "^7.0.1",
      "express-session": "^1.17.3",
      "connect-sqlite3": "^0.9.13",
      "multer": "^1.4.5-lts.1",
      "nodemailer": "^6.9.7",
      "compression": "^1.7.4",
      "morgan": "^1.10.0",
      "express-brute": "^1.0.1",
      "express-brute-redis": "^0.0.1",
      "sqlite3": "^5.1.6",
      "turso": "^0.0.15"
    },
    "devDependencies": {
      "nodemon": "^3.0.2",
      "jest": "^29.7.0",
      "eslint": "^8.55.0",
      "prettier": "^3.1.0",
      "supertest": "^6.3.3"
    },
    "engines": {
      "node": ">=18.0.0"
    },
    "keywords": [
      "iso9001",
      "quality-management",
      "express",
      "nodejs",
      "sqlite",
      "turso"
    ],
    "author": "Tu Nombre",
    "license": "MIT"
  };
  
  fs.writeFileSync(filePath, JSON.stringify(cleanPackage, null, 2));
  console.log(`✨ Package.json limpio creado: ${filePath}`);
}

// Ejecutar diagnóstico
console.log('\n📋 Verificando archivos package.json...\n');

const filesToCheck = [
  'backend/package.json',
  'frontend/package.json',
  'package.json'
];

let hasErrors = false;

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`\n🔍 Verificando: ${file}`);
    const isValid = validateJSON(file);
    
    if (!isValid) {
      hasErrors = true;
      console.log(`🛠️ Intentando corregir: ${file}`);
      
      // Crear backup
      createBackupPackageJSON(file);
      
      // Intentar corregir
      const fixed = fixPackageJSON(file);
      
      if (!fixed) {
        console.log(`⚠️ Creando package.json limpio para: ${file}`);
        createCleanPackageJSON(file);
      }
    }
  } else {
    console.log(`⚠️ Archivo no encontrado: ${file}`);
  }
});

console.log('\n==========================================');
console.log('🎯 COMANDOS PARA EJECUTAR EN EL VPS:');
console.log('==========================================');
console.log('1. Verificar estado de PM2:');
console.log('   pm2 status');
console.log('');
console.log('2. Ver logs del proceso:');
console.log('   pm2 logs isoflow3-backend --lines 50');
console.log('');
console.log('3. Reinstalar dependencias:');
console.log('   cd backend && rm -rf node_modules package-lock.json');
console.log('   npm install');
console.log('');
console.log('4. Reiniciar el proceso:');
console.log('   pm2 restart isoflow3-backend');
console.log('');
console.log('5. Si persiste el problema:');
console.log('   pm2 delete isoflow3-backend');
console.log('   cd backend && npm start');
console.log('');

if (hasErrors) {
  console.log('⚠️ Se detectaron errores en package.json');
  console.log('✅ Se han aplicado correcciones automáticas');
} else {
  console.log('✅ Todos los package.json están correctos');
} 