import { tursoClient } from './lib/tursoClient.js';

async function checkIndicadoresStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla indicadores...');
    
    // Obtener estructura de la tabla
    const schema = await tursoClient.execute('PRAGMA table_info(indicadores)');
    console.log('📋 Estructura de la tabla indicadores:');
    console.log(JSON.stringify(schema.rows, null, 2));
    
    // Obtener algunos registros de ejemplo
    const data = await tursoClient.execute('SELECT * FROM indicadores LIMIT 3');
    console.log('\n📊 Datos de ejemplo:');
    console.log(JSON.stringify(data.rows, null, 2));
    
    // Verificar el número total de registros
    const count = await tursoClient.execute('SELECT COUNT(*) as total FROM indicadores');
    console.log(`\n📈 Total de registros: ${count.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error al verificar estructura:', error.message);
  }
}

checkIndicadoresStructure(); 