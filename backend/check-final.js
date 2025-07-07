import { tursoClient } from './lib/tursoClient.js';

async function checkFinal() {
  try {
    console.log('🔍 Verificación final...');
    
    // Verificar organizaciones
    const orgs = await tursoClient.execute({
      sql: 'SELECT * FROM organizations',
      args: []
    });
    
    console.log('\n🏢 Organizaciones:');
    orgs.rows.forEach(org => {
      console.log(`  - ID: ${org.id}, Nombre: ${org.name}`);
    });
    
    // Verificar usuarios
    const users = await tursoClient.execute({
      sql: 'SELECT * FROM usuarios',
      args: []
    });
    
    console.log('\n👥 Usuarios:');
    users.rows.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, Nombre: ${user.name}, Rol: ${user.role}, Org ID: ${user.organization_id}`);
    });
    
    if (users.rows.length > 0) {
      console.log('\n✅ ¡Perfecto! Ahora puedes hacer login con:');
      console.log(`📧 Email: ${users.rows[0].email}`);
      console.log(`🔑 Contraseña: 123456`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkFinal(); 