import { tursoClient } from '../lib/tursoClient.js';

async function testDatabaseConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Prueba básica de conexión
    const result = await tursoClient.execute('SELECT 1 as test');
    console.log('✅ Conexión exitosa:', result.rows[0]);
    
    // Verificar tablas existentes
    const tables = await tursoClient.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);
    
    console.log('📋 Tablas disponibles:');
    tables.rows.forEach(table => {
      console.log(`  - ${table.name}`);
    });
    
    // Verificar datos en departamentos
    try {
      const deptCount = await tursoClient.execute('SELECT COUNT(*) as count FROM departamentos');
      console.log(`🏢 Departamentos en la base de datos: ${deptCount.rows[0].count}`);
      
      if (deptCount.rows[0].count > 0) {
        const sampleDepts = await tursoClient.execute('SELECT id, nombre FROM departamentos LIMIT 3');
        console.log('📝 Ejemplos de departamentos:');
        sampleDepts.rows.forEach(dept => {
          console.log(`  - ${dept.nombre} (${dept.id})`);
        });
      }
    } catch (error) {
      console.log('⚠️  Tabla departamentos no existe o no accesible');
    }
    
    // Verificar datos en usuarios
    try {
      const userCount = await tursoClient.execute('SELECT COUNT(*) as count FROM usuarios');
      console.log(`👤 Usuarios en la base de datos: ${userCount.rows[0].count}`);
    } catch (error) {
      console.log('⚠️  Tabla usuarios no existe o no accesible');
    }
    
    console.log('🎉 Prueba de conexión completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la conexión:', error.message);
    console.log('💡 Verifica:');
    console.log('  1. Que el archivo .env.local existe');
    console.log('  2. Que las credenciales de Turso son correctas');
    console.log('  3. Que la base de datos está activa');
  }
}

testDatabaseConnection(); 