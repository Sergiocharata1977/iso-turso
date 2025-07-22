import { tursoClient } from './lib/tursoClient.js';

async function checkCompetenciasTable() {
  try {
    console.log('🔍 Verificando tabla competencias...');
    
    // 1. Verificar estructura
    console.log('\n📋 Estructura de tabla competencias:');
    const schema = await tursoClient.execute({
      sql: `PRAGMA table_info(competencias)`
    });
    console.table(schema.rows);
    
    // 2. Contar registros
    const count = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM competencias`
    });
    console.log(`\n📊 Competencias contiene ${count.rows[0].count} registros.`);
    
    // 3. Mostrar todos los registros
    const allCompetencias = await tursoClient.execute({
      sql: `SELECT * FROM competencias`
    });
    console.log('\n📋 Todos los registros de competencias:');
    console.table(allCompetencias.rows);
    
    // 4. Verificar si tiene organization_id
    const hasOrgId = schema.rows.some(col => col.name === 'organization_id');
    console.log(`\n🔍 ¿Tiene organization_id? ${hasOrgId ? 'SÍ' : 'NO'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkCompetenciasTable(); 