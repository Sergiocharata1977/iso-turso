import { tursoClient } from './lib/tursoClient.js';
import bcrypt from 'bcryptjs';

/**
 * Script para corregir problemas de autenticación y configurar features
 * 1. Corregir tabla de usuarios (usuarios vs users)
 * 2. Configurar organization_features
 * 3. Verificar credenciales de admin
 */

async function fixAuthAndFeatures() {
  try {
    console.log('🔧 Iniciando corrección de autenticación y features...');

    // 1. Verificar estructura de la tabla usuarios
    console.log('\n📋 Verificando tabla usuarios...');
    const userTableInfo = await tursoClient.execute({
      sql: "PRAGMA table_info(usuarios)",
      args: []
    });
    
    console.log('Columnas de usuarios:');
    userTableInfo.rows.forEach(col => {
      console.log(`  - ${col.name} (${col.type})`);
    });

    // 2. Verificar si existe la tabla organization_features
    console.log('\n🔍 Verificando tabla organization_features...');
    const featuresTableExists = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='organization_features'",
      args: []
    });

    if (featuresTableExists.rows.length === 0) {
      console.log('❌ Tabla organization_features no existe. Creándola...');
      await tursoClient.execute({
        sql: `CREATE TABLE organization_features (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          organization_id INTEGER NOT NULL,
          feature_name TEXT NOT NULL,
          is_enabled INTEGER DEFAULT 1,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (organization_id) REFERENCES organizations(id)
        )`,
        args: []
      });
      console.log('✅ Tabla organization_features creada');
    } else {
      console.log('✅ Tabla organization_features ya existe');
    }

    // 3. Verificar organizaciones existentes
    console.log('\n🏢 Verificando organizaciones...');
    const organizations = await tursoClient.execute({
      sql: 'SELECT * FROM organizations',
      args: []
    });

    console.log(`📊 Organizaciones encontradas: ${organizations.rows.length}`);
    organizations.rows.forEach(org => {
      console.log(`  - ID: ${org.id}, Nombre: ${org.name}`);
    });

    // 4. Configurar features para cada organización
    console.log('\n⚙️ Configurando features para organizaciones...');
    for (const org of organizations.rows) {
      console.log(`\n🔧 Configurando features para organización ${org.id} (${org.name})...`);
      
      // Verificar si ya tiene features
      const existingFeatures = await tursoClient.execute({
        sql: 'SELECT COUNT(*) as count FROM organization_features WHERE organization_id = ?',
        args: [org.id]
      });

      if (existingFeatures.rows[0].count > 0) {
        console.log(`  ✅ Organización ${org.id} ya tiene features configuradas`);
        continue;
      }

      // Features básicas para plan basic
      const basicFeatures = [
        'personal_management',
        'department_management', 
        'position_management',
        'process_management',
        'document_management',
        'basic_dashboard',
        'user_management',
        'quality_management'
      ];

      // Insertar features
      for (const feature of basicFeatures) {
        await tursoClient.execute({
          sql: 'INSERT INTO organization_features (organization_id, feature_name, is_enabled) VALUES (?, ?, ?)',
          args: [org.id, feature, 1]
        });
      }

      console.log(`  ✅ ${basicFeatures.length} features configuradas para organización ${org.id}`);
    }

    // 5. Verificar y corregir usuario admin
    console.log('\n👤 Verificando usuario admin...');
    const adminUser = await tursoClient.execute({
      sql: 'SELECT * FROM usuarios WHERE email = ?',
      args: ['admin@demo.com']
    });

    if (adminUser.rows.length === 0) {
      console.log('❌ Usuario admin@demo.com no encontrado. Creándolo...');
      
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
      
      // Crear usuario admin
      await tursoClient.execute({
        sql: `INSERT INTO usuarios (name, email, password_hash, role, organization_id, is_active, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))`,
        args: ['Administrador', 'admin@demo.com', hashedPassword, 'admin', orgId, 1]
      });
      
      console.log('✅ Usuario admin creado exitosamente');
    } else {
      console.log('✅ Usuario admin encontrado:');
      console.log(`  - ID: ${adminUser.rows[0].id}`);
      console.log(`  - Nombre: ${adminUser.rows[0].name}`);
      console.log(`  - Email: ${adminUser.rows[0].email}`);
      console.log(`  - Rol: ${adminUser.rows[0].role}`);
      console.log(`  - Organización: ${adminUser.rows[0].organization_id}`);
      
      // Verificar si la contraseña es correcta
      const isPasswordValid = await bcrypt.compare('admin123', adminUser.rows[0].password_hash);
      if (!isPasswordValid) {
        console.log('⚠️ Contraseña incorrecta. Actualizando contraseña...');
        const newHashedPassword = await bcrypt.hash('admin123', 10);
        await tursoClient.execute({
          sql: 'UPDATE usuarios SET password_hash = ? WHERE email = ?',
          args: [newHashedPassword, 'admin@demo.com']
        });
        console.log('✅ Contraseña actualizada');
      } else {
        console.log('✅ Contraseña correcta');
      }
    }

    // 6. Verificar features configuradas
    console.log('\n📊 Verificando features configuradas...');
    const allFeatures = await tursoClient.execute({
      sql: `SELECT of.organization_id, o.name as org_name, of.feature_name, of.is_enabled
            FROM organization_features of
            JOIN organizations o ON of.organization_id = o.id
            ORDER BY of.organization_id, of.feature_name`,
      args: []
    });

    console.log('Features configuradas:');
    allFeatures.rows.forEach(feature => {
      console.log(`  - ${feature.org_name} (${feature.organization_id}): ${feature.feature_name} = ${feature.is_enabled ? '✅' : '❌'}`);
    });

    console.log('\n🎉 Corrección completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('  ✅ Tabla organization_features verificada/creada');
    console.log('  ✅ Features configuradas para todas las organizaciones');
    console.log('  ✅ Usuario admin verificado/corregido');
    console.log('  ✅ Credenciales: admin@demo.com / admin123');

  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  fixAuthAndFeatures()
    .then(() => {
      console.log('✅ Script completado exitosamente');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error en script:', error);
      process.exit(1);
    });
}

export default fixAuthAndFeatures; 