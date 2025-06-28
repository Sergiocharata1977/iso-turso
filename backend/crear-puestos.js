import { tursoClient } from './lib/tursoClient.js';

async function crearPuestos() {
  try {
    console.log('🚀 Creando datos de puestos...');
    
    // Crear algunos puestos
    console.log('💼 Creando puestos...');
    
    await tursoClient.execute({
      sql: 'INSERT INTO puestos (id, titulo_puesto, codigo_puesto, departamento_id, proposito_general, principales_responsabilidades, competencias_necesarias, requisitos, experiencia_requerida, formacion_requerida, estado_puesto, nivel, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [
        'puesto-001',
        'Especialista en Recursos Humanos',
        'RRHH-001',
        null, // Sin departamento por ahora
        'Gestionar procesos de recursos humanos',
        'Reclutamiento, selección, capacitación y desarrollo del personal',
        'Comunicación efectiva, liderazgo, análisis',
        'Título universitario en Administración o áreas afines',
        '2 años en gestión de recursos humanos',
        'Licenciatura en Administración, Psicología o similar',
        'Activo',
        'Medio',
        new Date().toISOString()
      ]
    });
    console.log('✅ Puesto RRHH creado');
    
    await tursoClient.execute({
      sql: 'INSERT INTO puestos (id, titulo_puesto, codigo_puesto, departamento_id, proposito_general, principales_responsabilidades, competencias_necesarias, requisitos, experiencia_requerida, formacion_requerida, estado_puesto, nivel, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [
        'puesto-002',
        'Desarrollador de Software',
        'TI-001',
        null, // Sin departamento por ahora
        'Desarrollar y mantener aplicaciones de software',
        'Programación, testing, documentación, mantenimiento de sistemas',
        'Programación, resolución de problemas, trabajo en equipo',
        'Título en Ingeniería en Sistemas o áreas afines',
        '1 año en desarrollo de software',
        'Ingeniería en Sistemas, Ciencias de la Computación',
        'Activo',
        'Junior',
        new Date().toISOString()
      ]
    });
    console.log('✅ Puesto Desarrollador creado');
    
    await tursoClient.execute({
      sql: 'INSERT INTO puestos (id, titulo_puesto, codigo_puesto, departamento_id, proposito_general, principales_responsabilidades, competencias_necesarias, requisitos, experiencia_requerida, formacion_requerida, estado_puesto, nivel, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [
        'puesto-003',
        'Auditor de Calidad',
        'CA-001',
        null, // Sin departamento por ahora
        'Realizar auditorías internas de calidad',
        'Planificación y ejecución de auditorías, preparación de informes',
        'Análisis, organización, comunicación escrita',
        'Conocimientos en normativas ISO',
        '2 años en sistemas de gestión de calidad',
        'Cursos en auditoría de calidad',
        'Activo',
        'Senior',
        new Date().toISOString()
      ]
    });
    console.log('✅ Puesto Auditor creado');

    // Verificar resultados
    const puestos = await tursoClient.execute('SELECT COUNT(*) as count FROM puestos');
    console.log(`💼 Puestos creados: ${puestos.rows[0].count}`);
    
    console.log('🎉 ¡Datos de puestos creados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error creando puestos:', error.message);
  }
}

crearPuestos();
