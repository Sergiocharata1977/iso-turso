import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Calendar, User, Award, ClipboardCheck } from 'lucide-react';

const EvaluacionCompetenciaKanbanCard = ({ evaluacion, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: evaluacion.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 1,
  } : undefined;

  const getEstadoBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_progreso':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completada':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 
        cursor-pointer hover:shadow-md transition-all duration-200 select-none
        ${isDragging ? 'opacity-50 rotate-3 scale-105' : ''}
      `}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Header con competencia y persona */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className="bg-emerald-100 p-1.5 rounded-lg flex-shrink-0">
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
              {evaluacion.competencia_nombre}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {evaluacion.persona_nombre}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <ClipboardCheck className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Información adicional */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(evaluacion.fecha)}</span>
        </div>
        {evaluacion.evaluador_nombre && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <User className="h-3 w-3" />
            <span className="truncate">{evaluacion.evaluador_nombre}</span>
          </div>
        )}
        {evaluacion.puntaje && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Puntaje:</span>
            <span className="font-bold">{evaluacion.puntaje}</span>
          </div>
        )}
      </div>

      {/* Footer con estado */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEstadoBadgeColor(evaluacion.estado)}`}>
          {evaluacion.estado}
        </span>
        {/* Indicador de drag */}
        <div className="flex gap-0.5">
          <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default EvaluacionCompetenciaKanbanCard; 