import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function auditDatabaseStructure() {
  try {
    console.log('🔍 AUDITORÍA COMPLETA DE LA BASE DE DATOS ISOFLOW3');
    console.log('='.repeat(60));
    
    // 1. Obtener todas las tablas
    console.log('\n📊 1. LISTADO DE TODAS LAS TABLAS:');
    const tablesResult = await db.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    });
    
    const tables = tablesResult.rows.map(row => row.name);
    console.log(`Total de tablas encontradas: ${tables.length}`);
    console.log(tables.map((table, index) => `${index + 1}. ${table}`).join('\n'));
    
    // 2. Estructura detallada de cada tabla
    console.log('\n🏗️ 2. ESTRUCTURA DETALLADA DE CADA TABLA:');
    console.log('='.repeat(60));
    
    for (const tableName of tables) {
      console.log(`\n📋 TABLA: ${tableName.toUpperCase()}`);
      console.log('-'.repeat(40));
      
      // Obtener estructura de la tabla
      const structureResult = await db.execute({
        sql: `PRAGMA table_info(${tableName})`
      });
      
      console.log('COLUMNAS:');
      structureResult.rows.forEach((col, index) => {
        const isPrimary = col.pk ? ' (PRIMARY KEY)' : '';
        const isNotNull = col.notnull ? ' NOT NULL' : '';
        const defaultVal = col.dflt_value ? ` DEFAULT ${col.dflt_value}` : '';
        console.log(`  ${index + 1}. ${col.name} - ${col.type}${isPrimary}${isNotNull}${defaultVal}`);
      });
      
      // Contar registros
      try {
        const countResult = await db.execute({
          sql: `SELECT COUNT(*) as count FROM ${tableName}`
        });
        console.log(`REGISTROS: ${countResult.rows[0].count}`);
      } catch (error) {
        console.log('REGISTROS: Error al contar');
      }
      
      // Mostrar algunos datos de ejemplo si tiene pocos registros
      try {
        const sampleResult = await db.execute({
          sql: `SELECT * FROM ${tableName} LIMIT 3`
        });
        if (sampleResult.rows.length > 0) {
          console.log('DATOS DE EJEMPLO:');
          sampleResult.rows.forEach((row, index) => {
            console.log(`  Registro ${index + 1}:`, JSON.stringify(row, null, 2));
          });
        }
      } catch (error) {
        console.log('DATOS DE EJEMPLO: Error al obtener muestras');
      }
    }
    
    // 3. Análisis de tablas clave según estructura.md
    console.log('\n🎯 3. ANÁLISIS DE TABLAS CLAVE (según estructura.md):');
    console.log('='.repeat(60));
    
    const expectedTables = [
      'departamentos',
      'personal', 
      'puestos',
      'auditorias',
      'procesos',
      'documentos',
      'objetivos',
      'indicadores',
      'mediciones',
      'acciones',
      'hallazgos',
      'capacitaciones',
      'evaluaciones',
      'usuarios',
      'organizations',
      'organization_features'
    ];
    
    console.log('\n✅ TABLAS PRESENTES:');
    const presentTables = expectedTables.filter(table => tables.includes(table));
    presentTables.forEach(table => console.log(`  ✓ ${table}`));
    
    console.log('\n❌ TABLAS FALTANTES:');
    const missingTables = expectedTables.filter(table => !tables.includes(table));
    if (missingTables.length > 0) {
      missingTables.forEach(table => console.log(`  ✗ ${table}`));
    } else {
      console.log('  Ninguna tabla faltante de las esperadas');
    }
    
    console.log('\n🔍 TABLAS ADICIONALES (no documentadas):');
    const extraTables = tables.filter(table => !expectedTables.includes(table) && !table.startsWith('sqlite_'));
    if (extraTables.length > 0) {
      extraTables.forEach(table => console.log(`  ? ${table}`));
    } else {
      console.log('  No hay tablas adicionales');
    }
    
    // 4. Verificación de relaciones organization_id
    console.log('\n🏢 4. VERIFICACIÓN DE MULTI-TENANCY (organization_id):');
    console.log('='.repeat(60));
    
    for (const tableName of tables) {
      try {
        const structureResult = await db.execute({
          sql: `PRAGMA table_info(${tableName})`
        });
        
        const hasOrgId = structureResult.rows.some(col => col.name === 'organization_id');
        if (hasOrgId) {
          console.log(`✓ ${tableName} - tiene organization_id`);
        } else if (!['organizations', 'organization_features', 'sqlite_sequence'].includes(tableName)) {
          console.log(`⚠️  ${tableName} - NO tiene organization_id`);
        }
      } catch (error) {
        console.log(`❌ ${tableName} - Error al verificar`);
      }
    }
    
    // 5. Resumen final
    console.log('\n📋 5. RESUMEN EJECUTIVO:');
    console.log('='.repeat(60));
    console.log(`Total de tablas: ${tables.length}`);
    console.log(`Tablas esperadas presentes: ${presentTables.length}/${expectedTables.length}`);
    console.log(`Tablas faltantes: ${missingTables.length}`);
    console.log(`Tablas adicionales: ${extraTables.length}`);
    
    if (missingTables.length > 0) {
      console.log('\n⚠️  ACCIÓN REQUERIDA: Hay tablas faltantes que podrían afectar el funcionamiento');
    }
    
    if (extraTables.length > 0) {
      console.log('\n🔍 REVISAR: Hay tablas adicionales que no están documentadas');
    }
    
    console.log('\n✅ Auditoría completada');
    
  } catch (error) {
    console.error('❌ Error durante la auditoría:', error.message);
  } finally {
    await db.close();
  }
}

auditDatabaseStructure();
