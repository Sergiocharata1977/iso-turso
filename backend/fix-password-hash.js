import bcrypt from 'bcryptjs';
import { tursoClient } from './lib/tursoClient.js';

async function fixPasswordHash() {
  try {
    console.log('🔧 Arreglando hash de contraseña...');
    
    const email = 'admin@demo.com';
    const plainPassword = '123456';
    
    // Generar hash bcrypt
    console.log('🔐 Generando hash bcrypt...');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('✅ Hash generado:', hashedPassword);
    
    // Actualizar en la base de datos
    console.log('💾 Actualizando contraseña en BD...');
    const result = await tursoClient.execute({
      sql: 'UPDATE usuarios SET password_hash = ? WHERE email = ?',
      args: [hashedPassword, email]
    });
    
    console.log('✅ Contraseña actualizada');
    
    // Verificar que se actualizó correctamente
    const verification = await tursoClient.execute({
      sql: 'SELECT email, password_hash FROM usuarios WHERE email = ?',
      args: [email]
    });
    
    if (verification.rows.length > 0) {
      const user = verification.rows[0];
      console.log('🔍 Verificación:');
      console.log(`  Email: ${user.email}`);
      console.log(`  Hash: ${user.password_hash}`);
      console.log(`  ¿Es hash bcrypt?: ${user.password_hash.startsWith('$2')}`);
      
      // Probar que el hash funciona
      const isMatch = await bcrypt.compare(plainPassword, user.password_hash);
      console.log(`  ¿Contraseña coincide?: ${isMatch}`);
      
      if (isMatch) {
        console.log('\n🎉 ¡Perfecto! Ahora el login debería funcionar');
        console.log('📧 Email: admin@demo.com');
        console.log('🔑 Contraseña: 123456');
      } else {
        console.log('\n❌ Error: El hash no coincide con la contraseña');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixPasswordHash(); 