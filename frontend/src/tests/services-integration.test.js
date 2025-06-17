// Tests de integración para verificar que los servicios frontend se comunican correctamente con el backend
import services from '../services';

// Función para ejecutar las pruebas de servicios
async function runServiceTests() {
  console.log('Iniciando pruebas de integración de servicios frontend...');
  console.log('=====================================================');
  
  const results = {
    passed: 0,
    failed: 0,
    details: []
  };

  // Lista de servicios a probar
  const serviceTests = [
    { name: 'Departamentos', service: services.departamentos, method: 'getAll' },
    { name: 'Puestos', service: services.puestos, method: 'getAll' },
    { name: 'Personal', service: services.personal, method: 'getAllPersonal' },
    { name: 'Auditorías', service: services.auditorias, method: 'getAllAuditorias' },
    { name: 'Indicadores', service: services.indicadores, method: 'getAll' },
    { name: 'Mediciones', service: services.mediciones, method: 'getAll' },
    { name: 'Mejoras', service: services.mejoras, method: 'getAll' },
    { name: 'Capacitaciones', service: services.capacitaciones, method: 'getAll' },
    { name: 'Evaluaciones', service: services.evaluaciones, method: 'getAll' },
    { name: 'Productos', service: services.productos, method: 'getAll' },
    { name: 'Encuestas', service: services.encuestas, method: 'getAll' },
    { name: 'Usuarios', service: services.usuarios, method: 'getAll' },
    { name: 'Tickets', service: services.tickets, method: 'getAll' }
  ];

  // Probar cada servicio
  for (const test of serviceTests) {
    try {
      console.log(`\nProbando servicio ${test.name}...`);
      
      if (!test.service) {
        console.log(`  ❌ Servicio no encontrado en el índice de servicios`);
        results.failed++;
        results.details.push({
          service: test.name,
          success: false,
          error: 'Servicio no encontrado en el índice de servicios'
        });
        continue;
      }

      if (!test.service[test.method]) {
        console.log(`  ❌ Método ${test.method} no encontrado en el servicio`);
        results.failed++;
        results.details.push({
          service: test.name,
          success: false,
          error: `Método ${test.method} no encontrado en el servicio`
        });
        continue;
      }

      console.log(`  Llamando a ${test.name}.${test.method}()`);
      const response = await test.service[test.method]();
      
      if (response) {
        console.log(`  ✅ Llamada exitosa`);
        if (Array.isArray(response)) {
          console.log(`  📊 Recibidos ${response.length} registros`);
        } else if (typeof response === 'object') {
          console.log(`  📊 Recibido objeto de respuesta`);
        }
        results.passed++;
        results.details.push({
          service: test.name,
          success: true
        });
      } else {
        console.log(`  ⚠️ Respuesta vacía o nula`);
        results.passed++; // Consideramos esto como éxito ya que la llamada no falló
        results.details.push({
          service: test.name,
          success: true,
          warning: 'Respuesta vacía o nula'
        });
      }
    } catch (error) {
      console.log(`  ❌ Error al probar ${test.name}: ${error.message}`);
      results.failed++;
      results.details.push({
        service: test.name,
        success: false,
        error: error.message
      });
    }
  }

  // Mostrar resumen
  console.log('\n=====================================================');
  console.log('RESUMEN DE PRUEBAS DE SERVICIOS:');
  console.log(`✅ Pruebas exitosas: ${results.passed}`);
  console.log(`❌ Pruebas fallidas: ${results.failed}`);
  console.log('=====================================================');

  // Mostrar detalles de las pruebas fallidas
  if (results.failed > 0) {
    console.log('\nDETALLES DE PRUEBAS FALLIDAS:');
    const failedTests = results.details.filter(test => !test.success);
    failedTests.forEach(test => {
      console.log(`- ${test.service}: ${test.error || 'Error desconocido'}`);
    });
  }

  return results;
}

// Ejecutar las pruebas si este archivo se ejecuta directamente
if (typeof window !== 'undefined') {
  // En entorno de navegador, exponer la función para ejecutarla desde la consola
  window.runServiceTests = runServiceTests;
  console.log('Función de prueba disponible como window.runServiceTests()');
}

export default runServiceTests;
