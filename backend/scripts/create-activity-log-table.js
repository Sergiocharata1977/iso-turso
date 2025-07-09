import { tursoClient } from '../lib/tursoClient.js';

const createTable = async () => {
  await tursoClient.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS actividad_sistema (
        id TEXT PRIMARY KEY,
        tipo_entidad TEXT NOT NULL,
        entidad_id TEXT NOT NULL,
        accion TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        usuario_id TEXT,
        usuario_nombre TEXT,
        organization_id INTEGER NOT NULL,
        datos_anteriores TEXT,
        datos_nuevos TEXT,
        created_at TEXT,
        ip_address TEXT,
        user_agent TEXT
      );
    `,
    args: []
  });

  // Crear índices
  const indices = [
    "CREATE INDEX IF NOT EXISTS idx_actividad_tipo_entidad ON actividad_sistema(tipo_entidad);",
    "CREATE INDEX IF NOT EXISTS idx_actividad_entidad_id ON actividad_sistema(entidad_id);",
    "CREATE INDEX IF NOT EXISTS idx_actividad_organization ON actividad_sistema(organization_id);",
    "CREATE INDEX IF NOT EXISTS idx_actividad_created_at ON actividad_sistema(created_at);",
    "CREATE INDEX IF NOT EXISTS idx_actividad_usuario ON actividad_sistema(usuario_id);"
  ];
  for (const sql of indices) {
    await tursoClient.execute({ sql, args: [] });
  }
  console.log('✅ Tabla actividad_sistema creada y con índices');
  process.exit(0);
};

createTable(); 