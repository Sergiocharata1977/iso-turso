// Script para inicializar la base de datos
// Importa el cliente ya configurado desde tursoClient.js, que maneja las variables de entorno.
import { tursoClient } from './lib/tursoClient.js';

async function initDatabase() {
  try {
    console.log('Inicializando base de datos Turso...');

    console.log('Iniciando el proceso de borrado de tablas...');
    try {
        // Desactivar las claves foráneas fuera de una transacción
        console.log('Paso 1: Desactivando claves foráneas...');
        await tursoClient.execute('PRAGMA foreign_keys = OFF;');
        console.log('-> Claves foráneas desactivadas.');

        // Ejecutar cada DROP como un comando separado
        console.log('Paso 2: Eliminando tablas individualmente...');
        const tablesToDrop = [
            'evaluaciones_capacitaciones', 'personal', 'puestos', 'departamentos',
            'indicadores', 'capacitaciones', 'procesos', 'usuarios', 'mejoras', 'noticias'
        ];
        for (const table of tablesToDrop) {
            await tursoClient.execute(`DROP TABLE IF EXISTS ${table}`);
            console.log(`-> Tabla ${table} eliminada.`);
        }
        console.log('-> Todas las tablas han sido eliminadas.');

        // Reactivar las claves foráneas
        console.log('Paso 3: Reactivando claves foráneas...');
        await tursoClient.execute('PRAGMA foreign_keys = ON;');
        console.log('-> Claves foráneas reactivadas.');
        
        console.log('✅ Proceso de borrado de tablas completado exitosamente.');
    } catch (err) {
        console.error('❌ Error durante el proceso de borrado de tablas.', err);
        // Intentar reactivar las FKs incluso si algo falla
        try {
            await tursoClient.execute('PRAGMA foreign_keys = ON;');
            console.log('-> Se intentó reactivar las claves foráneas por seguridad.');
        } catch (reactivationError) {
            console.error('!! No se pudieron reactivar las claves foráneas.', reactivationError);
        }
        throw err; // Re-lanzar el error original para detener el script
    }

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

    // Crear tabla de departamentos
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS departamentos (
          id TEXT PRIMARY KEY,
          nombre TEXT NOT NULL UNIQUE,
          descripcion TEXT,
          objetivos TEXT, -- Campo añadido para los objetivos del departamento
          responsableId TEXT,
          fecha_creacion TEXT NOT NULL,
          fecha_actualizacion TEXT
        )
      `
    });
    console.log('Tabla departamentos creada correctamente');

    // Crear tabla de puestos
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS puestos (
          id TEXT PRIMARY KEY,
          titulo_puesto TEXT NOT NULL,
          descripcion TEXT,
          departamentoId TEXT,
          reporta_a_puesto_id TEXT, 
          fecha_creacion TEXT NOT NULL,
          fecha_actualizacion TEXT
        )
      `
    });
    console.log('Tabla puestos creada correctamente');

    // Crear tabla de personal
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS personal (
          id TEXT PRIMARY KEY,
          nombre_completo TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          telefono TEXT,
          foto_url TEXT,
          departamentoId TEXT,
          puestoId TEXT,
          fecha_contratacion TEXT,
          numero_legajo TEXT UNIQUE,
          estado TEXT DEFAULT 'activo',
          fecha_creacion TEXT NOT NULL,
          fecha_actualizacion TEXT
        )
      `
    });
    console.log('Tabla personal creada correctamente');
    
    console.log('Base de datos inicializada completamente con nuevas tablas');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    tursoClient.close();
    console.log('Conexión con la base de datos cerrada.');
  }
}

// Ejecutar la función de inicialización
initDatabase();
