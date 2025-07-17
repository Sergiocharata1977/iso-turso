import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import CapacitacionKanbanCard from './CapacitacionKanbanCard';
import EvaluacionCompetenciaKanbanCard from './EvaluacionCompetenciaKanbanCard';

const CapacitacionKanbanColumn = ({ id, title, capacitaciones, evaluacionesCompetencias, onCardClick, onEvaluacionCardClick, colorClasses, count }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    background: isOver ? 'rgba(0, 0, 0, 0.1)' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`min-w-80 rounded-lg border border-gray-200 dark:border-gray-700 ${colorClasses} transition-all duration-200`}
    >
      {/* Header de la columna */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
            {title}
          </h3>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm font-medium">
            {count}
          </span>
        </div>
      </div>
      {/* Contenido de las tarjetas */}
      <div className="p-4 min-h-96 max-h-screen overflow-y-auto">
        <div className="space-y-3">
          {/* Capacitaciones */}
          {capacitaciones && capacitaciones.length > 0 && capacitaciones.map((capacitacion) => (
            <CapacitacionKanbanCard
              key={`cap-${capacitacion.id}`}
              capacitacion={capacitacion}
              onClick={() => onCardClick(capacitacion.id)}
            />
          ))}
          {/* Evaluaciones de Competencias */}
          {evaluacionesCompetencias && evaluacionesCompetencias.length > 0 && evaluacionesCompetencias.map((evaluacion) => (
            <EvaluacionCompetenciaKanbanCard
              key={`eval-${evaluacion.id}`}
              evaluacion={evaluacion}
              onClick={() => onEvaluacionCardClick(evaluacion.id)}
            />
          ))}
          {/* Si no hay nada */}
          {(!capacitaciones || capacitaciones.length === 0) && (!evaluacionesCompetencias || evaluacionesCompetencias.length === 0) && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-sm">No hay elementos en esta etapa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CapacitacionKanbanColumn; 