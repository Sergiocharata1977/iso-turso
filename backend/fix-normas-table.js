import { tursoClient } from './lib/tursoClient.js';

const puntosISO9001 = [
  {
    codigo: "4.1",
    titulo: "Comprensión de la organización y de su contexto",
    descripcion: "La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su sistema de gestión de la calidad.",
    observaciones: "Contexto de la organización"
  },
  {
    codigo: "4.2",
    titulo: "Comprensión de las necesidades y expectativas de las partes interesadas",
    descripcion: "La organización debe determinar las partes interesadas relevantes para el sistema de gestión de la calidad y los requisitos pertinentes de estas partes interesadas.",
    observaciones: "Contexto de la organización"
  },
  {
    codigo: "4.3",
    titulo: "Determinación del alcance del sistema de gestión de la calidad",
    descripcion: "La organización debe determinar los límites y la aplicabilidad del sistema de gestión de la calidad para establecer su alcance.",
    observaciones: "Contexto de la organización"
  },
  {
    codigo: "4.4",
    titulo: "Sistema de gestión de la calidad y sus procesos",
    descripcion: "La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de la calidad, incluidos los procesos necesarios y sus interacciones.",
    observaciones: "Contexto de la organización"
  },
  {
    codigo: "5.1.1",
    titulo: "Liderazgo y compromiso - Generalidades",
    descripcion: "La alta dirección debe demostrar liderazgo y compromiso con respecto al sistema de gestión de la calidad.",
    observaciones: "Liderazgo"
  },
  {
    codigo: "5.1.2",
    titulo: "Liderazgo y compromiso - Enfoque al cliente",
    descripcion: "La alta dirección debe demostrar liderazgo y compromiso con respecto al enfoque al cliente.",
    observaciones: "Liderazgo"
  },
  {
    codigo: "5.2.1",
    titulo: "Establecimiento de la política de la calidad",
    descripcion: "La alta dirección debe establecer, implementar y mantener una política de la calidad.",
    observaciones: "Liderazgo - Política"
  },
  {
    codigo: "5.2.2",
    titulo: "Comunicación de la política de la calidad",
    descripcion: "La política de la calidad debe estar disponible y mantenerse como información documentada, comunicarse, entenderse y aplicarse dentro de la organización.",
    observaciones: "Liderazgo - Política"
  },
  {
    codigo: "5.3",
    titulo: "Roles, responsabilidades y autoridades en la organización",
    descripcion: "La alta dirección debe asegurarse de que las responsabilidades y autoridades para los roles pertinentes se asignen, comuniquen y entiendan dentro de la organización.",
    observaciones: "Liderazgo"
  },
  {
    codigo: "6.1",
    titulo: "Acciones para abordar riesgos y oportunidades",
    descripcion: "La organización debe planificar acciones para abordar riesgos y oportunidades.",
    observaciones: "Planificación"
  },
  {
    codigo: "6.2",
    titulo: "Objetivos de la calidad y planificación para lograrlos",
    descripcion: "La organización debe establecer objetivos de la calidad para las funciones, los niveles y los procesos pertinentes del sistema de gestión de la calidad.",
    observaciones: "Planificación"
  },
  {
    codigo: "6.3",
    titulo: "Planificación de los cambios",
    descripcion: "Cuando la organización determine la necesidad de cambios en el sistema de gestión de la calidad, estos cambios se deben llevar a cabo de manera planificada.",
    observaciones: "Planificación"
  },
  {
    codigo: "7.1.1",
    titulo: "Recursos - Generalidades",
    descripcion: "La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del sistema de gestión de la calidad.",
    observaciones: "Apoyo"
  },
  {
    codigo: "7.1.2",
    titulo: "Recursos - Personas",
    descripcion: "La organización debe determinar y proporcionar las personas necesarias para la implementación eficaz de su sistema de gestión de la calidad.",
    observaciones: "Apoyo"
  },
  {
    codigo: "7.1.3",
    titulo: "Recursos - Infraestructura",
    descripcion: "La organización debe determinar, proporcionar y mantener la infraestructura necesaria para la operación de sus procesos.",
    observaciones: "Apoyo"
  },
  {
    codigo: "7.1.4",
    titulo: "Recursos - Ambiente para la operación de los procesos",
    descripcion: "La organización debe determinar, proporcionar y mantener el ambiente necesario para la operación de sus procesos.",
    observaciones: "Apoyo"
  },
  {
    codigo: "7.1.5",
    titulo: "Recursos - Recursos de seguimiento y medición",
    descripcion: "La organización debe determinar y proporcionar los recursos necesarios para asegurar la validez y fiabilidad de los resultados cuando se realice el seguimiento o la medición.",
    observaciones: "Apoyo"
  },
  {
    codigo: "7.1.6",
    titulo: "Recursos - Conocimientos de la organización",
    descripcion: "La organización debe determinar los conocimientos necesarios para la operación de sus procesos y para lograr la conformidad de los productos y servicios.",
    observaciones: "Apoyo"
  },
  {
    codigo: "7.2",
    titulo: "Competencia",
    descripcion: "La organización debe determinar la competencia necesaria de las personas que realizan un trabajo que afecta al desempeño y eficacia del sistema de gestión de la calidad.",
    observaciones: "Apoyo"
  },
  {
    codigo: "7.3",
    titulo: "Toma de conciencia",
    descripcion: "La organización debe asegurarse de que las personas que realizan el trabajo bajo el control de la organización tomen conciencia de la política de la calidad, los objetivos de la calidad, su contribución a la eficacia del sistema de gestión de la calidad y las implicaciones de no cumplir los requisitos del sistema de gestión de la calidad.",
    observaciones: "Apoyo"
  },
  {
    codigo: "7.4",
    titulo: "Comunicación",
    descripcion: "La organización debe determinar las comunicaciones internas y externas pertinentes al sistema de gestión de la calidad.",
    observaciones: "Apoyo"
  },
  {
    codigo: "7.5.1",
    titulo: "Información documentada - Generalidades",
    descripcion: "El sistema de gestión de la calidad de la organización debe incluir la información documentada requerida por esta Norma Internacional y la información documentada que la organización determine como necesaria para la eficacia del sistema de gestión de la calidad.",
    observaciones: "Apoyo"
  },
  {
    codigo: "7.5.2",
    titulo: "Información documentada - Creación y actualización",
    descripcion: "Al crear y actualizar la información documentada, la organización debe asegurarse de la identificación y descripción, el formato y los medios, y la revisión y aprobación con respecto a la idoneidad y adecuación.",
    observaciones: "Apoyo"
  },
  {
    codigo: "7.5.3",
    titulo: "Información documentada - Control",
    descripcion: "La información documentada requerida por el sistema de gestión de la calidad y por esta Norma Internacional se debe controlar para asegurarse de que esté disponible y sea idónea para su uso, dónde y cuándo se necesite, y que esté protegida adecuadamente.",
    observaciones: "Apoyo"
  },
  {
    codigo: "8.1",
    titulo: "Planificación y control operacional",
    descripcion: "La organización debe planificar, implementar y controlar los procesos necesarios para cumplir los requisitos para la provisión de productos y servicios y para implementar las acciones determinadas en el capítulo 6.",
    observaciones: "Operación"
  },
  {
    codigo: "8.2.1",
    titulo: "Requisitos para los productos y servicios - Comunicación con el cliente",
    descripcion: "La comunicación con los clientes debe incluir la provisión de información relativa a productos y servicios, el tratamiento de consultas, contratos o pedidos, incluyendo los cambios, la obtención de la retroalimentación del cliente, incluyendo sus quejas, el manejo o control de la propiedad del cliente, y el establecimiento de los requisitos específicos para las acciones de contingencia, cuando sea pertinente.",
    observaciones: "Operación"
  },
  {
    codigo: "8.2.2",
    titulo: "Requisitos para los productos y servicios - Determinación de los requisitos",
    descripcion: "La organización debe establecer los requisitos para los productos y servicios que se van a ofrecer a los clientes.",
    observaciones: "Operación"
  },
  {
    codigo: "8.2.3",
    titulo: "Requisitos para los productos y servicios - Revisión de los requisitos",
    descripcion: "La organización debe asegurarse de que tiene la capacidad de cumplir los requisitos para los productos y servicios que se van a ofrecer a los clientes.",
    observaciones: "Operación"
  },
  {
    codigo: "8.2.4",
    titulo: "Requisitos para los productos y servicios - Cambios en los requisitos",
    descripcion: "La organización debe asegurarse de que, cuando se cambien los requisitos para los productos y servicios, la información documentada pertinente sea modificada y de que el personal pertinente sea consciente de los requisitos modificados.",
    observaciones: "Operación"
  },
  {
    codigo: "8.3.1",
    titulo: "Diseño y desarrollo - Generalidades",
    descripcion: "La organización debe establecer, implementar y mantener un proceso de diseño y desarrollo que sea adecuado para asegurar la posterior provisión de productos y servicios.",
    observaciones: "Operación"
  },
  {
    codigo: "8.3.2",
    titulo: "Diseño y desarrollo - Planificación",
    descripcion: "La organización debe determinar las etapas y controles para el diseño y desarrollo.",
    observaciones: "Operación"
  },
  {
    codigo: "8.3.3",
    titulo: "Diseño y desarrollo - Entradas",
    descripcion: "La organización debe determinar los requisitos esenciales para los tipos específicos de productos y servicios que se están diseñando y desarrollando.",
    observaciones: "Operación"
  },
  {
    codigo: "8.3.4",
    titulo: "Diseño y desarrollo - Controles",
    descripcion: "La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que los resultados previstos se logren.",
    observaciones: "Operación"
  },
  {
    codigo: "8.3.5",
    titulo: "Diseño y desarrollo - Salidas",
    descripcion: "La organización debe asegurarse de que las salidas del diseño y desarrollo cumplen los requisitos de las entradas.",
    observaciones: "Operación"
  },
  {
    codigo: "8.3.6",
    titulo: "Diseño y desarrollo - Cambios",
    descripcion: "La organización debe identificar, revisar y controlar los cambios hechos durante el diseño y desarrollo de los productos y servicios.",
    observaciones: "Operación"
  },
  {
    codigo: "8.4.1",
    titulo: "Control de procesos, productos y servicios suministrados externamente - Generalidades",
    descripcion: "La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente son conformes a los requisitos.",
    observaciones: "Operación"
  },
  {
    codigo: "8.4.2",
    titulo: "Control de procesos, productos y servicios suministrados externamente - Tipo y alcance del control",
    descripcion: "La organización debe determinar los controles a aplicar a los procesos, productos y servicios suministrados externamente cuando: a) los productos y servicios de proveedores externos están destinados a incorporarse dentro de los propios productos y servicios de la organización; b) los productos y servicios son proporcionados directamente a los clientes por proveedores externos en nombre de la organización; c) un proceso, o una parte de un proceso, es proporcionado por un proveedor externo como resultado de una decisión de la organización.",
    observaciones: "Operación"
  },
  {
    codigo: "8.4.3",
    titulo: "Control de procesos, productos y servicios suministrados externamente - Información para los proveedores externos",
    descripcion: "La organización debe asegurarse de la adecuación de los requisitos antes de su comunicación al proveedor externo.",
    observaciones: "Operación"
  },
  {
    codigo: "8.5.1",
    titulo: "Producción y provisión del servicio - Control",
    descripcion: "La organización debe implementar la producción y provisión del servicio bajo condiciones controladas.",
    observaciones: "Operación"
  },
  {
    codigo: "8.5.2",
    titulo: "Producción y provisión del servicio - Identificación y trazabilidad",
    descripcion: "La organización debe utilizar los medios apropiados para identificar las salidas cuando sea necesario para asegurar la conformidad de los productos y servicios.",
    observaciones: "Operación"
  },
  {
    codigo: "8.5.3",
    titulo: "Producción y provisión del servicio - Propiedad perteneciente a los clientes o proveedores externos",
    descripcion: "La organización debe cuidar la propiedad perteneciente a los clientes o a los proveedores externos mientras esté bajo el control de la organización o esté siendo utilizada por la misma.",
    observaciones: "Operación"
  },
  {
    codigo: "8.5.4",
    titulo: "Producción y provisión del servicio - Preservación",
    descripcion: "La organización debe preservar las salidas durante la producción y provisión del servicio, en la medida necesaria para asegurar la conformidad con los requisitos.",
    observaciones: "Operación"
  },
  {
    codigo: "8.5.5",
    titulo: "Producción y provisión del servicio - Actividades posteriores a la entrega",
    descripcion: "La organización debe cumplir los requisitos para las actividades posteriores a la entrega asociadas con los productos y servicios.",
    observaciones: "Operación"
  },
  {
    codigo: "8.5.6",
    titulo: "Producción y provisión del servicio - Control de los cambios",
    descripcion: "La organización debe revisar y controlar los cambios para la producción o la provisión del servicio, en la medida necesaria para asegurar la conformidad continua con los requisitos.",
    observaciones: "Operación"
  },
  {
    codigo: "8.6",
    titulo: "Liberación de los productos y servicios",
    descripcion: "La organización debe asegurarse de que se han cumplido los requisitos para los productos y servicios en las etapas apropiadas.",
    observaciones: "Operación"
  },
  {
    codigo: "8.7",
    titulo: "Control de las salidas no conformes",
    descripcion: "La organización debe asegurarse de que las salidas que no sean conformes con sus requisitos se identifican y controlan para prevenir su uso o entrega no intencionada.",
    observaciones: "Operación"
  },
  {
    codigo: "9.1.1",
    titulo: "Seguimiento, medición, análisis y evaluación - Generalidades",
    descripcion: "La organización debe determinar qué necesita seguimiento y medición, los métodos de seguimiento, medición, análisis y evaluación necesarios para asegurar resultados válidos, cuándo se deben llevar a cabo el seguimiento y la medición, y cuándo se deben analizar y evaluar los resultados.",
    observaciones: "Evaluación del desempeño"
  },
  {
    codigo: "9.1.2",
    titulo: "Seguimiento, medición, análisis y evaluación - Satisfacción del cliente",
    descripcion: "La organización debe realizar el seguimiento de las percepciones de los clientes del grado en que se cumplen sus necesidades y expectativas.",
    observaciones: "Evaluación del desempeño"
  },
  {
    codigo: "9.1.3",
    titulo: "Seguimiento, medición, análisis y evaluación - Análisis y evaluación",
    descripcion: "La organización debe analizar y evaluar los datos y la información apropiados que surgen del seguimiento y la medición.",
    observaciones: "Evaluación del desempeño"
  },
  {
    codigo: "9.2",
    titulo: "Auditoría interna",
    descripcion: "La organización debe llevar a cabo auditorías internas a intervalos planificados para proporcionar información sobre si el sistema de gestión de la calidad es conforme con los requisitos propios de la organización para su sistema de gestión de la calidad, con los requisitos de esta Norma Internacional, y si se implementa y mantiene eficazmente.",
    observaciones: "Evaluación del desempeño"
  },
  {
    codigo: "9.3",
    titulo: "Revisión por la dirección",
    descripcion: "La alta dirección debe revisar el sistema de gestión de la calidad de la organización a intervalos planificados.",
    observaciones: "Evaluación del desempeño"
  },
  {
    codigo: "10.1",
    titulo: "Mejora - Generalidades",
    descripcion: "La organización debe determinar y seleccionar las oportunidades de mejora e implementar cualquier acción necesaria para cumplir los requisitos del cliente y aumentar la satisfacción del cliente.",
    observaciones: "Mejora"
  },
  {
    codigo: "10.2",
    titulo: "No conformidad y acción correctiva",
    descripcion: "Cuando ocurra una no conformidad, incluida cualquiera originada por quejas, la organización debe reaccionar ante la no conformidad, tomar acciones para controlarla y corregirla, y hacer frente a las consecuencias.",
    observaciones: "Mejora"
  },
  {
    codigo: "10.3",
    titulo: "Mejora continua",
    descripcion: "La organización debe mejorar continuamente la idoneidad, adecuación y eficacia del sistema de gestión de la calidad.",
    observaciones: "Mejora"
  }
];

async function fixNormasTable() {
  try {
    console.log('🔧 Iniciando corrección de la tabla normas...');

    // 1. Verificar estructura actual
    console.log('📋 Verificando estructura actual...');
    const tableInfo = await tursoClient.execute({
      sql: 'PRAGMA table_info(normas)',
      args: []
    });
    
    console.log('📊 Columnas actuales:', tableInfo.rows.map(row => row.name));

    // 2. Agregar columna organization_id si no existe
    const hasOrgId = tableInfo.rows.some(row => row.name === 'organization_id');
    
    if (!hasOrgId) {
      console.log('➕ Agregando columna organization_id...');
      await tursoClient.execute({
        sql: 'ALTER TABLE normas ADD COLUMN organization_id INTEGER DEFAULT 21',
        args: []
      });
      console.log('✅ Columna organization_id agregada');
    } else {
      console.log('✅ La columna organization_id ya existe');
    }

    // 3. Limpiar datos existentes (opcional)
    console.log('🧹 Limpiando datos existentes...');
    await tursoClient.execute({
      sql: 'DELETE FROM normas WHERE organization_id = 21',
      args: []
    });

    // 4. Insertar puntos de ISO 9001:2015
    console.log('📝 Insertando puntos de ISO 9001:2015...');
    
    for (const punto of puntosISO9001) {
      await tursoClient.execute({
        sql: `INSERT INTO normas (codigo, titulo, descripcion, observaciones, organization_id, version, tipo, estado, created_at) 
              VALUES (?, ?, ?, ?, 21, '2015', 'ISO 9001', 'activo', datetime('now'))`,
        args: [punto.codigo, punto.titulo, punto.descripcion, punto.observaciones]
      });
    }

    console.log(`✅ ${puntosISO9001.length} puntos de norma insertados correctamente`);

    // 5. Verificar inserción
    const result = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as total FROM normas WHERE organization_id = 21',
      args: []
    });

    console.log(`🎯 Total de normas en la organización 21: ${result.rows[0].total}`);

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('❌ Stack:', error.stack);
  } finally {
    await tursoClient.close();
  }
}

fixNormasTable(); 