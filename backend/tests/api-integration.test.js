// Tests de integración para verificar que todas las rutas API funcionan correctamente
import axios from 'axios';

// URL base para las pruebas
const API_URL = 'http://localhost:3002';

// Función auxiliar para realizar solicitudes HTTP
const api = {
  get: async (endpoint) => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status 
      };
    }
  },
  post: async (endpoint, data) => {
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, data);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status 
      };
    }
  }
};

// Función para ejecutar las pruebas
async function runTests() {
  console.log('Iniciando pruebas de integración API...');
  console.log('=====================================');
  
  // Lista de todos los endpoints a probar
  const endpoints = [
    { name: 'Departamentos', path: '/api/departamentos' },
    { name: 'Puestos', path: '/api/puestos' },
    { name: 'Personal', path: '/api/personal' },
    { name: 'Documentos', path: '/api/documentos' },
    { name: 'Normas', path: '/api/normas' },
    { name: 'Procesos', path: '/api/procesos' },
    { name: 'Objetivos de Calidad', path: '/api/objetivos_calidad' },
    { name: 'Indicadores', path: '/api/indicadores' },
    { name: 'Mediciones', path: '/api/mediciones' },
    { name: 'Mejoras', path: '/api/mejoras' },
    { name: 'Auditorías', path: '/api/auditorias' },
    { name: 'Capacitaciones', path: '/api/capacitaciones' },
    { name: 'Evaluaciones', path: '/api/evaluaciones' },
    { name: 'Productos', path: '/api/productos' },
    { name: 'Encuestas', path: '/api/encuestas' },
    { name: 'Usuarios', path: '/api/usuarios' },
    { name: 'Tickets', path: '/api/tickets' }
  ];

  const results = {
    passed: 0,
    failed: 0,
    details: []
  };

  // Probar cada endpoint
  for (const endpoint of endpoints) {
    try {
      console.log(`\nProbando ${endpoint.name}...`);
      
      // Probar GET (listar todos)
      console.log(`  GET ${endpoint.path}`);
      const getResponse = await api.get(endpoint.path);
      
      if (getResponse.success) {
        console.log(`  ✅ GET exitoso (status: ${getResponse.status})`);
        if (Array.isArray(getResponse.data)) {
          console.log(`  📊 Recibidos ${getResponse.data.length} registros`);
        }
        results.passed++;
        results.details.push({
          endpoint: endpoint.name,
          operation: 'GET',
          success: true,
          status: getResponse.status
        });
      } else {
        console.log(`  ❌ GET fallido (status: ${getResponse.status})`);
        console.log(`  Error: ${JSON.stringify(getResponse.error)}`);
        results.failed++;
        results.details.push({
          endpoint: endpoint.name,
          operation: 'GET',
          success: false,
          status: getResponse.status,
          error: getResponse.error
        });
      }
    } catch (error) {
      console.log(`  ❌ Error al probar ${endpoint.name}: ${error.message}`);
      results.failed++;
      results.details.push({
        endpoint: endpoint.name,
        operation: 'GET',
        success: false,
        error: error.message
      });
    }
  }

  // Mostrar resumen
  console.log('\n=====================================');
  console.log('RESUMEN DE PRUEBAS:');
  console.log(`✅ Pruebas exitosas: ${results.passed}`);
  console.log(`❌ Pruebas fallidas: ${results.failed}`);
  console.log('=====================================');

  // Mostrar detalles de las pruebas fallidas
  if (results.failed > 0) {
    console.log('\nDETALLES DE PRUEBAS FALLIDAS:');
    const failedTests = results.details.filter(test => !test.success);
    failedTests.forEach(test => {
      console.log(`- ${test.endpoint} (${test.operation}): ${test.error || 'Error desconocido'}`);
    });
  }

  return results;
}

// Ejecutar las pruebas si este archivo se ejecuta directamente
if (require.main === module) {
  runTests()
    .then(() => console.log('Pruebas completadas.'))
    .catch(error => console.error('Error al ejecutar las pruebas:', error));
}

export default runTests;
