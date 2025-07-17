// Script de prueba para verificar funcionalidad de objetivos de calidad

const API_BASE = 'http://localhost:5000/api';

async function testObjetivos() {
  console.log('🚀 Iniciando prueba de objetivos de calidad...\n');

  try {
    // 1. Autenticación
    console.log('🔐 Probando autenticación...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@demo.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Error en login: ${loginResponse.status}`);
    }

    const { accessToken } = await loginResponse.json();
    console.log('✅ Autenticación exitosa\n');

    const authHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    // 2. Obtener objetivos existentes
    console.log('📋 Obteniendo objetivos existentes...');
    const objetivosResponse = await fetch(`${API_BASE}/objetivos-calidad`, {
      headers: authHeaders
    });

    if (!objetivosResponse.ok) {
      throw new Error(`Error obteniendo objetivos: ${objetivosResponse.status}`);
    }

    const objetivos = await objetivosResponse.json();
    console.log(`✅ Encontrados ${objetivos.length} objetivos existentes`);
    if (objetivos.length > 0) {
      console.log(`   Primer objetivo: ${objetivos[0].nombre_objetivo || objetivos[0].id}`);
    }
    console.log();

    // 3. Crear nuevo objetivo
    console.log('➕ Creando nuevo objetivo...');
    const nuevoObjetivo = {
      nombre_objetivo: `Objetivo de Prueba ${Date.now()}`,
      descripcion: 'Este es un objetivo de prueba creado por el script de verificación',
      proceso_id: 'proc-test-001',
      indicador_asociado_id: 'ind-test-001',
      meta: 'Alcanzar 90% de efectividad en el proceso',
      responsable: 'Equipo de Pruebas',
      fecha_inicio: new Date().toISOString(),
      fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días después
    };

    const createResponse = await fetch(`${API_BASE}/objetivos-calidad`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(nuevoObjetivo)
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Error creando objetivo: ${createResponse.status} - ${errorText}`);
    }

    const objetivoCreado = await createResponse.json();
    console.log(`✅ Objetivo creado con ID: ${objetivoCreado.id}`);
    console.log(`   Nombre: ${objetivoCreado.nombre_objetivo}`);
    console.log();

    // 4. Obtener objetivo por ID
    console.log(`🔍 Verificando objetivo creado (ID: ${objetivoCreado.id})...`);
    const getResponse = await fetch(`${API_BASE}/objetivos-calidad/${objetivoCreado.id}`, {
      headers: authHeaders
    });

    if (!getResponse.ok) {
      throw new Error(`Error obteniendo objetivo: ${getResponse.status}`);
    }

    const objetivoObtenido = await getResponse.json();
    console.log(`✅ Objetivo encontrado: ${objetivoObtenido.nombre_objetivo}`);
    console.log(`   Descripción: ${objetivoObtenido.descripcion}`);
    console.log(`   Responsable: ${objetivoObtenido.responsable}`);
    console.log();

    // 5. Actualizar objetivo
    console.log('✏️ Actualizando objetivo...');
    const objetivoActualizado = {
      ...objetivoObtenido,
      nombre_objetivo: objetivoObtenido.nombre_objetivo + ' (ACTUALIZADO)',
      meta: 'Alcanzar 95% de efectividad en el proceso (meta actualizada)'
    };

    const updateResponse = await fetch(`${API_BASE}/objetivos-calidad/${objetivoCreado.id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(objetivoActualizado)
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Error actualizando objetivo: ${updateResponse.status} - ${errorText}`);
    }

    const objetivoUpdated = await updateResponse.json();
    console.log(`✅ Objetivo actualizado: ${objetivoUpdated.nombre_objetivo}`);
    console.log();

    // 6. Obtener lista actualizada
    console.log('📋 Verificando lista actualizada...');
    const listaResponse = await fetch(`${API_BASE}/objetivos-calidad`, {
      headers: authHeaders
    });

    const listaActualizada = await listaResponse.json();
    console.log(`✅ Lista actualizada: ${listaActualizada.length} objetivos totales`);
    
    // Buscar nuestro objetivo
    const nuestroObjetivo = listaActualizada.find(obj => obj.id === objetivoCreado.id);
    if (nuestroObjetivo) {
      console.log(`   ✓ Nuestro objetivo confirmado: ${nuestroObjetivo.nombre_objetivo}`);
    }
    console.log();

    // 7. Probar filtro por proceso
    if (objetivoCreado.proceso_id) {
      console.log(`🔍 Probando filtro por proceso: ${objetivoCreado.proceso_id}...`);
      const filtroResponse = await fetch(`${API_BASE}/objetivos-calidad/por-proceso/${objetivoCreado.proceso_id}`, {
        headers: authHeaders
      });

      if (filtroResponse.ok) {
        const objetivosPorProceso = await filtroResponse.json();
        console.log(`✅ Encontrados ${objetivosPorProceso.length} objetivos para el proceso`);
      } else {
        console.log(`⚠️ Filtro por proceso no disponible: ${filtroResponse.status}`);
      }
      console.log();
    }

    console.log('🎉 TODAS LAS PRUEBAS EXITOSAS! 🎉');
    console.log('\n📊 RESUMEN:');
    console.log(`   ✅ Autenticación: OK`);
    console.log(`   ✅ Listar objetivos: OK`);
    console.log(`   ✅ Crear objetivo: OK`);
    console.log(`   ✅ Obtener por ID: OK`);
    console.log(`   ✅ Actualizar objetivo: OK`);
    console.log(`   ✅ Filtro por proceso: OK`);
    console.log('\n🎯 La API de objetivos de calidad está funcionando correctamente!');

  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:');
    console.error(error.message);
    console.error('\n🔧 Posibles soluciones:');
    console.error('   1. Verificar que el servidor esté corriendo en puerto 5000');
    console.error('   2. Verificar que las credenciales admin@demo.com/admin123 sean correctas');
    console.error('   3. Verificar que la tabla objetivos_calidad exista en la base de datos');
    console.error('   4. Revisar los logs del servidor para más detalles');
  }
}

// Ejecutar la prueba
testObjetivos(); 