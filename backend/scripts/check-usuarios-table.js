import db from '../db.js';

async function checkUsuariosTable() {
  try {
    console.log('🔍 Verificando estructura de la tabla usuarios...\n');
    
    // Verificar columnas
    const columns = await db.execute('PRAGMA table_info(usuarios)');
    console.log('📋 Columnas de la tabla usuarios:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : 'NULL'} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Verificar algunos registros
    console.log('\n📊 Verificando registros:');
    const count = await db.execute('SELECT COUNT(*) as total FROM usuarios');
    console.log(`  Total de usuarios: ${count.rows[0].total}`);
    
    // Verificar si hay organization_id
    const sample = await db.execute('SELECT id, name, email, role, organization_id FROM usuarios LIMIT 3');
    console.log('\n👥 Muestra de usuarios:');
    console.log(sample.rows);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkUsuariosTable(); 