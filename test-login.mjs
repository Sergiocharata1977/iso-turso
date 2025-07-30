import fetch from 'node-fetch';

async function testLogin() {
  console.log('🔐 Probando login con usuarios existentes...\n');

  const testUsers = [
    { email: 'admin@demo.com', password: 'admin123' },
    { email: 'admin@isoflow3.com', password: 'admin123' },
    { email: 'test@test.com', password: 'test123' },
    { email: 'sergiojdf@gmail.com', password: 'admin123' },
    { email: 'romina@gmail.com', password: 'admin123' }
  ];

  for (const user of testUsers) {
    try {
      console.log(`🔑 Probando: ${user.email}`);
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });

      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login exitoso!');
        console.log('Token:', data.data?.tokens?.accessToken ? 'SÍ' : 'NO');
        
        // Probar API con el token
        if (data.data?.tokens?.accessToken) {
          const apiResponse = await fetch('http://localhost:5000/api/reuniones', {
            headers: {
              'Authorization': `Bearer ${data.data.tokens.accessToken}`
            }
          });
          
          if (apiResponse.ok) {
            const reuniones = await apiResponse.json();
            console.log(`✅ API funciona! Reuniones: ${reuniones.length}`);
            return; // Encontramos un usuario válido
          }
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Error:', errorText);
      }
      
    } catch (error) {
      console.log('❌ Error de conexión:', error.message);
    }
    
    console.log('---');
  }
}

testLogin(); 