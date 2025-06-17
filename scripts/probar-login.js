// Script para probar el login con las credenciales actualizadas
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// URL base de la API
const API_BASE_URL = process.env.API_URL || 'http://localhost:3002/api';

// Credenciales para probar
const credenciales = [
  { 
    email: 'admin@isoflow.com', 
    password: 'admin123',
    descripcion: 'Administrador'
  },
  { 
    email: 'juan@isoflow.com', 
    password: 'isoflow123',
    descripcion: 'Usuario regular'
  },
  { 
    email: 'maria@isoflow.com', 
    password: 'isoflow123',
    descripcion: 'Supervisor'
  }
];

// Función para timeout en peticiones
const fetchWithTimeout = async (url, options, timeout = 5000) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);
  
  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Función principal
async function probarLogin() {
  console.log('=== PRUEBA DE SISTEMA DE AUTENTICACIÓN ===');
  
  try {
    // 1. Verificar conexión con el backend
    console.log('\nPASO 1: Verificando conexión con el backend...');
    try {
      const respuesta = await fetchWithTimeout(`${API_BASE_URL}/health`, {
        method: 'GET'
      });
      
      if (respuesta.ok) {
        console.log('✅ Conexión exitosa con el backend');
      } else {
        console.log(`❌ Error al conectar con el backend: ${respuesta.status} ${respuesta.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Error de conexión: ${error.message}`);
      if (error.message.includes('ECONNREFUSED')) {
        console.log('💡 Asegúrate de que el backend esté en ejecución en el puerto 3002');
      }
    }
    
    // 2. Probar login con cada set de credenciales
    console.log('\nPASO 2: Probando login con las credenciales...');
    
    for (const credencial of credenciales) {
      console.log(`\nProbando login para: ${credencial.descripcion} (${credencial.email})`);
      console.log(`Enviando petición POST a ${API_BASE_URL}/auth/login`);
      
      try {
        const respLogin = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            email: credencial.email, 
            password: credencial.password 
          })
        });
        
        const dataLogin = await respLogin.json();
        
        if (respLogin.ok) {
          console.log('✅ Login exitoso!');
          console.log('📄 Datos del usuario:');
          console.log(`   Nombre: ${dataLogin.usuario.nombre}`);
          console.log(`   Email: ${dataLogin.usuario.email}`);
          console.log(`   Rol: ${dataLogin.usuario.role}`);
          console.log('🔑 Token JWT recibido');
          
          // Guardar token para pruebas posteriores
          const token = dataLogin.token;
          
          // Probar el endpoint protegido de perfil
          console.log('\nProbando acceso a endpoint protegido /auth/profile');
          const respProfile = await fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (respProfile.ok) {
            const profileData = await respProfile.json();
            console.log('✅ Acceso a perfil exitoso!');
            console.log(`   Perfil de: ${profileData.usuario.nombre}`);
          } else {
            const errorData = await respProfile.json();
            console.log(`❌ Error al acceder al perfil: ${respProfile.status} ${respProfile.statusText}`);
            console.log(`   Mensaje: ${errorData.error}`);
          }
        } else {
          console.log(`❌ Error en login: ${respLogin.status} ${respLogin.statusText}`);
          console.log(`   Mensaje: ${dataLogin.error}`);
        }
      } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error general en las pruebas:', error);
  }
}

// Ejecutar prueba
console.log('Iniciando pruebas de autenticación...');
probarLogin().then(() => {
  console.log('\nPruebas de autenticación completadas.');
  process.exit(0);
}).catch(error => {
  console.error('Error en el proceso de prueba:', error);
  process.exit(1);
});
