import { tursoClient } from '../lib/tursoClient.js';

async function createPersonalRelations() {
  try {
    console.log('🔧 Creando relaciones de personal con puestos y departamentos...');

    // 1. Verificar datos existentes
    const personalCount = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM personal'
    });
    const puestosCount = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM puestos'
    });
    const departamentosCount = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM departamentos'
    });

    console.log('\n📊 Datos disponibles:');
    console.log(`- Personal: ${personalCount.rows[0].count}`);
    console.log(`- Puestos: ${puestosCount.rows[0].count}`);
    console.log(`- Departamentos: ${departamentosCount.rows[0].count}`);

    // 2. Obtener datos para crear relaciones
    const personal = await tursoClient.execute({
      sql: 'SELECT id, nombres, apellidos FROM personal LIMIT 3'
    });

    const puestos = await tursoClient.execute({
      sql: 'SELECT id, nombre FROM puestos LIMIT 3'
    });

    const departamentos = await tursoClient.execute({
      sql: 'SELECT id, nombre FROM departamentos LIMIT 3'
    });

    console.log('\n👥 Personal disponible:', personal.rows.map(p => `${p.nombres} ${p.apellidos} (${p.id})`));
    console.log('💼 Puestos disponibles:', puestos.rows.map(p => `${p.nombre} (${p.id})`));
    console.log('🏢 Departamentos disponibles:', departamentos.rows.map(d => `${d.nombre} (${d.id})`));

    // 3. Crear relaciones personal -> puesto
    console.log('\n🔄 Creando relaciones personal -> puesto...');
    for (let i = 0; i < Math.min(personal.rows.length, puestos.rows.length); i++) {
      await tursoClient.execute({
        sql: `INSERT OR IGNORE INTO relaciones_sgc 
              (organization_id, origen_tipo, origen_id, destino_tipo, destino_id, descripcion, fecha_creacion, usuario_creador)
              VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
        args: [
          2, // organization_id
          'personal',
          personal.rows[i].id,
          'puesto',
          puestos.rows[i].id,
          `Asignación de ${puestos.rows[i].nombre} a ${personal.rows[i].nombres} ${personal.rows[i].apellidos}`,
          'sistema'
        ]
      });
      console.log(`✅ ${personal.rows[i].nombres} ${personal.rows[i].apellidos} -> ${puestos.rows[i].nombre}`);
    }

    // 4. Crear relaciones personal -> departamento
    console.log('\n🔄 Creando relaciones personal -> departamento...');
    for (let i = 0; i < Math.min(personal.rows.length, departamentos.rows.length); i++) {
      await tursoClient.execute({
        sql: `INSERT OR IGNORE INTO relaciones_sgc 
              (organization_id, origen_tipo, origen_id, destino_tipo, destino_id, descripcion, fecha_creacion, usuario_creador)
              VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
        args: [
          2, // organization_id
          'personal',
          personal.rows[i].id,
          'departamento',
          departamentos.rows[i].id,
          `Asignación de ${departamentos.rows[i].nombre} a ${personal.rows[i].nombres} ${personal.rows[i].apellidos}`,
          'sistema'
        ]
      });
      console.log(`✅ ${personal.rows[i].nombres} ${personal.rows[i].apellidos} -> ${departamentos.rows[i].nombre}`);
    }

    // 5. Verificar relaciones creadas
    console.log('\n📊 Verificando relaciones creadas...');
    const relacionesFinales = await tursoClient.execute({
      sql: `SELECT 
              r.*,
              CASE 
                WHEN r.origen_tipo = 'personal' THEN (SELECT nombres || ' ' || apellidos FROM personal WHERE id = r.origen_id)
                WHEN r.origen_tipo = 'puesto' THEN (SELECT nombre FROM puestos WHERE id = r.origen_id)
                WHEN r.origen_tipo = 'departamento' THEN (SELECT nombre FROM departamentos WHERE id = r.origen_id)
                ELSE 'N/A'
              END as origen_nombre,
              CASE 
                WHEN r.destino_tipo = 'personal' THEN (SELECT nombres || ' ' || apellidos FROM personal WHERE id = r.destino_id)
                WHEN r.destino_tipo = 'puesto' THEN (SELECT nombre FROM puestos WHERE id = r.destino_id)
                WHEN r.destino_tipo = 'departamento' THEN (SELECT nombre FROM departamentos WHERE id = r.destino_id)
                ELSE 'N/A'
              END as destino_nombre
            FROM relaciones_sgc r
            WHERE r.organization_id = 2
            ORDER BY r.fecha_creacion DESC`
    });

    console.log('\n📋 Relaciones finales:');
    console.table(relacionesFinales.rows);

    console.log('\n✅ ¡Relaciones creadas exitosamente!');
    console.log('\n🎯 RESUMEN:');
    console.log('- Se crearon relaciones personal -> puesto');
    console.log('- Se crearon relaciones personal -> departamento');
    console.log('- El sistema ahora puede mostrar puestos y departamentos asignados');
    console.log('- La aplicación debería funcionar correctamente');

  } catch (error) {
    console.error('❌ Error al crear relaciones:', error);
    throw error;
  }
}

// Ejecutar la función
createPersonalRelations().then(() => {
  console.log('\n🎉 Script completado');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Error en el script:', error);
  process.exit(1);
}); 