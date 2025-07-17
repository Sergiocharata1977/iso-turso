import React from 'react';

const VisionGeneral = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Visión General de la Arquitectura</h1>
        <p className="text-gray-600">
          ISO Flow 3.0 está construido sobre una arquitectura moderna y escalable que sigue las mejores prácticas de la industria.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Arquitectura General</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Frontend</h3>
            <p className="text-sm text-gray-600">
              Aplicación React.js con Vite, Tailwind CSS y React Router para una experiencia de usuario fluida y responsiva.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Backend</h3>
            <p className="text-sm text-gray-600">
              API RESTful con Node.js y Express, con autenticación JWT y base de datos MySQL/PostgreSQL.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Base de Datos</h3>
            <p className="text-sm text-gray-600">
              Modelo relacional multi-tenant con soporte para múltiples organizaciones.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Características Clave</h2>
        <ul className="space-y-4">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 text-green-500">✓</div>
            <div>
              <h3 className="font-medium text-gray-900">Arquitectura Multi-tenant</h3>
              <p className="text-sm text-gray-600">Soporte para múltiples organizaciones con aislamiento de datos.</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 text-green-500">✓</div>
            <div>
              <h3 className="font-medium text-gray-900">Autenticación Segura</h3>
              <p className="text-sm text-gray-600">JWT con refresh tokens y protección de rutas.</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 text-green-500">✓</div>
            <div>
              <h3 className="font-medium text-gray-900">API RESTful</h3>
              <p className="text-sm text-gray-600">Endpoints bien definidos con documentación Swagger/OpenAPI.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VisionGeneral;
