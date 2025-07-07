import React from 'react';
import { ShieldCheck, Plus, Calendar, AlertTriangle } from 'lucide-react';

const TratamientosPage = () => {
  const tratamientos = [
    {
      id: 1,
      nombre: "Tratamiento de No Conformidades",
      tipo: "Correctivo",
      fecha: "2024-01-15",
      estado: "En proceso",
      responsable: "Equipo de Calidad"
    },
    {
      id: 2,
      nombre: "Prevención de Riesgos Operacionales",
      tipo: "Preventivo",
      fecha: "2024-01-10",
      estado: "Completado",
      responsable: "Seguridad"
    },
    {
      id: 3,
      nombre: "Mejora del Proceso de Revisión",
      tipo: "Mejora",
      fecha: "2024-01-20",
      estado: "Planificado",
      responsable: "Gestión"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tratamientos</h1>
              <p className="text-gray-600">Gestión de acciones correctivas y preventivas</p>
            </div>
          </div>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Tratamiento
          </button>
        </div>
      </div>

      {/* Lista de tratamientos */}
      <div className="space-y-4">
        {tratamientos.map((tratamiento) => (
          <div key={tratamiento.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    tratamiento.tipo === 'Correctivo' ? 'bg-red-100 text-red-800' :
                    tratamiento.tipo === 'Preventivo' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {tratamiento.tipo}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    tratamiento.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                    tratamiento.estado === 'En proceso' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {tratamiento.estado}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {tratamiento.nombre}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(tratamiento.fecha).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {tratamiento.responsable}
                  </div>
                </div>
              </div>
              <button className="text-indigo-500 hover:text-indigo-700 transition-colors">
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TratamientosPage; 