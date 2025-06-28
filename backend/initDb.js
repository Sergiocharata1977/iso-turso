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
            'indicadores', 'capacitaciones', 'procesos', 'usuarios', 'mejoras', 'noticias',
            'tickets', 'encuestas_respuestas', 'encuestas_preguntas', 'encuestas' // Nuevas tablas
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
    
    // Crear tabla de hallazgos (anteriormente 'mejoras')
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS hallazgos (
          id TEXT PRIMARY KEY,
          numeroHallazgo TEXT UNIQUE NOT NULL,
          titulo TEXT NOT NULL,
          descripcion TEXT,
          estado TEXT NOT NULL,
          origen TEXT,
          categoria TEXT,
          prioridad TEXT,
          fechaRegistro TEXT NOT NULL,
          fechaCierre TEXT,
          proceso_id TEXT,
          requisitoIncumplido TEXT,
          accionInmediata TEXT,
          responsable_id TEXT,
          FOREIGN KEY (proceso_id) REFERENCES procesos(id),
          FOREIGN KEY (responsable_id) REFERENCES personal(id)
        )
      `
    });
    console.log('Tabla hallazgos creada correctamente');
    
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
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo_puesto TEXT NOT NULL UNIQUE,
          codigo_puesto TEXT UNIQUE,
          proposito_general TEXT,
          principales_responsabilidades TEXT,
          competencias_necesarias TEXT,
          requisitos TEXT,
          experiencia_requerida TEXT,
          formacion_requerida TEXT,
          estado_puesto TEXT DEFAULT 'Activo',
          nivel TEXT,
          conocimientos_especificos TEXT,
          documento_descripcion_puesto_url TEXT,
          fecha_creacion TEXT DEFAULT (datetime('now', 'localtime')),
          fecha_actualizacion TEXT DEFAULT (datetime('now', 'localtime'))
        )
      `
    });
    console.log('Tabla puestos creada correctamente');

    // Crear tabla de personal
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS personal (
          id TEXT PRIMARY KEY,
          nombres TEXT NOT NULL,
          apellidos TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          telefono TEXT,
          documento_identidad TEXT UNIQUE,
          fecha_nacimiento TEXT,
          nacionalidad TEXT,
          direccion TEXT,
          telefono_emergencia TEXT,
          fecha_contratacion TEXT,
          numero_legajo TEXT UNIQUE,
          estado TEXT DEFAULT 'Activo',
          formacion_academica TEXT, -- JSON
          experiencia_laboral TEXT, -- JSON
          habilidades_idiomas TEXT, -- JSON
          fecha_creacion TEXT DEFAULT (datetime('now', 'localtime')),
          fecha_actualizacion TEXT DEFAULT (datetime('now', 'localtime'))
        )
      `
    });
    console.log('Tabla personal creada correctamente');

    // Crear tabla de tickets
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS tickets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          descripcion TEXT NOT NULL,
          estado TEXT NOT NULL CHECK(estado IN ('Abierto', 'En Proceso', 'Resuelto', 'Cerrado')),
          prioridad TEXT NOT NULL CHECK(prioridad IN ('Baja', 'Media', 'Alta', 'Urgente')),
          solicitante TEXT,
          asignado TEXT,
          categoria TEXT,
      comentarios TEXT DEFAULT '[]',
      archivos TEXT DEFAULT '[]',
          fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
          fechaCierre DATETIME
        )
      `
    });
    console.log('Tabla tickets creada correctamente');

    // Crear tabla de encuestas
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS encuestas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          descripcion TEXT,
          fecha_creacion TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
          fecha_cierre TEXT,
          estado TEXT NOT NULL DEFAULT 'Borrador' -- Borrador, Activa, Cerrada
        )
      `
    });
    console.log('Tabla encuestas creada correctamente');

    // Crear tabla de preguntas de encuestas
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS encuestas_preguntas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          encuesta_id INTEGER NOT NULL,
          texto_pregunta TEXT NOT NULL,
          tipo_pregunta TEXT NOT NULL, -- 'texto_libre', 'opcion_multiple', 'escala_1_5'
          opciones TEXT, -- JSON para opciones de opción múltiple
          FOREIGN KEY (encuesta_id) REFERENCES encuestas (id) ON DELETE CASCADE
        )
      `
    });
    console.log('Tabla encuestas_preguntas creada correctamente');

    // Crear tabla de respuestas de encuestas
    await tursoClient.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS encuestas_respuestas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pregunta_id INTEGER NOT NULL,
          usuario_id INTEGER, -- Puede ser nulo para encuestas anónimas
          respuesta TEXT NOT NULL,
          fecha_respuesta TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY (pregunta_id) REFERENCES encuestas_preguntas (id) ON DELETE CASCADE,
          FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
        )
      `
    });
    console.log('Tabla encuestas_respuestas creada correctamente');
    
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
