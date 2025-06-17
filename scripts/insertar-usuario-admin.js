// Script simplificado para insertar un usuario administrador
// Usar desde la carpeta backend: node ../scripts/insertar-usuario-admin.js

import { db } from '../lib/tursoClient.js';
import bcrypt from 'bcryptjs';

async function insertAdminUser() {
  console.log('Iniciando creación de usuario administrador...');
  
  try {
    const username = 'admin@isoflow.com';
    const email = 'admin@isoflow.com';
    const plainPassword = 'admin123';
    
    // Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    // Verificar si el usuario ya existe
    const existingUsers = await db.execute({
      sql: 'SELECT id FROM usuarios WHERE username = ?',
      args: [username]
    });
    
    if (existingUsers.rows.length > 0) {
      console.log(`Usuario ${username} ya existe. Actualizando...`);
      
      // Actualizar usuario existente
      await db.execute({
        sql: `UPDATE usuarios 
              SET password = ?, 
                  email = ?, 
                  activo = 1,
                  rol = 'admin'
              WHERE username = ?`,
        args: [hashedPassword, email, username]
      });
      
      console.log('Usuario actualizado exitosamente');
    } else {
      console.log('Creando nuevo usuario administrador...');
      
      // Insertar nuevo usuario
      await db.execute({
        sql: `INSERT INTO usuarios (
                username, 
                email, 
                nombre, 
                apellido, 
                password, 
                rol, 
                activo, 
                fecha_creacion
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          username,
          email,
          'Administrador',
          'Sistema',
          hashedPassword,
          'admin',
          1,
          new Date().toISOString()
        ]
      });
      
      console.log('Usuario creado exitosamente');
    }
    
    // Verificar que el usuario existe
    const users = await db.execute({
      sql: 'SELECT id, username, email, nombre, apellido, rol, activo FROM usuarios WHERE username = ?',
      args: [username]
    });
    
    if (users.rows.length > 0) {
      console.log('\n=== Usuario admin disponible para login ===');
      console.log(`ID: ${users.rows[0].id}`);
      console.log(`Username: ${users.rows[0].username}`);
      console.log(`Email: ${users.rows[0].email}`);
      console.log(`Nombre: ${users.rows[0].nombre} ${users.rows[0].apellido}`);
      console.log(`Rol: ${users.rows[0].rol}`);
      console.log(`Activo: ${users.rows[0].activo === 1 ? 'Sí' : 'No'}`);
      console.log('\nPuedes iniciar sesión con:');
      console.log(`Usuario: ${username}`);
      console.log(`Contraseña: ${plainPassword}`);
    } else {
      console.log('Error: No se pudo verificar la creación del usuario');
    }
    
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
  }
}

// Ejecutar la función
insertAdminUser();
