// Script para crear la tabla relaciones_sgc en SQLite
// Ejecutar con: node create-relaciones-sgc-table.cjs

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS relaciones_sgc (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      origen_tipo TEXT NOT NULL,      -- 'proceso', 'puesto', etc.
      origen_id INTEGER NOT NULL,
      destino_tipo TEXT NOT NULL,     -- 'documento', 'norma', etc.
      destino_id INTEGER NOT NULL,
      descripcion TEXT,               -- opcional, para detalles de la relación
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      usuario_creador TEXT,           -- opcional, para auditoría
      UNIQUE(organization_id, origen_tipo, origen_id, destino_tipo, destino_id)
    );
  `, (err) => {
    if (err) {
      console.error('Error creando la tabla relaciones_sgc:', err.message);
    } else {
      console.log('Tabla relaciones_sgc creada o ya existe.');
      db.run(`CREATE INDEX IF NOT EXISTS idx_relaciones_org ON relaciones_sgc (organization_id);`, (err2) => {
        if (err2) {
          console.error('Error creando el índice:', err2.message);
        } else {
          console.log('Índice sobre organization_id creado o ya existe.');
        }
      });
    }
  });
});

db.close(); 