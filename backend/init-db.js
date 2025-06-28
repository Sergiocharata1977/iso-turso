import { tursoClient } from './lib/tursoClient.js';

/**
 * Script para inicializar la base de datos.
 * Crea las tablas necesarias si no existen.
 */



const createProcesosTable = `
  CREATE TABLE procesos (
    id TEXT PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    version TEXT NOT NULL,
    objetivo TEXT,
    alcance TEXT,
    funciones_involucradas TEXT,
    definiciones_abreviaturas TEXT,
    desarrollo TEXT,
    estado TEXT DEFAULT 'Activo',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

const createHallazgosTable = `
  CREATE TABLE IF NOT EXISTS hallazgos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    responsable TEXT,
    fecha TEXT,
    estado TEXT NOT NULL,
    prioridad TEXT,
    orden INTEGER
  );
`;

async function initializeDatabase() {
  const statements = [

    'DROP TABLE IF EXISTS hallazgos;',
    'DROP TABLE IF EXISTS procesos;',
    createProcesosTable,
    createHallazgosTable,
  ];

  try {
    console.log('Inicializando la base de datos...');
    console.log('Ejecutando lote de sentencias SQL para crear el esquema...');
    
    await tursoClient.batch(statements);
    
    console.log('Esquema de la base de datos creado/actualizado exitosamente.');
    console.log('\nInicialización de la base de datos completada.');

  } catch (error) {
    console.error('Error durante la inicialización de la base de datos:', error);
    process.exit(1); // Salir con error
  }
}

initializeDatabase();
