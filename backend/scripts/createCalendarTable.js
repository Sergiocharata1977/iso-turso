import db from '../db.js';

const createCalendarTable = async () => {
  try {
    // Crear tabla de eventos si no existe
    await db.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        all_day BOOLEAN NOT NULL DEFAULT 0, 
        type TEXT CHECK(type IN ('mejora', 'planificacion', 'auditoria', 'producto', 'otro')) NOT NULL DEFAULT 'otro',
        organization_id INTEGER NOT NULL,
        user_id INTEGER, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organizations (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
      );
    `);

    // Trigger para actualizar 'updated_at' en cada modificación
    await db.execute(`
      CREATE TRIGGER IF NOT EXISTS update_events_updated_at
      AFTER UPDATE ON events
      FOR EACH ROW
      BEGIN
        UPDATE events SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
      END;
    `);
    
    console.log('-> Tabla "events" y trigger verificados.');

  } catch (err) {
    console.error('Error durante la creación de la tabla de calendario:', err.message);
    throw err; // Re-lanzar el error para que el llamador lo maneje
  } 
};

export default createCalendarTable;
