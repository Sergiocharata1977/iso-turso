import { tursoClient } from '../lib/tursoClient.js';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

async function checkUsuariosStructure() {
  try {
    console.log('🔍 Verificando estructura real de la tabla usuarios...');
    console.log('📡 Conectando a TursoDB...');
    
    // Probar conexión primero
    await tursoClient.execute({ sql: "SELECT 1 as test;" });
    console.log('✅ Conexión exitosa');
    
    // Obtener información de la tabla usuarios
    console.log('📋 Obteniendo estructura de tabla usuarios...');
    const result = await tursoClient.execute({
      sql: "PRAGMA table_info(usuarios);"
    });
    
    console.log('\n📋 ESTRUCTURA ACTUAL DE LA TABLA USUARIOS:');
    console.log('='.repeat(50));
    
    if (result.rows.length === 0) {
      console.log('❌ La tabla usuarios NO EXISTE en la base de datos');
      return;
    }
    
    result.rows.forEach((column, index) => {
      console.log(`${index + 1}. ${column.name} (${column.type}) - ${column.notnull ? 'NOT NULL' : 'NULL'} - ${column.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    console.log('\n🔍 Verificando si hay datos en la tabla...');
    const countResult = await tursoClient.execute({
      sql: "SELECT COUNT(*) as count FROM usuarios;"
    });
    
    console.log(`📊 Total de usuarios en la tabla: ${countResult.rows[0].count}`);
    
    if (countResult.rows[0].count > 0) {
      console.log('\n👥 Primeros 3 usuarios (solo estructura):');
      const sampleResult = await tursoClient.execute({
        sql: "SELECT * FROM usuarios LIMIT 3;"
      });
      
      sampleResult.rows.forEach((user, index) => {
        console.log(`Usuario ${index + 1}:`, Object.keys(user));
      });
    }
    
  } catch (error) {
    console.error('❌ Error al verificar estructura:', error.message);
    console.error('🔍 Detalles del error:', error);
    process.exit(1);
  }
}

console.log('🚀 Iniciando verificación de estructura de usuarios...');
checkUsuariosStructure().then(() => {
  console.log('✅ Verificación completada');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});

checkUsuariosStructure();
