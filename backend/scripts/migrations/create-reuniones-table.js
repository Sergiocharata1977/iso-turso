import db from '../../src/config/db.js';

const createReunionesTable = async () => {
  const connection = await db.getConnection();
  try {
    console.log('Creando la tabla `reuniones`...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reuniones (
        id INTEGER PRIMARY KEY,
        titulo TEXT NOT NULL,
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        area TEXT,
        estado TEXT DEFAULT 'Programada',
        participantes TEXT,
        temas TEXT,
        objetivos TEXT,
        minuta TEXT,
        organization_id INTEGER NOT NULL,
        created_at TEXT DEFAULT (datetime('now','localtime')),
        updated_at TEXT DEFAULT (datetime('now','localtime'))
      );
    `);
    console.log('Tabla `reuniones` creada o ya existente.');
  } catch (error) {
    console.error('Error al crear la tabla `reuniones`:', error);
  } finally {
    connection.release();
  }
};

const runMigration = async () => {
  await createReunionesTable();
  db.pool.end();
};

// Ejecutar la migración si el script es llamado directamente
if (require.main === module) {
  runMigration();
}

module.exports = { createReunionesTable };
