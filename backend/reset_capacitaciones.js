import { tursoClient } from './lib/tursoClient.js';

async function resetCapacitaciones() {
  try {
    console.log(' Eliminando tabla capacitaciones existente...');
    
    // Eliminar tabla existente si existe
    await tursoClient.execute('DROP TABLE IF EXISTS capacitaciones');
    console.log(' Tabla anterior eliminada');

    console.log(' Creando tabla capacitaciones simple...');
    
    // Crear tabla nueva con estructura simple
    await tursoClient.execute(`
      CREATE TABLE capacitaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        fecha_inicio TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'Programada',
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      )
    `);
    
    console.log(' Tabla capacitaciones creada exitosamente');
    
    console.log(' Insertando datos de prueba...');
    await tursoClient.execute({
      sql: 'INSERT INTO capacitaciones (titulo, descripcion, fecha_inicio, estado) VALUES (?, ?, ?, ?)',
      args: ['Capacitación de Prueba', 'Esta es una capacitación de prueba para verificar funcionalidad', '2024-07-15', 'Programada']
    });
    
    await tursoClient.execute({
      sql: 'INSERT INTO capacitaciones (titulo, descripcion, fecha_inicio, estado) VALUES (?, ?, ?, ?)',
      args: ['Curso Básico ISO', 'Introducción básica a normas ISO', '2024-08-01', 'Programada']
    });
    
    console.log(' Datos de prueba insertados');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetCapacitaciones();
