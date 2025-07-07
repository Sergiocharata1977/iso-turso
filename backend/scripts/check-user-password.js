import { tursoClient } from '../lib/tursoClient.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

async function checkUserPassword() {
  try {
    console.log('🔍 Verificando usuario sergiojdf@gmail.com...');
    
    const result = await tursoClient.execute({
      sql: 'SELECT id, name, email, password_hash, role FROM usuarios WHERE email = ?',
      args: ['sergiojdf@gmail.com']
    });
    
    if (result.rows.length === 0) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    const user = result.rows[0];
    console.log('✅ Usuario encontrado:');
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Nombre: ${user.name}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Rol: ${user.role}`);
    console.log(`   - Hash: ${user.password_hash.substring(0, 20)}...`);
    
    // Probar diferentes contraseñas comunes
    const passwords = ['123456', 'password', 'admin', 'sergio', 'test'];
    
    console.log('\n🔐 Probando contraseñas comunes...');
    for (const pwd of passwords) {
      try {
        const isMatch = await bcrypt.compare(pwd, user.password_hash);
        if (isMatch) {
          console.log(`✅ ¡CONTRASEÑA ENCONTRADA! "${pwd}"`);
          return;
        } else {
          console.log(`❌ "${pwd}" no coincide`);
        }
      } catch (error) {
        console.log(`⚠️ Error probando "${pwd}":`, error.message);
      }
    }
    
    console.log('\n🚨 Ninguna contraseña común funcionó');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkUserPassword();
