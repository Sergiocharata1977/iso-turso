import { createClient } from '@libsql/client';

// Configuración de la conexión a la base de datos local
const tursoClient = createClient({
  url: 'file:C:\\Users\\Usuario\\Documents\\Proyectos\\isoflow3-master\\backend\\data.db'
});

console.log('[tursoClient] Conectando a la base de datos local: file:C:\\Users\\Usuario\\Documents\\Proyectos\\isoflow3-master\\backend\\data.db');

async function consultarTodasLasTablasAuditoria() {
  try {
    // Lista de tablas relacionadas con auditorías
    const tablasAuditoria = [
      'auditorias',
      'auditoria_procesos', 
      'auditoria_participantes',
      'auditoria_hallazgos',
      'auditoria_evidencias',
      'audit_logs'
    ];

    for (const tabla of tablasAuditoria) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📋 TABLA: ${tabla.toUpperCase()}`);
      console.log(`${'='.repeat(60)}`);
      
      try {
        // Verificar si la tabla existe
        const tableExists = await tursoClient.execute({
          sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
          args: [tabla]
        });

        if (tableExists.rows.length === 0) {
          console.log(`❌ La tabla ${tabla} NO EXISTE`);
          continue;
        }

        // Obtener estructura de la tabla
        const estructura = await tursoClient.execute({
          sql: `PRAGMA table_info(${tabla})`
        });

        console.log('\n📊 ESTRUCTURA DE LA TABLA:');
        console.table(estructura.rows);

        // Obtener datos de la tabla
        const datos = await tursoClient.execute({
          sql: `SELECT * FROM ${tabla} LIMIT 10`
        });

        console.log(`\n📄 DATOS (máximo 10 registros):`);
        if (datos.rows.length === 0) {
          console.log('   No hay datos en esta tabla');
        } else {
          console.table(datos.rows);
        }

        // Contar registros totales
        const count = await tursoClient.execute({
          sql: `SELECT COUNT(*) as total FROM ${tabla}`
        });

        console.log(`\n📈 TOTAL DE REGISTROS: ${count.rows[0].total}`);

      } catch (error) {
        console.error(`❌ Error consultando tabla ${tabla}:`, error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

consultarTodasLasTablasAuditoria(); 