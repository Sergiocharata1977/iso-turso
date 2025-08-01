#!/usr/bin/env node

/**
 * Agente de Cursor para ISOFlow3
 * Script simple para controlar funcionalidades principales
 */

import { tursoClient } from '../backend/lib/tursoClient.js';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = (color, message) => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Verificar funcionalidades críticas
const checkCriticalFunctions = async () => {
  log('cyan', '\n🔍 VERIFICANDO FUNCIONALIDADES CRÍTICAS...');

  const checks = [
    {
      name: 'Competencias',
      sql: 'SELECT COUNT(*) as count FROM competencias WHERE organization_id = 2',
      expected: '> 0'
    },
    {
      name: 'Capacitaciones',
      sql: 'SELECT COUNT(*) as count FROM capacitaciones WHERE organization_id = 2',
      expected: '> 0'
    },
    {
      name: 'Documentos',
      sql: 'SELECT COUNT(*) as count FROM documentos WHERE organization_id = 2',
      expected: '>= 0'
    },
    {
      name: 'Normas (Globales)',
      sql: 'SELECT COUNT(*) as count FROM normas WHERE organization_id = 0',
      expected: '> 0'
    },
    {
      name: 'Procesos',
      sql: 'SELECT COUNT(*) as count FROM procesos WHERE organization_id = 2',
      expected: '>= 0'
    },
    {
      name: 'Objetivos de Calidad',
      sql: 'SELECT COUNT(*) as count FROM objetivos_calidad WHERE organization_id = 2',
      expected: '>= 0'
    },
    {
      name: 'Indicadores',
      sql: 'SELECT COUNT(*) as count FROM indicadores WHERE organization_id = 2',
      expected: '>= 0'
    },
    {
      name: 'Hallazgos',
      sql: 'SELECT COUNT(*) as count FROM hallazgos WHERE organization_id = 2',
      expected: '>= 0'
    }
  ];

  let successCount = 0;
  let totalCount = checks.length;

  for (const check of checks) {
    try {
      const result = await tursoClient.execute({
        sql: check.sql,
        args: []
      });
      const count = result.rows[0]?.count || 0;
      
      if (check.expected === '> 0' && count > 0) {
        log('green', `  ✅ ${check.name}: ${count} registros`);
        successCount++;
      } else if (check.expected === '>= 0') {
        log('green', `  ✅ ${check.name}: ${count} registros`);
        successCount++;
      } else {
        log('yellow', `  ⚠️  ${check.name}: ${count} registros (esperado: ${check.expected})`);
      }
    } catch (error) {
      log('red', `  ❌ ${check.name}: Error - ${error.message}`);
    }
  }

  log('yellow', `\n📊 Resumen: ${successCount}/${totalCount} funcionalidades OK`);
  return successCount === totalCount;
};

// Verificar estructura de base de datos
const checkDatabaseStructure = async () => {
  log('cyan', '\n🗄️ VERIFICANDO ESTRUCTURA DE BASE DE DATOS...');

  const tables = [
    'usuarios', 'organizations', 'departamentos', 'puestos', 
    'personal', 'capacitaciones', 'competencias', 'documentos',
    'normas', 'procesos', 'objetivos_calidad', 'indicadores',
    'mediciones', 'hallazgos', 'acciones'
  ];

  let successCount = 0;
  let totalCount = tables.length;

  for (const table of tables) {
    try {
      const result = await tursoClient.execute({
        sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`,
        args: []
      });
      
      if (result.rows.length > 0) {
        log('green', `  ✅ Tabla ${table}: Existe`);
        successCount++;
      } else {
        log('red', `  ❌ Tabla ${table}: No existe`);
      }
    } catch (error) {
      log('red', `  ❌ Tabla ${table}: Error - ${error.message}`);
    }
  }

  log('yellow', `\n📊 Estructura: ${successCount}/${totalCount} tablas OK`);
  return successCount === totalCount;
};

// Función principal
const main = async () => {
  log('blue', '\n🤖 AGENTE DE CURSOR - ISOFlow3');
  log('blue', '================================');

  try {
    // Verificar estructura
    const structureOK = await checkDatabaseStructure();
    
    // Verificar funcionalidades
    const functionsOK = await checkCriticalFunctions();

    // Reporte final
    log('blue', '\n📋 REPORTE FINAL:');
    log('blue', '==================');
    
    if (structureOK && functionsOK) {
      log('green', '✅ Sistema completamente funcional');
      log('green', '🎯 Todas las funcionalidades críticas operativas');
    } else if (structureOK) {
      log('yellow', '⚠️  Estructura OK, algunas funcionalidades necesitan datos');
      log('yellow', '💡 Ejecuta scripts de datos de muestra');
    } else {
      log('red', '❌ Problemas en estructura de base de datos');
      log('red', '🔧 Revisa migraciones y scripts de inicialización');
    }

  } catch (error) {
    log('red', `\n❌ Error en agente: ${error.message}`);
    process.exit(1);
  }
};

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as agenteCursor }; 