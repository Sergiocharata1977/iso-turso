import { tursoClient } from '../lib/tursoClient.js';

const tables = [
  'departamentos',
  'puestos',
  'personal',
  'actividad_sistema'
];

const checkTables = async () => {
  for (const table of tables) {
    try {
      const info = await tursoClient.execute({ sql: `PRAGMA table_info(${table});`, args: [] });
      console.log(`\n=== ${table} ===`);
      info.rows.forEach(col => {
        console.log(`- ${col.name} (${col.type})`);
      });
    } catch (e) {
      console.error(`❌ Error consultando ${table}:`, e.message);
    }
  }
  process.exit(0);
};

checkTables(); 