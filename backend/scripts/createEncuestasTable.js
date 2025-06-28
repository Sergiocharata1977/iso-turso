import { tursoClient } from '../lib/tursoClient.js';

const main = async () => {
  try {
    // Eliminar tablas existentes para un nuevo comienzo (si existen)
    await tursoClient.execute('DROP TABLE IF EXISTS encuestas_respuestas');
    await tursoClient.execute('DROP TABLE IF EXISTS encuestas');
    console.log('Tablas antiguas de encuestas eliminadas (si existían).');

    // Crear la tabla de encuestas
    await tursoClient.execute(`
      CREATE TABLE encuestas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        preguntas TEXT, -- Se almacenará como un JSON con la estructura de las preguntas
        estado TEXT DEFAULT 'Borrador' CHECK(estado IN ('Borrador', 'Activa', 'Cerrada', 'Archivada')),
        creador TEXT,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabla "encuestas" creada exitosamente.');

    // Crear la tabla para las respuestas de las encuestas
    await tursoClient.execute(`
      CREATE TABLE encuestas_respuestas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        encuesta_id INTEGER NOT NULL,
        respondente_id TEXT, -- Opcional, para identificar quién respondió
        respuestas TEXT NOT NULL, -- Se almacenará como un JSON de {pregunta_id: respuesta}
        fecha_respuesta DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (encuesta_id) REFERENCES encuestas(id) ON DELETE CASCADE
      )
    `);
    console.log('Tabla "encuestas_respuestas" creada exitosamente.');

    // Crear un trigger para actualizar automáticamente el campo updated_at
    await tursoClient.execute(`
      CREATE TRIGGER update_encuestas_updated_at
      AFTER UPDATE ON encuestas
      FOR EACH ROW
      BEGIN
        UPDATE encuestas SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
      END;
    `);
    console.log('Trigger "update_encuestas_updated_at" creado exitosamente.');

    console.log('\n✅ Migración de base de datos para encuestas completada.');

  } catch (error) {
    console.error('❌ Error durante la migración de la base de datos para encuestas:');
    console.error(error);
    process.exit(1);
  }
};

    // Insertar datos de ejemplo
    const preguntasEjemplo = [
      {
        id: 'q1_satisfaccion',
        tipo: 'escala_numerica',
        texto: 'En una escala del 1 al 5, ¿qué tan satisfecho está con nuestro servicio al cliente?',
      },
      {
        id: 'q2_opciones',
        tipo: 'opcion_multiple',
        texto: '¿Qué característica del producto le resulta más útil?',
        opciones: [
          { id: 'opt1', texto: 'Facilidad de uso' },
          { id: 'opt2', texto: 'Rendimiento' },
          { id: 'opt3', texto: 'Diseño' },
          { id: 'opt4', texto: 'Soporte' },
        ],
      },
      {
        id: 'q3_texto',
        tipo: 'texto_abierto',
        texto: '¿Tiene alguna sugerencia para mejorar nuestro producto?',
      },
    ];

    await tursoClient.execute({
      sql: `INSERT INTO encuestas (titulo, descripcion, preguntas, estado, creador) VALUES (?, ?, ?, ?, ?)`,
      args: [
        'Satisfacción del Cliente (Q3 2024)',
        'Encuesta trimestral para medir la satisfacción de nuestros clientes con el producto y servicio.',
        JSON.stringify(preguntasEjemplo),
        'Activa',
        'Admin',
      ],
    });

    await tursoClient.execute({
      sql: `INSERT INTO encuestas (titulo, descripcion, preguntas, estado, creador) VALUES (?, ?, ?, ?, ?)`,
      args: [
        'Feedback del Equipo Interno',
        'Encuesta para recoger feedback sobre las nuevas herramientas de desarrollo.',
        JSON.stringify([
          { id: 'q1_herramientas', tipo: 'texto_abierto', texto: '¿Qué es lo que más te gusta de la nueva herramienta de CI/CD?'},
          { id: 'q2_mejoras', tipo: 'texto_abierto', texto: '¿Qué mejorarías en el proceso de code review?'},
        ]),
        'Borrador',
        'Admin',
      ],
    });

    console.log('Datos de ejemplo insertados en la tabla "encuestas".');

main();
