import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

async function verifyUsers() {
  try {
    console.log('🔍 VERIFICANDO USUARIOS CREADOS');
    console.log('=' .repeat(40));
    
    const users = await client.execute('SELECT name, email, role FROM usuarios ORDER BY role DESC');
    
    if (users.rows.length === 0) {
      console.log('❌ No se encontraron usuarios');
      return;
    }
    
    console.log('👥 USUARIOS EN EL SISTEMA:');
    users.rows.forEach(u => {
      const roleIcon = u.role === 'admin' ? '👑' : u.role === 'manager' ? '🎯' : '👤';
      console.log(`${roleIcon} ${u.name} (${u.role}) - ${u.email}`);
    });
    
    console.log(`\n✅ Total: ${users.rows.length} usuarios creados`);
    
    // Contar por rol
    const adminCount = users.rows.filter(u => u.role === 'admin').length;
    const managerCount = users.rows.filter(u => u.role === 'manager').length;
    const employeeCount = users.rows.filter(u => u.role === 'employee').length;
    
    console.log('\n📊 DISTRIBUCIÓN POR ROL:');
    console.log(`   👑 Admins: ${adminCount}`);
    console.log(`   🎯 Managers: ${managerCount}`);
    console.log(`   👤 Employees: ${employeeCount}`);
    
    console.log('\n🔑 CREDENCIALES PARA LOGIN:');
    console.log('   admin@demo.com / admin123 (admin)');
    console.log('   manager@demo.com / manager123 (manager)');
    console.log('   employee@demo.com / employee123 (employee)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

verifyUsers();
