import React from 'react';
import { ArrowLeft, User, Shield, Database, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UsuariosCasoUso = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <button
        onClick={() => navigate('/documentacion/casos-uso')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Casos de Uso
      </button>

      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <User className="h-8 w-8 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CU-001: Gestión de Usuarios</h1>
            <p className="text-gray-600">Sistema de administración de usuarios multi-tenant</p>
          </div>
        </div>

        {/* Resumen */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Resumen</h2>
          <p className="text-gray-600">
            Este caso de uso describe el proceso completo de gestión de usuarios en el sistema ISO Flow 3.0,
            incluyendo la creación, modificación, eliminación y asignación de roles a usuarios dentro de una
            organización específica.
          </p>
        </section>

        {/* Actores */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Actores</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Administrador</span>
              <span className="text-gray-600">(Actor principal)</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Usuario</span>
              <span className="text-gray-600">(Actor secundario)</span>
            </div>
          </div>
        </section>

        {/* Precondiciones */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Precondiciones</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
              <span className="text-gray-600">El administrador debe estar autenticado en el sistema</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
              <span className="text-gray-600">El administrador debe tener permisos de gestión de usuarios</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
              <span className="text-gray-600">La organización debe estar activa y con licencia válida</span>
            </li>
          </ul>
        </section>

        {/* Flujo Principal */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Flujo Principal</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Acceder al módulo de usuarios</h4>
                <p className="text-gray-600">El administrador navega a la sección "Usuarios" desde el menú principal</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Visualizar lista de usuarios</h4>
                <p className="text-gray-600">El sistema muestra todos los usuarios de la organización actual</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Crear nuevo usuario</h4>
                <p className="text-gray-600">El administrador completa el formulario con: nombre, email, rol y departamento</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold">
                4
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Validar información</h4>
                <p className="text-gray-600">El sistema valida que el email sea único y los datos sean correctos</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold">
                5
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Guardar usuario</h4>
                <p className="text-gray-600">El sistema crea el usuario y envía email de bienvenida con credenciales</p>
              </div>
            </div>
          </div>
        </section>

        {/* Flujos Alternativos */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Flujos Alternativos</h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <h4 className="font-medium text-gray-900">3a. Editar usuario existente</h4>
              <p className="text-gray-600 text-sm">El administrador selecciona un usuario y modifica sus datos</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">3b. Eliminar usuario</h4>
              <p className="text-gray-600 text-sm">El administrador elimina un usuario previa confirmación</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">4a. Email duplicado</h4>
              <p className="text-gray-600 text-sm">El sistema muestra error y solicita un email diferente</p>
            </div>
          </div>
        </section>

        {/* Postcondiciones */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Postcondiciones</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Database className="h-5 w-5 text-blue-500 mt-0.5" />
              <span className="text-gray-600">Usuario creado/modificado en la base de datos</span>
            </li>
            <li className="flex items-start gap-2">
              <Database className="h-5 w-5 text-blue-500 mt-0.5" />
              <span className="text-gray-600">Registro de auditoría generado</span>
            </li>
            <li className="flex items-start gap-2">
              <Database className="h-5 w-5 text-blue-500 mt-0.5" />
              <span className="text-gray-600">Email de notificación enviado</span>
            </li>
          </ul>
        </section>

        {/* Notas Técnicas */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Notas Técnicas</h2>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Implementación Multi-Tenant</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Cada usuario está asociado a una organización mediante organization_id</li>
              <li>• Los usuarios solo pueden ver/editar usuarios de su propia organización</li>
              <li>• El sistema valida automáticamente el organization_id en todas las operaciones</li>
              <li>• Las contraseñas se almacenan usando bcrypt con salt</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UsuariosCasoUso;
