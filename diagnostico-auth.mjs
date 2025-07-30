import fetch from 'node-fetch';

async function diagnosticoAuth() {
  console.log('🔍 Diagnóstico de Autenticación\n');

  try {
    // 1. Verificar si el backend responde
    console.log('1️⃣ Verificando backend...');
    const healthResponse = await fetch('http://localhost:5000/');
    console.log('Backend status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthText = await healthResponse.text();
      console.log('✅ Backend responde:', healthText);
    } else {
      console.log('❌ Backend no responde correctamente');
      return;
    }

    // 2. Intentar login para obtener token
    console.log('\n2️⃣ Intentando login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });

    console.log('Login status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login exitoso');
      console.log('Token recibido:', loginData.data?.tokens?.accessToken ? 'SÍ' : 'NO');
      
      if (loginData.data?.tokens?.accessToken) {
        const token = loginData.data.tokens.accessToken;
        
        // 3. Probar API con token
        console.log('\n3️⃣ Probando API con token...');
        const apiResponse = await fetch('http://localhost:5000/api/reuniones', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('API status:', apiResponse.status);
        
        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          console.log('✅ API funciona con token');
          console.log('Reuniones encontradas:', apiData.length || 0);
        } else {
          const errorText = await apiResponse.text();
          console.log('❌ Error en API:', errorText);
        }
      }
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Error en login:', errorText);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

diagnosticoAuth(); 