import { tursoClient } from '../lib/tursoClient.js';

async function checkEvaluacionesTable() {
  try {
    console.log('🔍 Verificando tabla evaluaciones_grupales...');
    
    // Verificar si la tabla existe
    const tableCheck = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='evaluaciones_grupales';"
    });
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ La tabla "evaluaciones_grupales" NO existe');
      return;
    }
    
    console.log('✅ La tabla "evaluaciones_grupales" existe');
    
    // Verificar estructura de la tabla
    const structure = await tursoClient.execute({
      sql: "PRAGMA table_info(evaluaciones_grupales);"
    });
    
    console.log('📋 Estructura de la tabla:');
    structure.rows.forEach(row => {
      console.log(`  - ${row[1]} (${row[2]})`);
    });
    
    // Contar registros
    const count = await tursoClient.execute({
      sql: "SELECT COUNT(*) as total FROM evaluaciones_grupales;"
    });
    
    console.log(`📊 Total de registros: ${count.rows[0][0]}`);
    
    // Mostrar algunos registros si existen
    if (count.rows[0][0] > 0) {
      const sample = await tursoClient.execute({
        sql: "SELECT * FROM evaluaciones_grupales LIMIT 3;"
      });
      
      console.log('📄 Muestra de registros:');
      sample.rows.forEach((row, index) => {
        console.log(`  ${index + 1}:`, row);
      });
    }
    
  } catch (error) {
    console.error('❌ Error al verificar la tabla:', error);
  }
}

checkEvaluacionesTable();
