// Script para inicializar la base de datos de autenticación en TursoDB
import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener __dirname para facilitar rutas relativas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de la conexión a la base de datos
const dbPath = path.join(dirname(__dirname), 'backend', 'data.db');
const dbUrl = process.env.DATABASE_URL || `file:${dbPath}`;

console.log(`Conectando a la base de datos en: ${dbUrl}`);

// Verificar si el archivo de base de datos existe
const dbFileExists = fs.existsSync(dbPath);
console.log(`¿Archivo de base de datos existe? ${dbFileExists}`);

// Crear cliente Turso
const client = createClient({ url: dbUrl });

// Función para ejecutar consultas
async function executeQuery(query, params = []) {
  try {
    const result = await client.execute({ sql: query, args: params });
    return result;
  } catch (error) {
    console.error(`Error al ejecutar consulta: ${query}`);
    console.error(error);
    throw error;
  }
}

async function initAuthDatabase() {
  console.log('Inicializando base de datos de autenticación...');

  try {
    // Eliminar tablas si existen
    console.log('Eliminando tablas existentes...');
    await executeQuery(`DROP TABLE IF EXISTS usuarios`);
    await executeQuery(`DROP TABLE IF EXISTS permisos_usuario`);
    await executeQuery(`DROP TABLE IF EXISTS roles`);
    
    // Crear tabla de usuarios
    console.log('Creando tabla de usuarios...');
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        password TEXT NOT NULL,
        activo BOOLEAN DEFAULT true,
        rol TEXT DEFAULT 'usuario',
        ultimo_acceso TIMESTAMP,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de roles
    console.log('Creando tabla de roles...');
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL,
        descripcion TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de permisos de usuario
    console.log('Creando tabla de permisos_usuario...');
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS permisos_usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        permiso TEXT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);

    // Insertar roles básicos
    console.log('Insertando roles básicos...');
    await executeQuery(`INSERT INTO roles (nombre, descripcion) VALUES (?, ?)`, 
      ['admin', 'Administrador del sistema']);
    await executeQuery(`INSERT INTO roles (nombre, descripcion) VALUES (?, ?)`, 
      ['usuario', 'Usuario estándar']);
    
    // Crear usuario administrador por defecto
    console.log('Creando usuario administrador por defecto...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await executeQuery(`
      INSERT INTO usuarios (username, email, nombre, apellido, password, rol)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['admin', 'admin@isoflow.com', 'Administrador', 'Sistema', hashedPassword, 'admin']);
    
    console.log('Base de datos de autenticación inicializada correctamente.');
    console.log('Credenciales del administrador:');
    console.log('- Username: admin');
    console.log('- Email: admin@isoflow.com');
    console.log('- Password: admin123');
    
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    // Cerrar conexión
    process.exit(0);
  }
}

// Ejecutar la función
initAuthDatabase();
