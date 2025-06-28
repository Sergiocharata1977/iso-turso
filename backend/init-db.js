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
    id TEXT PRIMARY KEY,
    numeroHallazgo TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    origen TEXT NOT NULL,
    categoria TEXT NOT NULL,
    requisitoIncumplido TEXT,
    fechaRegistro DATE NOT NULL,
    fechaCierre DATE,
    estado TEXT NOT NULL CHECK(estado IN (
      'd1_iniciado', 'd2_con_accion_inmediata', 'd3_corregido_parcial', 'd4_corregido_completo',
      't1_en_analisis', 't2_no_requiere_accion', 't3_pendiente_implementacion', 't4_en_implementacion',
      't5_implementacion_finalizada', 'c1_pendiente_verificacion', 'c2_en_verificacion',
      'c3_verificado_satisfactorio', 'c4_verificado_insatisfactorio', 'c5_cerrado'
    )),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
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
