import fetch from 'node-fetch';

async function testAPI() {
  console.log('🧪 Probando API de reuniones...\n');

  try {
    // Test 1: GET /api/reuniones
    console.log('1️⃣ Probando GET /api/reuniones...');
    const response = await fetch('http://localhost:5000/api/reuniones', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Sin token por ahora para probar
      }
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Datos recibidos:', data.length, 'reuniones');
    } else {
      const errorText = await response.text();
      console.log('❌ Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testAPI(); 