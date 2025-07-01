import { tursoClient } from '../lib/tursoClient.js';

const recreateHallazgosTable = async () => {
  try {
    console.log('🔵 Iniciando la recreación de la tabla `hallazgos`...');

    // Paso 1: Eliminar la tabla si ya existe para empezar de cero.
    await tursoClient.execute('DROP TABLE IF EXISTS hallazgos');
    console.log('✅ Tabla `hallazgos` anterior eliminada (si existía).');

    // Paso 2: Crear la tabla con la nueva estructura completa.
    await tursoClient.execute(`
      CREATE TABLE hallazgos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numeroHallazgo TEXT UNIQUE NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        origen TEXT,
        categoria TEXT,
        requisitoIncumplido TEXT,
        prioridad TEXT,
        estado TEXT NOT NULL,
        orden INTEGER,
        
        -- Timestamps para análisis de tiempos
        fechaRegistro TEXT, -- Cuándo se creó el hallazgo
        fecha_planificacion_finalizada TEXT, -- Cuándo se pasó de D1 a D2
        fecha_ejecucion_finalizada TEXT, -- Cuándo se pasó de D2 a D3
        fecha_analisis_finalizado TEXT, -- Cuándo se pasó de D3 a T1 o T2
        fechaCierre TEXT, -- Cuándo se cerró definitivamente (T2)
        
        -- Campos de Planificación
        planificacion_descripcion TEXT,
        planificacion_fecha_compromiso TEXT,
        planificacion_responsable_id TEXT,
        
        -- Campos de Ejecución
        ejecucion_fecha TEXT,
        ejecucion_comentarios TEXT,
        ejecucion_ejecutor_id TEXT,
        
        -- Campos de Análisis y Cierre
        analisis_comentarios TEXT,
        analisis_requiere_accion_correctiva INTEGER
      );
    `);
    console.log('✅ Tabla `hallazgos` creada exitosamente con la nueva estructura.');

    console.log('🟢 Proceso completado.');

  } catch (error) {
    console.error('🔴 Error durante la recreación de la tabla `hallazgos`:', error);
  }
};

recreateHallazgosTable();
