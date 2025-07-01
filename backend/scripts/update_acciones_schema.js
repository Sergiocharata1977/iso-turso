import { tursoClient } from '../lib/tursoClient.js';

async function updateSchema() {
  try {
    console.log('Verificando y actualizando el esquema de la tabla "acciones"...');

    const checkTableResult = await tursoClient.execute("PRAGMA table_info(acciones)");
    const columns = checkTableResult.rows.map(row => row.name);

    const columnsToAdd = {
      'titulo': 'VARCHAR(255)',
      'responsable_ejecucion': 'VARCHAR(255)',
      'fecha_limite': 'DATE'
    };

    for (const [column, type] of Object.entries(columnsToAdd)) {
      if (!columns.includes(column)) {
        await tursoClient.execute(`ALTER TABLE acciones ADD COLUMN ${column} ${type}`);
        console.log(`Columna "${column}" añadida a la tabla "acciones".`);
      } else {
        console.log(`La columna "${column}" ya existe.`);
      }
    }

    if (columns.includes('descripcion_accion') && !columns.includes('descripcion')) {
      await tursoClient.execute('ALTER TABLE acciones RENAME COLUMN descripcion_accion TO descripcion');
      console.log('Columna "descripcion_accion" renombrada a "descripcion".');
    } else {
      console.log('La columna "descripcion" ya existe o "descripcion_accion" no se encontró.');
    }

    console.log('El esquema de la tabla "acciones" ha sido verificado y actualizado con éxito.');

  } catch (e) {
    console.error('Error al actualizar el esquema de la tabla "acciones":', e);
  }
}

updateSchema();
