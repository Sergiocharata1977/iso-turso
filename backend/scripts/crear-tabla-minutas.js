import { tursoClient } from '../lib/tursoClient.js';

async function crearTablaMinutas() {
  try {
    console.log('🔄 Creando tabla de minutas...');
    
    // Crear tabla minutas
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS minutas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        organization_id INTEGER NOT NULL DEFAULT 1,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        fecha TEXT NOT NULL,
        hora TEXT,
        ubicacion TEXT,
        tipo_reunion TEXT DEFAULT 'revision_direccion',
        participantes TEXT,
        agenda TEXT,
        objetivos TEXT,
        estado TEXT DEFAULT 'programada',
        minuta_texto TEXT,
        acuerdos TEXT,
        acciones TEXT,
        proxima_revision TEXT,
        created_at DATETIME DEFAULT (datetime('now', 'localtime')),
        updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
      )
    `);
    
    console.log('✅ Tabla minutas creada exitosamente');
    
    // Insertar datos de ejemplo
    const minutasEjemplo = [
      {
        titulo: 'Revisión de Indicadores Q1 2024',
        descripcion: 'Revisión mensual de indicadores de calidad y objetivos estratégicos',
        fecha: '2024-01-15',
        hora: '09:00',
        ubicacion: 'Sala de Juntas Principal',
        tipo_reunion: 'revision_direccion',
        participantes: 'Director General, Gerente de Calidad, Jefes de Departamento',
        agenda: '1. Revisión de indicadores de calidad\n2. Análisis de no conformidades\n3. Planificación de mejoras\n4. Otros asuntos',
        objetivos: 'Evaluar el cumplimiento de objetivos y definir acciones de mejora',
        estado: 'programada'
      },
      {
        titulo: 'Revisión de Auditorías Internas',
        descripcion: 'Revisión de resultados de auditorías internas realizadas',
        fecha: '2024-01-20',
        hora: '14:00',
        ubicacion: 'Sala de Conferencias',
        tipo_reunion: 'revision_auditorias',
        participantes: 'Director General, Auditor Interno, Responsables de Área',
        agenda: '1. Presentación de hallazgos de auditorías\n2. Análisis de riesgos\n3. Definición de acciones correctivas\n4. Programación de próximas auditorías',
        objetivos: 'Analizar hallazgos y definir acciones correctivas',
        estado: 'programada'
      }
    ];
    
    for (const minuta of minutasEjemplo) {
      await tursoClient.execute({
        sql: `INSERT INTO minutas (
          organization_id, titulo, descripcion, fecha, hora, ubicacion,
          tipo_reunion, participantes, agenda, objetivos, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          1,
          minuta.titulo,
          minuta.descripcion,
          minuta.fecha,
          minuta.hora,
          minuta.ubicacion,
          minuta.tipo_reunion,
          minuta.participantes,
          minuta.agenda,
          minuta.objetivos,
          minuta.estado
        ]
      });
    }
    
    console.log(`✅ ${minutasEjemplo.length} minutas de ejemplo insertadas`);
    
    // Verificar estructura
    const tableInfo = await tursoClient.execute('PRAGMA table_info(minutas)');
    console.log('\n📋 Estructura de la tabla minutas:');
    tableInfo.rows.forEach(col => {
      console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Verificar datos
    const count = await tursoClient.execute('SELECT COUNT(*) as total FROM minutas');
    console.log(`\n📊 Total de minutas creadas: ${count.rows[0].total}`);
    
    console.log('\n🎉 Sistema de minutas configurado exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  crearTablaMinutas();
}

export default crearTablaMinutas; 