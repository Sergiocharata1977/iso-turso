#!/usr/bin/env node

/**
 * Script de Control Técnico Automatizado
 * Ejecutar: node scripts/control-tecnico.js
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

// Función para imprimir con colores
function print(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

// Función para verificar archivos críticos
function checkCriticalFiles() {
  const criticalFiles = [
    'src/hooks/useQueryClient.jsx',
    'src/hooks/usePagination.js',
    'src/components/ui/Pagination.jsx',
    'src/lib/errorHandler.js',
    'src/hooks/useToastEffect.js',
    'src/hooks/useOptimization.js'
  ];

  print(colors.blue, '\n🔍 VERIFICANDO ARCHIVOS CRÍTICOS...');
  
  let missingFiles = [];
  
  criticalFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      print(colors.green, `✅ ${file}`);
    } else {
      print(colors.red, `❌ ${file} - FALTANTE`);
      missingFiles.push(file);
    }
  });

  return missingFiles.length === 0;
}

// Función para verificar dependencias
function checkDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    print(colors.red, '❌ package.json no encontrado');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = [
    '@tanstack/react-query',
    'react-hot-toast',
    'framer-motion',
    'lucide-react'
  ];

  print(colors.blue, '\n📦 VERIFICANDO DEPENDENCIAS...');
  
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

// Función para generar reporte
function generateReport(criticalFilesOk, dependenciesOk) {
  const date = new Date().toLocaleDateString('es-ES');
  
  print(colors.bold, '\n📊 REPORTE DE CONTROL TÉCNICO');
  print(colors.blue, `📅 Fecha: ${date}`);
  
  print(colors.bold, '\n📋 ESTADO GENERAL:');
  
  if (criticalFilesOk) {
    print(colors.green, '✅ Archivos críticos: OK');
  } else {
    print(colors.red, '❌ Archivos críticos: PROBLEMAS');
  }
  
  if (dependenciesOk) {
    print(colors.green, '✅ Dependencias: OK');
  } else {
    print(colors.red, '❌ Dependencias: PROBLEMAS');
  }
  
  print(colors.bold, '\n🎯 PRÓXIMOS PASOS:');
  
  if (!criticalFilesOk) {
    print(colors.yellow, '⚠️  Revisar archivos faltantes');
  }
  
  if (!dependenciesOk) {
    print(colors.yellow, '⚠️  Instalar dependencias faltantes');
  }
  
  if (criticalFilesOk && dependenciesOk) {
    print(colors.green, '✅ Continuar con desarrollo');
    print(colors.blue, '📝 Próximo: Control de UX/UI');
  }
  
  print(colors.bold, '\n📞 CONTACTO DE EMERGENCIA:');
  print(colors.blue, '🔧 Si hay problemas críticos, revisar logs y revertir cambios');
}

// Función principal
function main() {
  print(colors.bold, '🤖 AGENTE 1: CONTROL TÉCNICO');
  print(colors.blue, 'Iniciando verificación automática...\n');
  
  const criticalFilesOk = checkCriticalFiles();
  const dependenciesOk = checkDependencies();
  
  generateReport(criticalFilesOk, dependenciesOk);
  
  print(colors.bold, '\n🏁 Control técnico completado');
  
  if (!criticalFilesOk || !dependenciesOk) {
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
main(); 