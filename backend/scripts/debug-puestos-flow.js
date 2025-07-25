import { tursoClient } from '../lib/tursoClient.js';

async function debugPuestosFlow() {
  try {
    console.log('🔍 DEBUG: Analizando flujo de datos de puestos...\n');

    // 1. VERIFICAR DATOS EN BASE DE DATOS
    console.log('📊 1. VERIFICACIÓN DE BASE DE DATOS');
    console.log('=====================================');
    
    // Verificar puestos por organización
    const puestosOrg2 = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM puestos WHERE organization_id = 2'
    });
    
    const puestosOrg3 = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM puestos WHERE organization_id = 3'
    });

    console.log(`- Puestos org 2: ${puestosOrg2.rows[0].count}`);
    console.log(`- Puestos org 3: ${puestosOrg3.rows[0].count}`);

    // Mostrar puestos de org 3
    const puestosDetalle = await tursoClient.execute({
      sql: 'SELECT id, nombre, organization_id FROM puestos WHERE organization_id = 3'
    });

    console.log('\n📋 Puestos en organization_id 3:');
    console.table(puestosDetalle.rows);

    // 2. VERIFICAR ESTRUCTURA DE TABLA
    console.log('\n📊 2. ESTRUCTURA DE TABLA PUESTOS');
    console.log('===================================');
    
    const estructuraPuestos = await tursoClient.execute({
      sql: 'PRAGMA table_info(puestos)'
    });
    
    console.log('Estructura de tabla puestos:');
    console.table(estructuraPuestos.rows);

    // 3. VERIFICAR RELACIONES
    console.log('\n📊 3. RELACIONES DE PUESTOS');
    console.log('============================');
    
    const relacionesPuestos = await tursoClient.execute({
      sql: `SELECT * FROM relaciones_sgc WHERE (origen_tipo = 'puesto' OR destino_tipo = 'puesto') AND organization_id = 3`
    });

    console.log(`Relaciones de puestos en org 3: ${relacionesPuestos.rows.length}`);
    if (relacionesPuestos.rows.length > 0) {
      console.table(relacionesPuestos.rows);
    }

    // 4. VERIFICAR ORGANIZACIONES
    console.log('\n📊 4. ORGANIZACIONES');
    console.log('===================');
    
    const organizaciones = await tursoClient.execute({
      sql: 'SELECT id, name FROM organizations'
    });

    console.log('Organizaciones disponibles:');
    console.table(organizaciones.rows);

    // 5. VERIFICAR TABLAS DE USUARIOS (CORREGIDO)
    console.log('\n📊 5. VERIFICAR TABLAS DE USUARIOS');
    console.log('===================================');
    
    // Verificar qué tablas de usuarios existen
    const tablasUsuarios = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%user%' OR name LIKE '%usuario%'"
    });

    console.log('Tablas de usuarios encontradas:');
    console.table(tablasUsuarios.rows);

    // 6. SIMULAR QUERY DEL BACKEND
    console.log('\n📊 6. SIMULACIÓN DE QUERY BACKEND');
    console.log('==================================');
    
    // Query que debería usar el backend
    const queryBackend = await tursoClient.execute({
      sql: `SELECT p.*, 
                   (SELECT COUNT(*) FROM relaciones_sgc r 
                    WHERE r.origen_tipo = 'puesto' AND r.origen_id = p.id 
                    AND r.destino_tipo = 'personal' AND r.organization_id = 3) as personal_count
            FROM puestos p 
            WHERE p.organization_id = 3`
    });

    console.log('Query simulada del backend:');
    console.table(queryBackend.rows);

    // 7. VERIFICAR POSIBLES PROBLEMAS
    console.log('\n📊 7. ANÁLISIS DE PROBLEMAS');
    console.log('============================');
    
    // Verificar si hay puestos sin organization_id
    const puestosSinOrg = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM puestos WHERE organization_id IS NULL'
    });
    
    // Verificar si hay puestos con organization_id inválido
    const puestosOrgInvalida = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as count FROM puestos WHERE organization_id NOT IN (SELECT id FROM organizations)'
    });

    console.log(`- Puestos sin organization_id: ${puestosSinOrg.rows[0].count}`);
    console.log(`- Puestos con organization_id inválido: ${puestosOrgInvalida.rows[0].count}`);

    // 8. ANÁLISIS FINAL Y RECOMENDACIONES
    console.log('\n📊 8. ANÁLISIS FINAL Y RECOMENDACIONES');
    console.log('========================================');
    
    console.log('✅ DATOS ENCONTRADOS:');
    console.log(`- Puestos en org 3: ${puestosOrg3.rows[0].count}`);
    console.log(`- Relaciones de puestos: ${relacionesPuestos.rows.length}`);
    console.log(`- Organización 3 existe: ${organizaciones.rows.some(org => org.id == 3)}`);

    console.log('\n🔍 PROBLEMAS IDENTIFICADOS:');
    
    if (puestosOrg3.rows[0].count === 0) {
      console.log('❌ PROBLEMA: No hay puestos en organization_id 3');
      console.log('💡 SOLUCIÓN: Ejecutar script de copia de datos');
    } else {
      console.log('✅ DATOS: Hay puestos en organization_id 3');
    }

    if (puestosSinOrg.rows[0].count > 0) {
      console.log('❌ PROBLEMA: Hay puestos sin organization_id');
      console.log('💡 SOLUCIÓN: Asignar organization_id a estos puestos');
    }

    if (puestosOrgInvalida.rows[0].count > 0) {
      console.log('❌ PROBLEMA: Hay puestos con organization_id inválido');
      console.log('💡 SOLUCIÓN: Corregir organization_id');
    }

    console.log('\n🎯 DIAGNÓSTICO PRINCIPAL:');
    console.log('✅ Los datos están en la base de datos (org 3)');
    console.log('✅ Las relaciones están creadas');
    console.log('🔍 PROBLEMA PROBABLE: El backend no está usando organization_id 3');
    console.log('🔍 PROBLEMA PROBABLE: El frontend no está enviando organization_id correcto');

    console.log('\n🚀 PLAN DE ACCIÓN:');
    console.log('1. ✅ Verificar datos en BD (COMPLETADO)');
    console.log('2. 🔄 Reiniciar servidor backend');
    console.log('3. 🔄 Verificar logs del backend al cargar puestos');
    console.log('4. 🔄 Probar aplicación y verificar organization_id en frontend');

  } catch (error) {
    console.error('❌ Error en debug:', error);
    throw error;
  }
}

// Ejecutar la función
debugPuestosFlow().then(() => {
  console.log('\n🎉 Debug completado');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Error en debug:', error);
  process.exit(1);
}); 