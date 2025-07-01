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
    numeroHallazgo TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    origen TEXT,
    categoria TEXT,
    requisitoIncumplido TEXT,
    fechaRegistro TEXT DEFAULT (datetime('now')),
    estado TEXT NOT NULL CHECK(estado IN (
      'd1_iniciado', -- Detección
      'd2_accion_inmedita-programada',
      'd3_accion_inmedita-finalizada',
      't1_en_analisis', -- Tratamiento / Análisis
      't2_no_requiere_accion',
      't3_requiere_accion', -- Punto de transferencia a una Acción de Mejora
      'c5_cerrado' -- Cerrado (para casos simples sin acción formal)
    )),
    orden INTEGER
  );
`;

const createAccionesMejoraTable = `
  CREATE TABLE IF NOT EXISTS acciones (
    id TEXT PRIMARY KEY,
    hallazgo_id TEXT NOT NULL,
    numeroAccion TEXT UNIQUE NOT NULL, -- Ej: AM-001
    estado TEXT NOT NULL CHECK(estado IN (
      'p1_planificacion_accion',
      'e2_ejecucion_accion',
      'v3_planificacion_verificacion',
      'v4_ejecucion_verificacion',
      'c5_cerrada'
    )),
    descripcion_accion TEXT,
    responsable_accion TEXT,
    fecha_plan_accion TEXT,
    comentarios_ejecucion TEXT,
    fecha_ejecucion TEXT,
    descripcion_verificacion TEXT,
    responsable_verificacion TEXT,
    fecha_plan_verificacion TEXT,
    comentarios_verificacion TEXT,
    fecha_verificacion_finalizada TEXT,
    eficacia TEXT CHECK(eficacia IN ('Eficaz', 'No Eficaz', 'Pendiente')),
    FOREIGN KEY (hallazgo_id) REFERENCES hallazgos(id)
  );
`;

async function initializeDatabase() {
  const statements = [

    'DROP TABLE IF EXISTS acciones;',
    'DROP TABLE IF EXISTS hallazgos;',
    'DROP TABLE IF EXISTS procesos;',
    createProcesosTable,
    createHallazgosTable,
    createAccionesMejoraTable,
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
