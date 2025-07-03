// Importamos el cliente de la base de datos
import { tursoClient } from '../lib/tursoClient.js';

// Función principal asíncrona para encapsular la lógica
const createDireccionConfigTable = async () => {
  try {
    console.log('Iniciando la creación de la tabla de configuración de dirección...');

    // 1. Eliminar la tabla si ya existe para asegurar un estado limpio
    await tursoClient.execute('DROP TABLE IF EXISTS direccion_configuracion');
    console.log('-> Tabla anterior (si existía) eliminada.');

    // 2. Crear la nueva tabla
    // Se usa CHECK (id = 1) para forzar a que solo exista una fila, la fila de configuración.
    await tursoClient.execute(`
      CREATE TABLE direccion_configuracion (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        politica_calidad TEXT,
        alcance TEXT,
        estrategia TEXT,
        organigrama_url TEXT,
        mapa_procesos_url TEXT,
        updated_at TEXT
      );
    `);
    console.log('-> Tabla "direccion_configuracion" creada exitosamente.');

    // 3. Insertar la fila de configuración inicial con valores por defecto.
    // Esto es importante para que las futuras operaciones de UPDATE funcionen sobre esta fila.
    const now = new Date().toISOString();
    await tursoClient.execute({
      sql: `
        INSERT INTO direccion_configuracion (id, politica_calidad, alcance, estrategia, organigrama_url, mapa_procesos_url, updated_at)
        VALUES (1, ?, ?, ?, ?, ?, ?);
      `,
      args: ['', '', '', '', '', now]
    });
    console.log('-> Fila de configuración inicial insertada correctamente.');

    console.log('✅ Proceso completado. La tabla está lista para ser usada.');

  } catch (error) {
    console.error('Ocurrió un error durante la creación de la tabla:', error);
  }
};

// Ejecutamos la función
createDireccionConfigTable();
