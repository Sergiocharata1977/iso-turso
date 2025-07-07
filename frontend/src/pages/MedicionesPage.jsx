import React from 'react';
import { BarChart3, Plus, Calendar, TrendingUp, Target } from 'lucide-react';

const MedicionesPage = () => {
  const mediciones = [
    {
      id: 1,
      nombre: "Satisfacción del Cliente",
      valor: 85,
      unidad: "%",
      fecha: "2024-01-15",
      objetivo: 90,
      estado: "En seguimiento"
    },
    {
      id: 2,
      nombre: "Tiempo de Respuesta",
      valor: 24,
      unidad: "horas",
      fecha: "2024-01-14",
      objetivo: 48,
      estado: "Cumplido"
    },
    {
      id: 3,
      nombre: "Defectos por Proceso",
      valor: 2,
      unidad: "defectos/100",
      fecha: "2024-01-13",
      objetivo: 5,
      estado: "Cumplido"
    }
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Cumplido':
        return 'bg-green-100 text-green-800';
      case 'En seguimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'No cumplido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgreso = (valor, objetivo) => {
    return Math.min((valor / objetivo) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mediciones</h1>
              <p className="text-gray-600">Seguimiento y control de indicadores clave</p>
            </div>
          </div>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Medición
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Objetivos Cumplidos</p>
              <p className="text-2xl font-bold text-green-600">2</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En Seguimiento</p>
              <p className="text-2xl font-bold text-yellow-600">1</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Mediciones</p>
              <p className="text-2xl font-bold text-blue-600">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de mediciones */}
      <div className="space-y-4">
        {mediciones.map((medicion) => (
          <div key={medicion.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(medicion.estado)}`}>
                    {medicion.estado}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {medicion.nombre}
                </h2>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(medicion.fecha).toLocaleDateString('es-ES')}
                  </div>
                  <div>
                    Valor actual: <span className="font-medium">{medicion.valor} {medicion.unidad}</span>
                  </div>
                  <div>
                    Objetivo: <span className="font-medium">{medicion.objetivo} {medicion.unidad}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {medicion.valor} {medicion.unidad}
                </div>
                <div className="text-sm text-gray-500">
                  {getProgreso(medicion.valor, medicion.objetivo).toFixed(1)}% del objetivo
                </div>
              </div>
            </div>
            
            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgreso(medicion.valor, medicion.objetivo)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicionesPage; 