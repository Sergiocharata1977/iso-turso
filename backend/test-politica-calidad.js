import { tursoClient } from './lib/tursoClient.js';

async function testPoliticaCalidad() {
  try {
    console.log('🧪 Probando sistema ABM de Política de Calidad...\n');

    // 1. Verificar que la tabla existe
    console.log('1️⃣ Verificando estructura de la tabla...');
    const tableInfo = await tursoClient.execute('PRAGMA table_info(politica_calidad)');
    console.log('✅ Tabla encontrada con columnas:');
    tableInfo.rows.forEach(col => {
      console.log(`   - ${col.name}: ${col.type}`);
    });

    // 2. Verificar datos existentes
    console.log('\n2️⃣ Verificando datos existentes...');
    const existingData = await tursoClient.execute({
      sql: 'SELECT * FROM politica_calidad WHERE organization_id = ?',
      args: [1]
    });

    if (existingData.rows.length > 0) {
      console.log(`✅ ${existingData.rows.length} políticas de calidad encontradas:`);
      existingData.rows.forEach((politica, index) => {
        console.log(`   ${index + 1}. ${politica.nombre} (${politica.estado})`);
        console.log(`      - Política: ${politica.politica_calidad ? 'Sí' : 'No'}`);
        console.log(`      - Alcance: ${politica.alcance ? 'Sí' : 'No'}`);
        console.log(`      - Mapa: ${politica.mapa_procesos ? 'Sí' : 'No'}`);
        console.log(`      - Organigrama: ${politica.organigrama ? 'Sí' : 'No'}`);
      });
    } else {
      console.log('ℹ️ No hay políticas de calidad existentes');
    }

    // 3. Probar operación ALTA (crear nueva política)
    console.log('\n3️⃣ Probando operación ALTA...');
    
    const nuevaPolitica = {
      nombre: 'Política de Calidad de Prueba ABM',
      politica_calidad: 'Política de prueba para verificar el sistema ABM completo.',
      alcance: 'Alcance de prueba para el sistema ABM.',
      mapa_procesos: 'Mapa de procesos de prueba para ABM.',
      organigrama: 'Organigrama de prueba para ABM.'
    };

    const insertResult = await tursoClient.execute({
      sql: `INSERT INTO politica_calidad (
        organization_id, nombre, politica_calidad, alcance, mapa_procesos, organigrama
      ) VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [
        1,
        nuevaPolitica.nombre,
        nuevaPolitica.politica_calidad,
        nuevaPolitica.alcance,
        nuevaPolitica.mapa_procesos,
        nuevaPolitica.organigrama
      ]
    });
    
    console.log('✅ Nueva política creada con ID:', insertResult.rows[0].id);

    // 4. Probar operación MODIFICACIÓN (actualizar política)
    console.log('\n4️⃣ Probando operación MODIFICACIÓN...');
    
    const politicaId = insertResult.rows[0].id;
    const updateResult = await tursoClient.execute({
      sql: `UPDATE politica_calidad 
            SET nombre = ?, politica_calidad = ?, estado = ?, updated_at = datetime('now', 'localtime')
            WHERE id = ? RETURNING *`,
      args: [
        'Política de Calidad Actualizada',
        'Política actualizada para probar la modificación.',
        'activo',
        politicaId
      ]
    });
    
    console.log('✅ Política actualizada:', updateResult.rows[0].nombre);

    // 5. Verificar datos finales
    console.log('\n5️⃣ Verificando datos finales...');
    const finalData = await tursoClient.execute({
      sql: 'SELECT * FROM politica_calidad WHERE organization_id = ? ORDER BY created_at DESC',
      args: [1]
    });

    console.log(`✅ Total de políticas de calidad: ${finalData.rows.length}`);
    finalData.rows.forEach((politica, index) => {
      console.log(`   ${index + 1}. ${politica.nombre} (${politica.estado})`);
      console.log(`      - Creado: ${politica.created_at}`);
      console.log(`      - Actualizado: ${politica.updated_at}`);
    });

    // 6. Probar operación BAJA (eliminar política de prueba)
    console.log('\n6️⃣ Probando operación BAJA...');
    
    const deleteResult = await tursoClient.execute({
      sql: 'DELETE FROM politica_calidad WHERE id = ?',
      args: [politicaId]
    });
    
    console.log('✅ Política de prueba eliminada');

    console.log('\n🎉 ¡Sistema ABM de Política de Calidad funcionando correctamente!');
    console.log('📋 El sistema está listo para usar con operaciones de Alta, Baja y Modificación.');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    process.exit(1);
  }
}

// Ejecutar la prueba
testPoliticaCalidad()
  .then(() => {
    console.log('\n✅ Script de prueba finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }); 