import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env en el directorio actual (backend)
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Verificar que las variables estén cargadas
console.log("🔑 DATABASE_URL:", process.env.DATABASE_URL ? "✅ Configurada" : "❌ No encontrada");
console.log("🔑 TURSO_AUTH_TOKEN:", process.env.TURSO_AUTH_TOKEN ? "✅ Configurada" : "❌ No encontrada");

// Usar las variables de entorno de Turso
const db = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

const createDocumentosTable = async () => {
    try {
        console.log("🔄 Creando tabla 'documentos'...");
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS documentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                nombre TEXT NOT NULL,
                descripcion TEXT,
                version TEXT DEFAULT '1.0',
                archivo_nombre TEXT NOT NULL,
                archivo_path TEXT NOT NULL,
                tipo_archivo TEXT,
                tamaño INTEGER,
                organization_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Tabla 'documentos' creada o ya existente.");

        // Verificar la estructura de la tabla
        const tableInfo = await db.execute(`PRAGMA table_info(documentos);`);
        console.log("📋 Estructura de la tabla 'documentos':");
        tableInfo.rows.forEach(row => {
            console.log(`  - ${row.name}: ${row.type} ${row.notnull ? 'NOT NULL' : ''} ${row.pk ? 'PRIMARY KEY' : ''}`);
        });

        // Opcional: Añadir índices para mejorar el rendimiento de las búsquedas
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_documentos_organization ON documentos(organization_id);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_documentos_titulo ON documentos(titulo);`);
        console.log("✅ Índices para la tabla 'documentos' creados o ya existentes.");

    } catch (error) {
        console.error("❌ Error al crear la tabla 'documentos':", error);
    } finally {
        await db.close();
        console.log("📦 Conexión con la base de datos cerrada.");
    }
};

// Ejecutar la función
createDocumentosTable(); 