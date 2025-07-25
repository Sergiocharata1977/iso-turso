import { tursoClient } from '../lib/tursoClient.js';

async function fixOrganizationRelations() {
  try {
    console.log('🔧 Arreglando relaciones para organization_id 3...');

    // 1. Verificar qué organization_id usa la aplicación
    console.log('\n📊 Verificando datos por organización...');
    
    const personalOrg2 = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM personal WHERE organization_id = 2'
    });
    
    const personalOrg3 = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM personal WHERE organization_id = 3'
    });

    const puestosOrg2 = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM puestos WHERE organization_id = 2'
    });

    const puestosOrg3 = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM puestos WHERE organization_id = 3'
    });

    const departamentosOrg2 = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM departamentos WHERE organization_id = 2'
    });

    const departamentosOrg3 = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM departamentos WHERE organization_id = 3'
    });

    console.log('📊 Datos por organización:');
    console.log(`- Personal org 2: ${personalOrg2.rows[0].count}`);
    console.log(`- Personal org 3: ${personalOrg3.rows[0].count}`);
    console.log(`- Puestos org 2: ${puestosOrg2.rows[0].count}`);
    console.log(`- Puestos org 3: ${puestosOrg3.rows[0].count}`);
    console.log(`- Departamentos org 2: ${departamentosOrg2.rows[0].count}`);
    console.log(`- Departamentos org 3: ${departamentosOrg3.rows[0].count}`);

    // 2. Si no hay datos en org 3, copiar desde org 2 con nuevos IDs y nombres únicos
    if (personalOrg3.rows[0].count === 0 && personalOrg2.rows[0].count > 0) {
      console.log('\n🔄 Copiando personal de org 2 a org 3 con nuevos IDs...');
      await tursoClient.execute({
        sql: `INSERT INTO personal (id, organization_id, nombres, apellidos, email, telefono, documento_identidad, fecha_nacimiento, nacionalidad, direccion, telefono_emergencia, fecha_contratacion, numero_legajo, estado)
              SELECT 'per_org3_' || ROWID, 3, nombres, apellidos, email, telefono, documento_identidad, fecha_nacimiento, nacionalidad, direccion, telefono_emergencia, fecha_contratacion, numero_legajo, estado
              FROM personal WHERE organization_id = 2`
      });
    }

    if (puestosOrg3.rows[0].count === 0 && puestosOrg2.rows[0].count > 0) {
      console.log('🔄 Copiando puestos de org 2 a org 3 con nuevos IDs...');
      await tursoClient.execute({
        sql: `INSERT INTO puestos (id, organization_id, nombre, descripcion_responsabilidades, requisitos_experiencia, requisitos_formacion, departamento_id, reporta_a_id)
              SELECT 'puesto_org3_' || ROWID, 3, nombre, descripcion_responsabilidades, requisitos_experiencia, requisitos_formacion, departamento_id, reporta_a_id
              FROM puestos WHERE organization_id = 2`
      });
    }

    if (departamentosOrg3.rows[0].count === 0 && departamentosOrg2.rows[0].count > 0) {
      console.log('🔄 Copiando departamentos de org 2 a org 3 con nuevos IDs y nombres únicos...');
      await tursoClient.execute({
        sql: `INSERT INTO departamentos (id, organization_id, nombre, descripcion, responsable_id, objetivos)
              SELECT 'dept_org3_' || ROWID, 3, nombre || ' (Org 3)', descripcion, responsable_id, objetivos
              FROM departamentos WHERE organization_id = 2`
      });
    }

    // 3. Crear relaciones para org 3 usando los nuevos IDs
    console.log('\n🔄 Creando relaciones para organization_id 3...');
    
    // Obtener datos de org 3
    const personalOrg3Data = await tursoClient.execute({
      sql: 'SELECT id, nombres, apellidos FROM personal WHERE organization_id = 3 LIMIT 3'
    });

    const puestosOrg3Data = await tursoClient.execute({
      sql: 'SELECT id, nombre FROM puestos WHERE organization_id = 3 LIMIT 3'
    });

    const departamentosOrg3Data = await tursoClient.execute({
      sql: 'SELECT id, nombre FROM departamentos WHERE organization_id = 3 LIMIT 3'
    });

    console.log('👥 Personal org 3:', personalOrg3Data.rows.map(p => `${p.nombres} ${p.apellidos} (${p.id})`));
    console.log('💼 Puestos org 3:', puestosOrg3Data.rows.map(p => `${p.nombre} (${p.id})`));
    console.log('🏢 Departamentos org 3:', departamentosOrg3Data.rows.map(d => `${d.nombre} (${d.id})`));

    // Crear relaciones personal -> puesto
    console.log('\n🔄 Creando relaciones personal -> puesto para org 3...');
    for (let i = 0; i < Math.min(personalOrg3Data.rows.length, puestosOrg3Data.rows.length); i++) {
      await tursoClient.execute({
        sql: `INSERT OR IGNORE INTO relaciones_sgc 
              (organization_id, origen_tipo, origen_id, destino_tipo, destino_id, descripcion, fecha_creacion, usuario_creador)
              VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
        args: [
          3, // organization_id
          'personal',
          personalOrg3Data.rows[i].id,
          'puesto',
          puestosOrg3Data.rows[i].id,
          `Asignación de ${puestosOrg3Data.rows[i].nombre} a ${personalOrg3Data.rows[i].nombres} ${personalOrg3Data.rows[i].apellidos}`,
          'sistema'
        ]
      });
      console.log(`✅ ${personalOrg3Data.rows[i].nombres} ${personalOrg3Data.rows[i].apellidos} -> ${puestosOrg3Data.rows[i].nombre}`);
    }

    // Crear relaciones personal -> departamento
    console.log('\n🔄 Creando relaciones personal -> departamento para org 3...');
    for (let i = 0; i < Math.min(personalOrg3Data.rows.length, departamentosOrg3Data.rows.length); i++) {
      await tursoClient.execute({
        sql: `INSERT OR IGNORE INTO relaciones_sgc 
              (organization_id, origen_tipo, origen_id, destino_tipo, destino_id, descripcion, fecha_creacion, usuario_creador)
              VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
        args: [
          3, // organization_id
          'personal',
          personalOrg3Data.rows[i].id,
          'departamento',
          departamentosOrg3Data.rows[i].id,
          `Asignación de ${departamentosOrg3Data.rows[i].nombre} a ${personalOrg3Data.rows[i].nombres} ${personalOrg3Data.rows[i].apellidos}`,
          'sistema'
        ]
      });
      console.log(`✅ ${personalOrg3Data.rows[i].nombres} ${personalOrg3Data.rows[i].apellidos} -> ${departamentosOrg3Data.rows[i].nombre}`);
    }

    // 4. Verificar resultados
    console.log('\n📊 Verificando resultados...');
    const relacionesOrg3 = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM relaciones_sgc WHERE organization_id = 3`
    });

    const personalFinal = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM personal WHERE organization_id = 3'
    });

    const puestosFinal = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM puestos WHERE organization_id = 3'
    });

    console.log('✅ Resultados finales:');
    console.log(`- Personal org 3: ${personalFinal.rows[0].count}`);
    console.log(`- Puestos org 3: ${puestosFinal.rows[0].count}`);
    console.log(`- Relaciones org 3: ${relacionesOrg3.rows[0].count}`);

    // 5. Mostrar relaciones creadas
    const relacionesFinales = await tursoClient.execute({
      sql: `SELECT 
              r.*,
              CASE 
                WHEN r.origen_tipo = 'personal' THEN (SELECT nombres || ' ' || apellidos FROM personal WHERE id = r.origen_id AND organization_id = 3)
                WHEN r.origen_tipo = 'puesto' THEN (SELECT nombre FROM puestos WHERE id = r.origen_id AND organization_id = 3)
                WHEN r.origen_tipo = 'departamento' THEN (SELECT nombre FROM departamentos WHERE id = r.origen_id AND organization_id = 3)
                ELSE 'N/A'
              END as origen_nombre,
              CASE 
                WHEN r.destino_tipo = 'personal' THEN (SELECT nombres || ' ' || apellidos FROM personal WHERE id = r.destino_id AND organization_id = 3)
                WHEN r.destino_tipo = 'puesto' THEN (SELECT nombre FROM puestos WHERE id = r.destino_id AND organization_id = 3)
                WHEN r.destino_tipo = 'departamento' THEN (SELECT nombre FROM departamentos WHERE id = r.destino_id AND organization_id = 3)
                ELSE 'N/A'
              END as destino_nombre
            FROM relaciones_sgc r
            WHERE r.organization_id = 3
            ORDER BY r.fecha_creacion DESC`
    });

    console.log('\n📋 Relaciones en organization_id 3:');
    console.table(relacionesFinales.rows);

    console.log('\n✅ ¡Problema resuelto!');
    console.log('🎯 La aplicación ahora debería mostrar puestos y departamentos correctamente');

  } catch (error) {
    console.error('❌ Error al arreglar relaciones:', error);
    throw error;
  }
}

// Ejecutar la función
fixOrganizationRelations().then(() => {
  console.log('\n🎉 Script completado');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Error en el script:', error);
  process.exit(1);
}); 