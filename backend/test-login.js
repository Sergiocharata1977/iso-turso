import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api/auth/login';

async function testLogin() {
  const body = {
    email: 'admin@demo.com',
    password: '123456'
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Respuesta:', data);
  } catch (err) {
    console.error('Error al hacer login:', err);
  }
}

testLogin(); 