import { db } from '../lib/tursoClient.js';

async function checkUsuarios() {
  try {
    console.log('🔍 Consultando tabla usuarios...');
    
    const result = await db.execute({
      sql: 'SELECT id, name, email, role, organization_id, created_at FROM usuarios ORDER BY created_at DESC LIMIT 10'
    });
    
    console.log(`📊 Total usuarios encontrados: ${result.rows.length}`);
    
    if (result.rows.length === 0) {
      console.log('⚠️ No hay usuarios en la tabla');
    } else {
      console.log('\n👥 Usuarios en la base de datos:');
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   📛 Nombre: ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🎯 Role: ${user.role}`);
        console.log(`   🏢 Org ID: ${user.organization_id}`);
        console.log(`   📅 Creado: ${user.created_at}`);
        console.log('');
      });
    }
    
    // Verificar específicamente el admin
    console.log('🔍 Buscando admin@demo.com...');
    const adminResult = await db.execute({
      sql: 'SELECT * FROM usuarios WHERE email = ?',
      args: ['admin@demo.com']
    });
    
    if (adminResult.rows.length > 0) {
      console.log('✅ Usuario admin encontrado:', adminResult.rows[0]);
    } else {
      console.log('❌ Usuario admin NO encontrado');
    }
    
  } catch (error) {
    console.error('❌ Error al consultar usuarios:', error);
  }
}

checkUsuarios();
