// Script para inicializar la base de datos desde la raíz del proyecto
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Determinar la ruta absoluta al archivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testFilePath = path.resolve(__dirname, 'test.txt'); // CAMBIADO A test.txt

// --- DEBUGGING: Leer y mostrar contenido de test.txt --- 
let testFileContent = "Error al leer test.txt";
try {
  testFileContent = fs.readFileSync(testFilePath, { encoding: 'utf8' });
  console.log(`[DEBUG] Contenido crudo de ${testFilePath}:`);
  console.log('-----------------------------------------');
  console.log(testFileContent);
  console.log('-----------------------------------------');
} catch (err) {
  console.error(`[DEBUG] Error al leer ${testFilePath} directamente:`, err);
}
// --- FIN DEBUGGING LECTURA CRUDA ---

// Carga de .env deshabilitada temporalmente para el test
// dotenv.config({ path: envPath }); 

// --- DEBUGGING --- 
console.log(`[DEBUG] Lectura de .env deshabilitada, probando test.txt.`);
console.log('[DEBUG] Variables después de dotenv.config({ path: envPath }):');
console.log(`[DEBUG] RAW TURSO_DATABASE_URL: ${process.env.TURSO_DATABASE_URL}`);
console.log(`[DEBUG] RAW TURSO_AUTH_TOKEN: ${process.env.TURSO_AUTH_TOKEN ? 'Token Presente (longitud: ' + process.env.TURSO_AUTH_TOKEN.length + ')' : 'Token Ausente o Vacío'}`);
// --- FIN DEBUGGING ---

// Crear el cliente de Turso
const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://iso103-1-sergiocharata1977.aws-us-east-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDatabase() {
  try {
    console.log('Inicializando base de datos Turso...');
    console.log('URL de la base de datos:', process.env.TURSO_DATABASE_URL);
    
    // Crear tabla de usuarios
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          rol TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT
        )
      `
    });
    console.log('Tabla usuarios creada correctamente');
    
    // Crear tabla de noticias
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS noticias (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          contenido TEXT NOT NULL,
          autor TEXT NOT NULL,
          fecha TEXT NOT NULL,
          imagen TEXT
        )
      `
    });
    console.log('Tabla noticias creada correctamente');
    
    // Crear tabla de mejoras
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS mejoras (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          descripcion TEXT NOT NULL,
          estado TEXT NOT NULL,
          responsable TEXT NOT NULL,
          fecha_inicio TEXT NOT NULL,
          fecha_fin_estimada TEXT
        )
      `
    });
    console.log('Tabla mejoras creada correctamente');
    
    // Crear tabla de procesos
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS procesos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          codigo TEXT UNIQUE NOT NULL,
          version TEXT NOT NULL,
          responsable TEXT NOT NULL,
          descripcion TEXT
        )
      `
    });
    console.log('Tabla procesos creada correctamente');
    
    // Crear tabla de indicadores
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS indicadores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          descripcion TEXT NOT NULL,
          formula TEXT NOT NULL,
          unidad TEXT NOT NULL,
          meta REAL,
          proceso_id INTEGER,
          FOREIGN KEY (proceso_id) REFERENCES procesos (id)
        )
      `
    });
    console.log('Tabla indicadores creada correctamente');
    
    // Crear tabla de capacitaciones
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS capacitaciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          solicitante TEXT,
          titulo TEXT NOT NULL,
          contenidos TEXT,
          objetivos TEXT,
          competencias TEXT,
          duracion TEXT,
          modalidad TEXT,
          importancia TEXT,
          instructores TEXT, 
          personal_asociado TEXT, 
          fecha_programada_inicio TEXT NOT NULL,
          fecha_programada_fin TEXT,
          fecha_realizacion_inicio TEXT,
          fecha_realizacion_fin TEXT,
          estado TEXT NOT NULL DEFAULT 'Programada', 
          lugar TEXT,
          materiales_url TEXT,
          observaciones TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        )
      `
    });
    console.log('Tabla capacitaciones creada correctamente');
    
    // Crear tabla de evaluaciones_capacitaciones
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS evaluaciones_capacitaciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          capacitacion_id INTEGER NOT NULL,
          evaluador_id INTEGER, 
          participante_id INTEGER, 
          fecha_evaluacion TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
          asistencia INTEGER DEFAULT 0, 
          grado_participacion TEXT, 
          comprension_contenidos INTEGER, 
          aplicabilidad_conocimientos INTEGER, 
          calificacion_instructor INTEGER, 
          calificacion_materiales INTEGER, 
          comentarios_generales TEXT,
          eficacia_verificada INTEGER DEFAULT 0, 
          eficacia_modo_verificacion TEXT,
          eficacia_fecha_verificacion TEXT,
          eficacia_responsable_verificacion TEXT,
          eficacia_observaciones TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY (capacitacion_id) REFERENCES capacitaciones (id) ON DELETE CASCADE,
          FOREIGN KEY (evaluador_id) REFERENCES usuarios (id) ON DELETE SET NULL,
          FOREIGN KEY (participante_id) REFERENCES usuarios (id) ON DELETE SET NULL
        )
      `
    });
    console.log('Tabla evaluaciones_capacitaciones creada correctamente');
    
    console.log('Base de datos inicializada completamente con nuevas tablas');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
}

// Ejecutar la función de inicialización
initDatabase();
