import React from 'react';
import { Settings, User, Building, Shield, Bell } from 'lucide-react';

const ConfiguracionPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-600">Ajustes del sistema y organización</p>
          </div>
        </div>
      </div>

      {/* Secciones de configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Perfil de Usuario</h2>
          </div>
          <p className="text-gray-600 mb-4">Gestiona tu información personal y preferencias</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Editar Perfil
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building className="w-6 h-6 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900">Organización</h2>
          </div>
          <p className="text-gray-600 mb-4">Configuración de la empresa y datos generales</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            Configurar
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900">Seguridad</h2>
          </div>
          <p className="text-gray-600 mb-4">Configuración de seguridad y permisos</p>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
            Ajustar
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
          </div>
          <p className="text-gray-600 mb-4">Preferencias de notificaciones y alertas</p>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
            Personalizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionPage; 