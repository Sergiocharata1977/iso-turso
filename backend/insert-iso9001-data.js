// Script para insertar puntos de norma ISO 9001:2015
import { tursoClient } from './lib/tursoClient.js';
import crypto from 'crypto';

async function insertISO9001Data() {
  try {
    console.log('📋 Insertando puntos de norma ISO 9001:2015...');
    
    // Puntos de norma ISO 9001:2015 (solo dos dígitos o más)
    const puntosNorma = [
      // 4. Contexto de la organización
      { codigo: '4.1', titulo: 'Comprensión de la organización y su contexto', descripcion: 'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y que afectan su capacidad para lograr los resultados previstos de su sistema de gestión de la calidad.' },
      { codigo: '4.2', titulo: 'Comprensión de las necesidades y expectativas de las partes interesadas', descripcion: 'La organización debe determinar las partes interesadas que son pertinentes al sistema de gestión de la calidad y los requisitos de estas partes interesadas.' },
      { codigo: '4.3', titulo: 'Determinación del alcance del sistema de gestión de la calidad', descripcion: 'La organización debe determinar los límites y la aplicabilidad del sistema de gestión de la calidad para establecer su alcance.' },
      { codigo: '4.4', titulo: 'Sistema de gestión de la calidad y sus procesos', descripcion: 'La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de la calidad, incluidos los procesos necesarios y sus interacciones.' },
      
      // 5. Liderazgo
      { codigo: '5.1', titulo: 'Liderazgo y compromiso', descripcion: 'La alta dirección debe demostrar liderazgo y compromiso con respecto al sistema de gestión de la calidad.' },
      { codigo: '5.1.1', titulo: 'Generalidades', descripcion: 'La alta dirección debe demostrar liderazgo y compromiso con respecto al sistema de gestión de la calidad asumiendo la responsabilidad y obligación de rendir cuentas.' },
      { codigo: '5.1.2', titulo: 'Enfoque al cliente', descripcion: 'La alta dirección debe demostrar liderazgo y compromiso con respecto al enfoque al cliente asegurándose de que se determinen, se comprendan y se cumplan regularmente los requisitos del cliente.' },
      { codigo: '5.2', titulo: 'Política', descripcion: 'La alta dirección debe establecer, implementar y mantener una política de la calidad.' },
      { codigo: '5.2.1', titulo: 'Establecimiento de la política de calidad', descripcion: 'La alta dirección debe establecer una política de la calidad que sea apropiada al propósito y contexto de la organización y apoye su dirección estratégica.' },
      { codigo: '5.2.2', titulo: 'Comunicación de la política de calidad', descripcion: 'La política de la calidad debe estar disponible y mantenerse como información documentada, comunicarse, entenderse y aplicarse dentro de la organización.' },
      { codigo: '5.3', titulo: 'Roles, responsabilidades y autoridades en la organización', descripcion: 'La alta dirección debe asegurarse de que las responsabilidades y autoridades para los roles pertinentes se asignen, se comuniquen y se entiendan en toda la organización.' },
      
      // 6. Planificación
      { codigo: '6.1', titulo: 'Acciones para abordar riesgos y oportunidades', descripcion: 'Al planificar el sistema de gestión de la calidad, la organización debe considerar las cuestiones referidas en el apartado 4.1 y los requisitos referidos en el apartado 4.2, y determinar los riesgos y oportunidades.' },
      { codigo: '6.2', titulo: 'Objetivos de la calidad y planificación para lograrlos', descripcion: 'La organización debe establecer objetivos de la calidad para las funciones y niveles pertinentes y los procesos necesarios para el sistema de gestión de la calidad.' },
      { codigo: '6.3', titulo: 'Planificación de los cambios', descripcion: 'Cuando la organización determine la necesidad de cambios en el sistema de gestión de la calidad, estos cambios se deben llevar a cabo de manera planificada.' },
      
      // 7. Apoyo
      { codigo: '7.1', titulo: 'Recursos', descripcion: 'La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del sistema de gestión de la calidad.' },
      { codigo: '7.1.1', titulo: 'Generalidades', descripcion: 'La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del sistema de gestión de la calidad.' },
      { codigo: '7.1.2', titulo: 'Personas', descripcion: 'La organización debe determinar y proporcionar las personas necesarias para la implementación eficaz de su sistema de gestión de la calidad y para la operación y control de sus procesos.' },
      { codigo: '7.1.3', titulo: 'Infraestructura', descripcion: 'La organización debe determinar, proporcionar y mantener la infraestructura necesaria para la operación de sus procesos y lograr la conformidad de los productos y servicios.' },
      { codigo: '7.1.4', titulo: 'Ambiente para la operación de los procesos', descripcion: 'La organización debe determinar, proporcionar y mantener el ambiente necesario para la operación de sus procesos y para lograr la conformidad de los productos y servicios.' },
      { codigo: '7.1.5', titulo: 'Recursos de seguimiento y medición', descripcion: 'La organización debe determinar y proporcionar los recursos necesarios para asegurar resultados válidos y fiables cuando se realice el seguimiento o la medición.' },
      { codigo: '7.1.5.1', titulo: 'Generalidades', descripcion: 'La organización debe determinar y proporcionar los recursos necesarios para asegurar resultados válidos y fiables cuando se realice el seguimiento o la medición para verificar la conformidad de los productos y servicios.' },
      { codigo: '7.1.5.2', titulo: 'Trazabilidad de las mediciones', descripcion: 'Cuando la trazabilidad de las mediciones es un requisito, o es considerada por la organización como parte esencial para proporcionar confianza en la validez de los resultados de la medición.' },
      { codigo: '7.1.6', titulo: 'Conocimientos organizacionales', descripcion: 'La organización debe determinar los conocimientos necesarios para la operación de sus procesos y para lograr la conformidad de los productos y servicios.' },
      { codigo: '7.2', titulo: 'Competencia', descripcion: 'La organización debe determinar la competencia necesaria de las personas que realizan, bajo su control, un trabajo que afecta al desempeño y eficacia del sistema de gestión de la calidad.' },
      { codigo: '7.3', titulo: 'Toma de conciencia', descripcion: 'La organización debe asegurarse de que las personas que realizan el trabajo bajo el control de la organización tomen conciencia de la política de la calidad, los objetivos de la calidad pertinentes.' },
      { codigo: '7.4', titulo: 'Comunicación', descripcion: 'La organización debe determinar las comunicaciones internas y externas pertinentes al sistema de gestión de la calidad.' },
      { codigo: '7.5', titulo: 'Información documentada', descripcion: 'El sistema de gestión de la calidad de la organización debe incluir la información documentada requerida por esta Norma Internacional y la información documentada que la organización determina.' },
      { codigo: '7.5.1', titulo: 'Generalidades', descripcion: 'El sistema de gestión de la calidad de la organización debe incluir la información documentada requerida por esta Norma Internacional y la información documentada que la organización determina.' },
      { codigo: '7.5.2', titulo: 'Creación y actualización', descripcion: 'Al crear y actualizar la información documentada, la organización debe asegurarse de que sea apropiada la identificación y descripción.' },
      { codigo: '7.5.3', titulo: 'Control de la información documentada', descripcion: 'La información documentada requerida por el sistema de gestión de la calidad y por esta Norma Internacional se debe controlar para asegurarse de que esté disponible y sea idónea para su uso.' },
      
      // 8. Operación
      { codigo: '8.1', titulo: 'Planificación y control operacional', descripcion: 'La organización debe planificar, implementar y controlar los procesos necesarios para cumplir los requisitos para la provisión de productos y servicios.' },
      { codigo: '8.2', titulo: 'Requisitos para los productos y servicios', descripcion: 'La organización debe asegurarse de que se determinen, revisen y cumplan los requisitos para los productos y servicios que se van a ofrecer a los clientes.' },
      { codigo: '8.2.1', titulo: 'Comunicación con el cliente', descripcion: 'La comunicación con los clientes debe incluir información relativa a los productos y servicios, las consultas, los contratos o atención de pedidos, incluyendo los cambios.' },
      { codigo: '8.2.2', titulo: 'Determinación de los requisitos relacionados con los productos y servicios', descripcion: 'Cuando se determinan los requisitos para los productos y servicios que se van a ofrecer a los clientes, la organización debe asegurarse de que se definan los requisitos.' },
      { codigo: '8.2.3', titulo: 'Revisión de los requisitos relacionados con los productos y servicios', descripcion: 'La organización debe asegurarse de que tiene la capacidad de cumplir los requisitos de los productos y servicios que se van a ofrecer a los clientes.' },
      { codigo: '8.2.4', titulo: 'Cambios en los requisitos para los productos y servicios', descripcion: 'La organización debe asegurarse de que, cuando se cambien los requisitos para los productos y servicios, la información documentada pertinente se modifique.' },
      { codigo: '8.3', titulo: 'Diseño y desarrollo de los productos y servicios', descripcion: 'La organización debe establecer, implementar y mantener un proceso de diseño y desarrollo que sea adecuado para asegurar la posterior provisión de productos y servicios.' },
      { codigo: '8.3.1', titulo: 'Generalidades', descripcion: 'La organización debe establecer, implementar y mantener un proceso de diseño y desarrollo que sea adecuado para asegurar la posterior provisión de productos y servicios.' },
      { codigo: '8.3.2', titulo: 'Planificación del diseño y desarrollo', descripcion: 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar la naturaleza, duración y complejidad de las actividades de diseño y desarrollo.' },
      { codigo: '8.3.3', titulo: 'Entradas para el diseño y desarrollo', descripcion: 'La organización debe determinar los requisitos esenciales para los tipos específicos de productos y servicios a diseñar y desarrollar.' },
      { codigo: '8.3.4', titulo: 'Controles del diseño y desarrollo', descripcion: 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que se definen los resultados a lograr.' },
      { codigo: '8.3.5', titulo: 'Salidas del diseño y desarrollo', descripcion: 'La organización debe asegurarse de que las salidas del diseño y desarrollo cumplen los requisitos de las entradas, son adecuadas para los procesos posteriores.' },
      { codigo: '8.3.6', titulo: 'Cambios en el diseño y desarrollo', descripcion: 'La organización debe identificar, revisar y controlar los cambios hechos durante el diseño y desarrollo de los productos y servicios, o posteriormente.' },
      { codigo: '8.4', titulo: 'Control de los procesos, productos y servicios suministrados externamente', descripcion: 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente son conformes a los requisitos.' },
      { codigo: '8.4.1', titulo: 'Generalidades', descripcion: 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente son conformes a los requisitos.' },
      { codigo: '8.4.2', titulo: 'Tipo y grado de control', descripcion: 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente no afecten de manera adversa a la capacidad de la organización.' },
      { codigo: '8.4.3', titulo: 'Información para los proveedores externos', descripcion: 'La organización debe asegurarse de la adecuación de los requisitos antes de su comunicación al proveedor externo.' },
      { codigo: '8.5', titulo: 'Producción y provisión del servicio', descripcion: 'La organización debe implementar la producción y provisión del servicio bajo condiciones controladas.' },
      { codigo: '8.5.1', titulo: 'Control de la producción y provisión del servicio', descripcion: 'La organización debe implementar la producción y provisión del servicio bajo condiciones controladas.' },
      { codigo: '8.5.2', titulo: 'Identificación y trazabilidad', descripcion: 'La organización debe utilizar medios apropiados para identificar las salidas cuando sea necesario asegurar la conformidad de los productos y servicios.' },
      { codigo: '8.5.3', titulo: 'Propiedad perteneciente a los clientes o proveedores externos', descripcion: 'La organización debe cuidar la propiedad perteneciente a los clientes o a proveedores externos mientras esté bajo el control de la organización o esté siendo utilizada por la misma.' },
      { codigo: '8.5.4', titulo: 'Preservación', descripcion: 'La organización debe preservar las salidas durante la producción y provisión del servicio, en la medida necesaria para asegurar la conformidad con los requisitos.' },
      { codigo: '8.5.5', titulo: 'Actividades posteriores a la entrega', descripcion: 'Cuando sea pertinente, la organización debe cumplir los requisitos para las actividades posteriores a la entrega asociadas con los productos y servicios.' },
      { codigo: '8.5.6', titulo: 'Control de los cambios', descripcion: 'La organización debe revisar y controlar los cambios para la producción o la provisión del servicio, en la medida necesaria para asegurar la continuidad en la conformidad con los requisitos.' },
      { codigo: '8.6', titulo: 'Liberación de los productos y servicios', descripcion: 'La organización debe implementar las disposiciones planificadas, en las etapas adecuadas, para verificar que se cumplen los requisitos de los productos y servicios.' },
      { codigo: '8.7', titulo: 'Control de las salidas no conformes', descripcion: 'La organización debe asegurarse de que las salidas que no sean conformes con sus requisitos se identifiquen y se controlen para prevenir su uso o entrega no intencionados.' },
      
      // 9. Evaluación del desempeño
      { codigo: '9.1', titulo: 'Seguimiento, medición, análisis y evaluación', descripcion: 'La organización debe determinar qué necesita seguimiento y medición, los métodos de seguimiento, medición, análisis y evaluación.' },
      { codigo: '9.1.1', titulo: 'Generalidades', descripcion: 'La organización debe determinar qué necesita seguimiento y medición, los métodos de seguimiento, medición, análisis y evaluación necesarios.' },
      { codigo: '9.1.2', titulo: 'Satisfacción del cliente', descripcion: 'La organización debe realizar el seguimiento de las percepciones de los clientes del grado en que se cumplen sus necesidades y expectativas.' },
      { codigo: '9.1.3', titulo: 'Análisis y evaluación', descripcion: 'La organización debe analizar y evaluar los datos y la información apropiados que surgen por el seguimiento y la medición.' },
      { codigo: '9.2', titulo: 'Auditoría interna', descripcion: 'La organización debe llevar a cabo auditorías internas a intervalos planificados para proporcionar información acerca de si el sistema de gestión de la calidad es conforme.' },
      { codigo: '9.3', titulo: 'Revisión por la dirección', descripcion: 'La alta dirección debe revisar el sistema de gestión de la calidad de la organización a intervalos planificados, para asegurarse de su conveniencia, adecuación, eficacia y alineación continuas.' },
      
      // 10. Mejora
      { codigo: '10.1', titulo: 'Generalidades', descripcion: 'La organización debe determinar y seleccionar las oportunidades de mejora e implementar cualquier acción necesaria para cumplir los requisitos del cliente y aumentar la satisfacción del cliente.' },
      { codigo: '10.2', titulo: 'No conformidad y acción correctiva', descripcion: 'Cuando ocurra una no conformidad, incluida cualquiera originada por quejas, la organización debe reaccionar ante la no conformidad.' },
      { codigo: '10.3', titulo: 'Mejora continua', descripcion: 'La organización debe mejorar continuamente la conveniencia, adecuación y eficacia del sistema de gestión de la calidad.' }
    ];

    console.log(`📊 Total de puntos a insertar: ${puntosNorma.length}`);
    
    // Limpiar registros existentes
    console.log('🧹 Limpiando registros existentes...');
    await tursoClient.execute('DELETE FROM normas');
    
    // Insertar todos los puntos
    let insertados = 0;
    for (const punto of puntosNorma) {
      const id = crypto.randomUUID();
      
      await tursoClient.execute({
        sql: `INSERT INTO normas (id, codigo, titulo, descripcion, observaciones) 
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          id, 
          punto.codigo, 
          punto.titulo, 
          punto.descripcion,
          `Punto de control para el requisito ${punto.codigo} de la norma ISO 9001:2015`
        ]
      });
      
      insertados++;
      if (insertados % 10 === 0) {
        console.log(`✅ Insertados ${insertados}/${puntosNorma.length} puntos...`);
      }
    }
    
    console.log(`🎉 ¡Completado! Se insertaron ${insertados} puntos de norma ISO 9001:2015`);
    
    // Verificar los resultados
    const result = await tursoClient.execute('SELECT COUNT(*) as total FROM normas');
    console.log(`📈 Total de registros en la tabla: ${result.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error al insertar datos de ISO 9001:2015:', error);
    throw error;
  } finally {
    console.log('🔌 Cerrando conexión...');
    tursoClient.close();
  }
}

// Ejecutar el script
insertISO9001Data();
