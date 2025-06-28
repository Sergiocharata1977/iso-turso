import { tursoClient } from './lib/tursoClient.js';

async function fixProcesosTable() {
  try {
    console.log('🔄 Verificando estructura de tabla procesos...');
    
    // Verificar estructura actual
    const tableInfo = await tursoClient.execute('PRAGMA table_info(procesos)');
    console.log('📊 Estructura actual:', tableInfo.rows.map(r => r.name));
    
    // Respaldar datos existentes
    const existingData = await tursoClient.execute('SELECT * FROM procesos');
    console.log(`📦 Respaldando ${existingData.rows.length} registros existentes`);
    
    // Recrear tabla con estructura completa
    await tursoClient.execute('DROP TABLE IF EXISTS procesos_backup');
    await tursoClient.execute(`
      CREATE TABLE procesos_backup AS SELECT * FROM procesos
    `);
    
    await tursoClient.execute('DROP TABLE procesos');
    
    await tursoClient.execute(`
      CREATE TABLE procesos (
        id TEXT PRIMARY KEY,
        codigo TEXT NOT NULL UNIQUE,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        tipo TEXT,
        responsable TEXT,
        entradas TEXT,
        salidas TEXT,
        indicadores TEXT,
        documentos_relacionados TEXT,
        estado TEXT DEFAULT 'activo',
        version TEXT DEFAULT '1.0',
        fecha_creacion TEXT NOT NULL,
        fecha_actualizacion TEXT
      )
    `);
    
    console.log('✅ Nueva estructura de tabla procesos creada');
    
    // Migrar datos existentes si los hay
    if (existingData.rows.length > 0) {
      console.log('🔄 Migrando datos existentes...');
      for (const row of existingData.rows) {
        await tursoClient.execute({
          sql: `INSERT INTO procesos (
                  id, codigo, nombre, descripcion, responsable, version, 
                  tipo, entradas, salidas, indicadores, documentos_relacionados, 
                  estado, fecha_creacion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            row.id || `proc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            row.codigo,
            row.nombre,
            row.descripcion || '',
            row.responsable || '',
            row.version || '1.0',
            'proceso', // tipo por defecto
            '', // entradas
            '', // salidas
            '', // indicadores
            '', // documentos_relacionados
            'activo', // estado
            new Date().toISOString() // fecha_creacion
          ]
        });
      }
      console.log(`✅ ${existingData.rows.length} registros migrados exitosamente`);
    }
    
    // Verificar nueva estructura
    const newTableInfo = await tursoClient.execute('PRAGMA table_info(procesos)');
    console.log('📊 Nueva estructura:', newTableInfo.rows.map(r => `${r.name} (${r.type})`));
    
    // Limpiar backup
    await tursoClient.execute('DROP TABLE IF EXISTS procesos_backup');
    
    console.log('🎉 Tabla procesos actualizada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al actualizar tabla procesos:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  fixProcesosTable();
}

export { fixProcesosTable };
