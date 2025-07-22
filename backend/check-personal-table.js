import { tursoClient } from './lib/tursoClient.js';

async function checkPersonalTable() {
  try {
    console.log('🔍 Verificando tabla personal...');
    
    // 1. Verificar estructura
    console.log('\n📋 Estructura de tabla personal:');
    const schema = await tursoClient.execute({
      sql: `PRAGMA table_info(personal)`
    });
    console.table(schema.rows);
    
    // 2. Contar registros
    const count = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM personal`
    });
    console.log(`\n📊 Personal contiene ${count.rows[0].count} registros.`);
    
    // 3. Mostrar todos los registros
    const allPersonal = await tursoClient.execute({
      sql: `SELECT * FROM personal`
    });
    console.log('\n📋 Todos los registros de personal:');
    console.table(allPersonal.rows);
    
    // 4. Verificar si tiene organization_id
    const hasOrgId = schema.rows.some(col => col.name === 'organization_id');
    console.log(`\n🔍 ¿Tiene organization_id? ${hasOrgId ? 'SÍ' : 'NO'}`);
    
    if (!hasOrgId) {
      console.log('⚠️ La tabla personal NO tiene organization_id');
      console.log('💡 Esto significa que todos los registros son globales o de una sola organización');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkPersonalTable(); 