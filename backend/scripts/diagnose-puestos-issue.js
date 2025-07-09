import { tursoClient } from '../lib/tursoClient.js';

const diagnosePuestos = async () => {
  console.log('🔍 Diagnóstico de la tabla puestos...\n');
  
  try {
    // 1. Verificar estructura de la tabla
    console.log('1. Estructura de la tabla puestos:');
    const tableInfo = await tursoClient.execute({
      sql: 'PRAGMA table_info(puestos)',
      args: []
    });
    
    console.log('Columnas encontradas:');
    tableInfo.rows.forEach(col => {
      console.log(`  - ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}`);
    });
    
    // 2. Verificar si hay registros
    console.log('\n2. Registros existentes:');
    const count = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as total FROM puestos',
      args: []
    });
    console.log(`  Total de puestos: ${count.rows[0].total}`);
    
    // 3. Intentar insertar un registro de prueba
    console.log('\n3. Prueba de inserción:');
    const testId = 'test-' + Date.now();
    
    try {
      // Primero intentar con descripcion_responsabilidades
      await tursoClient.execute({
        sql: `INSERT INTO puestos (
                id, nombre, descripcion_responsabilidades, departamento_id, organization_id,
                requisitos_experiencia, requisitos_formacion, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          testId,
          'Puesto de Prueba',
          'Descripción de prueba',
          null,
          21,
          'Sin experiencia',
          'Sin formación',
          new Date().toISOString(),
          new Date().toISOString()
        ]
      });
      console.log('  ✅ Inserción exitosa con descripcion_responsabilidades');
      
      // Limpiar el registro de prueba
      await tursoClient.execute({
        sql: 'DELETE FROM puestos WHERE id = ?',
        args: [testId]
      });
      
    } catch (error) {
      console.log('  ❌ Error con descripcion_responsabilidades:', error.message);
      
      // Intentar con solo descripcion
      try {
        await tursoClient.execute({
          sql: `INSERT INTO puestos (
                  id, nombre, descripcion, departamento_id, organization_id,
                  requisitos_experiencia, requisitos_formacion, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            testId,
            'Puesto de Prueba',
            'Descripción de prueba',
            null,
            21,
            'Sin experiencia',
            'Sin formación',
            new Date().toISOString(),
            new Date().toISOString()
          ]
        });
        console.log('  ✅ Inserción exitosa con descripcion');
        
        // Limpiar el registro de prueba
        await tursoClient.execute({
          sql: 'DELETE FROM puestos WHERE id = ?',
          args: [testId]
        });
        
      } catch (error2) {
        console.log('  ❌ Error con descripcion:', error2.message);
      }
    }
    
    // 4. Mostrar un registro de ejemplo si existe
    console.log('\n4. Ejemplo de registro existente:');
    const sample = await tursoClient.execute({
      sql: 'SELECT * FROM puestos LIMIT 1',
      args: []
    });
    
    if (sample.rows.length > 0) {
      console.log('  Campos del registro:');
      Object.keys(sample.rows[0]).forEach(key => {
        console.log(`    ${key}: ${sample.rows[0][key]}`);
      });
    } else {
      console.log('  No hay registros en la tabla');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
  
  process.exit(0);
};

diagnosePuestos(); 