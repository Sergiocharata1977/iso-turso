import { tursoClient } from '../backend/lib/tursoClient.js';

async function verificarAuditorias() {
  try {
    console.log('🔍 VERIFICANDO ESTRUCTURA DE AUDITORÍAS');
    console.log('='.repeat(50));

    // 1. Verificar si existe la tabla auditorias
    console.log('\n📋 1. Verificando tabla auditorias...');
    const tableExists = await tursoClient.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='auditorias'`,
      args: []
    });

    if (tableExists.rows.length === 0) {
      console.log('❌ La tabla auditorias NO EXISTE');
      return;
    }

    console.log('✅ La tabla auditorias EXISTE');

    // 2. Verificar estructura de la tabla auditorias
    console.log('\n🏗️ 2. Estructura de la tabla auditorias:');
    const estructura = await tursoClient.execute({
      sql: `PRAGMA table_info(auditorias)`,
      args: []
    });

    console.table(estructura.rows);

    // 3. Verificar datos en auditorias
    console.log('\n📄 3. Datos en auditorias:');
    const datos = await tursoClient.execute({
      sql: `SELECT * FROM auditorias LIMIT 5`,
      args: []
    });

    if (datos.rows.length === 0) {
      console.log('   No hay datos en la tabla auditorias');
    } else {
      console.table(datos.rows);
    }

    // 4. Contar registros
    const count = await tursoClient.execute({
      sql: `SELECT COUNT(*) as total FROM auditorias`,
      args: []
    });

    console.log(`\n📈 Total de auditorías: ${count.rows[0].total}`);

    // 5. Verificar tabla auditoria_aspectos
    console.log('\n📋 4. Verificando tabla auditoria_aspectos...');
    const aspectosExists = await tursoClient.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='auditoria_aspectos'`,
      args: []
    });

    if (aspectosExists.rows.length === 0) {
      console.log('❌ La tabla auditoria_aspectos NO EXISTE');
    } else {
      console.log('✅ La tabla auditoria_aspectos EXISTE');
      
      const estructuraAspectos = await tursoClient.execute({
        sql: `PRAGMA table_info(auditoria_aspectos)`,
        args: []
      });

      console.log('\n🏗️ Estructura de auditoria_aspectos:');
      console.table(estructuraAspectos.rows);

      const countAspectos = await tursoClient.execute({
        sql: `SELECT COUNT(*) as total FROM auditoria_aspectos`,
        args: []
      });

      console.log(`📈 Total de aspectos: ${countAspectos.rows[0].total}`);
    }

    // 6. Verificar relaciones con personal
    console.log('\n👥 5. Verificando relaciones con personal...');
    const personalCount = await tursoClient.execute({
      sql: `SELECT COUNT(*) as total FROM personal`,
      args: []
    });

    console.log(`📈 Total de personal: ${personalCount.rows[0].total}`);

    // 7. Ejemplo de JOIN
    console.log('\n🔗 6. Ejemplo de auditorías con personal:');
    const auditoriasConPersonal = await tursoClient.execute({
      sql: `
        SELECT 
          a.codigo,
          a.titulo,
          a.area,
          a.estado,
          p.nombres || ' ' || p.apellidos as responsable_nombre
        FROM auditorias a
        LEFT JOIN personal p ON a.responsable_id = p.id
        LIMIT 3
      `,
      args: []
    });

    if (auditoriasConPersonal.rows.length > 0) {
      console.table(auditoriasConPersonal.rows);
    } else {
      console.log('   No hay auditorías con personal asignado');
    }

    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
  }
}

verificarAuditorias(); 