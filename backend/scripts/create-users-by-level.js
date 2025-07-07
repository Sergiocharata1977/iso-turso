// Importaciones ES modules
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Configurar dotenv
dotenv.config();

// Verificar variables de entorno
if (!process.env.DATABASE_URL || !process.env.TURSO_DB_TOKEN) {
  console.error('❌ ERROR: Variables de entorno DATABASE_URL y TURSO_DB_TOKEN son requeridas');
  process.exit(1);
}

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

// 🏢 Datos de la organización de ejemplo
const ORGANIZATION_DATA = {
  name: 'Empresa Demo SAAS',
  domain: 'demo.isoflow.com',
  plan: 'premium',
  status: 'active'
};

// 👥 Usuarios de ejemplo por nivel
const USERS_BY_LEVEL = [
  {
    name: 'Super Admin',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
    description: '👑 Administrador principal con acceso total'
  },
  {
    name: 'Manager Principal',
    email: 'manager@demo.com',
    password: 'manager123',
    role: 'manager',
    description: '🎯 Gerente con permisos de gestión'
  },
  {
    name: 'Empleado Demo',
    email: 'empleado@demo.com',
    password: 'empleado123',
    role: 'employee',
    description: '👤 Empleado con permisos básicos'
  }
];

async function createUsersDemo() {
  try {
    console.log('🚀 INICIANDO CREACIÓN DE USUARIOS POR NIVEL');
    console.log('=' .repeat(50));

    // 1️⃣ CREAR ORGANIZACIÓN
    console.log('🏢 Creando organización demo...');
    
    const orgResult = await client.execute({
      sql: `INSERT INTO organizations (name, domain, plan, status, created_at) 
            VALUES (?, ?, ?, ?, datetime('now')) 
            RETURNING id`,
      args: [
        ORGANIZATION_DATA.name,
        ORGANIZATION_DATA.domain,
        ORGANIZATION_DATA.plan,
        ORGANIZATION_DATA.status
      ]
    });

    const organizationId = orgResult.rows[0].id;
    console.log(`✅ Organización creada con ID: ${organizationId}`);
    console.log(`   Nombre: ${ORGANIZATION_DATA.name}`);
    console.log(`   Dominio: ${ORGANIZATION_DATA.domain}`);
    console.log('');

    // 2️⃣ CREAR USUARIOS POR NIVEL
    console.log('👥 Creando usuarios por nivel...');
    console.log('-' .repeat(30));

    for (const userData of USERS_BY_LEVEL) {
      console.log(`\n🔐 Creando usuario: ${userData.name}`);
      
      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Insertar usuario
      const userResult = await client.execute({
        sql: `INSERT INTO usuarios (
                organization_id, name, email, password_hash, role, 
                status, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
              RETURNING id`,
        args: [
          organizationId,
          userData.name,
          userData.email,
          hashedPassword,
          userData.role
        ]
      });

      const userId = userResult.rows[0].id;
      
      console.log(`   ✅ Usuario creado con ID: ${userId}`);
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   🔑 Password: ${userData.password}`);
      console.log(`   👤 Rol: ${userData.role}`);
      console.log(`   📝 ${userData.description}`);
    }

    console.log('\n' + '=' .repeat(50));
    console.log('🎉 ¡USUARIOS CREADOS EXITOSAMENTE!');
    console.log('');

    // 3️⃣ MOSTRAR RESUMEN FINAL
    console.log('📋 RESUMEN DE CREDENCIALES:');
    console.log('-' .repeat(30));
    
    USERS_BY_LEVEL.forEach(user => {
      console.log(`${user.description}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Password: ${user.password}`);
      console.log('');
    });

    console.log('🌐 ORGANIZACIÓN:');
    console.log(`   🏢 ${ORGANIZATION_DATA.name}`);
    console.log(`   🌍 ${ORGANIZATION_DATA.domain}`);
    console.log(`   📦 Plan: ${ORGANIZATION_DATA.plan}`);
    console.log('');

    // 4️⃣ VERIFICAR CREACIÓN
    console.log('🔍 VERIFICANDO CREACIÓN...');
    const finalCheck = await client.execute(`
      SELECT u.id, u.name, u.email, u.role, o.name as org_name
      FROM usuarios u 
      JOIN organizations o ON u.organization_id = o.id
      WHERE o.id = ?
    `, [organizationId]);

    console.log(`✅ ${finalCheck.rows.length} usuarios verificados en la organización`);
    
    finalCheck.rows.forEach(row => {
      console.log(`   - ${row.name} (${row.role}) - ${row.email}`);
    });

    console.log('\n🚀 ¡LISTO PARA USAR EL SISTEMA!');
    console.log('Puedes hacer login con cualquiera de las credenciales mostradas arriba.');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.close();
  }
}

// Ejecutar directamente
createUsersDemo();

export { createUsersDemo };
