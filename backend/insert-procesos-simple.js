import { tursoClient } from './lib/tursoClient.js';
import crypto from 'crypto';

console.log('🔄 Iniciando inserción de procesos...');

try {
  // Verificar conexión
  console.log('🔗 Verificando conexión...');
  const testConnection = await tursoClient.execute('SELECT 1 as test');
  console.log('✅ Conexión OK');

  // Recrear tabla
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
  
  console.log('✅ Tabla creada');

  // Insertar procesos uno por uno
  const procesos = [
    {
      codigo: 'SAT-01',
      nombre: 'Satisfacción del Cliente',
      objetivo: 'Medir, evaluar y mejorar la satisfacción de los clientes respecto a los productos y servicios brindados por la organización.',
      alcance: 'Aplica a todos los puntos de contacto con el cliente, desde la preventa hasta el servicio postventa.',
      descripcion_detallada: 'El proceso contempla encuestas de satisfacción, análisis de quejas y sugerencias, reuniones de feedback, y acciones correctivas derivadas de los resultados. Se vincula con los indicadores de calidad y es revisado trimestralmente.'
    },
    {
      codigo: 'AUD-01',
      nombre: 'Auditorías Internas', 
      objetivo: 'Evaluar la conformidad del sistema de gestión con los requisitos de la norma ISO 9001:2015 y detectar oportunidades de mejora.',
      alcance: 'Involucra todos los departamentos y procesos documentados en el sistema de gestión de la calidad.',
      descripcion_detallada: 'Las auditorías se planifican anualmente y se ejecutan conforme a un programa aprobado por la dirección. Se asignan auditores independientes, se documentan hallazgos y se realiza seguimiento a las acciones correctivas.'
    },
    {
      codigo: 'RH-01',
      nombre: 'Gestión de Recursos Humanos',
      objetivo: 'Gestionar eficazmente la incorporación, desarrollo y retención del personal necesario para el cumplimiento de los objetivos organizacionales.',
      alcance: 'Aplica desde el reclutamiento hasta la desvinculación, incluyendo formación, evaluación y clima laboral.',
      descripcion_detallada: 'Se definen perfiles de puesto, se administran procesos de selección, inducción, capacitaciones y evaluaciones de desempeño. Se gestiona el legajo digital del personal y la documentación legal correspondiente.'
    },
    {
      codigo: 'DOC-01',
      nombre: 'Gestión de la Documentación',
      objetivo: 'Controlar la creación, revisión, aprobación, distribución y resguardo de la documentación del sistema de gestión.',
      alcance: 'Aplica a todos los documentos controlados, incluyendo procedimientos, instructivos, registros y formularios.',
      descripcion_detallada: 'Se implementa un sistema digital de control documental con permisos por rol. Los documentos tienen versión, fecha de revisión y responsable asignado. Se asegura la trazabilidad y la eliminación controlada de documentos obsoletos.'
    }
  ];

  for (let i = 0; i < procesos.length; i++) {
    const proceso = procesos[i];
    console.log(`📝 Insertando proceso ${i + 1}: ${proceso.codigo}`);
    
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
        proceso.objetivo,
        'proceso',
        'Responsable por definir',
        'Por definir',
        'Por definir',
        'Por definir',
        'Por definir',
        'activo',
        '1.0',
        proceso.objetivo,
        proceso.alcance,
        proceso.descripcion_detallada,
        fechaCreacion
      ]
    });
    
    console.log(`✅ Proceso ${proceso.codigo} insertado exitosamente`);
  }

  // Verificar resultados
  const result = await tursoClient.execute('SELECT codigo, nombre FROM procesos ORDER BY codigo');
  console.log('\n📋 Procesos creados:');
  result.rows.forEach(row => {
    console.log(`  • ${row.codigo} - ${row.nombre}`);
  });
  
  console.log(`\n🎉 ${result.rows.length} procesos insertados exitosamente`);
  
} catch (error) {
  console.error('❌ Error:', error);
}
