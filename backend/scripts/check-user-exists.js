import { tursoClient } from '../lib/tursoClient.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

async function checkUserExists() {
  try {
    console.log('🔍 Verificando si existe el usuario sergio@gmail.com...');
    
    const result = await tursoClient.execute({
      sql: 'SELECT id, name, email, role, organization_id FROM usuarios WHERE email = ?',
      args: ['sergio@gmail.com']
    });
    
    if (result.rows.length > 0) {
      console.log('✅ Usuario encontrado:');
      console.log(result.rows[0]);
    } else {
      console.log('❌ Usuario sergio@gmail.com NO existe en la base de datos');
      
      // Verificar qué usuarios existen
      const allUsers = await tursoClient.execute({
        sql: 'SELECT email FROM usuarios LIMIT 5'
      });
      
      console.log('\n📋 Usuarios existentes:');
      allUsers.rows.forEach(user => {
        console.log(`- ${user.email}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkUserExists();
