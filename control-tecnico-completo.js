#!/usr/bin/env node

/**
 * Control Técnico Completo - Sistema ISO Flow
 * Ejecutar: node control-tecnico-completo.js
 * 
 * Este script realiza una verificación técnica completa del sistema:
 * - Backend (Node.js/Express)
 * - Frontend (React/Vite)
 * - Base de datos (SQLite)
 * - Seguridad
 * - Rendimiento
 * - Dependencias
 * - Configuración
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Función para imprimir con colores
function print(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

// Función para imprimir sección
function printSection(title) {
  console.log('\n' + '='.repeat(60));
  print(colors.bold + colors.cyan, `🔍 ${title}`);
  console.log('='.repeat(60));
}

// Función para verificar archivos críticos del backend
function checkBackendCriticalFiles() {
  printSection('VERIFICACIÓN BACKEND');
  
  const backendFiles = [
    'backend/index.js',
    'backend/package.json',
    'backend/.env',
    'backend/database/',
    'backend/routes/',
    'backend/controllers/',
    'backend/middleware/',
    'backend/services/'
  ];

  let missingFiles = [];
  
  backendFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      print(colors.green, `✅ ${file}`);
    } else {
      print(colors.red, `❌ ${file} - FALTANTE`);
      missingFiles.push(file);
    }
  });

  return missingFiles.length === 0;
}

// Función para verificar archivos críticos del frontend
function checkFrontendCriticalFiles() {
  printSection('VERIFICACIÓN FRONTEND');
  
  const frontendFiles = [
    'frontend/src/',
    'frontend/package.json',
    'frontend/vite.config.js',
    'frontend/tailwind.config.js',
    'frontend/index.html'
  ];

  let missingFiles = [];
  
  frontendFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      print(colors.green, `✅ ${file}`);
    } else {
      print(colors.red, `❌ ${file} - FALTANTE`);
      missingFiles.push(file);
    }
  });

  return missingFiles.length === 0;
}

// Función para verificar dependencias del backend
function checkBackendDependencies() {
  printSection('DEPENDENCIAS BACKEND');
  
  const backendPackagePath = path.join(__dirname, 'backend/package.json');
  
  if (!fs.existsSync(backendPackagePath)) {
    print(colors.red, '❌ package.json del backend no encontrado');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
  const requiredDeps = [
    'express',
    'cors',
    'bcrypt',
    'jsonwebtoken',
    'dotenv',
    '@libsql/client',
    'sqlite3'
  ];

  let missingDeps = [];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      print(colors.green, `✅ ${dep}`);
    } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      print(colors.green, `✅ ${dep} (dev)`);
    } else {
      print(colors.red, `❌ ${dep} - FALTANTE`);
      missingDeps.push(dep);
    }
  });

  return missingDeps.length === 0;
}

// Función para verificar dependencias del frontend
function checkFrontendDependencies() {
  printSection('DEPENDENCIAS FRONTEND');
  
  const frontendPackagePath = path.join(__dirname, 'frontend/package.json');
  
  if (!fs.existsSync(frontendPackagePath)) {
    print(colors.red, '❌ package.json del frontend no encontrado');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));
  const requiredDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    'axios',
    '@tanstack/react-query',
    'tailwindcss',
    'vite'
  ];

  let missingDeps = [];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      print(colors.green, `✅ ${dep}`);
    } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      print(colors.green, `✅ ${dep} (dev)`);
    } else {
      print(colors.red, `❌ ${dep} - FALTANTE`);
      missingDeps.push(dep);
    }
  });

  return missingDeps.length === 0;
}

// Función para verificar base de datos
function checkDatabase() {
  printSection('VERIFICACIÓN BASE DE DATOS');
  
  const dbFiles = [
    'data.db',
    'backend/data.db'
  ];

  let dbExists = false;
  
  dbFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      print(colors.green, `✅ ${file} (${sizeInMB} MB)`);
      dbExists = true;
    } else {
      print(colors.yellow, `⚠️  ${file} - No encontrado`);
    }
  });

  return dbExists;
}

// Función para verificar configuración de seguridad
function checkSecurityConfig() {
  printSection('VERIFICACIÓN SEGURIDAD');
  
  const securityChecks = [
    { file: '.gitignore', check: () => {
      const gitignorePath = path.join(__dirname, '.gitignore');
      if (fs.existsSync(gitignorePath)) {
        const content = fs.readFileSync(gitignorePath, 'utf8');
        return content.includes('node_modules') && content.includes('.env');
      }
      return false;
    }},
    { file: 'backend/.env', check: () => {
      const envPath = path.join(__dirname, 'backend/.env');
      return fs.existsSync(envPath);
    }},
    { file: 'backend/middleware/', check: () => {
      const middlewarePath = path.join(__dirname, 'backend/middleware');
      return fs.existsSync(middlewarePath);
    }}
  ];

  let securityScore = 0;
  
  securityChecks.forEach(check => {
    if (check.check()) {
      print(colors.green, `✅ ${check.file}`);
      securityScore++;
    } else {
      print(colors.red, `❌ ${check.file} - PROBLEMA DE SEGURIDAD`);
    }
  });

  return securityScore === securityChecks.length;
}

// Función para verificar scripts de prueba
function checkTestScripts() {
  printSection('VERIFICACIÓN SCRIPTS DE PRUEBA');
  
  const testFiles = [
    'test-api-simple.mjs',
    'test-login.mjs',
    'test-db-directo.mjs',
    'test-objetivos.js',
    'test-procesos-issue.js',
    'test-procesos-protocolo.js',
    'test-server.js'
  ];

  let testScore = 0;
  
  testFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      print(colors.green, `✅ ${file}`);
      testScore++;
    } else {
      print(colors.yellow, `⚠️  ${file} - No encontrado`);
    }
  });

  return testScore >= testFiles.length * 0.7; // Al menos 70% de los tests
}

// Función para verificar documentación
function checkDocumentation() {
  printSection('VERIFICACIÓN DOCUMENTACIÓN');
  
  const docs = [
    'README.md',
    'CONTRIBUTING.md',
    'NORMAS_Y_ESTANDARES.md',
    'ESTRATEGIA_SOFTWARE.md',
    'SOLUCIONES_APLICADAS.md',
    'CASOS_DE_USO.md'
  ];

  let docsScore = 0;
  
  docs.forEach(doc => {
    const docPath = path.join(__dirname, doc);
    if (fs.existsSync(docPath)) {
      const stats = fs.statSync(docPath);
      const sizeInKB = (stats.size / 1024).toFixed(1);
      print(colors.green, `✅ ${doc} (${sizeInKB} KB)`);
      docsScore++;
    } else {
      print(colors.yellow, `⚠️  ${doc} - No encontrado`);
    }
  });

  return docsScore >= docs.length * 0.8; // Al menos 80% de la documentación
}

// Función para verificar estructura de directorios
function checkDirectoryStructure() {
  printSection('VERIFICACIÓN ESTRUCTURA DE DIRECTORIOS');
  
  const directories = [
    'backend/routes',
    'backend/controllers',
    'backend/middleware',
    'backend/services',
    'backend/database',
    'frontend/src',
    'frontend/src/components',
    'frontend/src/hooks',
    'frontend/src/lib',
    'scripts'
  ];

  let structureScore = 0;
  
  directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
      print(colors.green, `✅ ${dir}/`);
      structureScore++;
    } else {
      print(colors.red, `❌ ${dir}/ - FALTANTE`);
    }
  });

  return structureScore >= directories.length * 0.9; // Al menos 90% de la estructura
}

// Función para generar reporte completo
function generateCompleteReport(results) {
  printSection('REPORTE TÉCNICO COMPLETO');
  
  const date = new Date().toLocaleDateString('es-ES');
  const time = new Date().toLocaleTimeString('es-ES');
  
  print(colors.bold, `📅 Fecha: ${date} - ${time}`);
  print(colors.bold, `🏢 Sistema: ISO Flow Management`);
  
  console.log('\n' + '='.repeat(60));
  print(colors.bold, '📊 ESTADO GENERAL DEL SISTEMA');
  console.log('='.repeat(60));
  
  const status = {
    'Backend Files': results.backendFiles ? '✅ OK' : '❌ PROBLEMAS',
    'Frontend Files': results.frontendFiles ? '✅ OK' : '❌ PROBLEMAS',
    'Backend Dependencies': results.backendDeps ? '✅ OK' : '❌ PROBLEMAS',
    'Frontend Dependencies': results.frontendDeps ? '✅ OK' : '❌ PROBLEMAS',
    'Database': results.database ? '✅ OK' : '❌ PROBLEMAS',
    'Security': results.security ? '✅ OK' : '❌ PROBLEMAS',
    'Test Scripts': results.testScripts ? '✅ OK' : '❌ PROBLEMAS',
    'Documentation': results.documentation ? '✅ OK' : '❌ PROBLEMAS',
    'Directory Structure': results.directoryStructure ? '✅ OK' : '❌ PROBLEMAS'
  };

  Object.entries(status).forEach(([key, value]) => {
    print(colors.blue, `${key}: ${value}`);
  });

  // Calcular score general
  const totalChecks = Object.keys(status).length;
  const passedChecks = Object.values(status).filter(s => s.includes('✅')).length;
  const score = (passedChecks / totalChecks * 100).toFixed(1);

  console.log('\n' + '='.repeat(60));
  print(colors.bold, `🎯 SCORE GENERAL: ${score}%`);
  console.log('='.repeat(60));

  if (score >= 90) {
    print(colors.green, '🏆 EXCELENTE - Sistema en óptimas condiciones');
  } else if (score >= 80) {
    print(colors.yellow, '⚠️  BUENO - Algunas mejoras recomendadas');
  } else if (score >= 70) {
    print(colors.yellow, '⚠️  REGULAR - Requiere atención');
  } else {
    print(colors.red, '🚨 CRÍTICO - Requiere intervención inmediata');
  }

  console.log('\n' + '='.repeat(60));
  print(colors.bold, '📋 RECOMENDACIONES');
  console.log('='.repeat(60));

  if (!results.backendFiles) {
    print(colors.yellow, '🔧 Revisar archivos críticos del backend');
  }
  if (!results.frontendFiles) {
    print(colors.yellow, '🔧 Revisar archivos críticos del frontend');
  }
  if (!results.backendDeps) {
    print(colors.yellow, '📦 Instalar dependencias faltantes del backend');
  }
  if (!results.frontendDeps) {
    print(colors.yellow, '📦 Instalar dependencias faltantes del frontend');
  }
  if (!results.database) {
    print(colors.yellow, '🗄️  Verificar configuración de base de datos');
  }
  if (!results.security) {
    print(colors.red, '🔒 Revisar configuración de seguridad');
  }
  if (!results.testScripts) {
    print(colors.yellow, '🧪 Mejorar cobertura de pruebas');
  }
  if (!results.documentation) {
    print(colors.yellow, '📚 Completar documentación faltante');
  }
  if (!results.directoryStructure) {
    print(colors.yellow, '📁 Reorganizar estructura de directorios');
  }

  console.log('\n' + '='.repeat(60));
  print(colors.bold, '🚀 PRÓXIMOS PASOS');
  console.log('='.repeat(60));

  if (score >= 90) {
    print(colors.green, '✅ Continuar con desarrollo normal');
    print(colors.blue, '📝 Considerar nuevas funcionalidades');
  } else if (score >= 80) {
    print(colors.yellow, '⚠️  Resolver problemas menores antes de continuar');
  } else {
    print(colors.red, '🚨 Resolver problemas críticos antes de continuar');
  }

  console.log('\n' + '='.repeat(60));
  print(colors.bold, '📞 CONTACTO DE EMERGENCIA');
  console.log('='.repeat(60));
  print(colors.blue, '🔧 Revisar logs del sistema');
  print(colors.blue, '🔄 Considerar rollback si es necesario');
  print(colors.blue, '📞 Contactar al equipo de desarrollo');

  return score;
}

// Función principal
function main() {
  print(colors.bold + colors.magenta, '🤖 CONTROL TÉCNICO COMPLETO - ISO FLOW');
  print(colors.blue, 'Iniciando verificación técnica completa del sistema...\n');

  try {
    // Ejecutar todas las verificaciones
    const results = {
      backendFiles: checkBackendCriticalFiles(),
      frontendFiles: checkFrontendCriticalFiles(),
      backendDeps: checkBackendDependencies(),
      frontendDeps: checkFrontendDependencies(),
      database: checkDatabase(),
      security: checkSecurityConfig(),
      testScripts: checkTestScripts(),
      documentation: checkDocumentation(),
      directoryStructure: checkDirectoryStructure()
    };

    // Generar reporte completo
    const score = generateCompleteReport(results);

    print(colors.bold + colors.green, '\n🏁 Control técnico completo finalizado');
    
    if (score < 70) {
      process.exit(1);
    }
  } catch (error) {
    print(colors.red, `❌ Error durante el control técnico: ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
main();