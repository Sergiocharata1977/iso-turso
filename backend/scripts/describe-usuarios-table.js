import { db } from '../lib/tursoClient.js';

async function describeUsuariosTable() {
  try {
    console.log('🔍 Obteniendo estructura de la tabla usuarios...');
    
    // Obtener información de la tabla
    const tableInfo = await db.execute({
      sql: 'PRAGMA table_info(usuarios)'
    });
    
    console.log('\n📋 Estructura de la tabla usuarios:');
    console.log('Columna | Tipo | Not Null | Default | Primary Key');
    console.log('--------|------|----------|---------|------------');
    
    tableInfo.rows.forEach(column => {
      console.log(`${column.name} | ${column.type} | ${column.notnull} | ${column.dflt_value || 'NULL'} | ${column.pk}`);
    });
    
    // Verificar cuántos registros hay
    const countResult = await db.execute({
      sql: 'SELECT COUNT(*) as total FROM usuarios'
    });
    
    console.log(`\n📊 Total de registros: ${countResult.rows[0].total}`);
    
    // Si hay registros, mostrar algunos
    if (countResult.rows[0].total > 0) {
      console.log('\n👥 Primeros registros:');
      const sampleResult = await db.execute({
        sql: 'SELECT * FROM usuarios LIMIT 3'
      });
      
      sampleResult.rows.forEach((row, index) => {
        console.log(`\n${index + 1}. Registro:`);
        Object.keys(row).forEach(key => {
          if (key.includes('password')) {
            console.log(`   ${key}: [HASH OCULTO]`);
          } else {
            console.log(`   ${key}: ${row[key]}`);
          }
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Error al describir tabla usuarios:', error);
  }
}

describeUsuariosTable();
