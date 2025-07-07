import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

async function createDemoUsers() {
  try {
    console.log('🚀 CREANDO USUARIOS DEMO POR NIVEL');
    console.log('=' .repeat(40));

    // 1️⃣ Crear organización si no existe
    let orgId;
    try {
      const existingOrg = await client.execute('SELECT id FROM organizations LIMIT 1');
      if (existingOrg.rows.length > 0) {
        orgId = existingOrg.rows[0].id;
        console.log(`🏢 Usando organización existente ID: ${orgId}`);
      } else {
        const newOrg = await client.execute({
          sql: `INSERT INTO organizations (name, domain, plan, status, created_at) 
                VALUES (?, ?, ?, ?, datetime('now')) RETURNING id`,
          args: ['Empresa Demo', 'demo.com', 'premium', 'active']
        });
        orgId = newOrg.rows[0].id;
        console.log(`🏢 Nueva organización creada ID: ${orgId}`);
      }
    } catch (error) {
      console.error('❌ Error con organización:', error.message);
      return;
    }

    // 2️⃣ Usuarios a crear
    const users = [
      { name: 'Admin Demo', email: 'admin@demo.com', password: 'admin123', role: 'admin' },
      { name: 'Manager Demo', email: 'manager@demo.com', password: 'manager123', role: 'manager' },
      { name: 'Employee Demo', email: 'employee@demo.com', password: 'employee123', role: 'employee' }
    ];

    console.log('\n👥 CREANDO USUARIOS:');
    console.log('-' .repeat(30));

    for (const user of users) {
      try {
        // Verificar si ya existe
        const existing = await client.execute({
          sql: 'SELECT id FROM usuarios WHERE email = ? AND organization_id = ?',
          args: [user.email, orgId]
        });

        if (existing.rows.length > 0) {
          console.log(`⚠️  Usuario ${user.email} ya existe, saltando...`);
          continue;
        }

        // Crear usuario
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        const result = await client.execute({
          sql: `INSERT INTO usuarios (organization_id, name, email, password_hash, role, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now')) RETURNING id`,
          args: [orgId, user.name, user.email, hashedPassword, user.role]
        });

        console.log(`✅ ${user.name} (${user.role})`);
        console.log(`   📧 ${user.email}`);
        console.log(`   🔑 ${user.password}`);
        console.log('');

      } catch (error) {
        console.error(`❌ Error creando ${user.email}:`, error.message);
      }
    }

    // 3️⃣ Verificar resultado
    console.log('🔍 VERIFICANDO USUARIOS CREADOS:');
    const allUsers = await client.execute({
      sql: 'SELECT name, email, role FROM usuarios WHERE organization_id = ?',
      args: [orgId]
    });

    allUsers.rows.forEach(u => {
      const roleIcon = u.role === 'admin' ? '👑' : u.role === 'manager' ? '🎯' : '👤';
      console.log(`${roleIcon} ${u.name} (${u.role}) - ${u.email}`);
    });

    console.log('\n🎉 ¡LISTO! Puedes hacer login con:');
    users.forEach(u => {
      console.log(`${u.email} / ${u.password} (${u.role})`);
    });

  } catch (error) {
    console.error('❌ ERROR GENERAL:', error.message);
  } finally {
    await client.close();
  }
}

createDemoUsers();
