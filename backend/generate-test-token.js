import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_secreto';

// Generar token de prueba para usuario con ID 1
const testToken = jwt.sign(
  { 
    userId: 1,
    email: 'test@example.com',
    role: 'admin'
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);

console.log('🔑 Token de prueba generado:');
console.log(testToken);
console.log('\n📋 Para usar en curl:');
console.log(`curl -X GET http://localhost:5000/api/reunion2 -H "Authorization: Bearer ${testToken}"`); 