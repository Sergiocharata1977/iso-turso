#!/usr/bin/env node

/**
 * 🔍 CONTROL TÉCNICO COMPLETO - ISOFlow3
 * =====================================
 * 
 * Script de análisis técnico integral del sistema
 * Genera reporte completo del estado del proyecto
 * 
 * Ejecutar: node control-tecnico-completo.js
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de colores para consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

// Función para imprimir con colores
function print(color, text, indent = 0) {
  const spaces = ' '.repeat(indent);
  console.log(`${spaces}${color}${text}${colors.reset}`);
}

// Función para crear separadores visuales
function separator(title, symbol = '=') {
  const line = symbol.repeat(60);
  print(colors.cyan + colors.bold, `\n${line}`);
  print(colors.cyan + colors.bold, `${title.toUpperCase()}`);
  print(colors.cyan + colors.bold, line);
}

// Función para ejecutar comandos de forma segura
async function safeExec(command, description) {
  try {
    print(colors.blue, `🔄 ${description}...`, 2);
    const { stdout, stderr } = await execAsync(command);
    return { success: true, stdout, stderr };
  } catch (error) {
    return { success: false, error: error.message, stderr: error.stderr };
  }
}

// 1. ANÁLISIS DE ESTRUCTURA DEL PROYECTO
async function analyzeProjectStructure() {
  separator('📁 ANÁLISIS DE ESTRUCTURA DEL PROYECTO');
  
  const requiredDirs = ['backend', 'frontend', 'scripts', 'db'];
  const requiredFiles = ['package.json', 'README.md', 'deploy.sh'];
  
  let score = 0;
  let totalChecks = requiredDirs.length + requiredFiles.length;
  
  print(colors.yellow, '📂 Verificando directorios críticos:', 2);
  for (const dir of requiredDirs) {
    if (fs.existsSync(dir)) {
      print(colors.green, `✅ ${dir}/`, 4);
      score++;
    } else {
      print(colors.red, `❌ ${dir}/ - FALTANTE`, 4);
    }
  }
  
  print(colors.yellow, '\n📄 Verificando archivos críticos:', 2);
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      print(colors.green, `✅ ${file}`, 4);
      score++;
    } else {
      print(colors.red, `❌ ${file} - FALTANTE`, 4);
    }
  }
  
  return { score, total: totalChecks, percentage: Math.round((score / totalChecks) * 100) };
}

// 2. ANÁLISIS DEL BACKEND
async function analyzeBackend() {
  separator('🚀 ANÁLISIS DEL BACKEND');
  
  const results = {};
  
  // Verificar archivos críticos del backend
  print(colors.yellow, '📁 Verificando estructura del backend:', 2);
  const backendFiles = [
    'backend/index.js',
    'backend/package.json',
    'backend/lib/tursoClient.js',
    'backend/middleware/errorHandler.js',
    'backend/routes/',
    'backend/controllers/',
    'backend/services/'
  ];
  
  let backendScore = 0;
  for (const file of backendFiles) {
    if (fs.existsSync(file)) {
      print(colors.green, `✅ ${file}`, 4);
      backendScore++;
    } else {
      print(colors.red, `❌ ${file} - FALTANTE`, 4);
    }
  }
  
  results.structure = { score: backendScore, total: backendFiles.length };
  
  // Verificar dependencias del backend
  print(colors.yellow, '\n📦 Verificando dependencias del backend:', 2);
  if (fs.existsSync('backend/package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    const requiredDeps = ['express', 'cors', 'dotenv', '@libsql/client', 'bcrypt'];
    
    let depScore = 0;
    for (const dep of requiredDeps) {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        print(colors.green, `✅ ${dep}`, 4);
        depScore++;
      } else {
        print(colors.red, `❌ ${dep} - FALTANTE`, 4);
      }
    }
    
    results.dependencies = { score: depScore, total: requiredDeps.length };
  }
  
  // Verificar conexión a base de datos
  print(colors.yellow, '\n🗄️ Verificando configuración de base de datos:', 2);
  if (fs.existsSync('backend/.env') || fs.existsSync('backend/env.production')) {
    print(colors.green, '✅ Archivos de configuración encontrados', 4);
    results.database = { configured: true };
  } else {
    print(colors.red, '❌ Archivos de configuración no encontrados', 4);
    results.database = { configured: false };
  }
  
  return results;
}

// 3. ANÁLISIS DEL FRONTEND
async function analyzeFrontend() {
  separator('🎨 ANÁLISIS DEL FRONTEND');
  
  const results = {};
  
  // Verificar estructura del frontend
  print(colors.yellow, '📁 Verificando estructura del frontend:', 2);
  const frontendFiles = [
    'frontend/package.json',
    'frontend/vite.config.js',
    'frontend/src/',
    'frontend/src/components/',
    'frontend/src/hooks/',
    'frontend/src/lib/',
    'frontend/public/'
  ];
  
  let frontendScore = 0;
  for (const file of frontendFiles) {
    if (fs.existsSync(file)) {
      print(colors.green, `✅ ${file}`, 4);
      frontendScore++;
    } else {
      print(colors.red, `❌ ${file} - FALTANTE`, 4);
    }
  }
  
  results.structure = { score: frontendScore, total: frontendFiles.length };
  
  // Verificar dependencias críticas
  print(colors.yellow, '\n📦 Verificando dependencias del frontend:', 2);
  if (fs.existsSync('frontend/package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
    const requiredDeps = ['react', 'vite', '@tanstack/react-query', 'tailwindcss', 'axios'];
    
    let depScore = 0;
    for (const dep of requiredDeps) {
      const hasDep = (packageJson.dependencies && packageJson.dependencies[dep]) ||
                     (packageJson.devDependencies && packageJson.devDependencies[dep]);
      if (hasDep) {
        print(colors.green, `✅ ${dep}`, 4);
        depScore++;
      } else {
        print(colors.red, `❌ ${dep} - FALTANTE`, 4);
      }
    }
    
    results.dependencies = { score: depScore, total: requiredDeps.length };
  }
  
  return results;
}

// 4. ANÁLISIS DE TESTS
async function analyzeTests() {
  separator('🧪 ANÁLISIS DE TESTS');
  
  const results = {};
  
  // Buscar archivos de test
  print(colors.yellow, '🔍 Buscando archivos de test:', 2);
  const testPatterns = [
    'test*.js',
    '*test*.js',
    '*.test.js',
    'backend/tests/',
    'frontend/cypress/'
  ];
  
  let testFiles = [];
  for (const pattern of testPatterns) {
    try {
      if (pattern.includes('/')) {
        if (fs.existsSync(pattern)) {
          const files = fs.readdirSync(pattern);
          testFiles.push(...files.map(f => path.join(pattern, f)));
        }
      } else {
        // Buscar archivos con patrón en raíz
        const files = fs.readdirSync('.');
        const matching = files.filter(f => {
          return pattern.includes('*') ? 
            f.includes(pattern.replace('*', '')) : 
            f === pattern;
        });
        testFiles.push(...matching);
      }
    } catch (error) {
      // Ignorar errores de búsqueda
    }
  }
  
  if (testFiles.length > 0) {
    print(colors.green, `✅ Encontrados ${testFiles.length} archivos de test`, 4);
    testFiles.slice(0, 10).forEach(file => {
      print(colors.white, `📄 ${file}`, 6);
    });
    if (testFiles.length > 10) {
      print(colors.dim, `... y ${testFiles.length - 10} más`, 6);
    }
  } else {
    print(colors.red, '❌ No se encontraron archivos de test', 4);
  }
  
  results.testFiles = testFiles.length;
  
  return results;
}

// 5. ANÁLISIS DE SEGURIDAD
async function analyzeSecurity() {
  separator('🔒 ANÁLISIS DE SEGURIDAD');
  
  const results = {};
  
  // Verificar archivos de configuración sensibles
  print(colors.yellow, '🔐 Verificando archivos sensibles:', 2);
  const sensitiveFiles = ['.env', 'backend/.env', 'config.json', 'secrets.json'];
  const exposedFiles = [];
  
  for (const file of sensitiveFiles) {
    if (fs.existsSync(file)) {
      print(colors.yellow, `⚠️ ${file} - PRESENTE (verificar .gitignore)`, 4);
      exposedFiles.push(file);
    } else {
      print(colors.green, `✅ ${file} - NO EXPUESTO`, 4);
    }
  }
  
  // Verificar .gitignore
  print(colors.yellow, '\n📝 Verificando .gitignore:', 2);
  if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const protectedPatterns = ['.env', 'node_modules', '*.log', 'dist/', 'build/'];
    let protectedCount = 0;
    
    for (const pattern of protectedPatterns) {
      if (gitignore.includes(pattern)) {
        print(colors.green, `✅ ${pattern} protegido`, 4);
        protectedCount++;
      } else {
        print(colors.red, `❌ ${pattern} NO protegido`, 4);
      }
    }
    
    results.gitignore = { score: protectedCount, total: protectedPatterns.length };
  } else {
    print(colors.red, '❌ .gitignore no encontrado', 4);
    results.gitignore = { score: 0, total: 5 };
  }
  
  results.exposedFiles = exposedFiles.length;
  
  return results;
}

// 6. ANÁLISIS DE RENDIMIENTO
async function analyzePerformance() {
  separator('⚡ ANÁLISIS DE RENDIMIENTO');
  
  const results = {};
  
  // Verificar tamaño de archivos
  print(colors.yellow, '📏 Analizando tamaño de archivos:', 2);
  
  try {
    // Verificar package-lock.json
    if (fs.existsSync('package-lock.json')) {
      const stats = fs.statSync('package-lock.json');
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      print(colors.white, `📦 package-lock.json: ${sizeMB} MB`, 4);
    }
    
    // Verificar base de datos
    if (fs.existsSync('data.db')) {
      const stats = fs.statSync('data.db');
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      print(colors.white, `🗄️ data.db: ${sizeMB} MB`, 4);
    }
    
    // Verificar node_modules si existe
    if (fs.existsSync('node_modules')) {
      const result = await safeExec('du -sh node_modules 2>/dev/null || echo "No disponible"', 'Calculando tamaño de node_modules');
      if (result.success) {
        print(colors.white, `📚 node_modules: ${result.stdout.trim().split('\t')[0]}`, 4);
      }
    }
    
    results.analyzed = true;
  } catch (error) {
    print(colors.red, '❌ Error analizando archivos', 4);
    results.analyzed = false;
  }
  
  return results;
}

// 7. EJECUCIÓN DE TESTS DISPONIBLES
async function runAvailableTests() {
  separator('🏃 EJECUCIÓN DE TESTS DISPONIBLES');
  
  const results = {};
  
  // Intentar ejecutar tests del backend
  print(colors.yellow, '🧪 Ejecutando tests del backend:', 2);
  if (fs.existsSync('backend/package.json')) {
    const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    if (backendPkg.scripts && backendPkg.scripts.test) {
      const result = await safeExec('cd backend && npm test', 'Tests del backend');
      if (result.success) {
        print(colors.green, '✅ Tests del backend ejecutados correctamente', 4);
        results.backend = 'success';
      } else {
        print(colors.red, '❌ Tests del backend fallaron', 4);
        results.backend = 'failed';
      }
    } else {
      print(colors.yellow, '⚠️ No hay script de test configurado en backend', 4);
      results.backend = 'no-config';
    }
  }
  
  // Intentar ejecutar tests del frontend
  print(colors.yellow, '\n🧪 Ejecutando tests del frontend:', 2);
  if (fs.existsSync('frontend/package.json')) {
    const frontendPkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
    if (frontendPkg.scripts && frontendPkg.scripts.test) {
      const result = await safeExec('cd frontend && npm test -- --run', 'Tests del frontend');
      if (result.success) {
        print(colors.green, '✅ Tests del frontend ejecutados correctamente', 4);
        results.frontend = 'success';
      } else {
        print(colors.red, '❌ Tests del frontend fallaron', 4);
        results.frontend = 'failed';
      }
    } else {
      print(colors.yellow, '⚠️ No hay script de test configurado en frontend', 4);
      results.frontend = 'no-config';
    }
  }
  
  return results;
}

// 8. GENERACIÓN DEL REPORTE FINAL
function generateFinalReport(results) {
  separator('📊 REPORTE TÉCNICO FINAL', '*');
  
  const timestamp = new Date().toLocaleString('es-ES');
  print(colors.cyan + colors.bold, `🕒 Generado: ${timestamp}`, 2);
  print(colors.cyan + colors.bold, `🏢 Proyecto: ISOFlow3 - Sistema de Gestión de Calidad`, 2);
  
  // Calcular puntuación general
  let totalScore = 0;
  let maxScore = 0;
  
  // Estructura del proyecto
  if (results.structure) {
    totalScore += results.structure.score;
    maxScore += results.structure.total;
  }
  
  // Backend
  if (results.backend) {
    totalScore += results.backend.structure.score + results.backend.dependencies.score;
    maxScore += results.backend.structure.total + results.backend.dependencies.total;
  }
  
  // Frontend
  if (results.frontend) {
    totalScore += results.frontend.structure.score + results.frontend.dependencies.score;
    maxScore += results.frontend.structure.total + results.frontend.dependencies.total;
  }
  
  // Seguridad
  if (results.security && results.security.gitignore) {
    totalScore += results.security.gitignore.score;
    maxScore += results.security.gitignore.total;
  }
  
  const overallPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  print(colors.white, '\n📈 PUNTUACIÓN GENERAL:', 2);
  print(colors.white, `   Puntos obtenidos: ${totalScore}/${maxScore}`, 4);
  
  if (overallPercentage >= 90) {
    print(colors.green + colors.bold, `   Estado: EXCELENTE (${overallPercentage}%)`, 4);
  } else if (overallPercentage >= 75) {
    print(colors.yellow + colors.bold, `   Estado: BUENO (${overallPercentage}%)`, 4);
  } else if (overallPercentage >= 60) {
    print(colors.yellow + colors.bold, `   Estado: REGULAR (${overallPercentage}%)`, 4);
  } else {
    print(colors.red + colors.bold, `   Estado: REQUIERE ATENCIÓN (${overallPercentage}%)`, 4);
  }
  
  // Recomendaciones
  print(colors.magenta + colors.bold, '\n💡 RECOMENDACIONES:', 2);
  
  if (results.structure && results.structure.percentage < 100) {
    print(colors.yellow, '• Completar estructura básica del proyecto', 4);
  }
  
  if (results.backend && (!results.backend.database || !results.backend.database.configured)) {
    print(colors.yellow, '• Configurar correctamente la base de datos', 4);
  }
  
  if (results.tests && results.tests.testFiles === 0) {
    print(colors.yellow, '• Implementar suite de tests automatizados', 4);
  }
  
  if (results.security && results.security.exposedFiles > 0) {
    print(colors.red, '• Revisar archivos sensibles expuestos', 4);
  }
  
  if (overallPercentage >= 90) {
    print(colors.green, '• El proyecto está en excelente estado técnico', 4);
  }
  
  // Información de contacto y próximos pasos
  print(colors.cyan + colors.bold, '\n🔄 PRÓXIMOS PASOS:', 2);
  print(colors.white, '1. Revisar las recomendaciones listadas arriba', 4);
  print(colors.white, '2. Ejecutar tests específicos si están disponibles', 4);
  print(colors.white, '3. Verificar el funcionamiento en ambiente de desarrollo', 4);
  print(colors.white, '4. Programar siguiente control técnico', 4);
  
  separator('fin del reporte', '=');
}

// FUNCIÓN PRINCIPAL
async function runTechnicalControl() {
  print(colors.cyan + colors.bold, '🚀 INICIANDO CONTROL TÉCNICO COMPLETO...\n');
  
  const results = {};
  
  try {
    // Ejecutar todos los análisis
    results.structure = await analyzeProjectStructure();
    results.backend = await analyzeBackend();
    results.frontend = await analyzeFrontend();
    results.tests = await analyzeTests();
    results.security = await analyzeSecurity();
    results.performance = await analyzePerformance();
    results.testExecution = await runAvailableTests();
    
    // Generar reporte final
    generateFinalReport(results);
    
  } catch (error) {
    print(colors.red + colors.bold, `\n❌ ERROR DURANTE EL CONTROL TÉCNICO:`);
    print(colors.red, error.message, 2);
    print(colors.yellow, '\n⚠️ Se generó un reporte parcial con la información disponible.');
    generateFinalReport(results);
  }
}

// Ejecutar el control técnico
if (import.meta.url === `file://${process.argv[1]}`) {
  runTechnicalControl()
    .then(() => {
      print(colors.green + colors.bold, '\n✅ Control técnico completado exitosamente!');
      process.exit(0);
    })
    .catch((error) => {
      print(colors.red + colors.bold, '\n❌ Error fatal en control técnico:');
      print(colors.red, error.message, 2);
      process.exit(1);
    });
}

export default runTechnicalControl;