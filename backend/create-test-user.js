import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const createTestUser = async () => {
  try {
    console.log('🔗 Conectando a TursoDB...');
    
    const client = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.TURSO_DB_TOKEN,
    });

    // 1. Crear organización de prueba
    console.log('🏢 Creando organización de prueba...');
    const orgResult = await client.execute({
      sql: `INSERT INTO organizations (name, created_at) VALUES (?, ?) RETURNING id`,
      args: ['Empresa Demo', new Date().toISOString()]
    });
    
    const organizationId = orgResult.rows[0].id;
    console.log(`✅ Organización creada con ID: ${organizationId}`);

    // 2. Crear usuario admin de prueba
    console.log('👤 Creando usuario admin de prueba...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    await client.execute({
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

    console.log('🎉 ¡Usuario de prueba creado exitosamente!');
    console.log('');
    console.log('📋 CREDENCIALES DE LOGIN:');
    console.log('📧 Email: admin@demo.com');
    console.log('🔑 Password: 123456');
    console.log('🏢 Organización: Empresa Demo');
    console.log('👤 Rol: admin');
    console.log('');
    console.log('🌐 Ahora puedes hacer login en: http://localhost:5173/login');

  } catch (error) {
    console.error('❌ Error al crear usuario de prueba:', error.message);
  }
};

createTestUser();
