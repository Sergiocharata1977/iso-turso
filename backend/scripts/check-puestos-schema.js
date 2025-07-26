import { tursoClient } from '../lib/tursoClient.js';

async function checkPuestosSchema() {
  try {
    console.log('🔍 Verificando estructura de tabla puestos...\n');
    
    const schemaResult = await tursoClient.execute({
      sql: 'PRAGMA table_info(puestos)'
    });
    
    console.log('📋 Estructura de tabla puestos:');
    schemaResult.rows.forEach(col => {
      console.log(`   - ${col.name} (${col.type})`);
    });
    
    console.log('\n🔍 Verificando datos de ejemplo...');
    const dataResult = await tursoClient.execute({
      sql: 'SELECT * FROM puestos LIMIT 1'
    });
    
    if (dataResult.rows.length > 0) {
      console.log('📊 Datos de ejemplo:');
      const row = dataResult.rows[0];
      Object.keys(row).forEach(key => {
        console.log(`   - ${key}: ${row[key]}`);
      });
    } else {
      console.log('   ⚠️ No hay datos en la tabla puestos');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkPuestosSchema(); 