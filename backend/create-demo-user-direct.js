import { db } from './lib/tursoClient.js';
import bcrypt from 'bcryptjs';

const createDemoUser = async () => {
  try {
    console.log('👤 Creando usuario demo...');

    // Primero crear una organización
    const orgResult = await db.execute({
      sql: 'INSERT INTO organizations (name, type, industry) VALUES (?, ?, ?)',
      args: ['Empresa Demo', 'empresa', 'general']
    });
    
    const organizationId = orgResult.lastInsertRowid;
    console.log('🏢 Organización creada con ID:', organizationId);

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Crear usuario admin
    const userResult = await db.execute({
      sql: 'INSERT INTO users (name, email, password, role, organization_id) VALUES (?, ?, ?, ?, ?)',
      args: ['Admin Demo', 'admin@demo.com', hashedPassword, 'admin', organizationId]
    });

    const userId = userResult.lastInsertRowid;
    console.log('👤 Usuario creado con ID:', userId);

    console.log('✅ Usuario demo creado exitosamente!');
    console.log('📧 Email: admin@demo.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Rol: admin');

  } catch (error) {
    console.error('❌ Error al crear usuario demo:', error);
  }
};

createDemoUser();