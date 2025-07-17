import { tursoClient } from './lib/tursoClient.js';

async function checkMediciones() {
  try {
    console.log('🔍 Verificando estado de la tabla mediciones...');
    
    // Verificar si la tabla existe
    const tableExists = await tursoClient.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='mediciones'
    `);
    
    if (tableExists.rows.length === 0) {
      console.log('❌ La tabla "mediciones" NO EXISTE');
      return false;
    }
    
    // Obtener estructura
    const schema = await tursoClient.execute('PRAGMA table_info(mediciones)');
    console.log('📋 Estructura de la tabla mediciones:');
    console.log(JSON.stringify(schema.rows, null, 2));
    
    // Obtener datos de ejemplo
    const data = await tursoClient.execute('SELECT * FROM mediciones LIMIT 3');
    console.log('\n📊 Datos de ejemplo:');
    console.log(JSON.stringify(data.rows, null, 2));
    
    // Contar registros
    const count = await tursoClient.execute('SELECT COUNT(*) as total FROM mediciones');
    console.log(`\n📈 Total de registros: ${count.rows[0].total}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error al verificar mediciones:', error.message);
    return false;
  }
}

// Verificar también otras tablas relacionadas
async function checkRelatedTables() {
  try {
    console.log('\n🔗 Verificando tablas relacionadas...');
    
    // Verificar indicadores
    const indicadores = await tursoClient.execute('SELECT COUNT(*) as total FROM indicadores');
    console.log(`📊 Total de indicadores: ${indicadores.rows[0].total}`);
    
    // Verificar si hay objetivos
    const objetivos = await tursoClient.execute('SELECT COUNT(*) as total FROM objetivos');
    console.log(`🎯 Total de objetivos: ${objetivos.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error verificando tablas relacionadas:', error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando verificación completa de mediciones...');
  
  const exists = await checkMediciones();
  await checkRelatedTables();
  
  if (!exists) {
    console.log('\n💡 Solución: Necesitas crear la tabla mediciones');
    console.log('   Usa: node create-mediciones-table.js');
  }
}

main(); 