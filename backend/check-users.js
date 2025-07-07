import { tursoClient } from './lib/tursoClient.js';
import bcrypt from 'bcrypt';

async function checkAndCreateUsers() {
  try {
    console.log('👥 Verificando usuarios existentes...');
    
    // Verificar qué usuarios existen
    const users = await tursoClient.execute('SELECT id, email, name, role FROM usuarios LIMIT 10');
    
    console.log('\n📋 Usuarios existentes:');
    if (users.rows.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
    } else {
      users.rows.forEach(user => {
        console.log(`  - ${user.email} (${user.name}) - Rol: ${user.role}`);
      });
    }
    
    // Crear usuario de prueba si no existe
    const testEmail = 'admin@test.com';
    const testPassword = '123456';
    
    console.log('\n🔧 Creando usuario de prueba...');
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Contraseña: ${testPassword}`);
    
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    try {
      await tursoClient.execute({
        sql: `INSERT OR IGNORE INTO usuarios (email, name, password, role, organization_id, created_at) 
              VALUES (?, ?, ?, ?, ?, datetime('now'))`,
        args: [testEmail, 'Admin Test', hashedPassword, 'admin', 20]
      });
      
      console.log('✅ Usuario de prueba creado correctamente');
      
    } catch (error) {
      console.log('⚠️ Error creando usuario:', error.message);
    }
    
    // Verificar usuarios después de crear
    const usersAfter = await tursoClient.execute('SELECT id, email, name, role FROM usuarios WHERE email = ?', [testEmail]);
    
    if (usersAfter.rows.length > 0) {
      console.log('\n✅ Usuario de prueba verificado:');
      console.log(`  - Email: ${usersAfter.rows[0].email}`);
      console.log(`  - Nombre: ${usersAfter.rows[0].name}`);
      console.log(`  - Rol: ${usersAfter.rows[0].role}`);
      console.log('\n🔐 Credenciales para login:');
      console.log(`📧 Email: ${testEmail}`);
      console.log(`🔑 Contraseña: ${testPassword}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAndCreateUsers();
