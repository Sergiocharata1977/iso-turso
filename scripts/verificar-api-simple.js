// Script para verificar específicamente el sistema de login con TursoDB
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const API_BASE_URL = 'http://localhost:3002/api';
const TIMEOUT_MS = 3000; // 3 segundos de timeout para cada llamada

// Helper para hacer fetch con timeout
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error(`La solicitud a ${url} excedió el tiempo límite de ${TIMEOUT_MS}ms`);
    }
    throw error;
  }
}

async function main() {
  try {
    console.log('=== VERIFICACIÓN DEL SISTEMA DE LOGIN ===');
    console.log('Diagnóstico detallado del sistema de autenticación\n');

    // ========== PASO 1: VERIFICAR CONEXIÓN A API ==========
    console.log('PASO 1: Verificando conexión básica al API...');
    try {
      // Primero verificar si el servidor está activo
      console.log(`   Intentando conectar con el servidor en http://localhost:3002`);
      const respuestaRaiz = await fetchWithTimeout('http://localhost:3002');
      
      if (respuestaRaiz.ok) {
        const texto = await respuestaRaiz.text();
        console.log(`✅ Conexión básica al API exitosa: ${texto}`);
      } else {
        console.error(`❌ Error al conectar con el API: ${respuestaRaiz.status} ${respuestaRaiz.statusText}`);
        throw new Error('No se pudo establecer conexión con el servidor. Verifique que esté en ejecución.');
      }
    } catch (error) {
      console.error(`❌ Error de conexión con el API: ${error.message}`);
      console.log('   Asegúrese de que el servidor backend esté en ejecución en el puerto 3002');
      process.exit(1); // Terminar el script si no hay conexión con el API
    }
    console.log();

    // ========== PASO 2: VERIFICAR ENDPOINT DE USUARIOS ==========
    console.log('PASO 2: Verificando endpoint /usuarios...');
    try {
      const respuestaUsuarios = await fetchWithTimeout(`${API_BASE_URL}/usuarios`);
      if (respuestaUsuarios.ok) {
        const usuarios = await respuestaUsuarios.json();
        console.log(`✅ Endpoint /usuarios funciona. Hay ${usuarios.length} usuarios registrados.`);
      } else {
        console.error(`❌ Error al consultar /usuarios: ${respuestaUsuarios.status} ${respuestaUsuarios.statusText}`);
      }
    } catch (error) {
      console.error(`❌ Error al consultar usuarios: ${error.message}`);
      console.log('   El endpoint /usuarios no está disponible. Continuando con la verificación...');
    }
    console.log();
    
    // ========== PASO 3: PRUEBA DE LOGIN CON CREDENCIALES CORRECTAS ==========
    console.log('Ingrese manualmente las credenciales predeterminadas que desee usar para pruebas:');
    const credenciales = {
      username: 'admin', // Credencial de prueba - ajústalo según tu configuración
      password: 'admin123' // Credencial de prueba - ajústalo según tu configuración
    };
    
    console.log('   Utilizando credenciales predeterminadas para las pruebas:');
    
    console.log(`PASO 3: Probando login con usuario '${credenciales.username}'...`);
    console.log(`Enviando petición POST a ${API_BASE_URL}/usuarios/login`);
    console.log('Datos enviados:', JSON.stringify(credenciales, null, 2));
    try {
      const respuestaLogin = await fetchWithTimeout(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credenciales)
      });
      
      if (respuestaLogin.ok) {
        const usuario = await respuestaLogin.json();
        console.log('✅ Login exitoso!');
        console.log('Datos del usuario autenticado:');
        console.log(JSON.stringify(usuario, null, 2));
        console.log('👍 El sistema de login funciona correctamente con TursoDB.');
      } else {
        const error = await respuestaLogin.text();
        console.error(`❌ Error en login: ${respuestaLogin.status} ${respuestaLogin.statusText}`);
        console.error('Respuesta del servidor:', error);
        
        // Sugerir causas comunes del problema
        if (respuestaLogin.status === 401) {
          console.log('\n🔍 DIAGNÓSTICO: Las credenciales proporcionadas son incorrectas. Verifica el usuario y contraseña.');
        } else if (respuestaLogin.status === 400) {
          console.log('\n🔍 DIAGNÓSTICO: Solicitud incorrecta. Verifica que estés enviando los campos esperados (username y password).');
        } else if (respuestaLogin.status === 500) {
          console.log('\n🔍 DIAGNÓSTICO: Error interno del servidor. Posibles causas:');
          console.log('   1. Problemas con la conexión a TursoDB');
          console.log('   2. La tabla "usuarios" no existe o no tiene la estructura esperada');
          console.log('   3. Error en el manejo de la contraseña (bcrypt)');
        } else if (respuestaLogin.status === 404) {
          console.log('\n🔍 DIAGNÓSTICO: El endpoint /api/usuarios/login no existe o no está definido correctamente');
        }
      }
    } catch (error) {
      console.error(`❌ Error al intentar login: ${error.message}`);
      console.log('\n🔍 DIAGNÓSTICO: No se pudo conectar con el servidor. Posibles causas:');
      console.log('   1. El servidor backend no está en ejecución');
      console.log('   2. El puerto configurado es incorrecto');
      console.log('   3. Problema de red (CORS, firewall, etc.)');
    }
    console.log();

    // ========== PASO 4: VERIFICAR CLIENTE TURSO ==========
    console.log('PASO 4: Verificando configuración del cliente TursoDB...');
    console.log('Archivo verificado: backend/lib/tursoClient.js');
    
    // Verificar si el archivo existe
    const tursoClientPath = path.join(__dirname, '..', 'backend', 'lib', 'tursoClient.js');
    if (fs.existsSync(tursoClientPath)) {
      console.log('✅ El archivo tursoClient.js existe');
      
      // Leer contenido del archivo
      const tursoClientContent = fs.readFileSync(tursoClientPath, 'utf8');
      
      // Verificar si usa una base de datos local o remota
      if (tursoClientContent.includes('file:${path') || tursoClientContent.includes('file:')) {
        console.log('✓ Configuración para base de datos local detectada');
      } else if (tursoClientContent.includes('libsql://')) {
        console.log('✓ Configuración para base de datos remota detectada (libsql://)'); 
      }
      
      // Verificar si el archivo data.db existe en la carpeta backend
      const dataDbPath = path.join(__dirname, '..', 'backend', 'data.db');
      if (fs.existsSync(dataDbPath)) {
        console.log('✅ El archivo data.db existe en la carpeta backend');
      } else {
        console.log('❌ El archivo data.db NO existe en la carpeta backend');
      }
    } else {
      console.log('❌ El archivo tursoClient.js NO existe');
    }
    
    console.log('🔍 DIAGNÓSTICO DE POSIBLES PROBLEMAS:');
    console.log('   1. Verificar que el archivo data.db existe en la carpeta backend');
    console.log('   2. Verificar permisos de lectura/escritura en el archivo data.db');
    console.log('   3. Verificar que las tablas necesarias están creadas (ejecutar scripts/create-auth-tables.js)');

    // ========== PASO 5: VERIFICAR FRONTEND AUTH SERVICE ==========
    console.log('\nPASO 5: Revisando configuración del servicio de autenticación frontend...');
    
    // Verificar si el archivo existe
    const authServicePath = path.join(__dirname, '..', 'frontend', 'src', 'services', 'auth.js');
    if (fs.existsSync(authServicePath)) {
      console.log('✅ El archivo auth.js existe');
      
      // Leer contenido del archivo
      const authServiceContent = fs.readFileSync(authServicePath, 'utf8');
      
      // Verificar endpoint utilizado
      if (authServiceContent.includes('/usuarios/login')) {
        console.log('✅ El servicio auth.js llama al endpoint correcto: "/usuarios/login"');
      } else {
        console.log('❌ El servicio auth.js NO llama al endpoint "/usuarios/login". Revisar el endpoint utilizado.');
      }
      
      // Verificar si envía username o email
      if (authServiceContent.includes('username: email') || authServiceContent.includes('username: email,')) {
        console.log('⚠️ El servicio auth.js envía el email como username. Esto podría causar problemas si el backend espera un username específico.');
      } else if (authServiceContent.includes('username')) {
        console.log('✅ El servicio auth.js envía el campo "username"');
      } else {
        console.log('❌ No se detectó envío del campo "username" en auth.js');
      }
    } else {
      console.log('❌ El archivo auth.js NO existe en la ruta esperada');
    }
    
    console.log('🔍 DIAGNÓSTICO DE POSIBLES PROBLEMAS:');
    console.log('   1. Verificar que VITE_API_BASE_URL está correctamente configurado en .env');
    console.log('   2. Verificar que el servicio auth.js llama a "/usuarios/login" y no a otro endpoint');
    console.log('   3. Verificar que el servicio envía "username" y no solo "email"');

    console.log('\n=== RESUMEN DEL DIAGNÓSTICO ===');
    console.log('1. Verificar conexión a TursoDB');
    console.log('2. Verificar existencia y estructura de tabla "usuarios"');
    console.log('3. Verificar que el frontend envía los campos correctos (username/password)');
    console.log('4. Verificar que las URL de endpoints coinciden en frontend y backend');
    console.log('=======================================');
    
    console.log('\nVerificación del sistema de login completada.');
    return { verificado: true };
  } catch (error) {
    console.error('Error general en la verificación:', error);
    return { verificado: false, error: error.message };
  }
}

// Ejecutar la función principal
try {
  main();
} catch (error) {
  console.error('Error fatal en la ejecución del script:', error);
}
