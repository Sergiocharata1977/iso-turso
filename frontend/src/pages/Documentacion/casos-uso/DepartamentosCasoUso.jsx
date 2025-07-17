import React from 'react';

const DepartamentosCasoUso = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Departamentos</h1>
        <p className="text-gray-600">
          Flujos de trabajo y casos de uso para la gestión de departamentos en la organización.
        </p>
      </div>

      <div className="space-y-8">
        {/* Crear Departamento */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Crear Departamento</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Precondiciones</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>El usuario debe tener permisos de administrador</li>
                <li>No debe existir un departamento con el mismo nombre en la organización</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Flujo Principal</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>El usuario accede a la sección de Departamentos</li>
                <li>Hace clic en el botón "Nuevo Departamento"</li>
                <li>Completa el formulario con los datos requeridos</li>
                <li>Hace clic en "Guardar"</li>
                <li>El sistema valida los datos y crea el departamento</li>
                <li>Muestra mensaje de confirmación</li>
              </ol>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h3 className="font-medium text-yellow-800 mb-2">Excepciones</h3>
              <ul className="space-y-2">
                <li>
                  <span className="font-medium">Nombre duplicado:</span>
                  <p className="text-sm text-gray-600">Si ya existe un departamento con el mismo nombre, muestra un mensaje de error.</p>
                </li>
                <li>
                  <span className="font-medium">Datos inválidos:</span>
                  <p className="text-sm text-gray-600">Si faltan campos requeridos, muestra los mensajes de validación correspondientes.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Editar Departamento */}
        <div className="border-l-4 border-green-500 pl-4 pt-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Editar Departamento</h2>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Precondiciones</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>El usuario debe tener permisos de administrador</li>
                <li>El departamento debe existir en el sistema</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Flujo Principal</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>El usuario accede a la sección de Departamentos</li>
                <li>Hace clic en el ícono de editar del departamento</li>
                <li>Modifica los campos necesarios</li>
                <li>Hace clic en "Guardar cambios"</li>
                <li>El sistema actualiza la información del departamento</li>
                <li>Muestra mensaje de confirmación</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Eliminar Departamento */}
        <div className="border-l-4 border-red-500 pl-4 pt-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Eliminar Departamento</h2>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-800 mb-2">Precondiciones</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>El usuario debe tener permisos de administrador</li>
                <li>El departamento no debe tener personal asignado</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Flujo Principal</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>El usuario accede a la sección de Departamentos</li>
                <li>Hace clic en el ícono de eliminar del departamento</li>
                <li>Confirma la eliminación en el diálogo de confirmación</li>
                <li>El sistema elimina el departamento</li>
                <li>Muestra mensaje de confirmación</li>
              </ol>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h3 className="font-medium text-yellow-800 mb-2">Excepciones</h3>
              <ul className="space-y-2">
                <li>
                  <span className="font-medium">Departamento con personal:</span>
                  <p className="text-sm text-gray-600">Si el departamento tiene personal asignado, muestra un mensaje de error.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartamentosCasoUso;
