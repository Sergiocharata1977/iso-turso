import React from 'react';
import { CheckSquare, Plus, Calendar, User } from 'lucide-react';

const VerificacionesPage = () => {
  const verificaciones = [
    {
      id: 1,
      titulo: "Verificación de Proceso de Auditoría",
      descripcion: "Verificar el cumplimiento del proceso de auditoría interna",
      fecha: "2024-01-15",
      estado: "Completado",
      verificador: "Auditor Principal"
    },
    {
      id: 2,
      titulo: "Verificación de Documentación",
      descripcion: "Revisar la actualización de documentos del sistema",
      fecha: "2024-01-18",
      estado: "En proceso",
      verificador: "Responsable de Calidad"
    },
    {
      id: 3,
      titulo: "Verificación de Capacitaciones",
      descripcion: "Confirmar la efectividad de las capacitaciones realizadas",
      fecha: "2024-01-20",
      estado: "Programado",
      verificador: "Recursos Humanos"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Verificaciones</h1>
              <p className="text-gray-600">Control y seguimiento de verificaciones del sistema</p>
            </div>
          </div>
          <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Verificación
          </button>
        </div>
      </div>

      {/* Lista de verificaciones */}
      <div className="space-y-4">
        {verificaciones.map((verificacion) => (
          <div key={verificacion.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    verificacion.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                    verificacion.estado === 'En proceso' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {verificacion.estado}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {verificacion.titulo}
                </h2>
                <p className="text-gray-600 mb-4">
                  {verificacion.descripcion}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(verificacion.fecha).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {verificacion.verificador}
                  </div>
                </div>
              </div>
              <button className="text-teal-500 hover:text-teal-700 transition-colors">
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificacionesPage; 