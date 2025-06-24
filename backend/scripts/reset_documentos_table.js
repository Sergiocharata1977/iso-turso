import { tursoClient } from '../lib/tursoClient.js';

async function resetDocumentosTable() {
  try {
    console.log('Iniciando el reseteo de la tabla `documentos`...');

    // 1. Desactivar claves foráneas para evitar errores de dependencia
    await tursoClient.execute('PRAGMA foreign_keys = OFF;');
    console.log('-> Claves foráneas desactivadas.');

    // 2. Eliminar la tabla `documentos` si existe
    await tursoClient.execute('DROP TABLE IF EXISTS documentos;');
    console.log('-> Tabla `documentos` anterior eliminada (si existía).');

    // 3. Crear la nueva tabla `documentos` simplificada
    await tursoClient.execute(`
      CREATE TABLE documentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        version TEXT NOT NULL,
        descripcion TEXT,
        fecha_creacion TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        archivo_nombre TEXT,
        archivo_mime_type TEXT,
        archivo_contenido BLOB
      );
    `);
    console.log('-> Nueva tabla `documentos` simplificada creada exitosamente.');

    // 4. Reactivar las claves foráneas
    await tursoClient.execute('PRAGMA foreign_keys = ON;');
    console.log('-> Claves foráneas reactivadas.');

    console.log('✅ Reseteo de la tabla `documentos` completado.');

  } catch (error) {
    console.error('❌ Error durante el reseteo de la tabla `documentos`:', error);
    // Intentar reactivar las FKs en caso de error
    try {
      await tursoClient.execute('PRAGMA foreign_keys = ON;');
      console.log('-> Se intentó reactivar las claves foráneas por seguridad.');
    } catch (reactivationError) {
      console.error('!! No se pudieron reactivar las claves foráneas.', reactivationError);
    }
  } finally {
    tursoClient.close();
    console.log('Conexión con la base de datos cerrada.');
  }
}

resetDocumentosTable();
