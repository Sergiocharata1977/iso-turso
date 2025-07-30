import fetch from 'node-fetch';

async function verificarFrontendAuth() {
  console.log('🔍 Verificando autenticación del frontend...\n');

  try {
    // 1. Verificar si el frontend está ejecutándose
    console.log('1️⃣ Verificando frontend...');
    const frontendResponse = await fetch('http://localhost:3000');
    console.log('Frontend status:', frontendResponse.status);
    
    if (frontendResponse.ok) {
      console.log('✅ Frontend está ejecutándose');
    } else {
      console.log('❌ Frontend no responde');
      return;
    }

    // 2. Probar login desde el frontend
    console.log('\n2️⃣ Probando login desde frontend...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@demo.com',
        password: 'admin123'
      })
    });

    console.log('Login status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login exitoso desde frontend');
      
      // 3. Probar API con el token del frontend
      if (loginData.data?.tokens?.accessToken) {
        const token = loginData.data.tokens.accessToken;
        
        console.log('\n3️⃣ Probando API con token del frontend...');
        const apiResponse = await fetch('http://localhost:5000/api/reuniones', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('API status:', apiResponse.status);
        
        if (apiResponse.ok) {
          const reuniones = await apiResponse.json();
          console.log('✅ API funciona con token del frontend');
          console.log('Reuniones encontradas:', reuniones.length);
        } else {
          const errorText = await apiResponse.text();
          console.log('❌ Error en API:', errorText);
        }
      }
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Error en login desde frontend:', errorText);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

verificarFrontendAuth(); 