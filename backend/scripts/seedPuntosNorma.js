import { createClient } from "@libsql/client";
import dotenv from 'dotenv';

dotenv.config();

// Array de puntos de la norma ISO 9001
const puntosNorma = [
  { codigo: "4.1", titulo: "Comprensión de la organización y su contexto" },
  { codigo: "4.2", titulo: "Comprensión de las necesidades y expectativas de las partes interesadas" },
  { codigo: "4.3", titulo: "Determinación del alcance del sistema de gestión de la calidad" },
  { codigo: "4.4", titulo: "Sistema de gestión de la calidad y sus procesos" },
  { codigo: "5.1", titulo: "Liderazgo y compromiso" },
  { codigo: "5.1.1", titulo: "Generalidades" },
  { codigo: "5.1.2", titulo: "Enfoque al cliente" },
  { codigo: "5.2", titulo: "Política" },
  { codigo: "5.2.1", titulo: "Establecimiento de la política de calidad" },
  { codigo: "5.2.2", titulo: "Comunicación de la política de calidad" },
  { codigo: "5.3", titulo: "Roles, responsabilidades y autoridades en la organización" },
  { codigo: "6.1", titulo: "Acciones para abordar riesgos y oportunidades" },
  { codigo: "6.2", titulo: "Objetivos de la calidad y planificación para lograrlos" },
  { codigo: "6.3", titulo: "Planificación de los cambios" },
  { codigo: "7.1", titulo: "Recursos" },
  { codigo: "7.1.1", titulo: "Generalidades" },
  { codigo: "7.1.2", titulo: "Personas" },
  { codigo: "7.1.3", titulo: "Infraestructura" },
  { codigo: "7.1.4", titulo: "Ambiente para la operación de los procesos" },
  { codigo: "7.1.5", titulo: "Recursos de seguimiento y medición" },
  { codigo: "7.1.5.1", titulo: "Generalidades" },
  { codigo: "7.1.5.2", titulo: "Trazabilidad de las mediciones" },
  { codigo: "7.1.6", titulo: "Conocimientos organizacionales" },
  { codigo: "7.2", titulo: "Competencia" },
  { codigo: "7.3", titulo: "Toma de conciencia" },
  { codigo: "7.4", titulo: "Comunicación" },
  { codigo: "7.5", titulo: "Información documentada" },
  { codigo: "7.5.1", titulo: "Generalidades" },
  { codigo: "7.5.2", titulo: "Creación y actualización" },
  { codigo: "7.5.3", titulo: "Control de la información documentada" },
  { codigo: "8.1", titulo: "Planificación y control operacional" },
  { codigo: "8.2", titulo: "Requisitos para los productos y servicios" },
  { codigo: "8.2.1", titulo: "Comunicación con el cliente" },
  { codigo: "8.2.2", titulo: "Determinación de los requisitos relacionados con los productos y servicios" },
  { codigo: "8.2.3", titulo: "Revisión de los requisitos relacionados con los productos y servicios" },
  { codigo: "8.2.4", titulo: "Cambios en los requisitos para los productos y servicios" },
  { codigo: "8.3", titulo: "Diseño y desarrollo de los productos y servicios" },
  { codigo: "8.3.1", titulo: "Generalidades" },
  { codigo: "8.3.2", titulo: "Planificación del diseño y desarrollo" },
  { codigo: "8.3.3", titulo: "Entradas para el diseño y desarrollo" },
  { codigo: "8.3.4", titulo: "Controles del diseño y desarrollo" },
  { codigo: "8.3.5", titulo: "Salidas del diseño y desarrollo" },
  { codigo: "8.3.6", titulo: "Cambios en el diseño y desarrollo" },
  { codigo: "8.4", titulo: "Control de los procesos, productos y servicios suministrados externamente" },
  { codigo: "8.4.1", titulo: "Generalidades" },
  { codigo: "8.4.2", titulo: "Tipo y grado de control" },
  { codigo: "8.4.3", titulo: "Información para los proveedores externos" },
  { codigo: "8.5", titulo: "Producción y provisión del servicio" },
  { codigo: "8.5.1", titulo: "Control de la producción y provisión del servicio" },
  { codigo: "8.5.2", titulo: "Identificación y trazabilidad" },
  { codigo: "8.5.3", titulo: "Propiedad perteneciente a los clientes o proveedores externos" },
  { codigo: "8.5.4", titulo: "Preservación" },
  { codigo: "8.5.5", titulo: "Actividades posteriores a la entrega" },
  { codigo: "8.5.6", titulo: "Control de los cambios" },
  { codigo: "8.6", titulo: "Liberación de los productos y servicios" },
  { codigo: "8.7", titulo: "Control de las salidas no conformes" },
  { codigo: "9.1", titulo: "Seguimiento, medición, análisis y evaluación" },
  { codigo: "9.1.1", titulo: "Generalidades" },
  { codigo: "9.1.2", titulo: "Satisfacción del cliente" },
  { codigo: "9.1.3", titulo: "Análisis y evaluación" },
  { codigo: "9.2", titulo: "Auditoría interna" },
  { codigo: "9.3", titulo: "Revisión por la dirección" },
  { codigo: "10.1", titulo: "Generalidades" },
  { codigo: "10.2", titulo: "No conformidad y acción correctiva" },
  { codigo: "10.3", titulo: "Mejora continua" },
];

async function main() {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Crear la tabla si no existe
    await db.execute(`
      CREATE TABLE IF NOT EXISTS puntos_norma (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT NOT NULL UNIQUE,
        titulo TEXT NOT NULL
      );
    `);
    console.log('Tabla "puntos_norma" creada o ya existente.');

    // Insertar los datos
    console.log('Insertando puntos de la norma...');
    let count = 0;
    for (const punto of puntosNorma) {
      try {
        await db.execute({
          sql: "INSERT INTO puntos_norma (codigo, titulo) VALUES (?, ?)",
          args: [punto.codigo, punto.titulo],
        });
        console.log(`  -> Insertado: ${punto.codigo} - ${punto.titulo}`);
        count++;
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`  -> Omitido (ya existe): ${punto.codigo}`);
        } else {
          console.error(`Error insertando ${punto.codigo}:`, error);
        }
      }
    }
    console.log(`\nProceso completado. Se insertaron ${count} nuevos puntos.`);

  } catch (error) {
    console.error("Error general en el script:", error);
  } finally {
    db.close();
    console.log("Conexión a la base de datos cerrada.");
  }
}

main();
