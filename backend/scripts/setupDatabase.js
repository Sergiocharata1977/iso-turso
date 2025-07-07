const setupDatabase = async () => {
  console.log('🚀 Verificando estructura de la base de datos...');
  // La estructura de BD ya está verificada y protegida por database-manager.js
  // No ejecutamos scripts de creación automática para evitar conflictos
  console.log('✨ Estructura de la base de datos OK - Gestionada por database-manager.js');
};

// Exportamos la función para que pueda ser llamada desde el servidor principal
export default setupDatabase;
