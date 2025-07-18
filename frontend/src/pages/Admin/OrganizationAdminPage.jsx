import React from 'react';

const OrganizationAdminPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🏢 Panel Administrador de Organización
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Esta es la página del Administrador de Organización. Si puedes ver esto, significa que la ruta funciona correctamente.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Usuarios</h3>
            <p className="text-blue-700 dark:text-blue-300">Gestionar usuarios de la organización</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-100">Configuración</h3>
            <p className="text-green-700 dark:text-green-300">Configurar la organización</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">Actividad</h3>
            <p className="text-purple-700 dark:text-purple-300">Ver actividad reciente</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Información de Debug:</h3>
          <p className="text-yellow-700 dark:text-yellow-300">
            URL actual: {window.location.pathname}<br/>
            Usuario actual: {JSON.parse(localStorage.getItem('user') || '{}').name || 'No disponible'}<br/>
            Rol: {JSON.parse(localStorage.getItem('user') || '{}').role || 'No disponible'}<br/>
            Organización ID: {JSON.parse(localStorage.getItem('user') || '{}').organization_id || 'No disponible'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationAdminPage; 