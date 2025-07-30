import { tursoClient } from './backend/lib/tursoClient.js';

async function verificarTablaUsuarios() {
  console.log('🔍 Verificando estructura de tabla usuarios...\n');

  try {
    // Obtener información de la tabla
    const tableInfo = await tursoClient.execute({
      sql: "PRAGMA table_info(usuarios)"
    });

    console.log('📋 Estructura de tabla usuarios:');
    tableInfo.rows.forEach((column, index) => {
      console.log(`   ${index + 1}. ${column.name} (${column.type}) ${column.notnull ? 'NOT NULL' : ''} ${column.pk ? 'PRIMARY KEY' : ''}`);
    });

    // Verificar si hay usuarios existentes
    const usuarios = await tursoClient.execute({
      sql: 'SELECT id, name, email, role FROM usuarios LIMIT 5'
    });

    console.log(`\n👥 Usuarios existentes: ${usuarios.rows.length}`);
    usuarios.rows.forEach((usuario, index) => {
      console.log(`   ${index + 1}. ${usuario.name} (${usuario.email}) - ${usuario.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verificarTablaUsuarios(); 