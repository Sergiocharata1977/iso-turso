import { tursoClient } from './lib/tursoClient.js';

async function createMedicionesTable() {
  try {
    console.log('🔨 Creando tabla mediciones...');
    
    // Crear la tabla mediciones con la estructura esperada
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS mediciones (
        id TEXT PRIMARY KEY,
        indicador_id TEXT NOT NULL,
        valor REAL NOT NULL,
        fecha_medicion TEXT NOT NULL,
        observaciones TEXT,
        responsable TEXT,
        fecha_creacion TEXT NOT NULL DEFAULT (datetime('now')),
        organization_id INTEGER DEFAULT 1,
        FOREIGN KEY (indicador_id) REFERENCES indicadores(id)
      )
    `;
    
    await tursoClient.execute(createTableSQL);
    console.log('✅ Tabla mediciones creada exitosamente');
    
    // Verificar la estructura
    const schema = await tursoClient.execute('PRAGMA table_info(mediciones)');
    console.log('\n📋 Estructura de la tabla mediciones:');
    schema.rows.forEach(col => {
      console.log(`  - ${col.name}: ${col.type} ${col.notnull ? '(NOT NULL)' : ''} ${col.pk ? '(PRIMARY KEY)' : ''}`);
    });
    
    // Insertar datos de ejemplo si no hay datos
    const count = await tursoClient.execute('SELECT COUNT(*) as total FROM mediciones');
    
    if (count.rows[0].total === 0) {
      console.log('\n🌱 Insertando datos de ejemplo...');
      
      // Obtener algunos indicadores existentes
      const indicadores = await tursoClient.execute('SELECT id, nombre FROM indicadores LIMIT 3');
      
      if (indicadores.rows.length > 0) {
        const sampleData = [
          {
            id: 'med-1',
            indicador_id: indicadores.rows[0].id,
            valor: 85.5,
            fecha_medicion: '2024-01-15',
            observaciones: 'Medición satisfactoria del cliente',
            responsable: 'Juan Pérez',
            fecha_creacion: '2024-01-15T10:30:00Z'
          },
          {
            id: 'med-2', 
            indicador_id: indicadores.rows[0].id,
            valor: 24.0,
            fecha_medicion: '2024-01-13',
            observaciones: 'Tiempo de respuesta promedio',
            responsable: 'María García',
            fecha_creacion: '2024-01-13T14:20:00Z'
          }
        ];
        
        for (const data of sampleData) {
          await tursoClient.execute({
            sql: `INSERT INTO mediciones (
              id, indicador_id, valor, fecha_medicion, 
              observaciones, responsable, fecha_creacion, organization_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              data.id,
              data.indicador_id,
              data.valor,
              data.fecha_medicion,
              data.observaciones,
              data.responsable,
              data.fecha_creacion,
              1
            ]
          });
        }
        
        console.log(`✅ Insertadas ${sampleData.length} mediciones de ejemplo`);
      } else {
        console.log('⚠️  No hay indicadores disponibles para crear datos de ejemplo');
      }
    }
    
    // Mostrar resumen final
    const finalCount = await tursoClient.execute('SELECT COUNT(*) as total FROM mediciones');
    console.log(`\n📊 Total de mediciones en la base de datos: ${finalCount.rows[0].total}`);
    
    console.log('\n🎉 ¡Tabla mediciones configurada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error al crear tabla mediciones:', error.message);
  }
}

// Ejecutar el script
console.log('🚀 Iniciando creación de tabla mediciones...');
createMedicionesTable(); 