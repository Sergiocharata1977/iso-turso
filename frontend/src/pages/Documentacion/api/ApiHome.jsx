import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Lock, Users, Briefcase, Database, ArrowRight } from 'lucide-react';

const ApiHome = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Autenticación',
      description: 'Endpoints para autenticación y gestión de tokens',
      icon: Lock,
      path: '/documentacion/api/auth',
      method: 'POST',
      endpoint: '/api/auth/login'
    },
    {
      title: 'Usuarios',
      description: 'Gestión de usuarios y perfiles',
      icon: Users,
      path: '/documentacion/api/usuarios',
      method: 'GET',
      endpoint: '/api/usuarios'
    },
    {
      title: 'Organizaciones',
      description: 'Gestión de organizaciones multi-tenant',
      icon: Briefcase,
      path: '/documentacion/api/organizaciones',
      method: 'GET',
      endpoint: '/api/organizaciones'
    },
    {
      title: 'Recursos',
      description: 'API para recursos del sistema',
      icon: Database,
      path: '/documentacion/api/recursos',
      method: 'GET',
      endpoint: '/api/recursos'
    },
    {
      title: 'Procesos',
      description: 'API para gestión de procesos',
      icon: Code,
      path: '/documentacion/api/procesos',
      method: 'GET',
      endpoint: '/api/procesos'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">API Reference</h1>
      <p className="text-gray-600 mb-8">
        Documentación completa de la API REST de ISO Flow 3.0
      </p>

      <div className="space-y-4 mb-8">
        {sections.map((section) => (
          <button
            key={section.path}
            onClick={() => navigate(section.path)}
            className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <section.icon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {section.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    section.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                    section.method === 'POST' ? 'bg-green-100 text-green-800' :
                    section.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                    section.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {section.method}
                  </span>
                  <code className="text-sm font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">
                    {section.endpoint}
                  </code>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Autenticación API
        </h2>
        <div className="space-y-4">
          <p className="text-blue-800">
            Todas las peticiones a la API requieren un token de autenticación en el encabezado <code className="bg-blue-100 px-1.5 py-0.5 rounded">Authorization</code>.
          </p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code>
{`// Ejemplo de petición autenticada
fetch('/api/endpoint', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiHome;
