const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

async function createAuditLogsTable() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        organization_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES usuarios(id),
        FOREIGN KEY (organization_id) REFERENCES organizations(id)
      )
    `);
    console.log('✅ Tabla audit_logs creada exitosamente');
  } catch (error) {
    console.error('❌ Error creando tabla audit_logs:', error);
  }
}

createAuditLogsTable(); 