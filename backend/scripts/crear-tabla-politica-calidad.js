import { tursoClient } from '../lib/tursoClient.js';

async function crearTablaPoliticaCalidad() {
  try {
    console.log('🔄 Recreando tabla de política de calidad como ABM...');
    
    // Eliminar tabla anterior si existe
    await tursoClient.execute('DROP TABLE IF EXISTS identificacion_procesos');
    
    // Crear nueva tabla con estructura ABM
    await tursoClient.execute(`
      CREATE TABLE politica_calidad (
        id TEXT PRIMARY KEY DEFAULT ('politica_' || lower(hex(randomblob(8)))),
        organization_id INTEGER NOT NULL DEFAULT 1,
        nombre TEXT NOT NULL,
        politica_calidad TEXT,
        alcance TEXT,
        mapa_procesos TEXT,
        organigrama TEXT,
        estado TEXT DEFAULT 'activo',
        created_at DATETIME DEFAULT (datetime('now', 'localtime')),
        updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
      )
    `);
    
    console.log('✅ Tabla politica_calidad creada exitosamente');
    
    // Insertar algunos registros de ejemplo
    const politicasEjemplo = [
      {
        nombre: 'Política de Calidad Principal',
        politica_calidad: 'Compromiso con la excelencia en todos nuestros procesos y servicios, enfocados en la satisfacción del cliente y la mejora continua.',
        alcance: 'Aplica a todos los procesos de la organización, desde la planificación hasta la entrega al cliente.',
        mapa_procesos: 'Descripción de la interrelación entre los procesos principales de la organización.',
        organigrama: 'Estructura organizacional que define roles, responsabilidades y líneas de autoridad.'
      },
      {
        nombre: 'Política de Calidad Operativa',
        politica_calidad: 'Enfoque en la eficiencia operativa y la optimización de recursos para maximizar la calidad del servicio.',
        alcance: 'Procesos operativos y de producción de la organización.',
        mapa_procesos: 'Mapa detallado de procesos operativos y sus interrelaciones.',
        organigrama: 'Estructura operativa con roles y responsabilidades específicas.'
      },
      {
        nombre: 'Política de Calidad de Servicio',
        politica_calidad: 'Orientación hacia la excelencia en el servicio al cliente y la creación de valor sostenible.',
        alcance: 'Servicios al cliente y procesos de atención.',
        mapa_procesos: 'Procesos de servicio y atención al cliente.',
        organigrama: 'Equipos de servicio y atención al cliente.'
      }
    ];

    for (const politica of politicasEjemplo) {
      await tursoClient.execute({
        sql: `INSERT INTO politica_calidad (
          organization_id, nombre, politica_calidad, alcance, mapa_procesos, organigrama
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          1,
          politica.nombre,
          politica.politica_calidad,
          politica.alcance,
          politica.mapa_procesos,
          politica.organigrama
        ]
      });
    }
    
    console.log(`✅ ${politicasEjemplo.length} políticas de ejemplo insertadas`);
    
    // Verificar la estructura creada
    const tableInfo = await tursoClient.execute('PRAGMA table_info(politica_calidad)');
    console.log('\n📋 Estructura de la tabla:');
    tableInfo.rows.forEach(col => {
      console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Verificar datos insertados
    const count = await tursoClient.execute('SELECT COUNT(*) as total FROM politica_calidad');
    console.log(`\n📊 Total de políticas creadas: ${count.rows[0].total}`);
    
    console.log('\n🎉 Tabla de política de calidad configurada como ABM completo');
    
  } catch (error) {
    console.error('❌ Error al crear tabla de política de calidad:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  crearTablaPoliticaCalidad()
    .then(() => {
      console.log('✅ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export default crearTablaPoliticaCalidad; 