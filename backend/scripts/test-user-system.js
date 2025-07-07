// backend/scripts/test-user-system.js

import { tursoClient } from '../lib/tursoClient.js';
import bcrypt from 'bcryptjs';

console.log('🧪 Iniciando pruebas del sistema de usuarios multi-nivel...');

async function testUserSystem() {
  try {
    // 1. Verificar estructura de tablas
    console.log('\n📋 1. Verificando estructura de tablas...');
    
    const organizationsCheck = await tursoClient.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='organizations'`
    });
    
    const organizationFeaturesCheck = await tursoClient.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='organization_features'`
    });
    
    const usuariosCheck = await tursoClient.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'`
    });
    
    console.log(`✅ Tabla organizations: ${organizationsCheck.rows.length > 0 ? 'Existe' : 'NO EXISTE'}`);
    console.log(`✅ Tabla organization_features: ${organizationFeaturesCheck.rows.length > 0 ? 'Existe' : 'NO EXISTE'}`);
    console.log(`✅ Tabla usuarios: ${usuariosCheck.rows.length > 0 ? 'Existe' : 'NO EXISTE'}`);

    // 2. Crear organización para super admin si no existe
    console.log('\n🏢 2. Creando/verificando organización del sistema...');
    
    const systemOrgCheck = await tursoClient.execute({
      sql: `SELECT id FROM organizations WHERE name = 'Sistema IsoFlow3'`
    });
    
    let systemOrgId;
    if (systemOrgCheck.rows.length === 0) {
      console.log('📝 Creando organización del sistema...');
      
      const systemOrgResult = await tursoClient.execute({
        sql: `INSERT INTO organizations (name, plan, max_users, created_at) 
              VALUES (?, ?, ?, ?)`,
        args: ['Sistema IsoFlow3', 'enterprise', 999, new Date().toISOString()]
      });
      
      systemOrgId = Number(systemOrgResult.lastInsertRowid);
      console.log(`✅ Organización del sistema creada con ID: ${systemOrgId}`);
      
      // Configurar todas las features para la organización del sistema
      const allFeatures = ['personal_management', 'department_management', 'position_management', 'process_management', 'document_management', 'basic_dashboard', 'objectives_management', 'indicators_management', 'audit_management', 'findings_management', 'corrective_actions', 'advanced_dashboard', 'ai_assistant', 'system_management'];
      for (const feature of allFeatures) {
        await tursoClient.execute({
          sql: 'INSERT INTO organization_features (organization_id, feature_name, is_enabled) VALUES (?, ?, ?)',
          args: [systemOrgId, feature, true]
        });
      }
    } else {
      systemOrgId = Number(systemOrgCheck.rows[0].id);
      console.log(`✅ Organización del sistema ya existe con ID: ${systemOrgId}`);
    }

    // 3. Crear super admin si no existe
    console.log('\n👑 3. Verificando/Creando super admin...');
    
    const superAdminCheck = await tursoClient.execute({
      sql: `SELECT id FROM usuarios WHERE role = 'super_admin'`
    });
    
    if (superAdminCheck.rows.length === 0) {
      console.log('📝 Creando super admin...');
      
      const hashedPassword = await bcrypt.hash('superadmin123', 10);
      
      const superAdminResult = await tursoClient.execute({
        sql: `INSERT INTO usuarios (name, email, password_hash, role, organization_id, created_at) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: ['Super Admin', 'superadmin@isoflow3.com', hashedPassword, 'super_admin', systemOrgId, new Date().toISOString()]
      });
      
      console.log(`✅ Super admin creado con ID: ${superAdminResult.lastInsertRowid}`);
      console.log('📧 Email: superadmin@isoflow3.com');
      console.log('🔑 Password: superadmin123');
    } else {
      console.log(`✅ Super admin ya existe con ID: ${superAdminCheck.rows[0].id}`);
    }

    // 4. Crear organizaciones de prueba
    console.log('\n🏢 4. Creando organizaciones de prueba...');
    
    // Organización Básica
    const basicOrgCheck = await tursoClient.execute({
      sql: `SELECT id FROM organizations WHERE name = 'Empresa Básica Demo'`
    });
    
    let basicOrgId;
    if (basicOrgCheck.rows.length === 0) {
      const basicOrgResult = await tursoClient.execute({
        sql: `INSERT INTO organizations (name, plan, max_users, created_at) 
              VALUES (?, ?, ?, ?)`,
        args: ['Empresa Básica Demo', 'basic', 10, new Date().toISOString()]
      });
      basicOrgId = Number(basicOrgResult.lastInsertRowid);
      console.log(`✅ Organización básica creada con ID: ${basicOrgId}`);
      
      // Configurar features básicas
      const basicFeatures = ['personal_management', 'department_management', 'position_management', 'process_management', 'document_management', 'basic_dashboard', 'communications', 'tickets', 'calendar'];
      for (const feature of basicFeatures) {
        await tursoClient.execute({
          sql: 'INSERT INTO organization_features (organization_id, feature_name, is_enabled) VALUES (?, ?, ?)',
          args: [basicOrgId, feature, true]
        });
      }
    } else {
      basicOrgId = Number(basicOrgCheck.rows[0].id);
      console.log(`✅ Organización básica ya existe con ID: ${basicOrgId}`);
    }
    
    // Organización Premium
    const premiumOrgCheck = await tursoClient.execute({
      sql: `SELECT id FROM organizations WHERE name = 'Empresa Premium Demo'`
    });
    
    let premiumOrgId;
    if (premiumOrgCheck.rows.length === 0) {
      const premiumOrgResult = await tursoClient.execute({
        sql: `INSERT INTO organizations (name, plan, max_users, created_at) 
              VALUES (?, ?, ?, ?)`,
        args: ['Empresa Premium Demo', 'premium', 100, new Date().toISOString()]
      });
      premiumOrgId = Number(premiumOrgResult.lastInsertRowid);
      console.log(`✅ Organización premium creada con ID: ${premiumOrgId}`);
      
      // Configurar features premium
      const premiumFeatures = ['personal_management', 'department_management', 'position_management', 'process_management', 'document_management', 'basic_dashboard', 'objectives_management', 'indicators_management', 'audit_management', 'findings_management', 'corrective_actions', 'advanced_dashboard', 'ai_assistant', 'communications', 'tickets', 'calendar', 'capacitaciones', 'evaluaciones'];
      for (const feature of premiumFeatures) {
        await tursoClient.execute({
          sql: 'INSERT INTO organization_features (organization_id, feature_name, is_enabled) VALUES (?, ?, ?)',
          args: [premiumOrgId, feature, true]
        });
      }
    } else {
      premiumOrgId = Number(premiumOrgCheck.rows[0].id);
      console.log(`✅ Organización premium ya existe con ID: ${premiumOrgId}`);
    }

    // 5. Crear usuarios de prueba
    console.log('\n👥 5. Creando usuarios de prueba...');
    
    const testUsers = [
      { name: 'Admin Básico', email: 'admin.basico@demo.com', password: 'admin123', role: 'admin', org_id: basicOrgId },
      { name: 'Manager Básico', email: 'manager.basico@demo.com', password: 'manager123', role: 'manager', org_id: basicOrgId },
      { name: 'Empleado Básico', email: 'empleado.basico@demo.com', password: 'empleado123', role: 'employee', org_id: basicOrgId },
      { name: 'Admin Premium', email: 'admin.premium@demo.com', password: 'admin123', role: 'admin', org_id: premiumOrgId },
      { name: 'Manager Premium', email: 'manager.premium@demo.com', password: 'manager123', role: 'manager', org_id: premiumOrgId },
      { name: 'Empleado Premium', email: 'empleado.premium@demo.com', password: 'empleado123', role: 'employee', org_id: premiumOrgId }
    ];
    
    for (const user of testUsers) {
      const existingUser = await tursoClient.execute({
        sql: 'SELECT id FROM usuarios WHERE email = ?',
        args: [user.email]
      });
      
      if (existingUser.rows.length === 0) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        const userResult = await tursoClient.execute({
          sql: `INSERT INTO usuarios (name, email, password_hash, role, organization_id, created_at) 
                VALUES (?, ?, ?, ?, ?, ?)`,
          args: [user.name, user.email, hashedPassword, user.role, user.org_id, new Date().toISOString()]
        });
        
        console.log(`✅ Usuario creado: ${user.name} (${user.email}) - ${user.role}`);
      } else {
        console.log(`⚠️ Usuario ya existe: ${user.email}`);
      }
    }

    // 6. Verificar resultados
    console.log('\n📊 6. Resumen del sistema...');
    
    const orgStats = await tursoClient.execute({
      sql: `SELECT o.name, o.plan, o.max_users, COUNT(u.id) as user_count
            FROM organizations o
            LEFT JOIN usuarios u ON o.id = u.organization_id
            GROUP BY o.id, o.name, o.plan, o.max_users
            ORDER BY o.name`
    });
    
    console.log('\n🏢 Organizaciones configuradas:');
    for (const org of orgStats.rows) {
      console.log(`   📋 ${org.name}: Plan ${org.plan.toUpperCase()} (${org.user_count}/${org.max_users} usuarios)`);
    }
    
    const userStats = await tursoClient.execute({
      sql: `SELECT role, COUNT(*) as count FROM usuarios GROUP BY role ORDER BY role`
    });
    
    console.log('\n👥 Usuarios por rol:');
    for (const stat of userStats.rows) {
      console.log(`   👤 ${stat.role}: ${stat.count} usuarios`);
    }
    
    const featureStats = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM organization_features WHERE is_enabled = 1`
    });
    
    console.log(`\n🔧 Features configuradas: ${featureStats.rows[0].count}`);

    // 7. Verificar que el plan de organizaciones sea correcto
    console.log('\n🔍 7. Verificando configuración de planes...');
    
    const planCheck = await tursoClient.execute({
      sql: `SELECT o.name, o.plan, COUNT(of.feature_name) as feature_count
            FROM organizations o
            LEFT JOIN organization_features of ON o.id = of.organization_id
            WHERE of.is_enabled = 1
            GROUP BY o.id, o.name, o.plan
            ORDER BY o.name`
    });
    
    console.log('\n📋 Features por organización:');
    for (const org of planCheck.rows) {
      console.log(`   🏢 ${org.name} (${org.plan}): ${org.feature_count} features habilitadas`);
    }

    // 8. Mostrar credenciales de acceso
    console.log('\n🔑 8. CREDENCIALES DE ACCESO PARA PRUEBAS:');
    console.log('');
    console.log('👑 SUPER ADMIN (Gestión Global):');
    console.log('   📧 Email: superadmin@isoflow3.com');
    console.log('   🔑 Password: superadmin123');
    console.log('   🎯 Funciones: Crear organizaciones, cambiar planes, gestión global');
    console.log('');
    console.log('🏢 ORGANIZACIÓN BÁSICA (Plan Basic):');
    console.log('   📧 Admin: admin.basico@demo.com (password: admin123)');
    console.log('   📧 Manager: manager.basico@demo.com (password: manager123)');
    console.log('   📧 Empleado: empleado.basico@demo.com (password: empleado123)');
    console.log('   🎯 Limitaciones: Máximo 10 usuarios, módulos básicos solamente');
    console.log('');
    console.log('🚀 ORGANIZACIÓN PREMIUM (Plan Premium):');
    console.log('   📧 Admin: admin.premium@demo.com (password: admin123)');
    console.log('   📧 Manager: manager.premium@demo.com (password: manager123)');
    console.log('   📧 Empleado: empleado.premium@demo.com (password: empleado123)');
    console.log('   🎯 Beneficios: Usuarios ilimitados, todos los módulos, AI Assistant');
    
    console.log('\n🎉 ¡Sistema de usuarios multi-nivel configurado exitosamente!');
    console.log('\n✨ PRÓXIMOS PASOS:');
    console.log('   1. ✅ Estructura de base de datos migrada');
    console.log('   2. ✅ Middleware de permisos implementado');
    console.log('   3. ✅ Controladores de usuario creados'); 
    console.log('   4. ✅ Datos de prueba configurados');
    console.log('   5. 🔄 Actualizar frontend para mostrar/ocultar según permisos');
    console.log('   6. 🔄 Crear panel de super admin');
    console.log('   7. 🔄 Testing completo del sistema');
    
  } catch (error) {
    console.error('💥 Error en las pruebas:', error);
    process.exit(1);
  }
}

// Ejecutar pruebas
testUserSystem().then(() => {
  console.log('\n✅ Pruebas completadas. Cerrando conexión...');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
}); 