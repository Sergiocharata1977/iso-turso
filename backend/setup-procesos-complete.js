import { tursoClient } from './lib/tursoClient.js';
import crypto from 'crypto';

async function setupProcesosComplete() {
  try {
    console.log('🔄 Configurando sistema completo de procesos...');
    
    // 1. Recrear tabla procesos con estructura completa
    console.log('📊 Recreando tabla procesos...');
    await tursoClient.execute('DROP TABLE IF EXISTS procesos');
    
    await tursoClient.execute(`
      CREATE TABLE procesos (
        id TEXT PRIMARY KEY,
        codigo TEXT NOT NULL UNIQUE,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        tipo TEXT DEFAULT 'proceso',
        responsable TEXT,
        entradas TEXT,
        salidas TEXT,
        indicadores TEXT,
        documentos_relacionados TEXT,
        estado TEXT DEFAULT 'activo',
        version TEXT DEFAULT '1.0',
        objetivo TEXT,
        alcance TEXT,
        descripcion_detallada TEXT,
        fecha_creacion TEXT NOT NULL,
        fecha_actualizacion TEXT
      )
    `);
    
    console.log('✅ Tabla procesos creada exitosamente');
    
    // 2. Insertar los procesos especificados
    const procesos = [
      {
        codigo: 'SAT-01',
        nombre: 'Satisfacción del Cliente',
        objetivo: 'Medir, evaluar y mejorar la satisfacción de los clientes respecto a los productos y servicios brindados por la organización.',
        alcance: 'Aplica a todos los puntos de contacto con el cliente, desde la preventa hasta el servicio postventa.',
        descripcion_detallada: 'El proceso contempla encuestas de satisfacción, análisis de quejas y sugerencias, reuniones de feedback, y acciones correctivas derivadas de los resultados. Se vincula con los indicadores de calidad y es revisado trimestralmente.',
        tipo: 'estratégico',
        responsable: 'Gerencia de Calidad',
        entradas: 'Encuestas, quejas, sugerencias, feedback',
        salidas: 'Informes de satisfacción, planes de mejora, acciones correctivas',
        indicadores: 'Índice de satisfacción del cliente, tiempo de respuesta a quejas',
        documentos_relacionados: 'Procedimiento de atención al cliente, formularios de encuestas'
      },
      {
        codigo: 'AUD-01',
        nombre: 'Auditorías Internas',
        objetivo: 'Evaluar la conformidad del sistema de gestión con los requisitos de la norma ISO 9001:2015 y detectar oportunidades de mejora.',
        alcance: 'Involucra todos los departamentos y procesos documentados en el sistema de gestión de la calidad.',
        descripcion_detallada: 'Las auditorías se planifican anualmente y se ejecutan conforme a un programa aprobado por la dirección. Se asignan auditores independientes, se documentan hallazgos y se realiza seguimiento a las acciones correctivas.',
        tipo: 'apoyo',
        responsable: 'Auditor Interno Líder',
        entradas: 'Programa de auditoría, procedimientos, registros',
        salidas: 'Informes de auditoría, no conformidades, oportunidades de mejora',
        indicadores: 'Porcentaje de cumplimiento, tiempo de cierre de no conformidades',
        documentos_relacionados: 'Procedimiento de auditorías internas, listas de verificación'
      },
      {
        codigo: 'RH-01',
        nombre: 'Gestión de Recursos Humanos',
        objetivo: 'Gestionar eficazmente la incorporación, desarrollo y retención del personal necesario para el cumplimiento de los objetivos organizacionales.',
        alcance: 'Aplica desde el reclutamiento hasta la desvinculación, incluyendo formación, evaluación y clima laboral.',
        descripcion_detallada: 'Se definen perfiles de puesto, se administran procesos de selección, inducción, capacitaciones y evaluaciones de desempeño. Se gestiona el legajo digital del personal y la documentación legal correspondiente.',
        tipo: 'apoyo',
        responsable: 'Jefe de Recursos Humanos',
        entradas: 'Solicitudes de personal, CV, evaluaciones, capacitaciones',
        salidas: 'Personal capacitado, evaluaciones de desempeño, registros de capacitación',
        indicadores: 'Rotación de personal, horas de capacitación, satisfacción laboral',
        documentos_relacionados: 'Perfiles de puesto, procedimiento de selección, plan de capacitación'
      },
      {
        codigo: 'DOC-01',
        nombre: 'Gestión de la Documentación',
        objetivo: 'Controlar la creación, revisión, aprobación, distribución y resguardo de la documentación del sistema de gestión.',
        alcance: 'Aplica a todos los documentos controlados, incluyendo procedimientos, instructivos, registros y formularios.',
        descripcion_detallada: 'Se implementa un sistema digital de control documental con permisos por rol. Los documentos tienen versión, fecha de revisión y responsable asignado. Se asegura la trazabilidad y la eliminación controlada de documentos obsoletos.',
        tipo: 'apoyo',
        responsable: 'Coordinador de Calidad',
        entradas: 'Documentos nuevos, solicitudes de cambio, revisiones',
        salidas: 'Documentos controlados, listado maestro, documentos obsoletos',
        indicadores: 'Documentos vigentes vs obsoletos, tiempo de aprobación',
        documentos_relacionados: 'Procedimiento de control de documentos, listado maestro de documentos'
      }
    ];
    
    console.log('📝 Insertando procesos...');
    
    for (const proceso of procesos) {
      const id = crypto.randomUUID();
      const fechaCreacion = new Date().toISOString();
      
      await tursoClient.execute({
        sql: `INSERT INTO procesos (
                id, codigo, nombre, descripcion, tipo, responsable, 
                entradas, salidas, indicadores, documentos_relacionados, 
                estado, version, objetivo, alcance, descripcion_detallada,
                fecha_creacion
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          proceso.codigo,
          proceso.nombre,
          proceso.objetivo, // usando objetivo como descripción principal
          proceso.tipo,
          proceso.responsable,
          proceso.entradas,
          proceso.salidas,
          proceso.indicadores,
          proceso.documentos_relacionados,
          'activo',
          '1.0',
          proceso.objetivo,
          proceso.alcance,
          proceso.descripcion_detallada,
          fechaCreacion
        ]
      });
      
      console.log(`✅ Proceso insertado: ${proceso.codigo} - ${proceso.nombre}`);
    }
    
    // 3. Verificar datos insertados
    const result = await tursoClient.execute('SELECT codigo, nombre, tipo, estado FROM procesos ORDER BY codigo');
    console.log('\n📋 Procesos creados:');
    result.rows.forEach(row => {
      console.log(`  • ${row.codigo} - ${row.nombre} (${row.tipo})`);
    });
    
    console.log(`\n🎉 Sistema de procesos configurado exitosamente con ${result.rows.length} procesos`);
    
  } catch (error) {
    console.error('❌ Error al configurar sistema de procesos:', error);
    throw error;
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupProcesosComplete()
    .then(() => {
      console.log('✅ Configuración completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export { setupProcesosComplete };
