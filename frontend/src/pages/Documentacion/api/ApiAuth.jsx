import React from 'react';

const ApiAuth = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Autenticación API</h1>
        <p className="text-gray-600">
          Endpoints para la autenticación de usuarios y gestión de tokens de acceso.
        </p>
      </div>

      <div className="space-y-6">
        {/* Login Endpoint */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                POST
              </span>
              <code className="text-sm font-mono">/api/auth/login</code>
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <h3 className="font-medium text-gray-900 mb-3">Descripción</h3>
            <p className="text-gray-600 text-sm mb-4">
              Autentica a un usuario y devuelve un token JWT para acceder a los recursos protegidos.
            </p>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Parámetros</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Requerido</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 font-mono text-sm text-gray-900">email</td>
                    <td className="px-4 py-2 text-sm text-gray-500">string</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Sí</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Email del usuario</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-sm text-gray-900">password</td>
                    <td className="px-4 py-2 text-sm text-gray-500">string</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Sí</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Contraseña del usuario</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Ejemplo de solicitud</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  <code>
{`// Ejemplo usando fetch
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    password: 'contraseña-segura'
  })
});

const data = await response.json();`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Respuesta exitosa (200)</h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                <pre className="text-sm text-gray-800">
                  <code>
{`{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Nombre Usuario",
    "email": "usuario@ejemplo.com",
    "role": "admin"
  }
}`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Errores comunes</h4>
              <div className="space-y-2">
                <div className="p-3 bg-red-50 border border-red-100 rounded">
                  <div className="flex items-center gap-2 text-red-800">
                    <span className="font-mono text-sm font-medium">401 Unauthorized</span>
                    <span className="text-xs">- Credenciales inválidas</span>
                  </div>
                  <pre className="mt-1 text-xs text-red-600">
                    <code>{"{'error': 'Credenciales inválidas'}"}</code>
                  </pre>
                </div>
                <div className="p-3 bg-red-50 border border-red-100 rounded">
                  <div className="flex items-center gap-2 text-red-800">
                    <span className="font-mono text-sm font-medium">400 Bad Request</span>
                    <span className="text-xs">- Datos de entrada inválidos</span>
                  </div>
                  <pre className="mt-1 text-xs text-red-600">
                    <code>{"{'error': 'El campo email es requerido'}"}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Token Endpoint */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                POST
              </span>
              <code className="text-sm font-mono">/api/auth/refresh</code>
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <h3 className="font-medium text-gray-900 mb-3">Descripción</h3>
            <p className="text-gray-600 text-sm">
              Renueva el token de acceso utilizando un refresh token válido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiAuth;
