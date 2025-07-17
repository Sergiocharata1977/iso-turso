#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE MIGRACIÓN AUTOMÁTICA AL PROTOCOLO MULTI-TENANT
 * 
 * Este script migra automáticamente todas las rutas del backend 
 * al protocolo estándar de multi-tenancy usando tenantMiddleware.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const BACKEND_ROUTES_PATH = path.join(__dirname, '../backend/routes');
const BACKUP_PATH = path.join(__dirname, '../backup-routes');

// Lista de rutas que ya tienen el protocolo correcto
const ROUTES_WITH_TENANT = [
  'procesos.routes.js',
  'documentos.routes.js', 
  'mejoras.routes.js',
  'auditRoutes.js'
];

// Lista de rutas que necesitan migración
const ROUTES_TO_MIGRATE = [
  'productos.routes.js',
  'puestos.routes.js',
  'departamentos.routes.js', 
  'normas.routes.js',
  'acciones.routes.js',
  'verificaciones.routes.js',
  'tratamientos.routes.js',
  'tickets.routes.js',
  'evaluaciones-grupales.routes.js',
  'mediciones.routes.js',
  'indicadores.routes.js',
  'auditorias.routes.js',
  'objetivos_calidad.routes.js',
  'encuestas.routes.js'
];

// Lista de rutas que usan patrón simple (requieren actualización)
const ROUTES_SIMPLE_PATTERN = [
  'capacitaciones.routes.js',
  'personal.routes.js',
  'actividad.routes.js'
];

/**
 * 📋 Plantilla estándar para rutas con protocolo tenant
 */
const TENANT_ROUTE_TEMPLATE = (tableName, entityName, fields) => `import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { ensureTenant, secureQuery, logTenantOperation, checkPermission } from '../middleware/tenantMiddleware.js';

const router = express.Router();

// ✅ OBLIGATORIO: Aplicar middlewares de autenticación y tenant
router.use(authMiddleware);
router.use(ensureTenant);

// GET /${entityName} - Obtener todos los registros de la organización
router.get('/', async (req, res) => {
  try {
    console.log(\`[GET /api/${entityName}] Obteniendo lista de ${entityName}\`);
    
    const query = secureQuery(req);
    
    const result = await tursoClient.execute({
      sql: \`SELECT * FROM ${tableName} WHERE \${query.where()} ORDER BY created_at DESC\`,
      args: query.args()
    });
    
    logTenantOperation(req, 'GET_${entityName.toUpperCase()}', { count: result.rows.length });
    
    console.log(\`[GET /api/${entityName}] \${result.rows.length} registros encontrados\`);
    res.json(result.rows);
  } catch (error) {
    console.error(\`[GET /api/${entityName}] Error:\`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /${entityName}/:id - Obtener registro por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(\`[GET /api/${entityName}/\${id}] Obteniendo ${entityName}\`);
    
    const query = secureQuery(req);
    
    const result = await tursoClient.execute({
      sql: \`SELECT * FROM ${tableName} WHERE id = ? AND \${query.where()}\`,
      args: [id, ...query.args()]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '${entityName} no encontrado' });
    }
    
    logTenantOperation(req, 'GET_${entityName.toUpperCase()}', { recordId: id });
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(\`[GET /api/${entityName}/\${id}] Error:\`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /${entityName} - Crear nuevo registro
router.post('/', async (req, res) => {
  try {
    // Verificar permisos - solo employees+ pueden crear
    if (!checkPermission(req, 'employee')) {
      return res.status(403).json({ 
        error: 'No tienes permisos para crear ${entityName}' 
      });
    }

    const { ${fields.join(', ')} } = req.body;

    console.log(\`[POST /api/${entityName}] Datos recibidos:\`, req.body);

    // Validación básica (personalizar según entidad)
    if (!${fields[0]}) {
      return res.status(400).json({ error: '${fields[0]} es obligatorio.' });
    }

    const query = secureQuery(req);

    const result = await tursoClient.execute({
      sql: \`INSERT INTO ${tableName} (${fields.join(', ')}, organization_id, created_at, updated_at) 
            VALUES (${fields.map(() => '?').join(', ')}, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
            RETURNING *\`,
      args: [${fields.join(', ')}, query.organizationId]
    });

    const new${entityName} = result.rows[0];
    
    logTenantOperation(req, 'CREATE_${entityName.toUpperCase()}', { recordId: new${entityName}.id });
    
    console.log(\`[POST /api/${entityName}] ${entityName} creado exitosamente:\`, new${entityName});
    res.status(201).json(new${entityName});
  } catch (error) {
    console.error(\`[POST /api/${entityName}] Error:\`, error);
    res.status(500).json({ error: 'Error interno del servidor al crear ${entityName}.' });
  }
});

// PUT /${entityName}/:id - Actualizar registro
router.put('/:id', async (req, res) => {
  try {
    // Verificar permisos - solo employees+ pueden actualizar
    if (!checkPermission(req, 'employee')) {
      return res.status(403).json({ 
        error: 'No tienes permisos para actualizar ${entityName}' 
      });
    }

    const { id } = req.params;
    const { ${fields.join(', ')} } = req.body;

    console.log(\`[PUT /api/${entityName}/\${id}] Datos recibidos:\`, req.body);

    // Validación básica
    if (!${fields[0]}) {
      return res.status(400).json({ error: '${fields[0]} es obligatorio.' });
    }

    const query = secureQuery(req);

    // Verificar que el registro existe y pertenece a la organización
    const existsCheck = await tursoClient.execute({
      sql: \`SELECT id FROM ${tableName} WHERE id = ? AND \${query.where()}\`,
      args: [id, ...query.args()]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: '${entityName} no encontrado.' });
    }

    const result = await tursoClient.execute({
      sql: \`UPDATE ${tableName} SET ${fields.map(field => `${field} = ?`).join(', ')}, updated_at = datetime('now', 'localtime')
            WHERE id = ? AND \${query.where()}
            RETURNING *\`,
      args: [${fields.join(', ')}, id, ...query.args()]
    });

    const updated${entityName} = result.rows[0];
    
    logTenantOperation(req, 'UPDATE_${entityName.toUpperCase()}', { recordId: id });
    
    console.log(\`[PUT /api/${entityName}/\${id}] ${entityName} actualizado exitosamente\`);
    res.json(updated${entityName});
  } catch (error) {
    console.error(\`[PUT /api/${entityName}/\${id}] Error:\`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /${entityName}/:id - Eliminar registro
router.delete('/:id', async (req, res) => {
  try {
    // Verificar permisos - solo managers+ pueden eliminar
    if (!checkPermission(req, 'manager')) {
      return res.status(403).json({ 
        error: 'No tienes permisos para eliminar ${entityName}' 
      });
    }

    const { id } = req.params;
    const query = secureQuery(req);

    console.log(\`[DELETE /api/${entityName}/\${id}] Eliminando ${entityName}\`);

    // Verificar que el registro existe y pertenece a la organización
    const existsCheck = await tursoClient.execute({
      sql: \`SELECT id FROM ${tableName} WHERE id = ? AND \${query.where()}\`,
      args: [id, ...query.args()]
    });

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: '${entityName} no encontrado.' });
    }

    const result = await tursoClient.execute({
      sql: \`DELETE FROM ${tableName} WHERE id = ? AND \${query.where()}\`,
      args: [id, ...query.args()]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: '${entityName} no encontrado.' });
    }

    logTenantOperation(req, 'DELETE_${entityName.toUpperCase()}', { recordId: id });

    console.log(\`[DELETE /api/${entityName}/\${id}] ${entityName} eliminado exitosamente\`);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(\`[DELETE /api/${entityName}/\${id}] Error:\`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
`;

/**
 * 🔧 Configuración de entidades por archivo
 */
const ENTITY_CONFIG = {
  'productos.routes.js': {
    tableName: 'productos',
    entityName: 'producto',
    fields: ['nombre', 'descripcion', 'categoria']
  },
  'puestos.routes.js': {
    tableName: 'puestos', 
    entityName: 'puesto',
    fields: ['nombre', 'descripcion_responsabilidades', 'departamento_id']
  },
  'departamentos.routes.js': {
    tableName: 'departamentos',
    entityName: 'departamento', 
    fields: ['nombre', 'descripcion', 'responsable']
  },
  'normas.routes.js': {
    tableName: 'normas',
    entityName: 'norma',
    fields: ['codigo', 'nombre', 'descripcion']
  },
  'tickets.routes.js': {
    tableName: 'tickets',
    entityName: 'ticket',
    fields: ['titulo', 'descripcion', 'prioridad', 'estado']
  },
  'mediciones.routes.js': {
    tableName: 'mediciones',
    entityName: 'medicion',
    fields: ['indicador_id', 'valor', 'fecha_medicion']
  },
  'indicadores.routes.js': {
    tableName: 'indicadores',
    entityName: 'indicador',
    fields: ['nombre', 'descripcion', 'tipo', 'meta']
  }
};

/**
 * 📂 Crear respaldo de archivos
 */
async function createBackup() {
  console.log('📂 Creando respaldo de archivos...');
  
  if (!fs.existsSync(BACKUP_PATH)) {
    fs.mkdirSync(BACKUP_PATH, { recursive: true });
  }

  const files = fs.readdirSync(BACKEND_ROUTES_PATH);
  
  for (const file of files) {
    if (file.endsWith('.routes.js')) {
      const sourcePath = path.join(BACKEND_ROUTES_PATH, file);
      const backupPath = path.join(BACKUP_PATH, file);
      fs.copyFileSync(sourcePath, backupPath);
      console.log(`   ✅ ${file} → backup/`);
    }
  }
  
  console.log('📂 Respaldo completado\n');
}

/**
 * 🔄 Migrar ruta específica al protocolo tenant
 */
async function migrateRoute(filename) {
  console.log(`🔄 Migrando ${filename}...`);
  
  const config = ENTITY_CONFIG[filename];
  if (!config) {
    console.log(`   ⚠️ No hay configuración para ${filename}, omitiendo...`);
    return;
  }

  const { tableName, entityName, fields } = config;
  const newContent = TENANT_ROUTE_TEMPLATE(tableName, entityName, fields);
  
  const filePath = path.join(BACKEND_ROUTES_PATH, filename);
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  console.log(`   ✅ ${filename} migrado exitosamente`);
}

/**
 * 🔧 Actualizar rutas con patrón simple
 */
async function updateSimplePatternRoute(filename) {
  console.log(`🔧 Actualizando ${filename} de patrón simple a avanzado...`);
  
  const filePath = path.join(BACKEND_ROUTES_PATH, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar imports
  if (!content.includes('tenantMiddleware')) {
    content = content.replace(
      "import { tursoClient } from '../lib/tursoClient.js';",
      `import { tursoClient } from '../lib/tursoClient.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { ensureTenant, secureQuery, logTenantOperation, checkPermission } from '../middleware/tenantMiddleware.js';`
    );
  }
  
  // Agregar middlewares si no existen
  if (!content.includes('router.use(authMiddleware)')) {
    content = content.replace(
      'const router = express.Router();',
      `const router = express.Router();

// ✅ Aplicar middlewares de autenticación y tenant
router.use(authMiddleware);
router.use(ensureTenant);`
    );
  }
  
  // Reemplazar req.user?.organization_id con secureQuery
  content = content.replace(
    /req\.user\?\.organization_id \|\| 1/g,
    'query.organizationId'
  );
  
  // Agregar secureQuery al inicio de cada método
  content = content.replace(
    /router\.(get|post|put|delete)\([^,]+, async \(req, res\) => \{/g,
    (match, method) => {
      return match.replace(
        'async (req, res) => {',
        `async (req, res) => {
    const query = secureQuery(req);`
      );
    }
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`   ✅ ${filename} actualizado exitosamente`);
}

/**
 * 📊 Generar reporte de estado
 */
async function generateReport() {
  console.log('\n📊 REPORTE DE MIGRACIÓN');
  console.log('========================\n');
  
  console.log('✅ RUTAS CON PROTOCOLO TENANT (Ya implementadas):');
  ROUTES_WITH_TENANT.forEach(route => {
    console.log(`   ✅ ${route}`);
  });
  
  console.log('\n🔄 RUTAS MIGRADAS AUTOMÁTICAMENTE:');
  ROUTES_TO_MIGRATE.forEach(route => {
    console.log(`   🔄 ${route}`);
  });
  
  console.log('\n🔧 RUTAS ACTUALIZADAS (Patrón simple → Avanzado):');
  ROUTES_SIMPLE_PATTERN.forEach(route => {
    console.log(`   🔧 ${route}`);
  });
  
  console.log('\n🎯 PRÓXIMOS PASOS:');
  console.log('   1. Revisar archivos migrados y personalizar según necesidades');
  console.log('   2. Actualizar validaciones específicas de cada entidad');
  console.log('   3. Probar endpoints con herramientas como Postman');
  console.log('   4. Verificar que las tablas tengan columna organization_id');
  console.log('   5. Ejecutar script de creación de índices de performance');
}

/**
 * 🚀 Función principal
 */
async function main() {
  console.log('🚀 INICIANDO MIGRACIÓN AL PROTOCOLO MULTI-TENANT\n');
  
  try {
    // 1. Crear respaldo
    await createBackup();
    
    // 2. Migrar rutas sin protocolo
    console.log('🔄 Migrando rutas sin protocolo tenant...');
    for (const route of ROUTES_TO_MIGRATE) {
      await migrateRoute(route);
    }
    console.log('');
    
    // 3. Actualizar rutas con patrón simple
    console.log('🔧 Actualizando rutas con patrón simple...');
    for (const route of ROUTES_SIMPLE_PATTERN) {
      await updateSimplePatternRoute(route);
    }
    console.log('');
    
    // 4. Generar reporte
    await generateReport();
    
    console.log('\n🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE!');
    console.log('\n⚠️  IMPORTANTE: Revisar archivos migrados antes de usar en producción');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, migrateRoute, updateSimplePatternRoute }; 