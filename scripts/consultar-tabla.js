import { tursoClient } from '../backend/lib/tursoClient.js';

async function consultarEstructuraTabla(nombreTabla) {
  try {
    console.log(`Consultando estructura de la tabla ${nombreTabla}...`);
    
    const result = await tursoClient.execute({
      sql: `PRAGMA table_info(${nombreTabla})`
    });
    
    console.log(`Estructura de la tabla ${nombreTabla}:`);
    console.table(result.rows);
    
    return result.rows;
  } catch (error) {
    console.error(`Error al consultar la estructura de la tabla ${nombreTabla}:`, error);
    return null;
  }
}

// Ejecutar la consulta para la tabla procesos
consultarEstructuraTabla('procesos');
