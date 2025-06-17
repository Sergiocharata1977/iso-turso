import { createClient } from '@libsql/client';

// Configuración de la conexión a la base de datos local
const tursoClient = createClient({
  url: 'file:C:\\Users\\Usuario\\Documents\\Proyectos\\isoflow3-master\\backend\\data.db'
});

console.log('[tursoClient] Conectando a la base de datos local: file:C:\\Users\\Usuario\\Documents\\Proyectos\\isoflow3-master\\backend\\data.db');

async function consultarEstructuraTabla() {
  try {
    console.log('Consultando estructura de la tabla objetivos_calidad...');
    
    const result = await tursoClient.execute({
      sql: `PRAGMA table_info(objetivos_calidad)`
    });
    
    console.log('Estructura de la tabla objetivos_calidad:');
    console.table(result.rows);
    
  } catch (error) {
    console.error('Error al consultar la estructura de la tabla:', error);
  }
}

consultarEstructuraTabla();
