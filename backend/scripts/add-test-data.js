import { tursoClient } from '../lib/tursoClient.js';

async function addTestData() {
  console.log('🔥 Agregando datos de prueba a todas las tablas...');
  
  try {
    // Obtener organizaciones existentes
    const orgsResult = await tursoClient.execute({
      sql: 'SELECT id, name FROM organizations ORDER BY id',
      args: []
    });
    
    console.log(`✅ Organizaciones encontradas: ${orgsResult.rows.length}`);
    
    for (const org of orgsResult.rows) {
      console.log(`📋 Agregando datos para: ${org.name}`);
      
      // NORMAS
      const normasData = [
        {
          codigo: `ISO-9001-${org.id}`,
          titulo: 'Sistema de Gestión de Calidad',
          descripcion: 'Norma ISO 9001 para gestión de calidad',
          version: '2015',
          tipo: 'ISO',
          estado: 'activo',
          categoria: 'Gestión de Calidad',
          responsable: 'Director de Calidad',
          fecha_revision: '2024-12-01',
          observaciones: 'Norma principal del sistema'
        },
        {
          codigo: `ISO-14001-${org.id}`,
          titulo: 'Sistema de Gestión Ambiental',
          descripcion: 'Norma ISO 14001 para gestión ambiental',
          version: '2015',
          tipo: 'ISO',
          estado: 'activo',
          categoria: 'Gestión Ambiental',
          responsable: 'Responsable Ambiental',
          fecha_revision: '2024-12-01',
          observaciones: 'Norma ambiental complementaria'
        },
        {
          codigo: `OHSAS-18001-${org.id}`,
          titulo: 'Sistema de Gestión de Seguridad y Salud',
          descripcion: 'Norma OHSAS 18001 para seguridad laboral',
          version: '2007',
          tipo: 'OHSAS',
          estado: 'activo',
          categoria: 'Seguridad y Salud',
          responsable: 'Responsable de Seguridad',
          fecha_revision: '2024-12-01',
          observaciones: 'Norma de seguridad laboral'
        }
      ];
      
      for (const norma of normasData) {
        await tursoClient.execute({
          sql: `INSERT INTO normas (
            codigo, titulo, descripcion, version, tipo, estado, categoria,
            responsable, fecha_revision, observaciones, organization_id, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          args: [
            norma.codigo, norma.titulo, norma.descripcion, norma.version, 
            norma.tipo, norma.estado, norma.categoria, norma.responsable,
            norma.fecha_revision, norma.observaciones, Number(org.id)
          ]
        });
      }
      
      // PERSONAL
      const personalData = [
        {
          nombre: 'Juan',
          apellido: 'Pérez',
          dni: `12345678${org.id}`,
          email: `juan.perez@${org.name.toLowerCase().replace(/\s/g, '')}.com`,
          telefono: '1234567890',
          puesto: 'Director de Calidad',
          departamento: 'Dirección',
          fecha_ingreso: '2020-01-15',
          estado: 'activo',
          observaciones: 'Director responsable del SGC'
        },
        {
          nombre: 'María',
          apellido: 'González',
          dni: `87654321${org.id}`,
          email: `maria.gonzalez@${org.name.toLowerCase().replace(/\s/g, '')}.com`,
          telefono: '0987654321',
          puesto: 'Responsable de Auditoría',
          departamento: 'Calidad',
          fecha_ingreso: '2021-03-20',
          estado: 'activo',
          observaciones: 'Responsable de auditorías internas'
        },
        {
          nombre: 'Carlos',
          apellido: 'Rodríguez',
          dni: `11223344${org.id}`,
          email: `carlos.rodriguez@${org.name.toLowerCase().replace(/\s/g, '')}.com`,
          telefono: '1122334455',
          puesto: 'Analista de Procesos',
          departamento: 'Procesos',
          fecha_ingreso: '2022-06-10',
          estado: 'activo',
          observaciones: 'Analista de mejora continua'
        }
      ];
      
      for (const persona of personalData) {
        await tursoClient.execute({
          sql: `INSERT INTO personal (
            nombre, apellido, dni, email, telefono, puesto, departamento,
            fecha_ingreso, estado, observaciones, organization_id, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          args: [
            persona.nombre, persona.apellido, persona.dni, persona.email,
            persona.telefono, persona.puesto, persona.departamento,
            persona.fecha_ingreso, persona.estado, persona.observaciones,
            Number(org.id)
          ]
        });
      }
      
      // PROCESOS
      const procesosData = [
        {
          nombre: 'Gestión de la Calidad',
          descripcion: 'Proceso principal de gestión de calidad',
          responsable: 'Director de Calidad',
          tipo: 'Estratégico',
          estado: 'activo',
          version: '1.0',
          fecha_aprobacion: '2024-01-15',
          observaciones: 'Proceso core del SGC'
        },
        {
          nombre: 'Control de Documentos',
          descripcion: 'Proceso de control y gestión documental',
          responsable: 'Responsable de Documentos',
          tipo: 'Apoyo',
          estado: 'activo',
          version: '1.0',
          fecha_aprobacion: '2024-01-20',
          observaciones: 'Control de la documentación del SGC'
        },
        {
          nombre: 'Auditorías Internas',
          descripcion: 'Proceso de auditorías internas de calidad',
          responsable: 'Responsable de Auditoría',
          tipo: 'Evaluación',
          estado: 'activo',
          version: '1.0',
          fecha_aprobacion: '2024-02-01',
          observaciones: 'Auditorías del sistema de calidad'
        }
      ];
      
      for (const proceso of procesosData) {
        await tursoClient.execute({
          sql: `INSERT INTO procesos (
            nombre, descripcion, responsable, tipo, estado, version,
            fecha_aprobacion, observaciones, organization_id, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          args: [
            proceso.nombre, proceso.descripcion, proceso.responsable,
            proceso.tipo, proceso.estado, proceso.version,
            proceso.fecha_aprobacion, proceso.observaciones,
            Number(org.id)
          ]
        });
      }
      
      // DOCUMENTOS
      const documentosData = [
        {
          titulo: 'Manual de Calidad',
          descripcion: 'Manual principal del sistema de gestión de calidad',
          tipo: 'Manual',
          estado: 'vigente',
          version: '1.0',
          fecha_creacion: '2024-01-01',
          fecha_revision: '2024-12-01',
          responsable: 'Director de Calidad',
          observaciones: 'Documento maestro del SGC'
        },
        {
          titulo: 'Procedimiento de Auditorías',
          descripcion: 'Procedimiento para realizar auditorías internas',
          tipo: 'Procedimiento',
          estado: 'vigente',
          version: '1.0',
          fecha_creacion: '2024-01-15',
          fecha_revision: '2024-12-15',
          responsable: 'Responsable de Auditoría',
          observaciones: 'Procedimiento de auditorías internas'
        },
        {
          titulo: 'Instructivo de Control de Documentos',
          descripcion: 'Instructivo para el control de documentos',
          tipo: 'Instructivo',
          estado: 'vigente',
          version: '1.0',
          fecha_creacion: '2024-01-20',
          fecha_revision: '2024-12-20',
          responsable: 'Responsable de Documentos',
          observaciones: 'Control documental del SGC'
        }
      ];
      
      for (const documento of documentosData) {
        await tursoClient.execute({
          sql: `INSERT INTO documentos (
            titulo, descripcion, tipo, estado, version, fecha_creacion,
            fecha_revision, responsable, observaciones, organization_id, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          args: [
            documento.titulo, documento.descripcion, documento.tipo,
            documento.estado, documento.version, documento.fecha_creacion,
            documento.fecha_revision, documento.responsable,
            documento.observaciones, Number(org.id)
          ]
        });
      }
      
      console.log(`✅ Datos agregados para: ${org.name}`);
    }
    
    console.log('🎉 DATOS DE PRUEBA AGREGADOS EXITOSAMENTE');
    
    // Mostrar resumen
    const resumen = await tursoClient.execute({
      sql: `SELECT 
        'normas' as tabla, COUNT(*) as total FROM normas
        UNION ALL SELECT 'personal', COUNT(*) FROM personal
        UNION ALL SELECT 'procesos', COUNT(*) FROM procesos
        UNION ALL SELECT 'documentos', COUNT(*) FROM documentos`,
      args: []
    });
    
    console.log('📊 RESUMEN DE DATOS:');
    for (const row of resumen.rows) {
      console.log(`   ${row.tabla}: ${row.total} registros`);
    }
    
  } catch (error) {
    console.error('❌ Error agregando datos de prueba:', error);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  addTestData().then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export default addTestData; 