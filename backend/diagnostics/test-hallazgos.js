/**
 * Script de Diagnóstico para Hallazgos
 * Este script prueba todas las operaciones CRUD y diagnostica problemas
 */

import { tursoClient } from '../lib/tursoClient.js';

console.log('🔍 INICIANDO DIAGNÓSTICO DE HALLAZGOS...\n');

async function diagnosticar() {
  try {
    // 1. VERIFICAR CONEXIÓN A BASE DE DATOS
    console.log('📡 1. VERIFICANDO CONEXIÓN A BASE DE DATOS...');
    const connectionTest = await tursoClient.execute('SELECT 1 as test');
    console.log('✅ Conexión exitosa:', connectionTest.rows[0]);
    
    // 2. VERIFICAR ESTRUCTURA DE LA TABLA
    console.log('\n📋 2. VERIFICANDO ESTRUCTURA DE LA TABLA hallazgos...');
    try {
      const tableInfo = await tursoClient.execute("PRAGMA table_info(hallazgos)");
      console.log('✅ Estructura de la tabla:');
      tableInfo.rows.forEach(col => {
        console.log(`   - ${col.name}: ${col.type} ${col.notnull ? '(NOT NULL)' : ''} ${col.dflt_value ? `DEFAULT: ${col.dflt_value}` : ''}`);
      });
    } catch (error) {
      console.log('❌ Error al obtener estructura de tabla:', error.message);
    }

    // 3. CONTAR REGISTROS EXISTENTES
    console.log('\n📊 3. CONTANDO REGISTROS EXISTENTES...');
    try {
      const countResult = await tursoClient.execute('SELECT COUNT(*) as total FROM hallazgos');
      console.log('✅ Total de hallazgos existentes:', countResult.rows[0].total);
    } catch (error) {
      console.log('❌ Error al contar registros:', error.message);
    }

    // 4. PROBAR CONSULTA GET (listar todos)
    console.log('\n📝 4. PROBANDO CONSULTA GET (listar todos los hallazgos)...');
    try {
      const getResult = await tursoClient.execute({
        sql: `SELECT id, numeroHallazgo, titulo, descripcion, origen, categoria, requisitoIncumplido, fechaRegistro, fechaCierre, orden, estado FROM hallazgos ORDER BY orden ASC, fechaRegistro DESC NULLS LAST`,
      });
      console.log('✅ Consulta GET exitosa. Registros encontrados:', getResult.rows.length);
      if (getResult.rows.length > 0) {
        console.log('   Primer registro:', getResult.rows[0]);
      }
    } catch (error) {
      console.log('❌ Error en consulta GET:', error.message);
    }

    // 5. PROBAR INSERCIÓN (POST)
    console.log('\n➕ 5. PROBANDO INSERCIÓN DE NUEVO HALLAZGO...');
    
    const testData = {
      titulo: 'Hallazgo de Prueba - Diagnóstico',
      descripcion: 'Este es un hallazgo de prueba creado por el script de diagnóstico',
      origen: 'Sistema de Diagnóstico',
      categoria: 'Prueba Automatizada',
      requisitoIncumplido: 'Requisito de prueba',
      estado: 'd1_iniciado'
    };

    try {
      // Generar numeroHallazgo
      const lastHallazgoResult = await tursoClient.execute('SELECT numeroHallazgo FROM hallazgos ORDER BY id DESC LIMIT 1');
      let nextNumero = 'H-001';
      if (lastHallazgoResult.rows.length > 0 && lastHallazgoResult.rows[0].numeroHallazgo) {
        const lastNumero = lastHallazgoResult.rows[0].numeroHallazgo;
        const lastId = parseInt(lastNumero.split('-')[1], 10);
        nextNumero = `H-${(lastId + 1).toString().padStart(3, '0')}`;
      }
      console.log('   Número generado:', nextNumero);

      // Obtener orden
      const countResult = await tursoClient.execute('SELECT COUNT(*) as count FROM hallazgos');
      const newOrder = countResult.rows.length > 0 ? countResult.rows[0].count : 0;
      console.log('   Orden asignado:', newOrder);

      // Intentar inserción
      try {
        const insertResult = await tursoClient.execute({
          sql: `INSERT INTO hallazgos (numeroHallazgo, titulo, descripcion, origen, categoria, requisitoIncumplido, fechaRegistro, estado, orden) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
          args: [nextNumero, testData.titulo, testData.descripcion, testData.origen, testData.categoria, testData.requisitoIncumplido, new Date().toISOString(), testData.estado, newOrder],
        });
        console.log('✅ Inserción exitosa. ID:', insertResult.lastInsertRowid);
      } catch (error) {
        console.log('❌ Error en inserción:', error.message);
      }

    } catch (error) {
      console.log('❌ Error en proceso de inserción:', error.message);
    }

    // 6. VERIFICAR ESTADO FINAL
    console.log('\n📊 6. ESTADO FINAL DE LA BASE DE DATOS...');
    try {
      const finalCount = await tursoClient.execute('SELECT COUNT(*) as total FROM hallazgos');
      console.log('✅ Total final de registros:', finalCount.rows[0].total);
    } catch (error) {
      console.log('❌ Error al obtener conteo final:', error.message);
    }

  } catch (error) {
    console.log('💥 ERROR CRÍTICO EN EL DIAGNÓSTICO:', error.message);
  }
}

// EJECUTAR DIAGNÓSTICO
diagnosticar()
  .then(() => {
    console.log('\n🏁 DIAGNÓSTICO COMPLETADO.');
    console.log('📋 RESUMEN:');
    console.log('   - Si ves errores relacionados con "titulo", la columna no existe en la BD');
    console.log('   - Si las operaciones sin "titulo" funcionan, confirma que ese es el problema');
    console.log('   - Revisa los mensajes arriba para entender qué está funcionando y qué no');
    process.exit(0);
  })
  .catch((error) => {
    console.log('💥 ERROR FATAL:', error.message);
    process.exit(1);
  });
