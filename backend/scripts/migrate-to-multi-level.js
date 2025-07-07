import { tursoClient } from '../lib/tursoClient.js';

console.log('🚀 Iniciando migración a sistema multi-nivel...');

async function migrateToMultiLevel() {
  try {
    console.log('📋 Verificando estructura actual de la BD...');
    
    // 1. Verificar si la tabla organizations existe
    const orgTableCheck = await tursoClient.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='organizations'`
    });
    
    if (orgTableCheck.rows.length === 0) {
      console.log('❌ Tabla organizations no existe. Creándola...');
      await tursoClient.execute({
        sql: `CREATE TABLE organizations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(255) NOT NULL,
          plan VARCHAR(20) DEFAULT 'basic',
          max_users INTEGER DEFAULT 10,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      });
      console.log('✅ Tabla organizations creada exitosamente');
    } else {
      console.log('✅ Tabla organizations existe');
      
      // 2. Verificar si la columna plan existe
      const columns = await tursoClient.execute({
        sql: `PRAGMA table_info(organizations)`
      });
      
      const hasPlantColumn = columns.rows.some(col => col.name === 'plan');
      const hasMaxUsersColumn = columns.rows.some(col => col.name === 'max_users');
      
      if (!hasPlantColumn) {
        console.log('📊 Agregando columna plan a organizations...');
        await tursoClient.execute({
          sql: `ALTER TABLE organizations ADD COLUMN plan VARCHAR(20) DEFAULT 'basic'`
        });
        console.log('✅ Columna plan agregada');
      }
      
      if (!hasMaxUsersColumn) {
        console.log('📊 Agregando columna max_users a organizations...');
        await tursoClient.execute({
          sql: `ALTER TABLE organizations ADD COLUMN max_users INTEGER DEFAULT 10`
        });
        console.log('✅ Columna max_users agregada');
      }
      
      // 3. Agregar created_at y updated_at si no existen
      const hasCreatedAt = columns.rows.some(col => col.name === 'created_at');
      const hasUpdatedAt = columns.rows.some(col => col.name === 'updated_at');
      
      if (!hasCreatedAt) {
        console.log('📊 Agregando columna created_at a organizations...');
        await tursoClient.execute({
          sql: `ALTER TABLE organizations ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`
        });
        console.log('✅ Columna created_at agregada');
      }
      
      if (!hasUpdatedAt) {
        console.log('📊 Agregando columna updated_at a organizations...');
        await tursoClient.execute({
          sql: `ALTER TABLE organizations ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`
        });
        console.log('✅ Columna updated_at agregada');
      }
    }
    
    // 4. Crear tabla organization_features
    console.log('📋 Creando tabla organization_features...');
    
    const orgFeaturesCheck = await tursoClient.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='organization_features'`
    });
    
    if (orgFeaturesCheck.rows.length === 0) {
      await tursoClient.execute({
        sql: `CREATE TABLE organization_features (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          organization_id INTEGER,
          feature_name VARCHAR(100),
          is_enabled BOOLEAN DEFAULT TRUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (organization_id) REFERENCES organizations(id)
        )`
      });
      console.log('✅ Tabla organization_features creada');
    } else {
      console.log('✅ Tabla organization_features ya existe');
    }
    
    // 5. Verificar tabla usuarios
    console.log('📋 Verificando tabla usuarios...');
    const usuariosCheck = await tursoClient.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'`
    });
    
    if (usuariosCheck.rows.length > 0) {
      console.log('✅ Tabla usuarios existe');
      
      // Verificar que la columna role soporte los nuevos valores
      const usuariosColumns = await tursoClient.execute({
        sql: `PRAGMA table_info(usuarios)`
      });
      
      console.log('📊 Columnas de usuarios:', usuariosColumns.rows.map(r => r.name));
      
      // Crear índices para optimizar consultas
      console.log('📊 Creando índices...');
      try {
        await tursoClient.execute({
          sql: `CREATE INDEX IF NOT EXISTS idx_usuarios_organization_id ON usuarios(organization_id)`
        });
        
        await tursoClient.execute({
          sql: `CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role)`
        });
        
        await tursoClient.execute({
          sql: `CREATE INDEX IF NOT EXISTS idx_org_features_org_id ON organization_features(organization_id)`
        });
        
        console.log('✅ Índices creados exitosamente');
      } catch (error) {
        console.log('⚠️ Algunos índices ya existían:', error.message);
      }
    } else {
      console.log('❌ Tabla usuarios no existe');
    }
    
    // 6. Migrar datos existentes
    console.log('📊 Migrando datos existentes...');
    
    // Asignar plan 'basic' a todas las organizaciones existentes que no tengan plan
    const orgUpdate = await tursoClient.execute({
      sql: `UPDATE organizations SET plan = 'basic', max_users = 10 WHERE plan IS NULL OR plan = ''`
    });
    
    console.log(`✅ ${orgUpdate.rowsAffected} organizaciones actualizadas con plan básico`);
    
    // 7. Crear features básicas para organizaciones existentes
    console.log('📊 Creando features básicas para organizaciones existentes...');
    
    const orgs = await tursoClient.execute({
      sql: `SELECT id, plan FROM organizations`
    });
    
    const basicFeatures = [
      'personal_management',
      'department_management', 
      'position_management',
      'process_management',
      'document_management',
      'basic_dashboard'
    ];
    
    const premiumFeatures = [
      ...basicFeatures,
      'objectives_management',
      'indicators_management',
      'audit_management',
      'findings_management',
      'corrective_actions',
      'complaints_management',
      'advanced_dashboard',
      'ai_assistant'
    ];
    
    for (const org of orgs.rows) {
      const features = org.plan === 'premium' ? premiumFeatures : basicFeatures;
      
      for (const feature of features) {
        // Verificar si la feature ya existe
        const existing = await tursoClient.execute({
          sql: `SELECT id FROM organization_features WHERE organization_id = ? AND feature_name = ?`,
          args: [org.id, feature]
        });
        
        if (existing.rows.length === 0) {
          await tursoClient.execute({
            sql: `INSERT INTO organization_features (organization_id, feature_name, is_enabled) VALUES (?, ?, ?)`,
            args: [org.id, feature, true]
          });
        }
      }
    }
    
    console.log('✅ Features asignadas a organizaciones existentes');
    
    // 8. Verificar resultados
    console.log('📋 Verificando resultados de la migración...');
    
    const orgCount = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM organizations`
    });
    
    const orgWithPlans = await tursoClient.execute({
      sql: `SELECT plan, COUNT(*) as count FROM organizations GROUP BY plan`
    });
    
    const featuresCount = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM organization_features`
    });
    
    console.log(`📊 Organizaciones totales: ${orgCount.rows[0].count}`);
    console.log('📊 Organizaciones por plan:');
    orgWithPlans.rows.forEach(row => {
      console.log(`   ${row.plan}: ${row.count}`);
    });
    console.log(`📊 Features configuradas: ${featuresCount.rows[0].count}`);
    
    console.log('🎉 ¡Migración completada exitosamente!');
    console.log('');
    console.log('📋 RESUMEN DE CAMBIOS:');
    console.log('   ✅ Tabla organizations actualizada con columnas plan y max_users');
    console.log('   ✅ Tabla organization_features creada');
    console.log('   ✅ Índices creados para optimizar consultas');
    console.log('   ✅ Datos existentes migrados a plan básico');
    console.log('   ✅ Features asignadas según plan de cada organización');
    console.log('');
    console.log('🚀 Sistema multi-nivel listo para usar!');
    
  } catch (error) {
    console.error('💥 Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateToMultiLevel().then(() => {
  console.log('✅ Migración completada. Cerrando conexión...');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
