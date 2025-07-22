// Script para verificar las tablas de competencias
import { tursoClient } from './lib/tursoClient.js';

async function checkCompetenciasTables() {
  console.log('🔍 Verificando tablas de competencias...\n');
  
  const tables = [
    'competencias',
    'evalcompe_programacion',
    'evalcompe_detalle'
  ];
  
  for (const table of tables) {
    try {
      console.log(`📋 Verificando tabla ${table}...`);
      
      // Verificar si la tabla existe
      const tableExistsQuery = await tursoClient.execute({
        sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
        args: [table]
      });
      
      if (tableExistsQuery.rows.length === 0) {
        console.error(`❌ La tabla ${table} no existe!`);
        continue;
      }
      
      // Obtener estructura de la tabla
      const structureQuery = await tursoClient.execute({
        sql: `PRAGMA table_info(${table})`,
        args: []
      });
      
      console.log(`\n📋 Estructura de ${table}:`);
      console.table(structureQuery.rows);
      
      // Contar registros en la tabla
      const countQuery = await tursoClient.execute({
        sql: `SELECT COUNT(*) as count FROM ${table}`,
        args: []
      });
      
      console.log(`📊 Registros en ${table}: ${countQuery.rows[0].count}\n`);
      
      // Si es evalcompe_programacion, mostrar algunos registros
      if (table === 'evalcompe_programacion') {
        const sampleQuery = await tursoClient.execute({
          sql: `SELECT * FROM ${table} LIMIT 3`,
          args: []
        });
        
        console.log(`📝 Muestra de registros en ${table}:`);
        console.table(sampleQuery.rows);
      }
      
      console.log('-------------------------------------------\n');
    } catch (error) {
      console.error(`❌ Error al verificar tabla ${table}:`, error);
    }
  }
}

// Ejecutar la verificación
checkCompetenciasTables()
  .then(() => console.log('✅ Verificación completada'))
  .catch(error => console.error('❌ Error general:', error));
