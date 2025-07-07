import { tursoClient } from '../lib/tursoClient.js';

async function createAuditLogsTable() {
  try {
    console.log('🔄 Creando tabla audit_logs...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        organization_id TEXT NOT NULL,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        timestamp TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
      );
    `;

    await tursoClient.execute(createTableSQL);
    console.log('✅ Tabla audit_logs creada exitosamente');

    // Crear índices para optimizar consultas
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
    `);
    
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON audit_logs(organization_id);
    `);
    
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
    `);
    
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
    `);
    
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
    `);

    console.log('✅ Índices creados exitosamente');

  } catch (error) {
    console.error('❌ Error al crear tabla audit_logs:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createAuditLogsTable()
    .then(() => {
      console.log('🎉 Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en el script:', error);
      process.exit(1);
    });
}

export default createAuditLogsTable; 