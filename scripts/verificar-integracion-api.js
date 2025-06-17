// Script para verificar la integración entre los servicios frontend y las APIs backend

// Usamos import dinámico ya que estamos en un entorno Node.js
async function main() {
  try {
    const servicesModule = await import('../frontend/src/services/index.js');
    const services = servicesModule.default;

    // Iniciar la verificación
    console.log('=== VERIFICACIÓN DE INTEGRACIÓN API ===');
    console.log('Verificando la comunicación entre servicios frontend y APIs backend...\n');
    
    const resultados = {
      exitosos: 0,
      fallidos: 0,
      detalles: []
    };

    // Lista de servicios a probar
    const serviciosParaProbar = [
    { nombre: 'Departamentos', servicio: services.departamentos, metodo: 'getAll' },
    { nombre: 'Puestos', servicio: services.puestos, metodo: 'getAll' },
    { nombre: 'Personal', servicio: services.personal, metodo: 'getAllPersonal' },
    { nombre: 'Documentos', servicio: services.documentos, metodo: 'getAllDocumentos' },
    { nombre: 'Normas', servicio: services.normas, metodo: 'getAllNormas' },
    { nombre: 'Procesos', servicio: services.procesos, metodo: 'getAll' },
    { nombre: 'Objetivos de Calidad', servicio: services.objetivosCalidad, metodo: 'getAll' },
    { nombre: 'Indicadores', servicio: services.indicadores, metodo: 'getAll' },
    { nombre: 'Mediciones', servicio: services.mediciones, metodo: 'getAll' },
    { nombre: 'Mejoras', servicio: services.mejoras, metodo: 'getAll' },
    { nombre: 'Auditorías', servicio: services.auditorias, metodo: 'getAllAuditorias' },
    { nombre: 'Capacitaciones', servicio: services.capacitaciones, metodo: 'getAll' },
    { nombre: 'Evaluaciones', servicio: services.evaluaciones, metodo: 'getAll' },
    { nombre: 'Productos', servicio: services.productos, metodo: 'getAll' },
    { nombre: 'Encuestas', servicio: services.encuestas, metodo: 'getAll' },
    { nombre: 'Usuarios', servicio: services.usuarios, metodo: 'getAll' },
    { nombre: 'Tickets', servicio: services.tickets, metodo: 'getAll' }
  ];

    // Probar cada servicio
    for (const test of serviciosParaProbar) {
      try {
        console.log(`\nProbando servicio ${test.nombre}...`);
      
        if (!test.servicio) {
          console.log(`  ❌ Servicio no encontrado en el índice de servicios`);
          resultados.fallidos++;
          resultados.detalles.push({
            servicio: test.nombre,
            exito: false,
            error: 'Servicio no encontrado en el índice de servicios'
          });
          continue;
        }

        if (!test.servicio[test.metodo]) {
          console.log(`  ❌ Método ${test.metodo} no encontrado en el servicio`);
          resultados.fallidos++;
          resultados.detalles.push({
            servicio: test.nombre,
            exito: false,
            error: `Método ${test.metodo} no encontrado en el servicio`
          });
          continue;
        }

        console.log(`  Llamando a ${test.nombre}.${test.metodo}()`);
        const respuesta = await test.servicio[test.metodo]();
        
        if (respuesta) {
          console.log(`  ✅ Llamada exitosa`);
          if (Array.isArray(respuesta)) {
            console.log(`  📊 Recibidos ${respuesta.length} registros`);
          } else if (typeof respuesta === 'object') {
            console.log(`  📊 Recibido objeto de respuesta`);
          }
          resultados.exitosos++;
          resultados.detalles.push({
            servicio: test.nombre,
            exito: true
          });
        } else {
          console.log(`  ⚠️ Respuesta vacía o nula`);
          resultados.exitosos++; // Consideramos esto como éxito ya que la llamada no falló
          resultados.detalles.push({
            servicio: test.nombre,
            exito: true,
            advertencia: 'Respuesta vacía o nula'
          });
        }
      } catch (error) {
        console.log(`  ❌ Error al probar ${test.nombre}: ${error.message}`);
        resultados.fallidos++;
        resultados.detalles.push({
          servicio: test.nombre,
          exito: false,
          error: error.message
        });
      }
  }

  // Mostrar resumen
  console.log('\n=== RESUMEN DE PRUEBAS DE INTEGRACIÓN ===');
  console.log(`✅ Pruebas exitosas: ${resultados.exitosos}`);
  console.log(`❌ Pruebas fallidas: ${resultados.fallidos}`);
  console.log('=======================================');

  // Mostrar detalles de las pruebas fallidas
  if (resultados.fallidos > 0) {
    console.log('\nDETALLES DE PRUEBAS FALLIDAS:');
    const pruebasFallidas = resultados.detalles.filter(test => !test.exito);
    pruebasFallidas.forEach(test => {
      console.log(`- ${test.servicio}: ${test.error || 'Error desconocido'}`);
    });
  }

    // Mostrar resumen
    console.log('\n=== RESUMEN DE PRUEBAS DE INTEGRACIÓN ===');
    console.log(`✅ Pruebas exitosas: ${resultados.exitosos}`);
    console.log(`❌ Pruebas fallidas: ${resultados.fallidos}`);
    console.log('=======================================');

    // Mostrar detalles de las pruebas fallidas
    if (resultados.fallidos > 0) {
      console.log('\nDETALLES DE PRUEBAS FALLIDAS:');
      const pruebasFallidas = resultados.detalles.filter(test => !test.exito);
      pruebasFallidas.forEach(test => {
        console.log(`- ${test.servicio}: ${test.error || 'Error desconocido'}`);
      });
    }

    console.log('\nVerificación completada.');
    return resultados;
  } catch (error) {
    console.error('Error al importar los servicios:', error);
    return { exitosos: 0, fallidos: 1, detalles: [{ servicio: 'Importación', exito: false, error: error.message }] };
  }
}

// Ejecutar la función principal
main();
