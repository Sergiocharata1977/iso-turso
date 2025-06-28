import { tursoClient } from './lib/tursoClient.js';

async function crearDatosPrueba() {
  try {
    console.log('🚀 Creando datos de prueba...');
    
    // Crear departamentos
    console.log('📁 Creando departamentos...');
    
    await tursoClient.execute({
      sql: 'INSERT INTO departamentos (id, nombre, descripcion, fecha_creacion) VALUES (?, ?, ?, ?)',
      args: ['dept-001', 'Recursos Humanos', 'Gestión del personal y desarrollo organizacional', new Date().toISOString()]
    });
    console.log('✅ Departamento RRHH creado');
    
    await tursoClient.execute({
      sql: 'INSERT INTO departamentos (id, nombre, descripcion, fecha_creacion) VALUES (?, ?, ?, ?)',
      args: ['dept-002', 'Tecnología', 'Desarrollo y mantenimiento de sistemas informáticos', new Date().toISOString()]
    });
    console.log('✅ Departamento TI creado');
    
    await tursoClient.execute({
      sql: 'INSERT INTO departamentos (id, nombre, descripcion, fecha_creacion) VALUES (?, ?, ?, ?)',
      args: ['dept-003', 'Administración', 'Gestión administrativa y financiera', new Date().toISOString()]
    });
    console.log('✅ Departamento Admin creado');
    
    // Crear algunos puestos
    console.log('💼 Creando puestos...');
    
    await tursoClient.execute({
      sql: 'INSERT INTO puestos (id, titulo_puesto, codigo_puesto, departamento_id, proposito_general, principales_responsabilidades, competencias_necesarias, requisitos, experiencia_requerida, formacion_requerida, estado_puesto, nivel, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [
        'puesto-001',
        'Especialista en Recursos Humanos',
        'RRHH-001',
        'dept-001',
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
        'dept-002',
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
    console.log('✅ Puesto TI creado');
    
    // Crear algunos procesos
    console.log('🔄 Creando procesos...');
    
    await tursoClient.execute({
      sql: 'INSERT INTO procesos (id, nombre, codigo, descripcion, tipo_proceso, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?)',
      args: [
        'proc-001',
        'Gestión de Calidad',
        'GC-01',
        'Proceso para asegurar la calidad de los productos y servicios.',
        'Estratégico',
        new Date().toISOString()
      ]
    });
    console.log('✅ Proceso Gestión de Calidad creado');

    await tursoClient.execute({
      sql: 'INSERT INTO procesos (id, nombre, codigo, descripcion, tipo_proceso, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?)',
      args: [
        'proc-002',
        'Desarrollo de Software',
        'DS-01',
        'Proceso para el ciclo de vida del desarrollo de software.',
        'Clave',
        new Date().toISOString()
      ]
    });
    console.log('✅ Proceso Desarrollo de Software creado');

    // Verificar resultados
    console.log('🔍 Verificando datos creados...');
    
    const deptos = await tursoClient.execute('SELECT COUNT(*) as count FROM departamentos');
    console.log(`📁 Departamentos creados: ${deptos.rows[0].count}`);
    
    const puestos = await tursoClient.execute('SELECT COUNT(*) as count FROM puestos');
    console.log(`💼 Puestos creados: ${puestos.rows[0].count}`);

    const procesos = await tursoClient.execute('SELECT COUNT(*) as count FROM procesos');
    console.log(`🔄 Procesos creados: ${procesos.rows[0].count}`);
    
    console.log('🎉 ¡Datos de prueba creados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error creando datos:', error.message);
  }
}

crearDatosPrueba();
