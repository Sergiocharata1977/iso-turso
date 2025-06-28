/**
 * Script para verificar números de hallazgo existentes
 */

import { tursoClient } from '../lib/tursoClient.js';

console.log('🔍 VERIFICANDO NÚMEROS DE HALLAZGO EXISTENTES...\n');

async function verificarNumeros() {
  try {
    // Ver todos los números existentes
    const todosResult = await tursoClient.execute('SELECT numeroHallazgo FROM hallazgos ORDER BY numeroHallazgo');
    console.log('📋 Números existentes:');
    todosResult.rows.forEach(row => {
      console.log('   -', row.numeroHallazgo);
    });
    
    // Probar la consulta para obtener el último
    const ultimoResult = await tursoClient.execute('SELECT numeroHallazgo FROM hallazgos WHERE numeroHallazgo LIKE "H-%" ORDER BY numeroHallazgo DESC LIMIT 1');
    console.log('\n🔍 Último número encontrado:');
    if (ultimoResult.rows.length > 0) {
      console.log('   -', ultimoResult.rows[0].numeroHallazgo);
      
      const lastNumero = ultimoResult.rows[0].numeroHallazgo;
      const lastId = parseInt(lastNumero.split('-')[1], 10);
      const nextNumero = `H-${(lastId + 1).toString().padStart(3, '0')}`;
      console.log('   - Siguiente número sería:', nextNumero);
      
      // Verificar si el siguiente número ya existe
      const existeResult = await tursoClient.execute({
        sql: 'SELECT COUNT(*) as count FROM hallazgos WHERE numeroHallazgo = ?',
        args: [nextNumero]
      });
      console.log('   - ¿Ya existe?', existeResult.rows[0].count > 0);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  process.exit(0);
}

verificarNumeros();
