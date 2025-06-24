const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function fixNormasData() {
  try {
    console.log('🧹 Limpiando tabla normas...');
    
    // Limpiar la tabla normas
    await client.execute('DELETE FROM normas;');
    console.log('✅ Tabla normas limpiada.');

    console.log('📝 Insertando puntos de norma ISO 9001 con estructura correcta...');
    
    // Insertar puntos de norma ISO 9001 con la columna 'nombre' correcta
    const normasISO9001 = [
      { codigo: '4.1', nombre: 'Comprensión de la organización y de su contexto' },
      { codigo: '4.2', nombre: 'Comprensión de las necesidades y expectativas de las partes interesadas' },
      { codigo: '4.3', nombre: 'Determinación del alcance del sistema de gestión de la calidad' },
      { codigo: '4.4', nombre: 'Sistema de gestión de la calidad y sus procesos' },
      { codigo: '4.4.1', nombre: 'Generalidades del sistema de gestión' },
      { codigo: '4.4.2', nombre: 'Información documentada' },
      { codigo: '5.1', nombre: 'Liderazgo y compromiso' },
      { codigo: '5.1.1', nombre: 'Generalidades del liderazgo' },
      { codigo: '5.1.2', nombre: 'Enfoque al cliente' },
      { codigo: '5.2', nombre: 'Política' },
      { codigo: '5.2.1', nombre: 'Establecimiento de la política de la calidad' },
      { codigo: '5.2.2', nombre: 'Comunicación de la política de la calidad' },
      { codigo: '5.3', nombre: 'Roles, responsabilidades y autoridades en la organización' },
      { codigo: '6.1', nombre: 'Acciones para abordar riesgos y oportunidades' },
      { codigo: '6.1.1', nombre: 'Generalidades de riesgos y oportunidades' },
      { codigo: '6.1.2', nombre: 'Planificación de acciones' },
      { codigo: '6.2', nombre: 'Objetivos de la calidad y planificación para lograrlos' },
      { codigo: '6.2.1', nombre: 'Objetivos de la calidad' },
      { codigo: '6.2.2', nombre: 'Planificación de acciones para lograr los objetivos de la calidad' },
      { codigo: '6.3', nombre: 'Planificación de los cambios' },
      { codigo: '7.1', nombre: 'Recursos' },
      { codigo: '7.1.1', nombre: 'Generalidades de recursos' },
      { codigo: '7.1.2', nombre: 'Personas' },
      { codigo: '7.1.3', nombre: 'Infraestructura' },
      { codigo: '7.1.4', nombre: 'Ambiente para la operación de los procesos' },
      { codigo: '7.1.5', nombre: 'Recursos de seguimiento y medición' },
      { codigo: '7.1.6', nombre: 'Conocimientos de la organización' },
      { codigo: '7.2', nombre: 'Competencia' },
      { codigo: '7.3', nombre: 'Toma de conciencia' },
      { codigo: '7.4', nombre: 'Comunicación' },
      { codigo: '7.5', nombre: 'Información documentada' },
      { codigo: '7.5.1', nombre: 'Generalidades de información documentada' },
      { codigo: '7.5.2', nombre: 'Creación y actualización' },
      { codigo: '7.5.3', nombre: 'Control de la información documentada' },
      { codigo: '8.1', nombre: 'Planificación y control operacional' },
      { codigo: '8.2', nombre: 'Requisitos para los productos y servicios' },
      { codigo: '8.2.1', nombre: 'Comunicación con el cliente' },
      { codigo: '8.2.2', nombre: 'Determinación de los requisitos para los productos y servicios' },
      { codigo: '8.2.3', nombre: 'Revisión de los requisitos para los productos y servicios' },
      { codigo: '8.2.4', nombre: 'Cambios en los requisitos para los productos y servicios' },
      { codigo: '8.3', nombre: 'Diseño y desarrollo de los productos y servicios' },
      { codigo: '8.4', nombre: 'Control de los procesos, productos y servicios suministrados externamente' },
      { codigo: '8.5', nombre: 'Producción y provisión del servicio' },
      { codigo: '8.6', nombre: 'Liberación de los productos y servicios' },
      { codigo: '8.7', nombre: 'Control de las salidas no conformes' },
      { codigo: '9.1', nombre: 'Seguimiento, medición, análisis y evaluación' },
      { codigo: '9.1.1', nombre: 'Generalidades de seguimiento y medición' },
      { codigo: '9.1.2', nombre: 'Satisfacción del cliente' },
      { codigo: '9.1.3', nombre: 'Análisis y evaluación' },
      { codigo: '9.2', nombre: 'Auditoría interna' },
      { codigo: '9.3', nombre: 'Revisión por la dirección' },
      { codigo: '10.1', nombre: 'Generalidades de mejora' },
      { codigo: '10.2', nombre: 'No conformidad y acción correctiva' },
      { codigo: '10.3', nombre: 'Mejora continua' }
    ];

    for (const norma of normasISO9001) {
      const id = crypto.randomUUID();
      await client.execute({
        sql: `INSERT INTO normas (id, codigo, nombre, estado) VALUES (?, ?, ?, ?)`,
        args: [id, norma.codigo, norma.nombre, 'Activo']
      });
    }

    console.log(`✅ Se insertaron ${normasISO9001.length} puntos de norma ISO 9001 correctamente.`);
    console.log('🎉 Datos de normas corregidos exitosamente.');
    
  } catch (error) {
    console.error('❌ Error al corregir datos de normas:', error);
  } finally {
    client.close();
    console.log('🔌 Conexión con la base de datos cerrada.');
  }
}

// Ejecutar el script
fixNormasData();
