import { tursoClient } from './lib/tursoClient.js';

async function checkRelacionesTable() {
  try {
    console.log('🔍 Verificando tabla de relaciones...');
    
    // 1. Verificar estructura de relaciones_sgc
    console.log('\n📋 Verificando relaciones_sgc...');
    const schema = await tursoClient.execute({
      sql: `PRAGMA table_info(relaciones_sgc)`
    });
    console.log('\n📋 Estructura de relaciones_sgc:');
    console.table(schema.rows);
    
    // 2. Contar registros
    const count = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM relaciones_sgc`
    });
    console.log(`\n📊 relaciones_sgc contiene ${count.rows[0].count} registros.`);
    
    // 3. Ver algunos registros si existen
    if (count.rows[0].count > 0) {
      const sample = await tursoClient.execute({
        sql: `SELECT * FROM relaciones_sgc LIMIT 5`
      });
      console.log('\n📋 Muestra de registros:');
      console.table(sample.rows);
    }
    
    // 4. Verificar si hay relaciones de competencias
    const competenciasRel = await tursoClient.execute({
      sql: `SELECT * FROM relaciones_sgc WHERE origen_tipo = 'competencia' OR destino_tipo = 'competencia'`
    });
    console.log(`\n📊 Relaciones de competencias: ${competenciasRel.rows.length}`);
    
    // 5. Verificar si hay relaciones de personal
    const personalRel = await tursoClient.execute({
      sql: `SELECT * FROM relaciones_sgc WHERE origen_tipo = 'personal' OR destino_tipo = 'personal'`
    });
    console.log(`📊 Relaciones de personal: ${personalRel.rows.length}`);
    
    // 6. Probar consulta usando relaciones
    console.log('\n🧪 Probando consulta con relaciones...');
    try {
      const testQuery = await tursoClient.execute({
        sql: `SELECT 
          r.*,
          c.nombre as competencia_nombre,
          p.nombres || ' ' || p.apellidos as personal_nombre
          FROM relaciones_sgc r
          LEFT JOIN competencias c ON (r.origen_tipo = 'competencia' AND r.origen_id = c.id) 
                                    OR (r.destino_tipo = 'competencia' AND r.destino_id = c.id)
          LEFT JOIN personal p ON (r.origen_tipo = 'personal' AND r.origen_id = p.id) 
                                OR (r.destino_tipo = 'personal' AND r.destino_id = p.id)
          WHERE r.organization_id = 2
          AND (r.origen_tipo = 'competencia' OR r.destino_tipo = 'competencia')
          AND (r.origen_tipo = 'personal' OR r.destino_tipo = 'personal')`,
        args: []
      });
      console.log(`✅ Consulta con relaciones exitosa. Encontrados ${testQuery.rows.length} registros.`);
    } catch (error) {
      console.error('❌ Error en consulta con relaciones:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkRelacionesTable(); 