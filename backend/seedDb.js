import { tursoClient } from './lib/tursoClient.js';
import crypto from 'crypto';

async function testDb() {
  try {
    console.log('Iniciando prueba de base de datos...');
    
    const departamentoId = crypto.randomUUID();
    const departamentoNombre = 'Departamento de Prueba';

    console.log('Intentando insertar departamento...');
    await tursoClient.execute({
      sql: 'INSERT INTO departamentos (id, nombre, descripcion, fecha_creacion) VALUES (?, ?, ?, ?)',
      args: [departamentoId, departamentoNombre, 'Departamento para pruebas', new Date().toISOString()],
    });
    console.log('✅ Inserción de departamento exitosa.');

    console.log('Intentando consultar departamento...');
    const result = await tursoClient.execute({
        sql: `SELECT * FROM departamentos WHERE id = ?`,
        args: [departamentoId]
      });
  
    if (result.rows.length > 0) {
        console.log('✅ ¡Éxito! La consulta funcionó. Datos recuperados:');
        console.table(result.rows);
    } else {
        console.log('❌ La consulta no devolvió resultados.');
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    if (error.cause) {
        console.error('Causa del error:', error.cause);
    }
  } finally {
    tursoClient.close();
    console.log('Conexión con la base de datos cerrada.');
  }
}

testDb();
