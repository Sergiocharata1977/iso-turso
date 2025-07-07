import { tursoClient } from './lib/tursoClient.js';

async function checkTables() {
  try {
    console.log('🔍 Verificando estructura de tablas...');
    
    // Ver estructura de la tabla personal
    const personalSchema = await tursoClient.execute('PRAGMA table_info(personal)');
    console.log('\n📋 Columnas de la tabla personal:');
    personalSchema.rows.forEach(row => {
      console.log('  -', row.name, '(' + row.type + ')');
    });
    
    // Ver estructura de la tabla procesos
    const procesosSchema = await tursoClient.execute('PRAGMA table_info(procesos)');
    console.log('\n📋 Columnas de la tabla procesos:');
    procesosSchema.rows.forEach(row => {
      console.log('  -', row.name, '(' + row.type + ')');
    });
    
    // Ver estructura de la tabla hallazgos
    const hallazgosSchema = await tursoClient.execute('PRAGMA table_info(hallazgos)');
    console.log('\n📋 Columnas de la tabla hallazgos:');
    hallazgosSchema.rows.forEach(row => {
      console.log('  -', row.name, '(' + row.type + ')');
    });
    
    // Ver estructura de la tabla acciones
    const accionesSchema = await tursoClient.execute('PRAGMA table_info(acciones)');
    console.log('\n📋 Columnas de la tabla acciones:');
    accionesSchema.rows.forEach(row => {
      console.log('  -', row.name, '(' + row.type + ')');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTables(); 