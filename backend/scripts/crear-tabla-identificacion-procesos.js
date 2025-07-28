import { tursoClient } from '../lib/tursoClient.js';

async function crearTablaIdentificacionProcesos() {
  try {
    console.log('🔄 Creando tabla de identificación de procesos...');
    
    // Crear la tabla con solo los 4 campos requeridos
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS identificacion_procesos (
        id TEXT PRIMARY KEY DEFAULT ('ident_proc_' || lower(hex(randomblob(8)))),
        organization_id INTEGER NOT NULL DEFAULT 1,
        politica_calidad TEXT,
        alcance TEXT,
        mapa_procesos TEXT,
        organigrama TEXT,
        created_at DATETIME DEFAULT (datetime('now', 'localtime')),
        updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
      )
    `);
    
    console.log('✅ Tabla identificacion_procesos creada exitosamente');
    
    // Verificar si ya existe un registro para la organización
    const existingRecord = await tursoClient.execute({
      sql: 'SELECT id FROM identificacion_procesos WHERE organization_id = ?',
      args: [1]
    });
    
    if (existingRecord.rows.length === 0) {
      // Insertar un registro inicial con datos de ejemplo
      await tursoClient.execute({
        sql: `INSERT INTO identificacion_procesos (
          organization_id, politica_calidad, alcance, mapa_procesos, organigrama
        ) VALUES (?, ?, ?, ?, ?)`,
        args: [
          1,
          'Política de Calidad: Compromiso con la excelencia en todos nuestros procesos y servicios.',
          'Alcance: Aplica a todos los procesos de la organización, desde la planificación hasta la entrega al cliente.',
          'Mapa de Procesos: Descripción de la interrelación entre los procesos principales de la organización.',
          'Organigrama: Estructura organizacional que define roles, responsabilidades y líneas de autoridad.'
        ]
      });
      
      console.log('✅ Registro inicial creado con datos de ejemplo');
    } else {
      console.log('ℹ️ Ya existe un registro para esta organización');
    }
    
    // Verificar la estructura creada
    const tableInfo = await tursoClient.execute('PRAGMA table_info(identificacion_procesos)');
    console.log('\n📋 Estructura de la tabla:');
    tableInfo.rows.forEach(col => {
      console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    console.log('\n🎉 Tabla de identificación de procesos configurada correctamente');
    
  } catch (error) {
    console.error('❌ Error al crear tabla de identificación de procesos:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  crearTablaIdentificacionProcesos()
    .then(() => {
      console.log('✅ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export default crearTablaIdentificacionProcesos; 