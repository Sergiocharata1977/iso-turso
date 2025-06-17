// Script sencillo para verificar si el servidor está funcionando
import http from 'http';

console.log('Verificando si el servidor backend está en ejecución en el puerto 3002...');

// Opciones de la petición HTTP
const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/health',
  method: 'GET',
  timeout: 3000
};

// Realizar petición HTTP
const req = http.request(options, (res) => {
  console.log(`Código de estado: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Respuesta del servidor:', data);
    console.log('✅ El servidor está en ejecución correctamente');
  });
});

// Manejo de errores
req.on('error', (error) => {
  console.error('❌ No se pudo conectar con el servidor:', error.message);
  console.log('Asegúrate de que el servidor backend esté en ejecución en el puerto 3002');
  console.log('Para iniciar el servidor: cd backend && node index.js');
});

// Establecer timeout
req.on('timeout', () => {
  console.error('❌ Timeout al intentar conectar con el servidor');
  req.destroy();
});

// Enviar petición
req.end();
