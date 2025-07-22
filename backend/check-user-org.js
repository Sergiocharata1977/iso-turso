import { tursoClient } from './lib/tursoClient.js';

async function checkUserOrg() {
  try {
    console.log('🔍 Verificando usuarios y sus organizaciones...');
    
    // Verificar usuarios existentes
    const users = await tursoClient.execute({
      sql: 'SELECT id, name, email, organization_id FROM usuarios ORDER BY organization_id'
    });
    
    console.log('\n📋 Usuarios existentes:');
    console.table(users.rows);
    
    // Verificar competencias por organización
    const competencias = await tursoClient.execute({
      sql: 'SELECT id, nombre, organizacion_id FROM competencias ORDER BY organizacion_id'
    });
    
    console.log('\n📋 Competencias por organización:');
    console.table(competencias.rows);
    
    // Verificar organizaciones
    const orgs = await tursoClient.execute({
      sql: 'SELECT id, name FROM organizations ORDER BY id'
    });
    
    console.log('\n📋 Organizaciones existentes:');
    console.table(orgs.rows);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkUserOrg(); 