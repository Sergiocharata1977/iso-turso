import { tursoClient } from './lib/tursoClient.js';
import bcrypt from 'bcryptjs';

/**
 * Script para diagnosticar problemas de usuarios y autenticación
 */

async function debugUsers() {
  try {
    console.log('🔍 Diagnóstico de usuarios y autenticación...\n');

    // 1. Verificar tablas existentes
    console.log('📋 Verificando tablas existentes...');
    const tables = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%user%' OR name LIKE '%organiz%'",
      args: []
    });
    
    console.log('Tablas encontradas:');
    tables.rows.forEach(table => {
      console.log(`  - ${table.name}`);
    });

    // 2. Verificar estructura de la tabla usuarios
    console.log('\n🔍 Verificando estructura de usuarios...');
    const userTableInfo = await tursoClient.execute({
      sql: "PRAGMA table_info(usuarios)",
      args: []
    });
    
    console.log('Columnas de usuarios:');
    userTableInfo.rows.forEach(col => {
      console.log(`  - ${col.name} (${col.type})`);
    });

    // 3. Verificar usuarios existentes
    console.log('\n👥 Verificando usuarios existentes...');
    const users = await tursoClient.execute({
      sql: 'SELECT id, name, email, role, organization_id, is_active, created_at FROM usuarios',
      args: []
    });

    console.log(`Total de usuarios: ${users.rows.length}`);
    users.rows.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, Nombre: ${user.name}, Rol: ${user.role}, Org: ${user.organization_id}, Activo: ${user.is_active}`);
    });

    // 4. Buscar específicamente admin@demo.com
    console.log('\n🔍 Buscando admin@demo.com...');
    const adminUser = await tursoClient.execute({
      sql: 'SELECT * FROM usuarios WHERE email = ?',
      args: ['admin@demo.com']
    });

    if (adminUser.rows.length === 0) {
      console.log('❌ Usuario admin@demo.com NO encontrado');
    } else {
      console.log('✅ Usuario admin@demo.com encontrado:');
      const user = adminUser.rows[0];
      console.log(`  - ID: ${user.id}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Nombre: ${user.name}`);
      console.log(`  - Rol: ${user.role}`);
      console.log(`  - Organización: ${user.organization_id}`);
      console.log(`  - Activo: ${user.is_active}`);
      console.log(`  - Password hash: ${user.password_hash ? 'SÍ' : 'NO'}`);
      
      if (user.password_hash) {
        // Verificar si la contraseña admin123 coincide
        const isValid = await bcrypt.compare('admin123', user.password_hash);
        console.log(`  - Contraseña admin123 válida: ${isValid ? '✅' : '❌'}`);
      }
    }

    // 5. Verificar organizaciones
    console.log('\n🏢 Verificando organizaciones...');
    const organizations = await tursoClient.execute({
      sql: 'SELECT * FROM organizations',
      args: []
    });

    console.log(`Total de organizaciones: ${organizations.rows.length}`);
    organizations.rows.forEach(org => {
      console.log(`  - ID: ${org.id}, Nombre: ${org.name}`);
    });

    // 6. Verificar organization_features
    console.log('\n⚙️ Verificando organization_features...');
    const features = await tursoClient.execute({
      sql: 'SELECT organization_id, feature_name, is_enabled FROM organization_features',
      args: []
    });

    console.log(`Total de features: ${features.rows.length}`);
    features.rows.forEach(feature => {
      console.log(`  - Org ${feature.organization_id}: ${feature.feature_name} = ${feature.is_enabled ? '✅' : '❌'}`);
    });

    // 7. Crear usuario admin si no existe
    if (adminUser.rows.length === 0) {
      console.log('\n👤 Creando usuario admin@demo.com...');
      
      // Buscar organización para asignar
      const org = await tursoClient.execute({
        sql: 'SELECT id FROM organizations LIMIT 1',
        args: []
      });

      if (org.rows.length === 0) {
        console.log('❌ No hay organizaciones. Creando organización demo...');
        const orgResult = await tursoClient.execute({
          sql: 'INSERT INTO organizations (name, created_at, updated_at) VALUES (?, datetime("now"), datetime("now"))',
          args: ['Organización Demo']
        });
        const orgId = orgResult.lastInsertRowid;
        console.log(`✅ Organización demo creada con ID: ${orgId}`);
      }

      const orgId = org.rows[0]?.id || 1;
      
      // Crear hash de contraseña
      const hashedPassword = await bcrypt.hash('admin123', 10);
      console.log(`Hash generado: ${hashedPassword}`);
      
      // Crear usuario admin
      const userResult = await tursoClient.execute({
        sql: `INSERT INTO usuarios (name, email, password_hash, role, organization_id, is_active, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))`,
        args: ['Administrador', 'admin@demo.com', hashedPassword, 'admin', orgId, 1]
      });
      
      console.log(`✅ Usuario admin creado con ID: ${userResult.lastInsertRowid}`);
    }

    console.log('\n🎉 Diagnóstico completado!');

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  debugUsers()
    .then(() => {
      console.log('✅ Script completado exitosamente');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error en script:', error);
      process.exit(1);
    });
}

export default debugUsers; 