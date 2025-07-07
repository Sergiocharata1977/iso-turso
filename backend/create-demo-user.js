import fetch from 'node-fetch';

const createDemoUser = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationName: 'Empresa Demo',
        userName: 'Admin Demo',
        userEmail: 'admin@demo.com',
        userPassword: '123456'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Usuario demo creado exitosamente!');
      console.log('📧 Email: admin@demo.com');
      console.log('🔑 Password: 123456');
      console.log('🏢 Organización: Empresa Demo');
      console.log('👤 Rol: admin');
    } else {
      console.log('❌ Error:', data.message || 'No se pudo crear el usuario');
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
};

createDemoUser();
