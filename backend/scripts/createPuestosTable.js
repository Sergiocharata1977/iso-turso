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
  // Importar tursoClient aquí, DESPUÉS de que dotenv haya configurado las variables
  const { tursoClient } = await import('../lib/tursoClient.js');
  try {
    console.log("Creando tabla de puestos...");

    // Crear tabla de puestos si no existe
    await tursoClient.execute({
      sql: `CREATE TABLE IF NOT EXISTS puestos (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL,
        departamento_id INTEGER, /* Cambiado de departamento TEXT */
        descripcion TEXT,
        nivel TEXT,
        requisitos TEXT,
        responsabilidades TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (departamento_id) REFERENCES departamentos (id) ON DELETE SET NULL ON UPDATE CASCADE /* Añadida FK */
      )`
    });
    console.log("Tabla 'puestos' creada correctamente");
    
    console.log("Proceso de creación de tabla puestos completado");
  } catch (error) {
    console.error("Error al crear tabla de puestos:", error);
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
