import { createClient } from '@libsql/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_DB_TOKEN
});

async function fixPasswordHash() {
  const email = 'admin@demo.com';
  const password = 'admin123';

  try {
    console.log('🔧 GENERANDO HASH CORRECTO PARA LA CONTRASEÑA...');
    
    // 1. Generar hash correcto con bcrypt
    console.log(`[1/3] 🔐 Generando hash para contraseña: "${password}"`);
    const saltRounds = 10;
    const correctHash = await bcrypt.hash(password, saltRounds);
    console.log(`  [✅ OK] Hash generado: ${correctHash}`);

    // 2. Verificar que el hash funciona
    console.log('[2/3] ✅ Verificando que el hash funciona...');
    const isValid = await bcrypt.compare(password, correctHash);
    console.log(`  [INFO] Verificación: ${isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
    
    if (!isValid) {
      throw new Error('El hash generado no es válido');
    }

    // 3. Actualizar el usuario en la base de datos
    console.log('[3/3] 💾 Actualizando usuario en la base de datos...');
    const result = await db.execute({
      sql: 'UPDATE usuarios SET password_hash = ? WHERE email = ?',
      args: [correctHash, email]
    });
    
    console.log(`  [✅ OK] Usuario actualizado. Filas afectadas: ${result.rowsAffected}`);

    console.log('\n🎉 ¡HASH CORREGIDO EXITOSAMENTE!');
    console.log('='.repeat(50));
    console.log('  CREDENCIALES PARA PROBAR:');
    console.log(`  📧 Email: ${email}`);
    console.log(`  🔑 Password: ${password}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ ERROR AL CORREGIR EL HASH:', error);
  } finally {
    await db.close();
  }
}

fixPasswordHash();
