import 'dotenv/config';
import { tursoClient } from '../lib/tursoClient.js';

async function createAllTables() {
  try {
    console.log('🚀 Iniciando creación de tablas...');

    // Crear tabla departamentos
    await tursoClient.execute({
      sql: `CREATE TABLE IF NOT EXISTS departamentos (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL UNIQUE,
        descripcion TEXT,
        responsable_id INTEGER,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )`
    });
    console.log('✅ Tabla departamentos creada');

    // Crear tabla puestos
    await tursoClient.execute({
      sql: `CREATE TABLE IF NOT EXISTS puestos (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL,
        departamento_id INTEGER,
        descripcion TEXT,
        nivel TEXT,
        requisitos TEXT,
        responsabilidades TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (departamento_id) REFERENCES departamentos (id) ON DELETE SET NULL ON UPDATE CASCADE
      )`
    });
    console.log('✅ Tabla puestos creada');

    // Crear tabla personal
    await tursoClient.execute({
      sql: `CREATE TABLE IF NOT EXISTS personal (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE,
        telefono TEXT,
        departamento_id INTEGER,
        puesto_id INTEGER,
        fecha_contratacion TEXT,
        numero TEXT,
        estado TEXT DEFAULT 'activo',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (departamento_id) REFERENCES departamentos (id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (puesto_id) REFERENCES puestos (id) ON DELETE SET NULL ON UPDATE CASCADE
      )`
    });
    console.log('✅ Tabla personal creada');

    // Crear tabla procesos
    await tursoClient.execute({
      sql: `CREATE TABLE IF NOT EXISTS procesos (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        responsable_id INTEGER,
        estado TEXT DEFAULT 'activo',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (responsable_id) REFERENCES personal (id) ON DELETE SET NULL ON UPDATE CASCADE
      )`
    });
    console.log('✅ Tabla procesos creada');

    // Crear tabla documentos
    await tursoClient.execute({
      sql: `CREATE TABLE IF NOT EXISTS documentos (
        id INTEGER PRIMARY KEY,
        titulo TEXT NOT NULL UNIQUE,
        descripcion TEXT,
        version TEXT DEFAULT '1.0',
        proceso_id INTEGER,
        autor TEXT,
        estado TEXT DEFAULT 'borrador',
        archivo_url TEXT,
        fecha_creacion TEXT,
        fecha_revision TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (proceso_id) REFERENCES procesos (id) ON DELETE SET NULL ON UPDATE CASCADE
      )`
    });
    console.log('✅ Tabla documentos creada');

    // Crear tabla normas
    await tursoClient.execute({
      sql: `CREATE TABLE IF NOT EXISTS normas (
        id INTEGER PRIMARY KEY,
        codigo TEXT NOT NULL UNIQUE,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        version TEXT DEFAULT '1.0',
        fecha_vigencia TEXT,
        estado TEXT DEFAULT 'vigente',
        responsable TEXT,
        observaciones TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )`
    });
    console.log('✅ Tabla normas creada');

    // Crear tabla indicadores
    await tursoClient.execute({
      sql: `CREATE TABLE IF NOT EXISTS indicadores (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        proceso_id INTEGER,
        formula TEXT,
        meta TEXT,
        frecuencia TEXT,
        responsable_id INTEGER,
        estado TEXT DEFAULT 'activo',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (proceso_id) REFERENCES procesos (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (responsable_id) REFERENCES personal (id) ON DELETE SET NULL ON UPDATE CASCADE
      )`
    });
    console.log('✅ Tabla indicadores creada');

    // Crear tabla auditorias
    await tursoClient.execute({
      sql: `CREATE TABLE IF NOT EXISTS auditorias (
        id INTEGER PRIMARY KEY,
        titulo TEXT NOT NULL,
        tipo TEXT,
        fecha_inicio TEXT,
        fecha_fin TEXT,
        auditor_id INTEGER,
        estado TEXT DEFAULT 'planificada',
        observaciones TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (auditor_id) REFERENCES personal (id) ON DELETE SET NULL ON UPDATE CASCADE
      )`
    });
    console.log('✅ Tabla auditorias creada');

    console.log('🎉 ¡Todas las tablas han sido creadas exitosamente!');
    
    // Verificar las tablas creadas
    const tables = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    });
    
    console.log('\n📋 Tablas en la base de datos:');
    tables.rows.forEach(table => {
      console.log(`  - ${table.name}`);
    });

  } catch (error) {
    console.error('❌ Error al crear las tablas:', error);
    process.exit(1);
  }
}

// Ejecutar si el script se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  await createAllTables();
  process.exit(0);
}

export { createAllTables };
