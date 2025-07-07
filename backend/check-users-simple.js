import { tursoClient } from './lib/tursoClient.js';

async function checkUsers() {
  try {
    console.log('👥 Verificando usuarios existentes...');
    
    // Verificar qué usuarios existen
    const users = await tursoClient.execute('SELECT id, email, name, role FROM usuarios LIMIT 10');
    
    console.log('\n📋 Usuarios existentes:');
    if (users.rows.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      console.log('\n💡 Sugerencias:');
      console.log('1. Revisa si existe un script de creación de usuarios');
      console.log('2. O registra un nuevo usuario desde /register');
    } else {
      users.rows.forEach(user => {
        console.log(`  - ${user.email} (${user.name}) - Rol: ${user.role}`);
      });
      
      console.log('\n🔐 Usa uno de estos emails para hacer login');
      console.log('📧 Si no recuerdas la contraseña, puede que sea "123456" o "admin"');
    }
    
    // También verificar la estructura de la tabla usuarios
    console.log('\n🔍 Estructura de la tabla usuarios:');
    const schema = await tursoClient.execute('PRAGMA table_info(usuarios)');
    schema.rows.forEach(row => {
      console.log(`  - ${row.name} (${row.type})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Posible solución:');
    console.log('- La tabla "usuarios" podría no existir');
    console.log('- Ejecuta los scripts de inicialización de la base de datos');
  }
}

checkUsers(); 