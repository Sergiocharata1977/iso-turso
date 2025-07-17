const { tursoClient } = require('./lib/tursoClient');

async function createObjetivosTable() {
  try {
    console.log('📋 Creando tabla objetivos_calidad...');
    
    const sql = `
      CREATE TABLE IF NOT EXISTS objetivos_calidad (
        id TEXT PRIMARY KEY DEFAULT ('obj-' || SUBSTR(HEX(RANDOMBLOB(8)), 1, 12)),
        codigo TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        meta TEXT,
        responsable TEXT,
        fecha_inicio DATE,
        fecha_fin DATE,
        estado TEXT DEFAULT 'activo',
        organization_id INTEGER NOT NULL DEFAULT 21,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await tursoClient.execute(sql);
    console.log('✅ Tabla objetivos_calidad creada exitosamente');
    
    // Verificar la tabla
    const result = await tursoClient.execute('SELECT COUNT(*) as count FROM objetivos_calidad');
    console.log('📊 Registros en objetivos_calidad:', result.rows[0]);
    
    // Insertar algunos datos de ejemplo
    const ejemplos = [
      {
        codigo: 'OC-001',
        descripcion: 'Mejorar la satisfacción del cliente al 95%',
        meta: '95% satisfacción',
        responsable: 'Gerente de Calidad',
        fecha_inicio: '2025-01-01',
        fecha_fin: '2025-12-31',
        estado: 'activo'
      },
      {
        codigo: 'OC-002', 
        descripcion: 'Reducir defectos de productos al 2%',
        meta: 'Máximo 2% defectos',
        responsable: 'Jefe de Producción',
        fecha_inicio: '2025-01-01',
        fecha_fin: '2025-12-31',
        estado: 'activo'
      }
    ];
    
    for (const ejemplo of ejemplos) {
      try {
        await tursoClient.execute({
          sql: `INSERT INTO objetivos_calidad (codigo, descripcion, meta, responsable, fecha_inicio, fecha_fin, estado, organization_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [ejemplo.codigo, ejemplo.descripcion, ejemplo.meta, ejemplo.responsable, 
                ejemplo.fecha_inicio, ejemplo.fecha_fin, ejemplo.estado, 21]
        });
        console.log(`✅ Objetivo ${ejemplo.codigo} insertado`);
      } catch (err) {
        console.log(`⚠️ Objetivo ${ejemplo.codigo} ya existe o error:`, err.message);
      }
    }
    
    console.log('🎉 Setup de objetivos_calidad completado');
    
  } catch (error) {
    console.error('❌ Error creando tabla objetivos_calidad:', error);
  }
}

createObjetivosTable().then(() => process.exit(0)); 