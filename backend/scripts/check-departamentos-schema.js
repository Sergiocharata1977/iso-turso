import { tursoClient } from '../lib/tursoClient.js';

async function checkDepartamentosSchema() {
  try {
    console.log('Consultando esquema de la tabla "departamentos"...');
    const tableInfo = await tursoClient.execute('PRAGMA table_info(departamentos);');
    
    if (tableInfo.rows && tableInfo.rows.length > 0) {
      console.log('Columnas encontradas en la tabla "departamentos":');
      tableInfo.rows.forEach(column => {
        console.log(`- Nombre: ${column.name}, Tipo: ${column.type}, No Nulo: ${column.notnull}, Clave Primaria: ${column.pk}`);
      });
    } else {
      console.log('No se pudo obtener información del esquema para la tabla "departamentos" o la tabla está vacía/no existe.');
    }

  } catch (error) {
    console.error('Error al verificar el esquema de la tabla "departamentos":', error);
  }
}

checkDepartamentosSchema();
