import { tursoClient } from './lib/tursoClient.js';

async function checkTables() {
  try {
    console.log('🔍 Verificando tablas existentes...');
    
    // Listar todas las tablas
    const tables = await tursoClient.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('\n📋 Tablas existentes:');
    tables.rows.forEach(table => {
      console.log(`  - ${table.name}`);
    });
    
    // Verificar tabla personal
    console.log('\n🧑‍💼 Verificando tabla personal...');
    try {
      const personalInfo = await tursoClient.execute("PRAGMA table_info(personal)");
      console.log('📋 Estructura de personal:');
      personalInfo.rows.forEach(column => {
        console.log(`  - ${column.name} (${column.type})`);
      });
      
      const personalContent = await tursoClient.execute("SELECT id, nombre, apellido, puesto FROM personal LIMIT 5");
      console.log(`\n📊 Personal existente (${personalContent.rows.length} registros):`);
      personalContent.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ID: ${row.id}, ${row.nombre} ${row.apellido} - ${row.puesto}`);
      });
    } catch (error) {
      console.log('❌ Tabla personal no existe');
    }
    
    // Verificar tabla evaluaciones_personal
    console.log('\n📊 Verificando tabla evaluaciones_personal...');
    try {
      const evalInfo = await tursoClient.execute("PRAGMA table_info(evaluaciones_personal)");
      console.log('📋 Estructura de evaluaciones_personal:');
      evalInfo.rows.forEach(column => {
        console.log(`  - ${column.name} (${column.type})`);
      });
    } catch (error) {
      console.log('❌ Tabla evaluaciones_personal no existe');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkTables();
