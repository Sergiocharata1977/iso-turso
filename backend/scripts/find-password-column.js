import { tursoClient } from '../lib/tursoClient.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

async function findPasswordColumn() {
  const possibleNames = [
    'password',
    'password_hash', 
    'passwordHash',
    'pwd',
    'pwd_hash',
    'hash',
    'contraseña',
    'clave'
  ];
  
  for (const colName of possibleNames) {
    try {
      console.log(`🔍 Probando columna: ${colName}`);
      
      const result = await tursoClient.execute({
        sql: `SELECT id, name, email, ${colName} FROM usuarios LIMIT 1`
      });
      
      console.log(`✅ ¡ENCONTRADA! La columna de contraseña es: ${colName}`);
      
      if (result.rows.length > 0) {
        console.log('📋 Estructura encontrada:', Object.keys(result.rows[0]));
      }
      
      process.exit(0);
      
    } catch (error) {
      console.log(`❌ ${colName} no existe`);
    }
  }
  
  console.log('🚨 No se encontró ninguna columna de contraseña válida');
  process.exit(1);
}

findPasswordColumn();
