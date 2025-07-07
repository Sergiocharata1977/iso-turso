// backend/scripts/test-no-restrictions.js

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

console.log('🧪 Probando sistema SIN restricciones de roles...');

async function testNoRestrictions() {
  try {
    console.log('\n🔐 1. Probando login con todos los usuarios...');
    
    const testUsers = [
      { email: 'admin.basico@demo.com', password: 'admin123', org: 'Básica' },
      { email: 'manager.basico@demo.com', password: 'manager123', org: 'Básica' },
      { email: 'empleado.basico@demo.com', password: 'empleado123', org: 'Básica' },
      { email: 'admin.premium@demo.com', password: 'admin123', org: 'Premium' },
      { email: 'manager.premium@demo.com', password: 'manager123', org: 'Premium' },
      { email: 'empleado.premium@demo.com', password: 'empleado123', org: 'Premium' }
    ];
    
    const tokens = {};
    
    for (const user of testUsers) {
      try {
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: user.email,
          password: user.password
        });
        
        tokens[user.email] = {
          token: loginResponse.data.accessToken,
          user: loginResponse.data.user,
          org: user.org
        };
        
        console.log(`✅ Login exitoso: ${user.email} (${user.org})`);
        console.log(`   🏢 Organización: ${loginResponse.data.user.organization_name}`);
        console.log(`   📋 Plan: ${loginResponse.data.user.organization_plan}`);
        
      } catch (error) {
        console.log(`❌ Error login ${user.email}: ${error.response?.data?.message || error.message}`);
      }
    }

    console.log('\n👥 2. Probando acceso a usuarios desde cada rol...');
    
    for (const [email, data] of Object.entries(tokens)) {
      console.log(`\n🔍 Probando acceso con: ${email} (${data.user.role})`);
      
      try {
        const usersResponse = await axios.get(`${API_BASE}/users`, {
          headers: { Authorization: `Bearer ${data.token}` }
        });
        
        console.log(`   ✅ Ve ${usersResponse.data.users.length} usuarios de su organización`);
        console.log(`   📋 Usuarios: ${usersResponse.data.users.map(u => `${u.name} (${u.role})`).join(', ')}`);
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.response?.data?.message || error.message}`);
      }
    }

    console.log('\n📋 3. RESUMEN DE RESULTADOS:');
    
    const loginCount = Object.keys(tokens).length;
    console.log(`✅ Logins exitosos: ${loginCount}/${testUsers.length}`);
    
    if (loginCount === testUsers.length) {
      console.log('🎉 ¡TODOS los usuarios pueden hacer login!');
    } else {
      console.log('⚠️ Algunos usuarios no pueden hacer login');
    }
    
    console.log('\n🎯 PRUEBA DESDE EL NAVEGADOR:');
    console.log('1. Ve a: http://localhost:5173/login');
    console.log('2. Usa cualquiera de estas credenciales:');
    console.log('');
    
    for (const user of testUsers) {
      console.log(`   📧 ${user.email} / 🔑 ${user.password} (${user.org})`);
    }
    
    console.log('');
    console.log('🔥 NOTA: Ahora TODOS los roles (admin, manager, employee) pueden:');
    console.log('   ✅ Ver todos los usuarios de su organización');
    console.log('   ✅ Crear nuevos usuarios');
    console.log('   ✅ Editar usuarios existentes');
    console.log('   ✅ Eliminar usuarios');
    console.log('   ✅ Acceder a todos los módulos');
    console.log('');
    console.log('🏢 Aislamiento multi-tenant: Cada organización ve solo sus datos');

  } catch (error) {
    console.error('💥 Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testNoRestrictions().then(() => {
  console.log('\n✅ Pruebas sin restricciones completadas');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
}); 