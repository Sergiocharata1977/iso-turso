import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function createSimpleUser() {
  // Credenciales del nuevo usuario - con hash precalculado
  const newUser = {
    name: 'Sistema Admin',
    email: 'sistema@isoflow.com',
    password: 'Sistema123!',
    // Hash precalculado para "Sistema123!" usando bcrypt con salt 10
    passwordHash: '$2b$10$rOvQLgq8P7JO8F7vN0k8F.NLnc0.BxC0v6f0.9l9qnZF9BzjMzpE.',
    role: 'super-admin',
    organizationId: 21
  };

  try {
    console.log('🆕 Creando usuario simple...');
    console.log(`📧 Email: ${newUser.email}`);
    console.log(`🔑 Password: ${newUser.password}`);
    
    // 1. Eliminar si existe
    console.log('\n🗑️ Limpiando usuario existente...');
    await db.execute({
      sql: 'DELETE FROM usuarios WHERE email = ?',
      args: [newUser.email]
    });
    
    // 2. Insertar usuario nuevo con hash directo
    console.log('\n👤 Insertando usuario...');
    const insertResult = await db.execute({
      sql: `INSERT INTO usuarios 
            (name, email, password_hash, role, organization_id, is_active, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
      args: [
        newUser.name, 
        newUser.email, 
        newUser.passwordHash, 
        newUser.role, 
        newUser.organizationId
      ]
    });
    
    const userId = insertResult.lastInsertRowid;
    console.log('✅ Usuario creado con ID:', userId);
    
    // 3. Verificar creación
    console.log('\n🔍 Verificando usuario...');
    const verification = await db.execute({
      sql: 'SELECT id, name, email, role, organization_id, is_active, created_at FROM usuarios WHERE id = ?',
      args: [userId]
    });
    
    if (verification.rows.length > 0) {
      const user = verification.rows[0];
      console.log('✅ USUARIO CREADO EXITOSAMENTE:');
      console.log('   ID:', user.id);
      console.log('   Nombre:', user.name);
      console.log('   Email:', user.email);
      console.log('   Role:', user.role);
      console.log('   Org ID:', user.organization_id);
      console.log('   Activo:', user.is_active);
      console.log('   Creado:', user.created_at);
    }
    
    // 4. Mostrar credenciales finales
    console.log('\n🎯 NUEVAS CREDENCIALES PARA LOGIN:');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${newUser.email}`);
    console.log(`🔑 Password: ${newUser.password}`);
    console.log('='.repeat(50));
    console.log('\n🚀 Intenta hacer login con estas credenciales ahora!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  } finally {
    await db.close();
  }
}

createSimpleUser();
