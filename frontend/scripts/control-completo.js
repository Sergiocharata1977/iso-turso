#!/usr/bin/env node

/**
 * Script de Control Completo - Todos los Agentes
 * Ejecutar: node scripts/control-completo.js
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
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Función para imprimir con colores
function print(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

// Función para generar timestamp
function getTimestamp() {
  return new Date().toLocaleString('es-ES');
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

  print(colors.blue, '\n🔍 AGENTE 1: VERIFICANDO ARCHIVOS CRÍTICOS...');
  
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

// Función para verificar componentes UI
function checkUIComponents() {
  const uiComponents = [
    'src/components/ui/Pagination.jsx',
    'src/components/ui/Skeleton.jsx',
    'src/components/ui/button.jsx',
    'src/components/ui/input.jsx',
    'src/components/ui/select.jsx'
  ];

  print(colors.magenta, '\n🎨 AGENTE 2: VERIFICANDO COMPONENTES UI...');
  
  let missingComponents = [];
  
  uiComponents.forEach(component => {
    const componentPath = path.join(process.cwd(), component);
    if (fs.existsSync(componentPath)) {
      print(colors.green, `✅ ${component}`);
    } else {
      print(colors.red, `❌ ${component} - FALTANTE`);
      missingComponents.push(component);
    }
  });

  return missingComponents.length === 0;
}

// Función para verificar seguridad
function checkSecurity() {
  const securityFiles = [
    'src/lib/errorHandler.js',
    'src/hooks/useToastEffect.js'
  ];

  print(colors.cyan, '\n🛡️ AGENTE 3: VERIFICANDO SEGURIDAD...');
  
  let missingSecurity = [];
  
  securityFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      print(colors.green, `✅ ${file}`);
    } else {
      print(colors.red, `❌ ${file} - FALTANTE`);
      missingSecurity.push(file);
    }
  });

  return missingSecurity.length === 0;
}

// Función para generar reporte completo
function generateCompleteReport(agent1Ok, agent2Ok, agent3Ok) {
  const date = getTimestamp();
  
  print(colors.bold, '\n📊 REPORTE COMPLETO DE CONTROL');
  print(colors.blue, `📅 Fecha: ${date}`);
  
  print(colors.bold, '\n🤖 ESTADO DE AGENTES:');
  
  if (agent1Ok) {
    print(colors.green, '✅ Agente 1 (Control Técnico): OK');
  } else {
    print(colors.red, '❌ Agente 1 (Control Técnico): PROBLEMAS');
  }
  
  if (agent2Ok) {
    print(colors.green, '✅ Agente 2 (Control UX/UI): OK');
  } else {
    print(colors.red, '❌ Agente 2 (Control UX/UI): PROBLEMAS');
  }
  
  if (agent3Ok) {
    print(colors.green, '✅ Agente 3 (Control Seguridad): OK');
  } else {
    print(colors.red, '❌ Agente 3 (Control Seguridad): PROBLEMAS');
  }
  
  print(colors.bold, '\n📈 MÉTRICAS GENERALES:');
  
  const totalAgents = 3;
  const workingAgents = [agent1Ok, agent2Ok, agent3Ok].filter(Boolean).length;
  const percentage = Math.round((workingAgents / totalAgents) * 100);
  
  print(colors.blue, `📊 Agentes funcionando: ${workingAgents}/${totalAgents} (${percentage}%)`);
  
  if (percentage === 100) {
    print(colors.green, '🎉 ¡Todos los agentes funcionando correctamente!');
  } else if (percentage >= 66) {
    print(colors.yellow, '⚠️  Mayoría de agentes funcionando, revisar los que fallan');
  } else {
    print(colors.red, '🚨 Problemas críticos detectados, revisar inmediatamente');
  }
  
  print(colors.bold, '\n🎯 PRÓXIMOS PASOS:');
  
  if (!agent1Ok) {
    print(colors.yellow, '⚠️  Revisar archivos críticos y dependencias');
  }
  
  if (!agent2Ok) {
    print(colors.yellow, '⚠️  Implementar componentes UI faltantes');
  }
  
  if (!agent3Ok) {
    print(colors.yellow, '⚠️  Revisar archivos de seguridad');
  }
  
  if (agent1Ok && agent2Ok && agent3Ok) {
    print(colors.green, '✅ Continuar con desarrollo normal');
    print(colors.blue, '📝 Próximo: Implementar funcionalidades avanzadas');
  }
  
  print(colors.bold, '\n📞 CONTACTO DE EMERGENCIA:');
  print(colors.blue, '🔧 Si hay problemas críticos, revisar logs y revertir cambios');
}

// Función principal
function main() {
  print(colors.bold, '🤖 CONTROL COMPLETO - TODOS LOS AGENTES');
  print(colors.blue, 'Iniciando verificación automática de todos los agentes...\n');
  
  const agent1Ok = checkCriticalFiles() && checkDependencies();
  const agent2Ok = checkUIComponents();
  const agent3Ok = checkSecurity();
  
  generateCompleteReport(agent1Ok, agent2Ok, agent3Ok);
  
  print(colors.bold, '\n🏁 Control completo finalizado');
  
  if (!agent1Ok || !agent2Ok || !agent3Ok) {
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
main(); 