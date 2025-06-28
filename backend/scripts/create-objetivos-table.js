import { tursoClient } from '../lib/tursoClient.js';

async function createObjetivosTable() {
  try {
    console.log('Creando tabla objetivos_calidad...');
    
    // Crear la tabla objetivos_calidad
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS objetivos_calidad (
        id TEXT PRIMARY KEY,
        codigo TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        meta TEXT,
        responsable TEXT,
        fecha_inicio TEXT,
        fecha_fin TEXT,
        estado TEXT DEFAULT 'activo',
        fecha_creacion TEXT NOT NULL
      )
    `);
    
    console.log('Tabla objetivos_calidad creada exitosamente');
    
    // Insertar datos de ejemplo
    console.log('Insertando datos de ejemplo...');
    
    const ejemplos = [
      {
        id: '1',
        codigo: 'OBJ-001',
        descripcion: 'Reducir el tiempo de respuesta al cliente en un 15%',
        meta: 'Tiempo de respuesta < 24 horas',
        responsable: 'Departamento de Atención al Cliente',
        fecha_inicio: '2025-01-01',
        fecha_fin: '2025-12-31',
        estado: 'En progreso'
      },
      {
        id: '2',
        codigo: 'OBJ-002',
        descripcion: 'Aumentar la satisfacción del cliente a 4.5/5',
        meta: 'Puntuación media de satisfacción ≥ 4.5',
        responsable: 'Gerencia de Calidad',
        fecha_inicio: '2025-01-01',
        fecha_fin: '2025-12-31',
        estado: 'En progreso'
      },
      {
        id: '3',
        codigo: 'OBJ-003',
        descripcion: 'Reducir las no conformidades en un 20%',
        meta: 'Reducción del 20% respecto al año anterior',
        responsable: 'Departamento de Producción',
        fecha_inicio: '2025-01-01',
        fecha_fin: '2025-06-30',
        estado: 'Activo'
      }
    ];
    
    for (const ejemplo of ejemplos) {
      await tursoClient.execute({
        sql: `INSERT OR IGNORE INTO objetivos_calidad 
              (id, codigo, descripcion, meta, responsable, fecha_inicio, fecha_fin, estado, fecha_creacion) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          ejemplo.id,
          ejemplo.codigo,
          ejemplo.descripcion,
          ejemplo.meta,
          ejemplo.responsable,
          ejemplo.fecha_inicio,
          ejemplo.fecha_fin,
          ejemplo.estado,
          new Date().toISOString()
        ]
      });
    }
    
    console.log('Datos de ejemplo insertados exitosamente');
    
    // Verificar los datos
    const result = await tursoClient.execute('SELECT * FROM objetivos_calidad');
    console.log('Registros en la tabla objetivos_calidad:', result.rows.length);
    console.log('Datos:', result.rows);
    
  } catch (error) {
    console.error('Error al crear la tabla objetivos_calidad:', error);
  } finally {
    process.exit(0);
  }
}

createObjetivosTable();
