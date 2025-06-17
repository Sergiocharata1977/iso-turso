// Script para crear un usuario administrador en TursoDB
import path from 'path';
import { fileURLToPath } from 'url';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@libsql/client';

// Importamos bcrypt utilizando require para mayor compatibilidad
const bcrypt = await import('bcryptjs');

// Cargar variables de entorno
loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de conexión a la base de datos
const DATABASE_URL = process.env.DATABASE_URL || path.join(__dirname, '../backend/data.db');
console.log(`Conexión a: ${DATABASE_URL}`);

const client = createClient({
  url: DATABASE_URL.startsWith('libsql:') ? DATABASE_URL : `file:${DATABASE_URL}`,
});

// Datos del usuario admin a crear
const adminUser = {
  username: 'admin@isoflow.com',
  email: 'admin@isoflow.com',
  nombre: 'Administrador',
  apellido: 'Sistema',
  password: 'admin123', // Será hasheado antes de guardarlo
  rol: 'admin',
  activo: true,
  fecha_creacion: new Date().toISOString(),
  ultimo_acceso: null
};

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
      console.log('La tabla "usuarios" no existe. Creándola...');
      
      // Crear la tabla usuarios si no existe
      await client.execute(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          nombre TEXT,
          apellido TEXT,
          password TEXT NOT NULL,
          rol TEXT DEFAULT 'usuario',
          activo BOOLEAN DEFAULT true,
          fecha_creacion TEXT,
          ultimo_acceso TEXT
        )
      `);
      
      console.log('Tabla "usuarios" creada correctamente');
    } else {
      console.log('Tabla "usuarios" encontrada');
    }

    // Comprobar si el usuario ya existe
    const userCheckResult = await client.execute({
      sql: 'SELECT id FROM usuarios WHERE username = ?',
      args: [adminUser.username]
    });

    if (userCheckResult.rows.length > 0) {
      console.log(`El usuario ${adminUser.username} ya existe. Actualizando contraseña...`);
      
      // Hashear la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      // Actualizar la contraseña del usuario existente
      await client.execute({
        sql: 'UPDATE usuarios SET password = ?, activo = true WHERE username = ?',
        args: [hashedPassword, adminUser.username]
      });
      
      console.log('Contraseña actualizada correctamente');
    } else {
      // Hashear la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      // Insertar el nuevo usuario
      await client.execute({
        sql: `
          INSERT INTO usuarios (username, email, nombre, apellido, password, rol, activo, fecha_creacion, ultimo_acceso)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          adminUser.username,
          adminUser.email,
          adminUser.nombre,
          adminUser.apellido,
          hashedPassword,
          adminUser.rol,
          adminUser.activo ? 1 : 0,
          adminUser.fecha_creacion,
          adminUser.ultimo_acceso
        ]
      });
      
      console.log(`Usuario ${adminUser.username} creado correctamente`);
    }

    // Verificar que el usuario existe
    const verifyResult = await client.execute(`
      SELECT id, username, email, nombre, apellido, rol, activo, 
             fecha_creacion, ultimo_acceso 
      FROM usuarios
      WHERE username = '${adminUser.username}'
    `);
    
    if (verifyResult.rows.length > 0) {
      const user = verifyResult.rows[0];
      console.log('\n--- Datos del usuario creado/actualizado ---');
      console.log(`ID: ${user.id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Nombre: ${user.nombre} ${user.apellido}`);
      console.log(`Rol: ${user.rol}`);
      console.log(`Activo: ${user.activo ? 'Sí' : 'No'}`);
      console.log(`Fecha creación: ${user.fecha_creacion}`);
      console.log(`Último acceso: ${user.ultimo_acceso || 'Nunca'}`);
      console.log('\nSe ha guardado correctamente la contraseña (hasheada)');
      console.log('\n¡LISTO! Ya puedes intentar iniciar sesión con:');
      console.log(`Username: ${adminUser.username}`);
      console.log(`Password: ${adminUser.password}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Cerrar la conexión
    await client.close();
  }
}

main();
