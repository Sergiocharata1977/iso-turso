import { tursoClient } from '../lib/tursoClient.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

async function fixPedroPassword() {
  try {
    console.log('🔧 Corrigiendo contraseña de Pedro...');
    
    // 1. Verificar que Pedro existe
    const result = await tursoClient.execute({
      sql: 'SELECT id, name, email, password_hash FROM usuarios WHERE email = ?',
      args: ['pedro@gmail.com']
    });
    
    if (result.rows.length === 0) {
      console.log('❌ Pedro no encontrado');
      return;
    }
    
    const pedro = result.rows[0];
    console.log(`✅ Pedro encontrado: ${pedro.name} (${pedro.email})`);
    console.log(`📝 Hash actual: ${pedro.password_hash.substring(0, 20)}...`);
    
    // 2. Hashear la contraseña correctamente
    const plainPassword = 'Pedro373141278'; // La contraseña que pusiste
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    console.log(`🔐 Nueva contraseña hasheada: ${hashedPassword.substring(0, 20)}...`);
    
    // 3. Actualizar la contraseña en la base de datos
    await tursoClient.execute({
      sql: 'UPDATE usuarios SET password_hash = ? WHERE email = ?',
      args: [hashedPassword, 'pedro@gmail.com']
    });
    
    console.log('✅ Contraseña de Pedro actualizada correctamente');
    
    // 4. Verificar que el login funciona
    console.log('\n🧪 Probando login con bcrypt.compare...');
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(`🔍 bcrypt.compare resultado: ${isMatch ? '✅ CORRECTO' : '❌ ERROR'}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

fixPedroPassword();
