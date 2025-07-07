import React from 'react';
import { TrendingUp, Plus, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const MejorasPage = () => {
  const mejoras = [
    {
      id: 1,
      titulo: "Optimización del proceso de auditoría",
      descripcion: "Implementar herramientas digitales para agilizar el proceso de auditoría interna",
      estado: "En progreso",
      fecha: "2024-01-15",
      responsable: "Equipo de Calidad",
      prioridad: "Alta"
    },
    {
      id: 2,
      titulo: "Capacitación en nuevas tecnologías",
      descripcion: "Programa de capacitación para el personal en las nuevas herramientas del sistema",
      estado: "Planificado",
      fecha: "2024-01-20",
      responsable: "Recursos Humanos",
      prioridad: "Media"
    },
    {
      id: 3,
      titulo: "Mejora en la comunicación interna",
      descripcion: "Implementar sistema de notificaciones automáticas para mejorar la comunicación",
      estado: "Completado",
      fecha: "2024-01-05",
      responsable: "IT",
      prioridad: "Media"
    }
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'En progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Planificado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Completado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'En progreso':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Planificado':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mejoras</h1>
              <p className="text-gray-600">Gestión de mejoras continuas del sistema</p>
            </div>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Mejora
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">1</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En Progreso</p>
              <p className="text-2xl font-bold text-yellow-600">1</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Planificadas</p>
              <p className="text-2xl font-bold text-blue-600">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de mejoras */}
      <div className="space-y-4">
        {mejoras.map((mejora) => (
          <div key={mejora.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(mejora.estado)}`}>
                    {mejora.estado}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {mejora.prioridad}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {mejora.titulo}
                </h2>
                <p className="text-gray-600 mb-4">
                  {mejora.descripcion}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(mejora.fecha).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center gap-1">
                    {getEstadoIcon(mejora.estado)}
                    {mejora.responsable}
                  </div>
                </div>
              </div>
              <button className="text-blue-500 hover:text-blue-700 transition-colors">
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MejorasPage; 