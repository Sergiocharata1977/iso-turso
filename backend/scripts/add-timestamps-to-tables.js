import { tursoClient } from '../lib/tursoClient.js';

const tables = [
  'departamentos',
  'puestos',
  'personal',
  'procesos',
  'documentos',
  'normas',
  'objetivos_calidad',
  'indicadores',
  'mediciones',
  'capacitaciones',
  'evaluaciones_grupales',
  'tickets',
  'productos',
  'encuestas',
  'hallazgos',
  'acciones',
  'auditorias'
];

const addTimestamps = async () => {
  for (const table of tables) {
    try {
      // Agregar columnas si no existen
      await tursoClient.execute({ sql: `ALTER TABLE ${table} ADD COLUMN created_at TEXT;`, args: [] }).catch(()=>{});
      await tursoClient.execute({ sql: `ALTER TABLE ${table} ADD COLUMN updated_at TEXT;`, args: [] }).catch(()=>{});
      // Poblar valores existentes
      await tursoClient.execute({ sql: `UPDATE ${table} SET created_at = datetime('now', 'localtime') WHERE created_at IS NULL;`, args: [] });
      await tursoClient.execute({ sql: `UPDATE ${table} SET updated_at = datetime('now', 'localtime') WHERE updated_at IS NULL;`, args: [] });
      console.log(`✅ Timestamps agregados a ${table}`);
    } catch (e) {
      console.error(`❌ Error en ${table}:`, e.message);
    }
  }
  process.exit(0);
};

addTimestamps(); 