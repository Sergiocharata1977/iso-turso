import { db } from './lib/tursoClient.js';

const checkUsers = async () => {
  try {
    console.log('🔍 Verificando todas las tablas de usuarios...');
    
    // Verificar todas las tablas relacionadas con usuarios
    const allTablesResult = await db.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%user%'"
    });
    
    console.log('📋 Tablas encontradas:', allTablesResult.rows.map(row => row.name));
    
    // Verificar tabla users
    try {
      const usersResult = await db.execute({
        sql: "SELECT id, name, email, role FROM users LIMIT 5"
      });
      console.log('👥 Tabla users - Total usuarios:', usersResult.rows.length);
      if (usersResult.rows.length > 0) {
        console.log('📝 Primeros usuarios en tabla users:');
        usersResult.rows.forEach((user, index) => {
          console.log(`${index + 1}. ID: ${user.id}, Email: ${user.email}, Nombre: ${user.name}`);
        });
      }
    } catch (error) {
      console.log('❌ Error accediendo tabla users:', error.message);
    }
    
    // Verificar tabla usuarios
    try {
      const usuariosResult = await db.execute({
        sql: "SELECT id, nombre, email, rol FROM usuarios LIMIT 5"
      });
      console.log('👥 Tabla usuarios - Total usuarios:', usuariosResult.rows.length);
      if (usuariosResult.rows.length > 0) {
        console.log('📝 Primeros usuarios en tabla usuarios:');
        usuariosResult.rows.forEach((user, index) => {
          console.log(`${index + 1}. ID: ${user.id}, Email: ${user.email}, Nombre: ${user.nombre}`);
        });
      }
    } catch (error) {
      console.log('❌ Error accediendo tabla usuarios:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
};

checkUsers();