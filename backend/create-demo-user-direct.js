import { createClient } from '@libsql/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const createDemoUser = async () => {
  try {
    // Crear cliente de base de datos
    const client = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.TURSO_DB_TOKEN,
    });

    console.log('🔗 Conectando a la base de datos...');

    // 1. Crear organización demo
    const orgResult = await client.execute({
      sql: `INSERT INTO organizations (name, created_at) VALUES (?, ?) RETURNING id`,
      args: ['Empresa Demo', new Date().toISOString()]
    });

    const organizationId = orgResult.rows[0].id;
    console.log('🏢 Organización creada con ID:', organizationId);

    // 2. Hashear contraseña
    const hashedPassword = await bcrypt.hash('123456', 10);

    // 3. Crear usuario admin
    const userResult = await client.execute({
      sql: `INSERT INTO usuarios (organization_id, name, email, password_hash, role, is_active, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        organizationId,
        'Admin Demo',
        'admin@demo.com',
        hashedPassword,
        'admin',
        1,
        new Date().toISOString()
      ]
    });

    console.log('✅ Usuario demo creado exitosamente!');
    console.log('📧 Email: admin@demo.com');
    console.log('🔑 Password: 123456');
    console.log('🏢 Organización: Empresa Demo');
    console.log('👤 Rol: admin');
    console.log('');
    console.log('🚀 Ya puedes hacer login en el frontend!');

  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      console.log('ℹ️  El usuario demo ya existe!');
      console.log('📧 Email: admin@demo.com');
      console.log('🔑 Password: 123456');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
};

createDemoUser();
