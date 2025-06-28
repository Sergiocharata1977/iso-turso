import { tursoClient } from '../lib/tursoClient.js';

async function setupProductosTable() {
  console.log('Iniciando la re-creación de la tabla de productos...');

  const dropTableStmt = `DROP TABLE IF EXISTS productos;`;

  const createTableStmt = `
    CREATE TABLE productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        codigo TEXT UNIQUE,
        estado TEXT DEFAULT 'En Desarrollo',
        fecha_creacion DATETIME DEFAULT (datetime('now','localtime')),
        fecha_actualizacion DATETIME
    );
  `;

  const createTriggerStmt = `
    CREATE TRIGGER IF NOT EXISTS update_productos_fecha_actualizacion
    AFTER UPDATE ON productos
    FOR EACH ROW
    BEGIN
        UPDATE productos SET fecha_actualizacion = datetime('now', 'localtime') WHERE id = OLD.id;
    END;
  `;

  try {
    // Usamos batch para asegurar que las operaciones se ejecuten en orden
    await tursoClient.batch([
      dropTableStmt,
      createTableStmt,
      createTriggerStmt
    ], 'write');
    
    console.log('✅ Tabla `productos` re-creada con éxito (versión simplificada).');

  } catch (error) {
    console.error('❌ Error al configurar la tabla de productos:', error.message);
    if (error.cause) {
      console.error('Causa del error:', error.cause);
    }
  }
}

setupProductosTable();
