import { tursoClient } from './lib/tursoClient.js';

async function createAdminUser() {
  try {
    console.log('👤 Creando usuario administrador...');
    
    // Crear usuario con contraseña simple (sin hash por ahora)
    const email = 'admin@test.com';
    const password = '123456';
    const name = 'Admin Test';
    const role = 'admin';
    const organizationId = 20;
    
    // Para simplificar, vamos a usar la contraseña sin hash primero
    // En un entorno real deberías usar bcrypt
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO usuarios (
        organization_id, name, email, password_hash, role, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      args: [organizationId, name, email, password, role, 1]
    });
    
    console.log('✅ Usuario creado exitosamente!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Contraseña: ${password}`);
    console.log(`👤 Nombre: ${name}`);
    console.log(`🎯 Rol: ${role}`);
    console.log(`🏢 Organization ID: ${organizationId}`);
    
    // Verificar que se creó correctamente
    const verification = await tursoClient.execute({
      sql: 'SELECT id, email, name, role FROM usuarios WHERE email = ?',
      args: [email]
    });
    
    if (verification.rows.length > 0) {
      console.log('\n✅ Verificación exitosa - Usuario encontrado en la base de datos');
      console.log(`ID: ${verification.rows[0].id}`);
    } else {
      console.log('❌ Error: Usuario no encontrado después de la creación');
    }
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
  }
}

createAdminUser(); 