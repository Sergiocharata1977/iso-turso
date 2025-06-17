// Script para probar diferentes combinaciones de autenticación
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3002/api';

// Lista de credenciales a probar
const testCredentials = [
  // Formato: { username, password, description }
  { username: 'admin@isoflow.com', password: 'admin123', description: 'Admin con email como username' },
  { username: 'admin', password: 'admin123', description: 'Admin con username directo' },
  { username: 'usuario@isoflow.com', password: 'usuario123', description: 'Usuario con email como username' },
  { username: 'usuario', password: 'usuario123', description: 'Usuario con username directo' }
];

// Función para probar login
async function testLogin(credentials) {
  console.log(`\nProbando: ${credentials.description}`);
  console.log(`Username: ${credentials.username}`);
  console.log(`Password: ${credentials.password}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      })
    });
    
    const data = await response.text();
    const statusCode = response.status;
    
    console.log(`Estado: ${statusCode}`);
    console.log(`Respuesta: ${data}`);
    
    if (statusCode === 200) {
      console.log('✅ LOGIN EXITOSO');
      return true;
    } else {
      console.log('❌ LOGIN FALLIDO');
      return false;
    }
  } catch (error) {
    console.error(`Error de conexión: ${error.message}`);
    return false;
  }
}

// Ejecutar pruebas
async function runTests() {
  console.log('==== INICIANDO PRUEBAS DE AUTENTICACIÓN ====');
  
  let successfulLogin = false;
  
  for (const cred of testCredentials) {
    const success = await testLogin(cred);
    if (success) {
      successfulLogin = true;
      console.log(`\n¡CREDENCIALES CORRECTAS ENCONTRADAS!`);
      console.log(`Username: ${cred.username}`);
      console.log(`Password: ${cred.password}`);
      break;
    }
  }
  
  if (!successfulLogin) {
    console.log('\n❌ NO SE ENCONTRARON CREDENCIALES VÁLIDAS');
    console.log('Posibles problemas:');
    console.log('1. El servidor backend no está corriendo');
    console.log('2. Las credenciales por defecto han sido modificadas');
    console.log('3. No hay usuarios en la base de datos');
    console.log('4. La tabla usuarios no existe o tiene estructura diferente');
  }
  
  console.log('\n==== FIN DE PRUEBAS ====');
}

runTests();
