import { tursoClient } from './lib/tursoClient.js';

async function createEvaluacionesGrupalesTable() {
  try {
    console.log('🔄 Creando tablas para evaluaciones grupales...');

    // Tabla principal de evaluaciones grupales
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS evaluaciones_grupales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        proceso_capacitacion TEXT,
        fecha_evaluacion DATE NOT NULL,
        estado TEXT DEFAULT 'planificada' CHECK (estado IN ('planificada', 'en_progreso', 'completada', 'cancelada')),
        observaciones_generales TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de empleados evaluados dentro de cada evaluación grupal
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS empleados_evaluados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        evaluacion_grupal_id INTEGER NOT NULL,
        nombre_empleado TEXT NOT NULL,
        puesto TEXT,
        competencias_json TEXT, -- JSON con calificaciones por competencia
        observaciones_individuales TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (evaluacion_grupal_id) REFERENCES evaluaciones_grupales (id) ON DELETE CASCADE
      )
    `);

    // Tabla de competencias estándar (opcional, para estandarizar)
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS competencias_estandar (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        descripcion TEXT,
        activa BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insertar competencias estándar
    const competenciasEstandar = [
      'Liderazgo',
      'Comunicación',
      'Trabajo en Equipo',
      'Conocimiento Técnico',
      'Resolución de Problemas',
      'Adaptabilidad',
      'Orientación a Resultados',
      'Calidad del Trabajo'
    ];

    for (const competencia of competenciasEstandar) {
      await tursoClient.execute({
        sql: `INSERT OR IGNORE INTO competencias_estandar (nombre) VALUES (?)`,
        args: [competencia]
      });
    }

    console.log('✅ Tablas de evaluaciones grupales creadas exitosamente');
    console.log('📋 Estructura:');
    console.log('   - evaluaciones_grupales: Evaluaciones por grupo/proceso');
    console.log('   - empleados_evaluados: Empleados y sus calificaciones por evaluación');
    console.log('   - competencias_estandar: Competencias predefinidas para evaluación');

  } catch (error) {
    console.error('❌ Error al crear tablas de evaluaciones grupales:', error);
  } finally {
    process.exit(0);
  }
}

createEvaluacionesGrupalesTable();
