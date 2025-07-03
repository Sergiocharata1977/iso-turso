import createAuthTables from './createAuthTables.js';
import createCalendarTable from './createCalendarTable.js';

const setupDatabase = async () => {
  console.log('🚀 Verificando y configurando la estructura de la base de datos...');
  // Los scripts individuales ya no se importan aquí, se ejecutan por separado si es necesario
  // o se integran en un sistema de migraciones más robusto a futuro.
  // Por ahora, nos aseguramos de que las tablas principales existan.
  await createAuthTables();
  await createCalendarTable();
  console.log('✨ Estructura de la base de datos verificada.');
};

// Exportamos la función para que pueda ser llamada desde el servidor principal
export default setupDatabase;
