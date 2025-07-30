import jwt from 'jsonwebtoken';
import { tursoClient } from './lib/tursoClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_secreto';

async function createValidToken() {
    try {
        // Primero, obtener un usuario existente de la base de datos
        const userResult = await tursoClient.execute({
            sql: `SELECT id, name, email, role, organization_id FROM usuarios LIMIT 1`,
            args: []
        });

        if (userResult.rows.length === 0) {
            console.error('❌ No hay usuarios en la base de datos');
            return;
        }

        const user = userResult.rows[0];
        console.log('👤 Usuario encontrado:', {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            organization_id: user.organization_id
        });

        // Generar token JWT válido
        const token = jwt.sign(
            { 
                userId: user.id,
                email: user.email,
                role: user.role,
                organization_id: user.organization_id
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('\n🔑 TOKEN VÁLIDO GENERADO:');
        console.log('='.repeat(50));
        console.log(token);
        console.log('='.repeat(50));
        
        console.log('\n📋 Para usar en el frontend:');
        console.log('1. Abre la consola del navegador');
        console.log('2. Ejecuta: localStorage.setItem("token", "' + token + '")');
        console.log('3. Recarga la página');
        
        console.log('\n📋 Para probar con curl:');
        console.log(`curl -X GET http://localhost:5000/api/reunion2 -H "Authorization: Bearer ${token}"`);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

createValidToken()
    .then(() => {
        console.log('\n✅ Script completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Error:', error);
        process.exit(1);
    });