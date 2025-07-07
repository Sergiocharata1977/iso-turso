import React from 'react';
import { FileText, Calendar, User } from 'lucide-react';

const NoticiasPage = () => {
  const noticias = [
    {
      id: 1,
      titulo: "Actualización del Sistema de Gestión",
      contenido: "Se ha implementado una nueva versión del sistema con mejoras en el módulo de auditorías.",
      fecha: "2024-01-15",
      autor: "Administrador",
      categoria: "Sistema"
    },
    {
      id: 2,
      titulo: "Capacitación en ISO 9001",
      contenido: "Próxima capacitación sobre los requisitos de la norma ISO 9001:2015 para todo el personal.",
      fecha: "2024-01-10",
      autor: "Recursos Humanos",
      categoria: "Capacitación"
    },
    {
      id: 3,
      titulo: "Auditoría Interna Programada",
      contenido: "Se ha programado una auditoría interna para el proceso de gestión de calidad.",
      fecha: "2024-01-05",
      autor: "Calidad",
      categoria: "Auditoría"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Noticias</h1>
            <p className="text-gray-600">Mantente al día con las últimas actualizaciones</p>
          </div>
        </div>
      </div>

      {/* Lista de noticias */}
      <div className="space-y-4">
        {noticias.map((noticia) => (
          <div key={noticia.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {noticia.categoria}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {noticia.titulo}
                </h2>
                <p className="text-gray-600 mb-4">
                  {noticia.contenido}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(noticia.fecha).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {noticia.autor}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón para agregar noticia */}
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600 mb-4">¿Tienes algo importante que comunicar?</p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Agregar Noticia
        </button>
      </div>
    </div>
  );
};

export default NoticiasPage; 