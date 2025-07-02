// Script para crear la tabla de puestos
import dotenv from 'dotenv';
import path from 'path';

// Construir la ruta al archivo .env ubicado en 'backend/.env' relativo al directorio de trabajo actual
const projectRoot = process.cwd(); // Debería ser c:\Users\Usuario\Documents\Proyectos\isoflow3-master
const envPath = path.join(projectRoot, 'backend', '.env');

console.log(`[DEBUG] Intentando cargar .env desde: ${envPath}`);
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
  console.error('[DEBUG] Error al cargar .env:', dotenvResult.error);
} else {
  console.log('[DEBUG] .env cargado aparentemente con éxito. Contenido parseado:', dotenvResult.parsed);
}

console.log('[DEBUG] VITE_TURSO_DATABASE_URL (después de dotenv.config):', process.env.VITE_TURSO_DATABASE_URL);
console.log('[DEBUG] VITE_TURSO_AUTH_TOKEN (después de dotenv.config):', process.env.VITE_TURSO_AUTH_TOKEN);

// La importación de tursoClient se moverá dentro de la función createPuestosTable

async function createPuestosTable() {
  const { tursoClient } = await import('../lib/tursoClient.js');
  try {
    console.log("Recreando la tabla de puestos con el esquema correcto...");

    // Primero, eliminamos la tabla si existe para asegurar que el esquema nuevo se aplique
    await tursoClient.execute(`DROP TABLE IF EXISTS puestos;`);
    console.log("Tabla 'puestos' existente eliminada (si existía).");

    // Crear tabla de puestos con el esquema correcto que espera la API
    await tursoClient.execute({
      sql: `CREATE TABLE puestos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo_puesto TEXT NOT NULL,
        codigo_puesto TEXT UNIQUE,
        departamento_id INTEGER,
        proposito_general TEXT,
        principales_responsabilidades TEXT,
        requisitos TEXT,
        formacion_requerida TEXT,
        experiencia_requerida TEXT,
        conocimientos_especificos TEXT,
        competencias_necesarias TEXT,
        nivel TEXT,
        documento_descripcion_puesto_url TEXT,
        estado_puesto TEXT DEFAULT 'Activo',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (departamento_id) REFERENCES departamentos (id) ON DELETE SET NULL ON UPDATE CASCADE
      )`
    });
    console.log("Tabla 'puestos' creada correctamente con el nuevo esquema.");
    
    console.log("Proceso de creación de tabla puestos completado.");
  } catch (error) {
    console.error("Error al recrear la tabla de puestos:", error);
  }
}

// Ejecutar la función principal
createPuestosTable()
  .then(() => {
    console.log("Proceso finalizado con éxito");
  })
  .catch(error => {
    console.error("Error en el proceso principal:", error);
  });
