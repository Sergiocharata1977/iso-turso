import { tursoClient } from '../backend/lib/tursoClient.js';
import bcrypt from 'bcrypt';

// Función para generar contraseñas seguras
const generatePassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const createSampleUsers = async () => {
  console.log('🚀 Creando usuarios de ejemplo...\n');

  try {
    // Obtener organizaciones existentes
    const orgsResult = await tursoClient.execute({
      sql: 'SELECT id, name FROM organizations ORDER BY id'
    });

    if (orgsResult.rows.length === 0) {
      console.log('❌ No hay organizaciones. Primero crea organizaciones.');
      return;
    }

    console.log('📋 Organizaciones disponibles:');
    orgsResult.rows.forEach(org => {
      console.log(`   - ${org.name} (ID: ${org.id})`);
    });

    // Usuarios de ejemplo
    const sampleUsers = [
      {
        name: 'Juan Pérez',
        email: 'juan.perez@demo.com',
        role: 'admin',
        organization_id: orgsResult.rows[0].id, // Primera organización
        password: generatePassword()
      },
      {
        name: 'María García',
        email: 'maria.garcia@demo.com',
        role: 'manager',
        organization_id: orgsResult.rows[0].id,
        password: generatePassword()
      },
      {
        name: 'Carlos López',
        email: 'carlos.lopez@demo.com',
        role: 'employee',
        organization_id: orgsResult.rows[0].id,
        password: generatePassword()
      }
    ];

    // Si hay más de una organización, crear usuarios para la segunda
    if (orgsResult.rows.length > 1) {
      sampleUsers.push(
        {
          name: 'Ana Rodríguez',
          email: 'ana.rodriguez@demo2.com',
          role: 'admin',
          organization_id: orgsResult.rows[1].id,
          password: generatePassword()
        },
        {
          name: 'Luis Martínez',
          email: 'luis.martinez@demo2.com',
          role: 'employee',
          organization_id: orgsResult.rows[1].id,
          password: generatePassword()
        }
      );
    }

    console.log('\n👥 Creando usuarios...\n');

    for (const user of sampleUsers) {
      try {
        // Verificar si el usuario ya existe
        const existingUser = await tursoClient.execute({
          sql: 'SELECT id FROM usuarios WHERE email = ?',
          args: [user.email]
        });

        if (existingUser.rows.length > 0) {
          console.log(`⚠️  Usuario ${user.email} ya existe, saltando...`);
          continue;
        }

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(user.password, 10);

        // Insertar usuario
        const result = await tursoClient.execute({
          sql: `
            INSERT INTO usuarios (name, email, password_hash, role, organization_id, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
            RETURNING id
          `,
          args: [user.name, user.email, passwordHash, user.role, user.organization_id]
        });

        console.log(`✅ Usuario creado: ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Contraseña: ${user.password}`);
        console.log(`   👑 Rol: ${user.role}`);
        console.log(`   🏢 Organización: ${orgsResult.rows.find(org => org.id === user.organization_id)?.name}`);
        console.log('');

      } catch (error) {
        console.error(`❌ Error creando usuario ${user.email}:`, error.message);
      }
    }

    console.log('🎉 ¡Usuarios de ejemplo creados exitosamente!');
    console.log('\n📝 Credenciales de acceso:');
    console.log('=====================================');
    sampleUsers.forEach(user => {
      console.log(`${user.name}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Contraseña: ${user.password}`);
      console.log(`  Rol: ${user.role}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Ejecutar el script
createSampleUsers().then(() => {
  console.log('✅ Script completado');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error en el script:', error);
  process.exit(1);
}); 