import { tursoClient } from './lib/tursoClient.js';

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Intentar una consulta simple
    const result = await tursoClient.execute("SELECT 'Conexión exitosa' as status");
    console.log('✅ Resultado de la consulta de prueba:', result.rows[0].status);
    
    // Listar todas las tablas
    const tables = await tursoClient.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 Tablas existentes en la base de datos:');
    console.table(tables.rows);
    
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:');
    console.error(error);
  } finally {
    tursoClient.close();
    console.log('🔒 Conexión cerrada.');
  }
}

testConnection();
