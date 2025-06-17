// Script para eliminar la tabla usuarios y recrearla con un usuario administrador
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

async function resetUsuariosTable() {
  try {
    console.log('=== RESETEO DE TABLA USUARIOS ===');
    
    // Eliminar tabla usuarios si existe
    console.log('1. Eliminando tabla usuarios si existe...');
    await db.execute({
      sql: "DROP TABLE IF EXISTS usuarios"
    });
    console.log('   ✓ Tabla eliminada correctamente');
    
    // Crear tabla usuarios desde cero
    console.log('2. Recreando tabla usuarios...');
    await db.execute({
      sql: `CREATE TABLE usuarios (
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
    console.log('   ✓ Tabla recreada correctamente');
    
    // Generar hash de la contraseña
    console.log('3. Creando usuario administrador...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(admin.password, salt);
    
    // Insertar usuario administrador
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
    console.log('   ✓ Usuario administrador creado correctamente');
    
    // Verificar que el usuario se haya creado
    const result = await db.execute({
      sql: 'SELECT id, username, email, nombre, apellido, rol, activo FROM usuarios WHERE username = ?',
      args: [admin.username]
    });
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('\n=== INFORMACIÓN DEL USUARIO ADMINISTRADOR ===');
      console.log(`ID: ${user.id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Nombre: ${user.nombre} ${user.apellido}`);
      console.log(`Rol: ${user.rol}`);
      console.log(`Activo: ${user.activo === 1 ? 'Sí' : 'No'}`);
      console.log('\nPuedes iniciar sesión con:');
      console.log(`Usuario: ${admin.username}`);
      console.log(`Contraseña: ${admin.password}`);
      console.log('===========================================');
      
      console.log('\n¡Todo listo! La tabla usuarios ha sido reseteada y se ha creado un usuario administrador.');
      console.log('Ahora puedes probar el inicio de sesión con las credenciales proporcionadas.');
    } else {
      console.error('Error: No se pudo verificar la creación del usuario');
    }
    
  } catch (error) {
    console.error('Error durante el reseteo de la tabla usuarios:', error);
  } finally {
    process.exit(0);
  }
}

// Ejecutar la función
resetUsuariosTable();
