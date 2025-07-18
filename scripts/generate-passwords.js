import { tursoClient } from '../backend/lib/tursoClient.js';
import bcrypt from 'bcrypt';

const generatePasswords = async () => {
  console.log('🔐 Generando contraseñas hash para usuarios existentes...\n');
  
  try {
    // Contraseñas que queremos usar
    const passwords = {
      'admin@demo.com': 'admin123',
      'admin@isoflow3.com': 'admin123'
    };

    for (const [email, password] of Object.entries(passwords)) {
      try {
        // Generar hash de la contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // Actualizar el usuario en la base de datos
        const result = await tursoClient.execute({
          sql: 'UPDATE usuarios SET password_hash = ? WHERE email = ? RETURNING id, name, email, role',
          args: [passwordHash, email]
        });

        if (result.rows.length > 0) {
          const user = result.rows[0];
          console.log(`✅ Usuario actualizado: ${user.name}`);
          console.log(`   📧 Email: ${user.email}`);
          console.log(`   🔑 Contraseña: ${password}`);
          console.log(`   👑 Rol: ${user.role}`);
          console.log('');
        } else {
          console.log(`⚠️  Usuario no encontrado: ${email}`);
        }
      } catch (error) {
        console.error(`❌ Error actualizando usuario ${email}:`, error.message);
      }
    }

    console.log('🎉 ¡Contraseñas generadas exitosamente!');
    console.log('\n📝 Credenciales de acceso:');
    console.log('=====================================');
    console.log('Super Administrador:');
    console.log('  Email: admin@isoflow3.com');
    console.log('  Contraseña: admin123');
    console.log('');
    console.log('Administrador Demo:');
    console.log('  Email: admin@demo.com');
    console.log('  Contraseña: admin123');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

generatePasswords().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
}); 