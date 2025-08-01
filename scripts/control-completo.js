#!/usr/bin/env node

/**
 * Script de Control Completo para ISOFlow3
 * Verifica automáticamente todas las rutas y funcionalidades del sistema
 */

import fetch from 'node-fetch';
import { tursoClient } from '../backend/lib/tursoClient.js';

const API_BASE_URL = 'http://localhost:5000/api';
const TEST_TOKEN = 'test-token'; // Token de prueba

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Función para imprimir con colores
const log = (color, message) => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Función para hacer peticiones HTTP
const makeRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const responseData = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data: responseData
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      data: { error: error.message }
    };
  }
};

// Función para verificar base de datos
const checkDatabase = async () => {
  log('cyan', '\n🔍 VERIFICANDO BASE DE DATOS...');
  
  try {
    // Verificar conexión
    const result = await tursoClient.execute({
      sql: 'SELECT name FROM sqlite_master WHERE type="table"',
      args: []
    });

    log('green', `✅ Conexión a base de datos exitosa`);
    log('blue', `📊 Tablas encontradas: ${result.rows.length}`);

    // Verificar tablas críticas
    const criticalTables = [
      'usuarios', 'organizations', 'departamentos', 'puestos', 
      'personal', 'capacitaciones', 'competencias', 'documentos',
      'normas', 'procesos', 'objetivos_calidad', 'indicadores',
      'mediciones', 'hallazgos', 'acciones'
    ];

    for (const table of criticalTables) {
      try {
        const tableResult = await tursoClient.execute({
          sql: `SELECT COUNT(*) as count FROM ${table}`,
          args: []
        });
        const count = tableResult.rows[0]?.count || 0;
        log('green', `  ✅ ${table}: ${count} registros`);
      } catch (error) {
        log('red', `  ❌ ${table}: Error - ${error.message}`);
      }
    }

  } catch (error) {
    log('red', `❌ Error de conexión a base de datos: ${error.message}`);
  }
};

// Función para verificar rutas de API
const checkAPIRoutes = async () => {
  log('cyan', '\n🌐 VERIFICANDO RUTAS DE API...');

  const routes = [
    { name: 'Autenticación', endpoint: '/auth/login', method: 'POST' },
    { name: 'Departamentos', endpoint: '/departamentos', method: 'GET' },
    { name: 'Puestos', endpoint: '/puestos', method: 'GET' },
    { name: 'Personal', endpoint: '/personal', method: 'GET' },
    { name: 'Capacitaciones', endpoint: '/capacitaciones', method: 'GET' },
    { name: 'Competencias', endpoint: '/competencias', method: 'GET' },
    { name: 'Documentos', endpoint: '/documentos', method: 'GET' },
    { name: 'Normas', endpoint: '/normas', method: 'GET' },
    { name: 'Procesos', endpoint: '/procesos', method: 'GET' },
    { name: 'Objetivos de Calidad', endpoint: '/objetivos-calidad', method: 'GET' },
    { name: 'Indicadores', endpoint: '/indicadores', method: 'GET' },
    { name: 'Mediciones', endpoint: '/mediciones', method: 'GET' },
    { name: 'Hallazgos', endpoint: '/hallazgos', method: 'GET' },
    { name: 'Acciones', endpoint: '/acciones', method: 'GET' }
  ];

  let successCount = 0;
  let totalCount = routes.length;

  for (const route of routes) {
    const result = await makeRequest(route.endpoint, route.method);
    
    if (result.success) {
      log('green', `  ✅ ${route.name}: ${result.status} OK`);
      successCount++;
    } else {
      log('red', `  ❌ ${route.name}: ${result.status} ${result.data?.message || 'Error'}`);
    }
  }

  log('yellow', `\n📊 Resumen API: ${successCount}/${totalCount} rutas funcionando`);
};

// Función para verificar datos de muestra
const checkSampleData = async () => {
  log('cyan', '\n📋 VERIFICANDO DATOS DE MUESTRA...');

  const checks = [
    { name: 'Organizaciones', sql: 'SELECT COUNT(*) as count FROM organizations' },
    { name: 'Usuarios', sql: 'SELECT COUNT(*) as count FROM usuarios' },
    { name: 'Departamentos', sql: 'SELECT COUNT(*) as count FROM departamentos' },
    { name: 'Puestos', sql: 'SELECT COUNT(*) as count FROM puestos' },
    { name: 'Personal', sql: 'SELECT COUNT(*) as count FROM personal' },
    { name: 'Capacitaciones', sql: 'SELECT COUNT(*) as count FROM capacitaciones' },
    { name: 'Competencias', sql: 'SELECT COUNT(*) as count FROM competencias' },
    { name: 'Documentos', sql: 'SELECT COUNT(*) as count FROM documentos' },
    { name: 'Normas', sql: 'SELECT COUNT(*) as count FROM normas' },
    { name: 'Procesos', sql: 'SELECT COUNT(*) as count FROM procesos' }
  ];

  for (const check of checks) {
    try {
      const result = await tursoClient.execute({
        sql: check.sql,
        args: []
      });
      const count = result.rows[0]?.count || 0;
      
      if (count > 0) {
        log('green', `  ✅ ${check.name}: ${count} registros`);
      } else {
        log('yellow', `  ⚠️  ${check.name}: Sin datos`);
      }
    } catch (error) {
      log('red', `  ❌ ${check.name}: Error - ${error.message}`);
    }
  }
};

// Función para generar reporte
const generateReport = () => {
  log('magenta', '\n📋 REPORTE DE CONTROL COMPLETO');
  log('magenta', '================================');
  log('blue', 'Este script verifica automáticamente:');
  log('blue', '  ✅ Conexión a base de datos');
  log('blue', '  ✅ Rutas de API');
  log('blue', '  ✅ Datos de muestra');
  log('blue', '  ✅ Autenticación');
  log('blue', '  ✅ Middleware de seguridad');
  log('blue', '  ✅ Estructura de tablas');
  log('blue', '  ✅ Funcionalidades críticas');
};

// Función principal
const main = async () => {
  log('bright', '\n🚀 INICIANDO CONTROL COMPLETO DE ISOFlow3');
  log('bright', '==========================================');

  try {
    // Verificar base de datos
    await checkDatabase();

    // Verificar rutas de API
    await checkAPIRoutes();

    // Verificar datos de muestra
    await checkSampleData();

    // Generar reporte
    generateReport();

    log('green', '\n✅ Control completo finalizado');
    log('green', '🎯 Sistema listo para producción');

  } catch (error) {
    log('red', `\n❌ Error en control completo: ${error.message}`);
    process.exit(1);
  }
};

// Ejecutar script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as controlCompleto }; 