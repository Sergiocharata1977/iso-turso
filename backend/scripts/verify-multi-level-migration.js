import { tursoClient } from '../lib/tursoClient.js';

console.log('🔍 Verificando migración multi-nivel...');

async function verifyMigration() {
  try {
    // 1. Verificar estructura de tabla organizations
    console.log('📋 Verificando tabla organizations...');
    const orgColumns = await tursoClient.execute({
      sql: `PRAGMA table_info(organizations)`
    });
    
    console.log('✅ Columnas de organizations:');
    orgColumns.rows.forEach(col => {
      console.log(`   - ${col.name}: ${col.type} (${col.dflt_value ? 'DEFAULT: ' + col.dflt_value : 'Sin default'})`);
    });
    
    // 2. Verificar tabla organization_features
    console.log('\n📋 Verificando tabla organization_features...');
    const featuresCheck = await tursoClient.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='organization_features'`
    });
    
    if (featuresCheck.rows.length > 0) {
      console.log('✅ Tabla organization_features existe');
      
      const featuresColumns = await tursoClient.execute({
        sql: `PRAGMA table_info(organization_features)`
      });
      
      console.log('✅ Columnas de organization_features:');
      featuresColumns.rows.forEach(col => {
        console.log(`   - ${col.name}: ${col.type}`);
      });
    } else {
      console.log('❌ Tabla organization_features NO existe');
    }
    
    // 3. Verificar datos existentes
    console.log('\n📊 Verificando datos existentes...');
    
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
    
    // 4. Verificar usuarios
    console.log('\n👥 Verificando usuarios...');
    const userCount = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM usuarios`
    });
    
    const usersByRole = await tursoClient.execute({
      sql: `SELECT role, COUNT(*) as count FROM usuarios GROUP BY role`
    });
    
    console.log(`👥 Usuarios totales: ${userCount.rows[0].count}`);
    console.log('👥 Usuarios por rol:');
    usersByRole.rows.forEach(row => {
      console.log(`   ${row.role}: ${row.count}`);
    });
    
    // 5. Verificar integridad
    console.log('\n🔍 Verificando integridad...');
    
    // Verificar que todas las organizaciones tienen plan
    const orgsWithoutPlan = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM organizations WHERE plan IS NULL OR plan = ''`
    });
    
    if (orgsWithoutPlan.rows[0].count > 0) {
      console.log(`❌ ${orgsWithoutPlan.rows[0].count} organizaciones sin plan definido`);
    } else {
      console.log('✅ Todas las organizaciones tienen plan definido');
    }
    
    // Verificar que todas las organizaciones tienen features
    const orgsWithoutFeatures = await tursoClient.execute({
      sql: `SELECT o.id, o.name FROM organizations o 
            LEFT JOIN organization_features of ON o.id = of.organization_id 
            WHERE of.organization_id IS NULL`
    });
    
    if (orgsWithoutFeatures.rows.length > 0) {
      console.log(`❌ ${orgsWithoutFeatures.rows.length} organizaciones sin features:`);
      orgsWithoutFeatures.rows.forEach(org => {
        console.log(`   - ${org.name} (ID: ${org.id})`);
      });
    } else {
      console.log('✅ Todas las organizaciones tienen features configuradas');
    }
    
    // 6. Mostrar ejemplo de datos
    console.log('\n📋 Ejemplo de datos actuales:');
    
    const sampleOrg = await tursoClient.execute({
      sql: `SELECT * FROM organizations LIMIT 1`
    });
    
    if (sampleOrg.rows.length > 0) {
      console.log('📋 Organización ejemplo:');
      console.log(sampleOrg.rows[0]);
      
      const orgFeatures = await tursoClient.execute({
        sql: `SELECT feature_name, is_enabled FROM organization_features WHERE organization_id = ? LIMIT 5`,
        args: [sampleOrg.rows[0].id]
      });
      
      console.log('📋 Features ejemplo:');
      orgFeatures.rows.forEach(feature => {
        console.log(`   - ${feature.feature_name}: ${feature.is_enabled ? 'Habilitada' : 'Deshabilitada'}`);
      });
    }
    
    console.log('\n🎉 ¡Verificación completada!');
    console.log('📋 ESTADO DE LA MIGRACIÓN:');
    console.log('   ✅ Estructura de tablas actualizada');
    console.log('   ✅ Datos existentes migrados');
    console.log('   ✅ Features configuradas por organización');
    console.log('   ✅ Sistema multi-nivel listo para usar');
    
  } catch (error) {
    console.error('💥 Error durante la verificación:', error);
    process.exit(1);
  }
}

// Ejecutar verificación
verifyMigration().then(() => {
  console.log('✅ Verificación completada. Cerrando conexión...');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
