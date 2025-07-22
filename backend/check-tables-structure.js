import { tursoClient } from './lib/tursoClient.js';

async function checkTablesStructure() {
  try {
    console.log('🔍 Verificando estructura de tablas...');
    
    // 1. Verificar tabla personal
    console.log('\n📋 Verificando tabla personal...');
    const personalSchema = await tursoClient.execute({
      sql: `PRAGMA table_info(personal)`
    });
    console.log('\n📋 Estructura de personal:');
    console.table(personalSchema.rows);
    
    // 2. Verificar tabla competencias
    console.log('\n📋 Verificando tabla competencias...');
    const competenciasSchema = await tursoClient.execute({
      sql: `PRAGMA table_info(competencias)`
    });
    console.log('\n📋 Estructura de competencias:');
    console.table(competenciasSchema.rows);
    
    // 3. Contar registros
    const personalCount = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM personal`
    });
    console.log(`\n📊 Personal contiene ${personalCount.rows[0].count} registros.`);
    
    const competenciasCount = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM competencias`
    });
    console.log(`📊 Competencias contiene ${competenciasCount.rows[0].count} registros.`);
    
    // 4. Mostrar algunos registros
    const personalSample = await tursoClient.execute({
      sql: `SELECT * FROM personal LIMIT 3`
    });
    console.log('\n📋 Muestra de personal:');
    console.table(personalSample.rows);
    
    const competenciasSample = await tursoClient.execute({
      sql: `SELECT * FROM competencias LIMIT 3`
    });
    console.log('\n📋 Muestra de competencias:');
    console.table(competenciasSample.rows);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkTablesStructure(); 