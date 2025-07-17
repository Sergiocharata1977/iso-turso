import { createClient } from '@libsql/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function generateValidUser() {
  const newUser = {
    name: 'Usuario Valido',
    email: 'valid@isoflow.com',
    password: 'Password123!',
    role: 'admin',
    organizationId: 21
  };

  try {
    console.log('--- 🛡️  INICIANDO CREACIÓN DE USUARIO VÁLIDO 🛡️  ---');
    
    // 1. Eliminar usuario si ya existe
    console.log(`[1/4] 🗑️  Limpiando usuario anterior (${newUser.email})...`);
    await db.execute({ sql: 'DELETE FROM usuarios WHERE email = ?', args: [newUser.email] });
    console.log('  [✅ OK] Limpieza completada.');

    // 2. Generar hash con la librería del backend
    console.log('[2/4] 🔐 Generando hash de contraseña...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newUser.password, salt);
    console.log('  [✅ OK] Hash generado:', passwordHash);

    // 3. Insertar usuario con el nuevo hash
    console.log('[3/4] 👤 Insertando nuevo usuario en la base de datos...');
    await db.execute({
      sql: `INSERT INTO usuarios (name, email, password_hash, role, organization_id, is_active, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
      args: [newUser.name, newUser.email, passwordHash, newUser.role, newUser.organizationId]
    });
    console.log('  [✅ OK] Usuario insertado.');

    // 4. Mostrar credenciales para la prueba
    console.log('\n[4/4] ✨ ¡Usuario Válido Creado! ✨');
    console.log('='.repeat(40));
    console.log('  PRUEBA CON ESTAS CREDENCIALES:');
    console.log(`  📧 Email: ${newUser.email}`);
    console.log(`  🔑 Password: ${newUser.password}`);
    console.log('='.repeat(40));
    console.log('--- ✅ PROCESO COMPLETADO ---');

  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA CREACIÓN DEL USUARIO:', error);
  } finally {
    await db.close();
  }
}

generateValidUser();
