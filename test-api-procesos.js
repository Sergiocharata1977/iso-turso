/**
 * 🧪 TEST: API de procesos - Identificar error 500
 */

import fetch from 'node-fetch';

// Configuración
const API_BASE = 'http://localhost:5000';
const TEST_USER = {
  email: 'admin@demo.com',
  password: 'admin123'
};

/**
 * 🔑 Hacer login y obtener token
 */
async function login() {
  console.log('🔑 Haciendo login...');
  
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(TEST_USER)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login exitoso');
      console.log('   - Usuario:', data.user?.name);
      console.log('   - Rol:', data.user?.role);
      console.log('   - Organization ID:', data.user?.organization_id);
      return data.token;
    } else {
      console.log('❌ Error en login:', data);
      return null;
    }
  } catch (error) {
    console.log('❌ Error de conexión en login:', error.message);
    return null;
  }
}

/**
 * 🧪 Probar creación de proceso
 */
async function testCreateProceso(token) {
  console.log('\n🧪 Probando creación de proceso...');
  
  const procesoTest = {
    nombre: 'Proceso API Test',
    responsable: 'Admin API',
    descripcion: 'Proceso de prueba desde API'
  };
  
  console.log('📋 Datos a enviar:', procesoTest);
  
  try {
    const response = await fetch(`${API_BASE}/api/procesos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(procesoTest)
    });
    
    console.log('📊 Status Code:', response.status);
    console.log('📊 Status Text:', response.statusText);
    
    // Obtener respuesta (tanto si es exitosa como si hay error)
    const data = await response.text();
    
    if (response.ok) {
      console.log('✅ Proceso creado exitosamente');
      console.log('📄 Respuesta:', data);
      return JSON.parse(data);
    } else {
      console.log('❌ Error en creación de proceso');
      console.log('📄 Respuesta de error:', data);
      
      // Intentar parsear como JSON si es posible
      try {
        const errorJson = JSON.parse(data);
        console.log('🔍 Error parseado:', errorJson);
      } catch (e) {
        console.log('🔍 Error como texto plano:', data);
      }
      
      return null;
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    return null;
  }
}

/**
 * 🔍 Probar listado de procesos
 */
async function testListProcesos(token) {
  console.log('\n🔍 Probando listado de procesos...');
  
  try {
    const response = await fetch(`${API_BASE}/api/procesos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📊 Status Code:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Listado exitoso');
      console.log(`📊 Procesos encontrados: ${data.length}`);
      
      if (data.length > 0) {
        console.log('📋 Primer proceso:', data[0]);
      }
      return data;
    } else {
      const errorData = await response.text();
      console.log('❌ Error en listado:', errorData);
      return null;
    }
  } catch (error) {
    console.log('❌ Error de conexión en listado:', error.message);
    return null;
  }
}

/**
 * 🚀 Función principal
 */
async function main() {
  console.log('🚀 INICIANDO PRUEBAS DE API DE PROCESOS\n');
  
  try {
    // 1. Login
    const token = await login();
    if (!token) {
      console.log('💥 No se pudo obtener token, abortando...');
      return;
    }
    
    // 2. Probar listado (GET)
    const procesos = await testListProcesos(token);
    
    // 3. Probar creación (POST) - aquí debería estar el error
    const nuevoProceso = await testCreateProceso(token);
    
    // 4. Resumen
    console.log('\n' + '='.repeat(50));
    console.log('📋 RESUMEN DE PRUEBAS');
    console.log('='.repeat(50));
    
    console.log('🔑 Login:', token ? '✅ OK' : '❌ FALLÓ');
    console.log('📋 Listado:', procesos !== null ? '✅ OK' : '❌ FALLÓ');
    console.log('➕ Creación:', nuevoProceso !== null ? '✅ OK' : '❌ FALLÓ');
    
    if (!nuevoProceso) {
      console.log('\n🚨 PROBLEMA IDENTIFICADO: Error en POST /api/procesos');
      console.log('🔧 Revisar logs del servidor para más detalles');
    }
    
  } catch (error) {
    console.log('💥 Error general en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(() => {
    console.log('\n✅ Pruebas completadas');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Error en pruebas:', error);
    process.exit(1);
  });
}

export { login, testCreateProceso, testListProcesos }; 