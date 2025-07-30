import { tursoClient } from './backend/lib/tursoClient.js';
import bcrypt from 'bcryptjs';

async function crearUsuarioPrueba() {
  console.log('👤 Creando usuario de prueba...\n');

  try {
    // 1. Verificar si ya existe el usuario
    const checkUser = await tursoClient.execute({
      sql: 'SELECT id, email FROM usuarios WHERE email = ?',
      args: ['admin@example.com']
    });

    if (checkUser.rows.length > 0) {
      console.log('✅ Usuario admin@example.com ya existe');
      return;
    }

    // 2. Verificar si existe la organización
    const checkOrg = await tursoClient.execute({
      sql: 'SELECT id, name FROM organizations WHERE id = 1'
    });

    let organizationId = 1;
    if (checkOrg.rows.length === 0) {
      console.log('🏢 Creando organización de prueba...');
      await tursoClient.execute({
        sql: `INSERT INTO organizations (id, name, created_at, updated_at) 
              VALUES (1, 'Organización de Prueba', 
                     datetime('now', 'localtime'), datetime('now', 'localtime'))`
      });
      console.log('✅ Organización creada');
    }

    // 3. Crear hash de la contraseña
    const password = 'admin123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Crear usuario
    console.log('👤 Creando usuario admin...');
    await tursoClient.execute({
      sql: `INSERT INTO usuarios (name, email, password, role, organization_id, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))`,
      args: ['Administrador', 'admin@example.com', hashedPassword, 'admin', organizationId]
    });

    console.log('✅ Usuario creado exitosamente');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');

  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  }
}

crearUsuarioPrueba(); 