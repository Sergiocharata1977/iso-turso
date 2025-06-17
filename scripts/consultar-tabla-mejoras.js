import { createClient } from '@libsql/client';

// Configuración de la conexión a la base de datos local
const tursoClient = createClient({
  url: 'file:C:\\Users\\Usuario\\Documents\\Proyectos\\isoflow3-master\\backend\\data.db'
});

console.log('[tursoClient] Conectando a la base de datos local: file:C:\\Users\\Usuario\\Documents\\Proyectos\\isoflow3-master\\backend\\data.db');

async function consultarEstructuraTabla() {
  try {
    console.log('Consultando estructura de la tabla mejoras...');
    
    const result = await tursoClient.execute({
      sql: `PRAGMA table_info(mejoras)`
    });
    
    console.log('Estructura de la tabla mejoras:');
    console.table(result.rows);
    
  } catch (error) {
    console.error('Error al consultar la estructura de la tabla:', error);
  }
}

consultarEstructuraTabla();
