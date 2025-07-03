// Script para inicializar la base de datos
import { tursoClient } from './lib/tursoClient.js';

async function initDatabase() {
  try {
    console.log('Inicializando base de datos Turso...');

    // Iniciar el proceso de borrado de tablas
    console.log('Iniciando el proceso de borrado de tablas...');
    await tursoClient.execute('PRAGMA foreign_keys = OFF;');
    const tablesResult = await tursoClient.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != '_litestream_seq' AND name != '_litestream_lock' AND name != 'libsql_wasm_func_table';");
    const tablesToDrop = tablesResult.rows.map(row => row.name);

    for (const table of tablesToDrop) {
        await tursoClient.execute(`DROP TABLE IF EXISTS ${table}`);
        console.log(`-> Tabla ${table} eliminada.`);
    }
    await tursoClient.execute('PRAGMA foreign_keys = ON;');
    console.log('✅ Proceso de borrado de tablas completado.');

    // Definiciones de las tablas
    const tableDefinitions = [
      `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        organization_id INTEGER
      );`,
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        priority TEXT CHECK(priority IN ('baja', 'media', 'alta')) DEFAULT 'media',
        FOREIGN KEY (sender_id) REFERENCES usuarios(id)
      );`,
      `CREATE TABLE IF NOT EXISTS message_recipients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id INTEGER NOT NULL,
        recipient_id INTEGER NOT NULL,
        is_read INTEGER NOT NULL DEFAULT 0,
        read_at TEXT,
        FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
        FOREIGN KEY (recipient_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS message_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id INTEGER NOT NULL,
        tag_type TEXT NOT NULL CHECK(tag_type IN ('department', 'process', 'person')),
        tag_id TEXT NOT NULL,
        FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS noticias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        contenido TEXT NOT NULL,
        autor TEXT NOT NULL,
        fecha TEXT NOT NULL,
        imagen TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS normas (
        id TEXT PRIMARY KEY,
        codigo TEXT UNIQUE NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        observaciones TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS procesos (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        responsable TEXT,
        descripcion TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS hallazgos (
        id TEXT PRIMARY KEY,
        numeroHallazgo TEXT UNIQUE NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        estado TEXT NOT NULL,
        origen TEXT CHECK(origen IN ('auditoria_interna', 'auditoria_externa', 'reclamo_cliente', 'revision_direccion', 'analisis_datos', 'otro')),
        tipo_hallazgo TEXT,
        prioridad TEXT CHECK(prioridad IN ('baja', 'media', 'alta')),
        fecha_deteccion TEXT NOT NULL,
        fecha_cierre TEXT,
        proceso_id TEXT NOT NULL,
        requisito_incumplido TEXT,
        orden INTEGER,
        FOREIGN KEY (proceso_id) REFERENCES procesos(id)
      );`,
      `CREATE TABLE IF NOT EXISTS acciones (
        id TEXT PRIMARY KEY,
        hallazgo_id TEXT NOT NULL,
        numeroAccion TEXT UNIQUE NOT NULL,
        estado TEXT NOT NULL CHECK(estado IN ('p1_planificacion_accion', 'e2_ejecucion_accion', 'v3_planificacion_verificacion', 'v4_ejecucion_verificacion', 'c5_cerrada')),
        descripcion_accion TEXT,
        responsable_accion TEXT,
        fecha_plan_accion TEXT,
        comentarios_ejecucion TEXT,
        fecha_ejecucion_accion TEXT,
        eficacia TEXT CHECK(eficacia IN ('Eficaz', 'No Eficaz', 'Pendiente')),
        observaciones TEXT,
        FOREIGN KEY (hallazgo_id) REFERENCES hallazgos(id) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS auditorias (
        id TEXT PRIMARY KEY,
        tipo_auditoria TEXT NOT NULL,
        fecha_inicio TEXT NOT NULL,
        fecha_fin TEXT,
        alcance TEXT,
        auditor_lider TEXT,
        equipo_auditor TEXT,
        objetivos TEXT,
        estado TEXT NOT NULL,
        informe_url TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS documentos (
        id TEXT PRIMARY KEY,
        codigo_documento TEXT UNIQUE NOT NULL,
        nombre_documento TEXT NOT NULL,
        version INTEGER NOT NULL,
        fecha_aprobacion TEXT,
        proceso_id TEXT,
        tipo_documento TEXT,
        ubicacion TEXT,
        estado TEXT,
        FOREIGN KEY (proceso_id) REFERENCES procesos(id)
      );`,
      `CREATE TABLE IF NOT EXISTS objetivos (
        id TEXT PRIMARY KEY,
        nombre_objetivo TEXT NOT NULL,
        descripcion TEXT,
        proceso_id TEXT,
        indicador_asociado_id INTEGER,
        meta TEXT,
        responsable TEXT,
        fecha_inicio TEXT,
        fecha_fin TEXT,
        FOREIGN KEY (proceso_id) REFERENCES procesos(id),
        FOREIGN KEY (indicador_asociado_id) REFERENCES indicadores(id)
      );`,
      `CREATE TABLE IF NOT EXISTS indicadores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        proceso_id INTEGER,
        frecuencia_medicion TEXT,
        meta REAL,
        formula TEXT,
        FOREIGN KEY (proceso_id) REFERENCES procesos(id)
      );`,
      `CREATE TABLE IF NOT EXISTS comunicaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        asunto TEXT NOT NULL,
        mensaje TEXT,
        remitente TEXT,
        destinatarios TEXT,
        fecha_comunicacion TEXT NOT NULL,
        canal TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS encuestas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        fecha_creacion TEXT NOT NULL,
        fecha_cierre TEXT,
        estado TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS eventos_calendario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        start TEXT NOT NULL,
        end TEXT,
        allDay BOOLEAN,
        description TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS capacitaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        fecha_programada TEXT,
        duracion_horas INTEGER,
        instructor TEXT,
        estado TEXT DEFAULT 'Programada'
      );`,
      `CREATE TABLE IF NOT EXISTS departamentos (
        id TEXT PRIMARY KEY,
        nombre TEXT UNIQUE NOT NULL,
        descripcion TEXT,
        responsable_id TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS puestos (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        departamento_id TEXT NOT NULL,
        descripcion_responsabilidades TEXT,
        requisitos_experiencia TEXT,
        requisitos_formacion TEXT,
        reporta_a_id TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS personal (
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
        estado TEXT DEFAULT 'Activo'
      );`,
       `CREATE TABLE IF NOT EXISTS evaluaciones_capacitaciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          capacitacion_id INTEGER NOT NULL,
          empleado_id INTEGER NOT NULL,
          calificacion INTEGER,
          comentarios TEXT,
          fecha_evaluacion TEXT,
          FOREIGN KEY (capacitacion_id) REFERENCES capacitaciones(id) ON DELETE CASCADE,
          FOREIGN KEY (empleado_id) REFERENCES personal(id) ON DELETE CASCADE
        );`
    ];

    for (const tableDef of tableDefinitions) {
      await tursoClient.execute(tableDef);
      const tableName = tableDef.match(/TABLE IF NOT EXISTS (\w+)/)[1];
      console.log(`Tabla ${tableName} creada correctamente`);
    }

    // Insertar procesos de ejemplo
    const procesos = [
      { id: 'proc-001', nombre: 'Gestión de Calidad', responsable: 'Juan Pérez', descripcion: 'Proceso de seguimiento y control de la calidad.' },
      { id: 'proc-002', nombre: 'Producción', responsable: 'Ana Gómez', descripcion: 'Proceso de fabricación de productos.' },
      { id: 'proc-003', nombre: 'Recursos Humanos', responsable: 'Carlos Ruiz', descripcion: 'Gestión del personal y talento humano.' },
      { id: 'proc-004', nombre: 'Ventas y Marketing', responsable: 'Laura Méndez', descripcion: 'Estrategias de venta y promoción.' }
    ];

    for (const proc of procesos) {
      await tursoClient.execute({
        sql: 'INSERT INTO procesos (id, nombre, responsable, descripcion) VALUES (?, ?, ?, ?)',
        args: [proc.id, proc.nombre, proc.responsable, proc.descripcion]
      });
    }
    console.log('-> 4 procesos de ejemplo insertados correctamente.');

    // Insertar normas de ejemplo
    const normas = [
      { id: 'norma-001', codigo: 'ISO 9001:2015', titulo: 'Sistemas de gestión de la calidad', descripcion: 'Requisitos para un sistema de gestión de la calidad.', observaciones: 'Norma principal del SGC.' },
      { id: 'norma-002', codigo: 'ISO 14001:2015', titulo: 'Sistemas de gestión ambiental', descripcion: 'Requisitos con orientación para su uso.', observaciones: 'Relacionada con la gestión ambiental.' }
    ];

    for (const norma of normas) {
      await tursoClient.execute({
        sql: 'INSERT INTO normas (id, codigo, titulo, descripcion, observaciones) VALUES (?, ?, ?, ?, ?)',
        args: [norma.id, norma.codigo, norma.titulo, norma.descripcion, norma.observaciones]
      });
    }
    console.log('-> 2 normas de ejemplo insertadas correctamente.');

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
