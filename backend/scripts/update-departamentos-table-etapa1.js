import { executeQuery, tursoClient } from '../lib/tursoClient.js';

async function updateDepartamentosTableEtapa1() {
  const columnsToAdd = [
    { name: 'codigo_departamento', type: 'TEXT' },
    { name: 'ubicacion_fisica', type: 'TEXT' },
    { name: 'documento_pdf_url', type: 'TEXT' },
    { name: 'recursos_materiales', type: 'TEXT' },
    { name: 'recursos_tecnologicos', type: 'TEXT' },
    { name: 'registros_que_debe_generar', type: 'TEXT' }
  ];

  try {
    // Obtener información de la tabla actual para no añadir columnas que ya existen
    const tableInfo = await tursoClient.execute(`PRAGMA table_info(departamentos);`);
    const existingColumns = tableInfo.rows.map(col => col.name);

    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        const alterTableQuery = `ALTER TABLE departamentos ADD COLUMN ${column.name} ${column.type};`;
        await executeQuery(alterTableQuery);
        console.log(`Columna "${column.name}" añadida a la tabla "departamentos".`);
      } else {
        console.log(`Columna "${column.name}" ya existe en la tabla "departamentos".`);
      }
    }
    console.log('Tabla "departamentos" actualizada con éxito para Etapa 1.');
  } catch (error) {
    console.error('Error al actualizar la tabla "departamentos":', error);
  }
}

updateDepartamentosTableEtapa1();
