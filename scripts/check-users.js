// Script para verificar usuarios existentes en TursoDB
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de conexión a la base de datos
const DATABASE_URL = process.env.DATABASE_URL || path.join(__dirname, '../backend/data.db');
console.log(`Conexión a: ${DATABASE_URL}`);

const client = createClient({
  url: DATABASE_URL.startsWith('libsql:') ? DATABASE_URL : `file:${DATABASE_URL}`,
});

async function main() {
  try {
    // Verificar conexión
    await client.execute('SELECT 1');
    console.log('Conexión a la base de datos exitosa');

    // Comprobar si existe la tabla usuarios
    const tablesResult = await client.execute(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios';
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('La tabla "usuarios" no existe!');
      return;
    }
    
    console.log('Tabla "usuarios" encontrada');
    
    // Obtener todos los usuarios
    const usersResult = await client.execute(`
      SELECT id, username, email, nombre, apellido, rol, activo, 
             fecha_creacion, ultimo_acceso 
      FROM usuarios
    `);
    
    console.log(`Total de usuarios: ${usersResult.rows.length}`);
    
    // Mostrar detalles de cada usuario
    usersResult.rows.forEach((user, index) => {
      console.log(`\n--- Usuario ${index + 1} ---`);
      console.log(`ID: ${user.id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Nombre: ${user.nombre} ${user.apellido}`);
      console.log(`Rol: ${user.rol}`);
      console.log(`Activo: ${user.activo ? 'Sí' : 'No'}`);
      console.log(`Fecha creación: ${user.fecha_creacion}`);
      console.log(`Último acceso: ${user.ultimo_acceso || 'Nunca'}`);
    });

  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
  } finally {
    // Cerrar la conexión
    await client.close();
  }
}

main();
