import { createClient } from '@libsql/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function createFreshUser() {
  // Credenciales del nuevo usuario
  const newUser = {
    name: 'Super Admin',
    email: 'superadmin@isoflow.com',
    password: 'Super123!',
    role: 'super-admin',
    organizationId: 21 // Organización Demo existente
  };

  try {
    console.log('🆕 Creando usuario completamente nuevo...');
    console.log(`📧 Email: ${newUser.email}`);
    console.log(`🔑 Password: ${newUser.password}`);
    
    // 1. Verificar que no existe
    console.log('\n🔍 Verificando que el email no existe...');
    const existingCheck = await db.execute({
      sql: 'SELECT id FROM usuarios WHERE email = ?',
      args: [newUser.email]
    });
    
    if (existingCheck.rows.length > 0) {
      console.log('⚠️ Usuario ya existe, eliminando primero...');
      await db.execute({
        sql: 'DELETE FROM usuarios WHERE email = ?',
        args: [newUser.email]
      });
      console.log('✅ Usuario anterior eliminado');
    }
    
    // 2. Generar hash fresco
    console.log('\n🔐 Generando hash de contraseña fresco...');
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(newUser.password, salt);
    console.log('✅ Hash generado exitosamente');
    
    // 3. Insertar usuario nuevo
    console.log('\n👤 Insertando nuevo usuario...');
    const insertResult = await db.execute({
      sql: `INSERT INTO usuarios 
            (name, email, password_hash, role, organization_id, is_active, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
      args: [newUser.name, newUser.email, passwordHash, newUser.role, newUser.organizationId]
    });
    
    const userId = insertResult.lastInsertRowid;
    console.log('✅ Usuario creado con ID:', userId);
    
    // 4. Verificar inserción
    console.log('\n🔍 Verificando usuario creado...');
    const verification = await db.execute({
      sql: 'SELECT id, name, email, role, organization_id, is_active FROM usuarios WHERE id = ?',
      args: [userId]
    });
    
    if (verification.rows.length > 0) {
      const user = verification.rows[0];
      console.log('✅ USUARIO VERIFICADO:');
      console.log('   ID:', user.id);
      console.log('   Nombre:', user.name);
      console.log('   Email:', user.email);
      console.log('   Role:', user.role);
      console.log('   Org ID:', user.organization_id);
      console.log('   Activo:', user.is_active);
    }
    
    // 5. Probar hash de contraseña
    console.log('\n🧪 Probando verificación de contraseña...');
    const storedHash = await db.execute({
      sql: 'SELECT password_hash FROM usuarios WHERE id = ?',
      args: [userId]
    });
    
    const isPasswordValid = await bcrypt.compare(newUser.password, storedHash.rows[0].password_hash);
    console.log('🔐 Verificación de contraseña:', isPasswordValid ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    
    // 6. Mostrar credenciales para login
    console.log('\n🎯 CREDENCIALES PARA LOGIN:');
    console.log('='.repeat(40));
    console.log(`📧 Email: ${newUser.email}`);
    console.log(`🔑 Password: ${newUser.password}`);
    console.log('='.repeat(40));
    
    console.log('\n✅ Usuario fresco creado exitosamente!');
    console.log('🚀 Ahora puedes probar el login en la aplicación web');
    
  } catch (error) {
    console.error('❌ Error creando usuario fresco:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await db.close();
  }
}

createFreshUser();
