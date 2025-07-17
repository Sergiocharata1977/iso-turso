import bcrypt from 'bcryptjs';
import { db } from '../lib/tursoClient.js';

async function createAdminUser() {
  console.log('🔧 Iniciando creación del usuario admin...');
  
  try {
    // Datos del usuario admin
    const adminEmail = 'admin@demo.com';
    const adminPassword = 'admin123';
    const adminName = 'Administrador';
    const adminRole = 'super-admin';
    const organizationId = 21; // Usar la Organización Demo existente (ID 21)
    
    // Verificar si el usuario ya existe
    console.log('🔍 Verificando si el usuario admin ya existe...');
    const existingUser = await db.execute({
      sql: 'SELECT id FROM usuarios WHERE email = ?',
      args: [adminEmail]
    });
    
    if (existingUser.rows.length > 0) {
      console.log('⚠️  El usuario admin ya existe. ID:', existingUser.rows[0].id);
      return;
    }
    
    // Verificar que la organización ID 21 existe
    console.log('🏢 Verificando organización ID 21...');
    const orgCheck = await db.execute({
      sql: 'SELECT id, name FROM organizations WHERE id = ?',
      args: [organizationId]
    });
    
    if (orgCheck.rows.length === 0) {
      console.log('❌ Error: Organización ID 21 no encontrada');
      return;
    }
    
    console.log('✅ Usando organización:', orgCheck.rows[0].name);
    
    // Generar hash de la contraseña
    console.log('🔐 Generando hash de contraseña...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    console.log('✅ Hash generado correctamente');
    
    // Crear el usuario admin
    console.log('👤 Creando usuario admin...');
    const userResult = await db.execute({
      sql: 'INSERT INTO usuarios (name, email, password_hash, role, organization_id, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
      args: [adminName, adminEmail, hashedPassword, adminRole, organizationId]
    });
    
    const userId = userResult.lastInsertRowid;
    console.log('✅ Usuario admin creado exitosamente:');
    console.log('   - ID:', userId);
    console.log('   - Nombre:', adminName);
    console.log('   - Email:', adminEmail);
    console.log('   - Role:', adminRole);
    console.log('   - Organization ID:', organizationId);
    
    // Verificar que se creó correctamente
    console.log('🔍 Verificando usuario creado...');
    const verifyUser = await db.execute({
      sql: 'SELECT id, name, email, role, organization_id FROM usuarios WHERE email = ?',
      args: [adminEmail]
    });
    
    if (verifyUser.rows.length > 0) {
      console.log('✅ Verificación exitosa:', verifyUser.rows[0]);
      console.log('');
      console.log('🎉 USUARIO ADMIN CREADO EXITOSAMENTE');
      console.log('   📧 Email: admin@demo.com');
      console.log('   🔑 Password: admin123');
      console.log('   🎯 Role: super-admin');
      console.log('');
      console.log('Ya puedes iniciar sesión en el sistema!');
    } else {
      console.log('❌ Error: No se pudo verificar la creación del usuario');
    }
    
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
    console.error('Detalles:', error.message);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser()
    .then(() => {
      console.log('🏁 Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export { createAdminUser };
