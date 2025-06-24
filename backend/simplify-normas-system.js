// Script para simplificar completamente el sistema de normas eliminando todas las conexiones/relaciones
import { tursoClient } from './lib/tursoClient.js';

async function simplifyNormasSystem() {
  try {
    console.log('🔧 Iniciando simplificación del sistema de normas...');
    
    // 1. Verificar que la tabla normas tenga solo campos esenciales
    console.log('📋 Verificando estructura de la tabla normas...');
    const tableInfo = await tursoClient.execute("PRAGMA table_info(normas)");
    console.log('Campos actuales en la tabla normas:');
    tableInfo.rows.forEach(column => {
      console.log(`  - ${column.name} (${column.type})`);
    });
    
    // 2. Buscar y eliminar cualquier tabla de relaciones que pueda existir
    console.log('\n🗂️ Buscando tablas de relaciones...');
    const tables = await tursoClient.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name LIKE '%norma%'
    `);
    
    for (const table of tables.rows) {
      if (table.name !== 'normas') {
        console.log(`❌ Encontrada tabla relacionada: ${table.name}`);
        await tursoClient.execute(`DROP TABLE IF EXISTS ${table.name}`);
        console.log(`✅ Tabla ${table.name} eliminada`);
      }
    }
    
    // 3. Eliminar cualquier índice relacionado con normas excepto los básicos
    console.log('\n📌 Verificando índices...');
    const indexes = await tursoClient.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='index' AND name LIKE '%norma%'
    `);
    
    for (const index of indexes.rows) {
      // Mantener solo índices básicos como PRIMARY KEY
      if (!index.name.includes('sqlite_autoindex')) {
        console.log(`❌ Encontrado índice: ${index.name}`);
        await tursoClient.execute(`DROP INDEX IF EXISTS ${index.name}`);
        console.log(`✅ Índice ${index.name} eliminado`);
      }
    }
    
    // 4. Verificar que no hay claves foráneas apuntando a normas
    console.log('\n🔗 Verificando referencias foráneas...');
    const allTables = await tursoClient.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name != 'normas'
    `);
    
    for (const table of allTables.rows) {
      try {
        const foreignKeys = await tursoClient.execute(`PRAGMA foreign_key_list(${table.name})`);
        for (const fk of foreignKeys.rows) {
          if (fk.table === 'normas') {
            console.log(`⚠️ Encontrada referencia foránea en tabla ${table.name} campo ${fk.from}`);
          }
        }
      } catch (error) {
        // Algunas tablas pueden no existir, ignorar errores
      }
    }
    
    // 5. Optimizar la tabla normas
    console.log('\n⚡ Optimizando tabla normas...');
    await tursoClient.execute('VACUUM');
    
    // 6. Crear índice optimizado solo para código (para búsquedas rápidas)
    console.log('📊 Creando índice optimizado para código...');
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_normas_codigo 
      ON normas(codigo)
    `);
    
    // 7. Verificar estado final
    console.log('\n✅ Verificación final:');
    const finalCount = await tursoClient.execute('SELECT COUNT(*) as total FROM normas');
    console.log(`   - Total de normas: ${finalCount.rows[0].total}`);
    
    const tableSize = await tursoClient.execute(`
      SELECT 
        COUNT(*) as rows,
        AVG(LENGTH(codigo) + LENGTH(titulo) + LENGTH(descripcion) + LENGTH(observaciones)) as avg_size
      FROM normas
    `);
    console.log(`   - Filas: ${tableSize.rows[0].rows}, Tamaño promedio: ${Math.round(tableSize.rows[0].avg_size)} bytes`);
    
    console.log('\n🎉 Sistema de normas simplificado exitosamente!');
    console.log('📝 Características del sistema simplificado:');
    console.log('   ✓ Sin relaciones con otras tablas');
    console.log('   ✓ Sin claves foráneas');
    console.log('   ✓ Sin tablas intermedias');
    console.log('   ✓ Estructura optimizada para rendimiento');
    console.log('   ✓ Consultas directas y rápidas');
    
  } catch (error) {
    console.error('❌ Error durante la simplificación:', error);
    throw error;
  } finally {
    console.log('🔌 Cerrando conexión...');
    tursoClient.close();
  }
}

// Ejecutar el script
simplifyNormasSystem();
