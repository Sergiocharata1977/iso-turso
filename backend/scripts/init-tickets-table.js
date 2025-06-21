import { executeQuery } from '../lib/tursoClient.js';

async function createTicketsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client TEXT,
      problem TEXT NOT NULL,
      status TEXT DEFAULT 'Abierto',
      responsible TEXT,
      final_comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await executeQuery(createTableQuery);
    console.log('Tabla "tickets" verificada/creada con éxito.');
  } catch (error) {
    console.error('Error al crear la tabla "tickets":', error);
  }
}

createTicketsTable();
