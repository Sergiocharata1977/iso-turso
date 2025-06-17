// Script para insertar directamente un usuario administrador en TursoDB
import { db } from '../backend/lib/tursoClient.js';
import bcrypt from 'bcryptjs';

// Datos del usuario administrador
const admin = {
  username: 'admin@isoflow.com',
  email: 'admin@isoflow.com',
  nombre: 'Administrador',
  apellido: 'Sistema',
  password: 'admin123',
  rol: 'admin',
  activo: 1
};

async function createAdminUser() {
  try {
    console.log('Verificando si existe tabla usuarios...');
    
    // Comprobar si existe la tabla usuarios
    const tablesResult = await db.execute({
      sql: "SELECT name FROM sqlite_schema WHERE type='table' AND name='usuarios'"
    });
    
    if (tablesResult.rows.length === 0) {
      console.log('Creando tabla usuarios...');
      await db.execute({
        sql: `CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          email TEXT UNIQUE,
          nombre TEXT,
          apellido TEXT,
          password TEXT,
          rol TEXT DEFAULT 'user',
          activo INTEGER DEFAULT 1,
          fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
          ultimo_acceso TEXT
        )`
      });
      console.log('Tabla usuarios creada correctamente.');
    }
    
    // Verificar si el usuario ya existe
    const userExists = await db.execute({
      sql: 'SELECT id FROM usuarios WHERE username = ?',
      args: [admin.username]
    });
    
    // Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(admin.password, salt);
    
    if (userExists.rows.length > 0) {
      // Actualizar usuario existente
      const userId = userExists.rows[0].id;
      console.log(`Usuario ${admin.username} encontrado con ID ${userId}. Actualizando...`);
      
      await db.execute({
        sql: `UPDATE usuarios 
              SET password = ?, 
                  email = ?, 
                  nombre = ?,
                  apellido = ?,
                  rol = ?,
                  activo = ?
              WHERE id = ?`,
        args: [hashedPassword, admin.email, admin.nombre, admin.apellido, admin.rol, admin.activo, userId]
      });
      
      console.log('Usuario administrador actualizado correctamente.');
    } else {
      // Insertar nuevo usuario
      console.log('Insertando nuevo usuario administrador...');
      
      await db.execute({
        sql: `INSERT INTO usuarios (username, email, nombre, apellido, password, rol, activo, fecha_creacion)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          admin.username,
          admin.email,
          admin.nombre,
          admin.apellido,
          hashedPassword,
          admin.rol,
          admin.activo,
          new Date().toISOString()
        ]
      });
      
      console.log('Nuevo usuario administrador creado correctamente.');
    }
    
    // Verificar usuario creado
    const adminUser = await db.execute({
      sql: 'SELECT id, username, email, nombre, apellido, rol, activo FROM usuarios WHERE username = ?',
      args: [admin.username]
    });
    
    if (adminUser.rows.length > 0) {
      const user = adminUser.rows[0];
      console.log('\n===== INFORMACIÓN DEL USUARIO ADMINISTRADOR =====');
      console.log(`ID: ${user.id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Nombre: ${user.nombre} ${user.apellido}`);
      console.log(`Rol: ${user.rol}`);
      console.log(`Activo: ${user.activo === 1 ? 'Sí' : 'No'}`);
      console.log('\nPuedes iniciar sesión con:');
      console.log(`Usuario: ${admin.username}`);
      console.log(`Contraseña: ${admin.password}`);
      console.log('=================================================');
    }
    
    // Listar todos los usuarios
    console.log('\nUsuarios existentes en la base de datos:');
    const allUsers = await db.execute({
      sql: 'SELECT id, username, email, nombre, apellido, rol, activo FROM usuarios'
    });
    
    if (allUsers.rows.length > 0) {
      allUsers.rows.forEach(user => {
        console.log(`- ${user.username} (${user.nombre} ${user.apellido}, ${user.rol}, ${user.activo === 1 ? 'activo' : 'inactivo'})`);
      });
    } else {
      console.log('No hay usuarios en la base de datos.');
    }
    
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
  } finally {
    process.exit(0);
  }
}

// Ejecutar la función
createAdminUser();
