import { tursoClient } from './lib/tursoClient.js';

async function checkEvalcompeTables() {
  try {
    console.log('🔍 Verificando tablas de evaluación de competencias...');
    
    // 1. Verificar tabla evalcompe_programacion
    console.log('\n📋 Verificando evalcompe_programacion...');
    const evalTable = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='evalcompe_programacion'"
    });
    
    if (evalTable.rows.length === 0) {
      console.log('❌ La tabla evalcompe_programacion NO existe');
    } else {
      console.log('✅ La tabla evalcompe_programacion existe');
      
      // Mostrar estructura
      const schema = await tursoClient.execute({
        sql: `PRAGMA table_info(evalcompe_programacion)`
      });
      console.log('\n📋 Estructura de evalcompe_programacion:');
      console.table(schema.rows);
      
      // Contar registros
      const count = await tursoClient.execute({
        sql: `SELECT COUNT(*) as count FROM evalcompe_programacion`
      });
      console.log(`\n📊 evalcompe_programacion contiene ${count.rows[0].count} registros.`);
    }
    
    // 2. Verificar tabla evalcompe_detalle
    console.log('\n📋 Verificando evalcompe_detalle...');
    const detalleTable = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='evalcompe_detalle'"
    });
    
    if (detalleTable.rows.length === 0) {
      console.log('❌ La tabla evalcompe_detalle NO existe');
    } else {
      console.log('✅ La tabla evalcompe_detalle existe');
      
      // Mostrar estructura
      const schema = await tursoClient.execute({
        sql: `PRAGMA table_info(evalcompe_detalle)`
      });
      console.log('\n📋 Estructura de evalcompe_detalle:');
      console.table(schema.rows);
      
      // Contar registros
      const count = await tursoClient.execute({
        sql: `SELECT COUNT(*) as count FROM evalcompe_detalle`
      });
      console.log(`\n📊 evalcompe_detalle contiene ${count.rows[0].count} registros.`);
    }
    
    // 3. Probar consulta de evalcompe_programacion
    console.log('\n🧪 Probando consulta de evalcompe_programacion...');
    try {
      const testQuery = await tursoClient.execute({
        sql: `SELECT 
          ec.*,
          c.nombre as competencia_nombre,
          p.nombres || ' ' || p.apellidos as personal_nombre,
          u.name as evaluador_nombre
          FROM evalcompe_programacion ec
          LEFT JOIN competencias c ON ec.competencia_id = c.id
          LEFT JOIN personal p ON ec.personal_id = p.id
          LEFT JOIN usuarios u ON ec.evaluador_id = u.id
          WHERE ec.organization_id = 2
          ORDER BY ec.created_at DESC`,
        args: []
      });
      console.log(`✅ Consulta exitosa. Encontrados ${testQuery.rows.length} registros.`);
    } catch (error) {
      console.error('❌ Error en consulta:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkEvalcompeTables(); 