import { tursoClient } from '../lib/tursoClient.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

async function simpleCheck() {
  try {
    // Verificar estructura de usuarios
    const result = await tursoClient.execute({
      sql: "SELECT * FROM usuarios LIMIT 1;"
    });
    
    if (result.rows.length > 0) {
      console.log('✅ COLUMNAS REALES DE LA TABLA USUARIOS:');
      console.log(Object.keys(result.rows[0]));
    } else {
      console.log('❌ No hay usuarios en la tabla');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  process.exit(0);
}

simpleCheck();
