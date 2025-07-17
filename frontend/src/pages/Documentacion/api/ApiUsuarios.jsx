import React from 'react';

const ApiUsuarios = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">API de Usuarios</h1>
        <p className="text-gray-600">
          Documentación completa de los endpoints disponibles para la gestión de usuarios en el sistema.
        </p>
      </div>

      <div className="space-y-6">
        {/* Listar Usuarios */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                GET
              </span>
              <code className="text-sm font-mono">/api/usuarios</code>
              <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                Requiere autenticación
              </span>
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <h3 className="font-medium text-gray-900 mb-3">Obtener lista de usuarios</h3>
            <p className="text-gray-600 text-sm mb-4">
              Retorna una lista paginada de usuarios en la organización actual.
            </p>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Parámetros de consulta</h4>
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
                    <td className="px-4 py-2 font-mono text-sm text-gray-900">page</td>
                    <td className="px-4 py-2 text-sm text-gray-500">integer</td>
                    <td className="px-4 py-2 text-sm text-gray-500">No</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Número de página (por defecto: 1)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-sm text-gray-900">limit</td>
                    <td className="px-4 py-2 text-sm text-gray-500">integer</td>
                    <td className="px-4 py-2 text-sm text-gray-500">No</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Resultados por página (por defecto: 10, máximo: 100)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-sm text-gray-900">search</td>
                    <td className="px-4 py-2 text-sm text-gray-500">string</td>
                    <td className="px-4 py-2 text-sm text-gray-500">No</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Texto para buscar en nombre o email</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Ejemplo de respuesta exitosa (200)</h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                <pre className="text-sm text-gray-800">
                  <code>{
`{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "department_id": 1,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}`
                  }</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Crear Usuario */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                POST
              </span>
              <code className="text-sm font-mono">/api/usuarios</code>
              <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                Requiere autenticación
              </span>
              <span className="ml-2 px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-800">
                Requiere rol: admin
              </span>
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <h3 className="font-medium text-gray-900 mb-3">Crear un nuevo usuario</h3>
            <p className="text-gray-600 text-sm mb-4">
              Crea un nuevo usuario en la organización actual.
            </p>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Cuerpo de la petición (JSON)</h4>
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
                    <td className="px-4 py-2 font-mono text-sm text-gray-900">name</td>
                    <td className="px-4 py-2 text-sm text-gray-500">string</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Sí</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Nombre completo del usuario</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-sm text-gray-900">email</td>
                    <td className="px-4 py-2 text-sm text-gray-500">string</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Sí</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Email del usuario (debe ser único)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-sm text-gray-900">password</td>
                    <td className="px-4 py-2 text-sm text-gray-500">string</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Sí</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Contraseña (mínimo 8 caracteres)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-sm text-gray-900">role</td>
                    <td className="px-4 py-2 text-sm text-gray-500">string</td>
                    <td className="px-4 py-2 text-sm text-gray-500">No</td>
                    <td className="px-4 py-2 text-sm text-gray-500">Rol del usuario (admin, manager, user)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-sm text-gray-900">department_id</td>
                    <td className="px-4 py-2 text-sm text-gray-500">integer</td>
                    <td className="px-4 py-2 text-sm text-gray-500">No</td>
                    <td className="px-4 py-2 text-sm text-gray-500">ID del departamento al que pertenece</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Ejemplo de petición</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  <code>{
`// Ejemplo usando fetch
const response = await fetch('/api/usuarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    name: 'Nuevo Usuario',
    email: 'nuevo@ejemplo.com',
    password: 'contraseña-segura',
    role: 'user',
    department_id: 1
  })
});

const data = await response.json();`
                  }</code>
                </pre>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Respuesta exitosa (201)</h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                <pre className="text-sm text-gray-800">
                  <code>{
`{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 2,
    "name": "Nuevo Usuario",
    "email": "nuevo@ejemplo.com",
    "role": "user",
    "department_id": 1,
    "created_at": "2023-01-02T00:00:00.000Z",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
}`
                  }</code>
                </pre>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Errores comunes</h4>
              <div className="space-y-2">
                <div className="p-3 bg-red-50 border border-red-100 rounded">
                  <div className="flex items-center gap-2 text-red-800">
                    <span className="font-mono text-sm font-medium">400 Bad Request</span>
                    <span className="text-xs">- Datos de entrada inválidos</span>
                  </div>
                  <pre className="mt-1 text-xs text-red-600">
                    <code>{"{\n  \"success\": false,\n  \"error\": \"Error de validación\",\n  \"details\": [\n    {\n      \"field\": \"email\",\n      \"message\": \"El email ya está en uso\"\n    }\n  ]\n}"}</code>
                  </pre>
                </div>
                <div className="p-3 bg-red-50 border border-red-100 rounded">
                  <div className="flex items-center gap-2 text-red-800">
                    <span className="font-mono text-sm font-medium">403 Forbidden</span>
                    <span className="text-xs">- No autorizado</span>
                  </div>
                  <pre className="mt-1 text-xs text-red-600">
                    <code>{"{\n  \"success\": false,\n  \"error\": \"No tienes permiso para realizar esta acción\"\n}"}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiUsuarios;
