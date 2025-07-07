import { tursoClient } from './lib/tursoClient.js';

async function setupInitialDataSimple() {
  try {
    console.log('🚀 Configurando datos iniciales...');
    
    // Paso 1: Verificar estructura de la tabla organizations
    console.log('\n🔍 Verificando estructura de la tabla organizations...');
    const orgSchema = await tursoClient.execute({
      sql: "PRAGMA table_info(organizations)",
      args: []
    });
    
    console.log('Columnas de organizations:');
    orgSchema.rows.forEach(col => {
      console.log(`  - ${col.name} (${col.type})`);
    });
    
    // Paso 2: Crear organización con las columnas que existen
    console.log('\n🏢 Creando organización...');
    const orgResult = await tursoClient.execute({
      sql: `INSERT INTO organizations (name, created_at, updated_at) 
            VALUES (?, datetime('now'), datetime('now'))`,
      args: ['Organización Demo']
    });
    
    const organizationId = orgResult.lastInsertRowid;
    console.log(`✅ Organización creada con ID: ${organizationId}`);
    
    // Paso 3: Verificar estructura de la tabla usuarios
    console.log('\n🔍 Verificando estructura de la tabla usuarios...');
    const userSchema = await tursoClient.execute({
      sql: "PRAGMA table_info(usuarios)",
      args: []
    });
    
    console.log('Columnas de usuarios:');
    userSchema.rows.forEach(col => {
      console.log(`  - ${col.name} (${col.type})`);
    });
    
    // Paso 4: Crear usuario administrador
    console.log('\n👤 Creando usuario administrador...');
    const email = 'admin@demo.com';
    const password = '123456'; // Contraseña simple para testing
    const name = 'Administrador';
    const role = 'admin';
    
    const userResult = await tursoClient.execute({
      sql: `INSERT INTO usuarios (
        organization_id, name, email, password_hash, role, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      args: [organizationId, name, email, password, role, 1]
    });
    
    const userId = userResult.lastInsertRowid;
    console.log(`✅ Usuario creado con ID: ${userId}`);
    
    // Paso 5: Verificar que todo se creó correctamente
    console.log('\n🔍 Verificando datos creados...');
    
    // Verificar organización
    const orgCheck = await tursoClient.execute({
      sql: 'SELECT * FROM organizations WHERE id = ?',
      args: [organizationId]
    });
    
    if (orgCheck.rows.length > 0) {
      console.log('✅ Organización verificada:');
      console.log(`   - ID: ${orgCheck.rows[0].id}`);
      console.log(`   - Nombre: ${orgCheck.rows[0].name}`);
    }
    
    // Verificar usuario
    const userCheck = await tursoClient.execute({
      sql: 'SELECT * FROM usuarios WHERE id = ?',
      args: [userId]
    });
    
    if (userCheck.rows.length > 0) {
      console.log('✅ Usuario verificado:');
      console.log(`   - ID: ${userCheck.rows[0].id}`);
      console.log(`   - Nombre: ${userCheck.rows[0].name}`);
      console.log(`   - Email: ${userCheck.rows[0].email}`);
      console.log(`   - Rol: ${userCheck.rows[0].role}`);
      console.log(`   - Organization ID: ${userCheck.rows[0].organization_id}`);
    }
    
    console.log('\n🎉 ¡Configuración inicial completada!');
    console.log('\n📋 Credenciales para login:');
    console.log(`   📧 Email: ${email}`);
    console.log(`   🔑 Contraseña: ${password}`);
    console.log('\n💡 Ahora puedes intentar hacer login en el frontend');
    
  } catch (error) {
    console.error('❌ Error en la configuración inicial:', error.message);
    console.error('Detalles del error:', error);
  }
}

setupInitialDataSimple(); 