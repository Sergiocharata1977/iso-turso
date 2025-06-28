import { tursoClient } from './lib/tursoClient.js';

async function verEsquemaProceso() {
  try {
    console.log('🔍 Analizando esquema de la tabla procesos...');
    
    const esquema = await tursoClient.execute('PRAGMA table_info(procesos)');
    console.log('\n📋 ESTRUCTURA DETALLADA DE LA TABLA PROCESOS:');
    console.log('--------------------------------------------');
    
    for (const columna of esquema.rows) {
      console.log(`- ${columna.name}: tipo ${columna.type}, not null: ${columna.notnull}, default: ${columna.dflt_value}`);
    }
    
    console.log('\n🧪 Intentando una consulta simple...');
    const existingData = await tursoClient.execute('SELECT * FROM procesos LIMIT 1');
    
    if (existingData.rows.length > 0) {
      console.log('✅ Datos existentes (primer registro):');
      const registro = existingData.rows[0];
      for (const [key, value] of Object.entries(registro)) {
        console.log(`   - ${key}: ${value} (${typeof value})`);
      }
    } else {
      console.log('⚠️ No hay datos en la tabla procesos');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verEsquemaProceso();
