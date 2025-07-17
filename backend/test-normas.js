import { tursoClient } from './lib/tursoClient.js';

async function testNormas() {
  try {
    console.log('🔍 Probando consulta de normas...');
    
    // Probar consulta simple
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM normas LIMIT 5',
      args: []
    });
    
    console.log('✅ Normas encontradas:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('📋 Estructura de la primera norma:', result.rows[0]);
    }
    
    // Probar consulta con JOIN
    const resultJoin = await tursoClient.execute({
      sql: `SELECT n.*, o.name as organization_name 
            FROM normas n 
            LEFT JOIN organizations o ON n.organization_id = o.id 
            LIMIT 3`,
      args: []
    });
    
    console.log('✅ Normas con JOIN encontradas:', resultJoin.rows.length);
    if (resultJoin.rows.length > 0) {
      console.log('📋 Primera norma con JOIN:', resultJoin.rows[0]);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('❌ Stack:', error.stack);
  } finally {
    await tursoClient.close();
  }
}

testNormas(); 