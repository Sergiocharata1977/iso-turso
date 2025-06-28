/**
 * Script de Prueba de Rutas API
 * Prueba las rutas de hallazgos directamente haciendo peticiones HTTP
 */

console.log('🚀 INICIANDO PRUEBA DE RUTAS API DE HALLAZGOS...\n');

const API_BASE = 'http://localhost:5000/api/hallazgos';

async function testApiRoutes() {
  try {
    
    // 1. PROBAR GET - Obtener todos los hallazgos
    console.log('📋 1. PROBANDO GET /api/hallazgos/ (obtener todos)...');
    try {
      const getResponse = await fetch(API_BASE + '/');
      console.log('   Status:', getResponse.status, getResponse.statusText);
      
      if (getResponse.ok) {
        const data = await getResponse.json();
        console.log('✅ GET exitoso. Hallazgos encontrados:', data.length);
        if (data.length > 0) {
          console.log('   Primer hallazgo:', data[0]);
        }
      } else {
        const errorData = await getResponse.text();
        console.log('❌ GET falló. Error:', errorData);
      }
    } catch (error) {
      console.log('❌ Error en GET:', error.message);
    }

    // 2. PROBAR POST - Crear nuevo hallazgo
    console.log('\n➕ 2. PROBANDO POST /api/hallazgos/ (crear nuevo)...');
    
    const testHallazgo = {
      titulo: 'Hallazgo API Test ' + Date.now(),
      descripcion: 'Descripción de prueba desde script de diagnóstico de API',
      origen: 'Prueba API',
      categoria: 'Test Automatizado',
      requisitoIncumplido: 'Requisito de prueba API',
      estado: 'd1_iniciado'
    };

    try {
      const postResponse = await fetch(API_BASE + '/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testHallazgo)
      });

      console.log('   Status:', postResponse.status, postResponse.statusText);
      
      if (postResponse.ok) {
        const newHallazgo = await postResponse.json();
        console.log('✅ POST exitoso. Nuevo hallazgo creado:');
        console.log('   ID:', newHallazgo.id);
        console.log('   Código:', newHallazgo.codigo);
        console.log('   Título:', newHallazgo.titulo);
        
        // 3. PROBAR GET individual - Obtener el hallazgo recién creado
        console.log('\n🔍 3. PROBANDO GET individual del hallazgo recién creado...');
        try {
          const getIndividualResponse = await fetch(API_BASE + '/' + newHallazgo.id);
          console.log('   Status:', getIndividualResponse.status, getIndividualResponse.statusText);
          
          if (getIndividualResponse.ok) {
            const individualData = await getIndividualResponse.json();
            console.log('✅ GET individual exitoso:', individualData);
          } else {
            const errorData = await getIndividualResponse.text();
            console.log('❌ GET individual falló:', errorData);
          }
        } catch (error) {
          console.log('❌ Error en GET individual:', error.message);
        }

      } else {
        const errorData = await postResponse.text();
        console.log('❌ POST falló. Error:', errorData);
        
        // PROBAR POST SIN TITULO
        console.log('\n🔄 Probando POST sin campo "titulo"...');
        const testHallazgoSinTitulo = {
          descripcion: 'Descripción de prueba SIN titulo desde script de diagnóstico',
          origen: 'Prueba API Sin Titulo',
          categoria: 'Test Sin Titulo',
          estado: 'd1_iniciado'
        };

        try {
          const postSinTituloResponse = await fetch(API_BASE + '/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(testHallazgoSinTitulo)
          });

          console.log('   Status sin titulo:', postSinTituloResponse.status, postSinTituloResponse.statusText);
          
          if (postSinTituloResponse.ok) {
            const newHallazgoSinTitulo = await postSinTituloResponse.json();
            console.log('✅ POST sin titulo exitoso:', newHallazgoSinTitulo);
          } else {
            const errorDataSinTitulo = await postSinTituloResponse.text();
            console.log('❌ POST sin titulo también falló:', errorDataSinTitulo);
          }
        } catch (error) {
          console.log('❌ Error en POST sin titulo:', error.message);
        }
      }
    } catch (error) {
      console.log('❌ Error en POST:', error.message);
    }

    // 4. VERIFICAR ESTADO FINAL
    console.log('\n📊 4. VERIFICACIÓN FINAL - Contar todos los hallazgos...');
    try {
      const finalGetResponse = await fetch(API_BASE + '/');
      if (finalGetResponse.ok) {
        const finalData = await finalGetResponse.json();
        console.log('✅ Total final de hallazgos en la API:', finalData.length);
      } else {
        console.log('❌ No se pudo obtener el conteo final');
      }
    } catch (error) {
      console.log('❌ Error en verificación final:', error.message);
    }

  } catch (error) {
    console.log('💥 ERROR CRÍTICO EN PRUEBA DE API:', error.message);
  }
}

// EJECUTAR PRUEBAS
testApiRoutes()
  .then(() => {
    console.log('\n🏁 PRUEBA DE API COMPLETADA.');
    console.log('📋 ANALIZA LOS RESULTADOS ARRIBA PARA IDENTIFICAR EL PROBLEMA:');
    console.log('   - Status 500 = Error interno en el servidor (problema en backend/BD)');
    console.log('   - Status 400 = Datos mal formateados o campos faltantes');
    console.log('   - Status 200/201 = Operación exitosa');
    console.log('   - Si funciona sin "titulo" pero no con "titulo" = Columna faltante en BD');
    process.exit(0);
  })
  .catch((error) => {
    console.log('💥 ERROR FATAL EN PRUEBA DE API:', error.message);
    process.exit(1);
  });
