import { tursoClient } from './lib/tursoClient.js';

async function testIdentificacionProcesos() {
  try {
    console.log('🧪 Probando API de Identificación de Procesos...\n');

    // 1. Verificar que la tabla existe
    console.log('1️⃣ Verificando estructura de la tabla...');
    const tableInfo = await tursoClient.execute('PRAGMA table_info(identificacion_procesos)');
    console.log('✅ Tabla encontrada con columnas:');
    tableInfo.rows.forEach(col => {
      console.log(`   - ${col.name}: ${col.type}`);
    });

    // 2. Verificar datos existentes
    console.log('\n2️⃣ Verificando datos existentes...');
    const existingData = await tursoClient.execute({
      sql: 'SELECT * FROM identificacion_procesos WHERE organization_id = ?',
      args: [1]
    });

    if (existingData.rows.length > 0) {
      console.log('✅ Datos existentes encontrados:');
      const data = existingData.rows[0];
      console.log(`   - ID: ${data.id}`);
      console.log(`   - Política de Calidad: ${data.politica_calidad ? 'Sí' : 'No'}`);
      console.log(`   - Alcance: ${data.alcance ? 'Sí' : 'No'}`);
      console.log(`   - Mapa de Procesos: ${data.mapa_procesos ? 'Sí' : 'No'}`);
      console.log(`   - Organigrama: ${data.organigrama ? 'Sí' : 'No'}`);
      console.log(`   - Creado: ${data.created_at}`);
      console.log(`   - Actualizado: ${data.updated_at}`);
    } else {
      console.log('ℹ️ No hay datos existentes');
    }

    // 3. Probar inserción de datos de ejemplo
    console.log('\n3️⃣ Probando inserción de datos de ejemplo...');
    
    const testData = {
      politica_calidad: 'Política de Calidad de Prueba: Compromiso con la excelencia y mejora continua.',
      alcance: 'Alcance de Prueba: Aplica a todos los procesos de la organización.',
      mapa_procesos: 'Mapa de Procesos de Prueba: Descripción de la interrelación entre procesos.',
      organigrama: 'Organigrama de Prueba: Estructura organizacional y responsabilidades.'
    };

    // Verificar si ya existe un registro
    const existingRecord = await tursoClient.execute({
      sql: 'SELECT id FROM identificacion_procesos WHERE organization_id = ?',
      args: [1]
    });

    if (existingRecord.rows.length === 0) {
      // Crear nuevo registro
      const insertResult = await tursoClient.execute({
        sql: `INSERT INTO identificacion_procesos (
          organization_id, politica_calidad, alcance, mapa_procesos, organigrama
        ) VALUES (?, ?, ?, ?, ?) RETURNING *`,
        args: [1, testData.politica_calidad, testData.alcance, testData.mapa_procesos, testData.organigrama]
      });
      console.log('✅ Nuevo registro creado con datos de prueba');
    } else {
      // Actualizar registro existente
      const updateResult = await tursoClient.execute({
        sql: `UPDATE identificacion_procesos 
              SET politica_calidad = ?, alcance = ?, mapa_procesos = ?, organigrama = ?,
                  updated_at = datetime('now', 'localtime')
              WHERE organization_id = ? RETURNING *`,
        args: [testData.politica_calidad, testData.alcance, testData.mapa_procesos, testData.organigrama, 1]
      });
      console.log('✅ Registro existente actualizado con datos de prueba');
    }

    // 4. Verificar datos finales
    console.log('\n4️⃣ Verificando datos finales...');
    const finalData = await tursoClient.execute({
      sql: 'SELECT * FROM identificacion_procesos WHERE organization_id = ?',
      args: [1]
    });

    if (finalData.rows.length > 0) {
      const data = finalData.rows[0];
      console.log('✅ Datos finales:');
      console.log(`   - Política de Calidad: ${data.politica_calidad.substring(0, 50)}...`);
      console.log(`   - Alcance: ${data.alcance.substring(0, 50)}...`);
      console.log(`   - Mapa de Procesos: ${data.mapa_procesos.substring(0, 50)}...`);
      console.log(`   - Organigrama: ${data.organigrama.substring(0, 50)}...`);
      console.log(`   - Última actualización: ${data.updated_at}`);
    }

    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('📋 La API de identificación de procesos está lista para usar.');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    process.exit(1);
  }
}

// Ejecutar la prueba
testIdentificacionProcesos()
  .then(() => {
    console.log('\n✅ Script de prueba finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }); 