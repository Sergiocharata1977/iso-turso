import React, { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import CapacitacionKanbanColumn from './CapacitacionKanbanColumn';

// Definición de las columnas del Kanban para capacitaciones y sus estados correspondientes
const columnConfig = [
  { 
    id: 'planificacion', 
    title: 'Planificación', 
    states: ['Planificada', 'Programada'], 
    colorClasses: 'bg-blue-100 dark:bg-blue-900/40',
    description: 'Capacitaciones en fase de planificación y programación'
  },
  { 
    id: 'preparacion', 
    title: 'En Preparación', 
    states: ['En Preparación', 'Preparando Material'], 
    colorClasses: 'bg-orange-100 dark:bg-orange-900/40',
    description: 'Preparando materiales y recursos para la capacitación'
  },
  { 
    id: 'evaluacion', 
    title: 'En Evaluación', 
    states: ['En Evaluación', 'Evaluando Resultados'], 
    colorClasses: 'bg-purple-100 dark:bg-purple-900/40',
    description: 'Evaluando la efectividad y resultados de la capacitación'
  },
  { 
    id: 'completada', 
    title: 'Completada', 
    states: ['Completada', 'Finalizada', 'Cerrada'], 
    colorClasses: 'bg-green-100 dark:bg-green-900/40',
    description: 'Capacitaciones finalizadas exitosamente'
  },
];

const CapacitacionKanbanBoard = ({ capacitaciones, evaluacionesCompetencias, onCardClick, onEvaluacionCardClick, onCapacitacionStateChange, onEvaluacionStateChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Permite clics si el cursor no se mueve más de 10px
      },
    })
  );
  const [items, setItems] = useState({});

  useEffect(() => {
    // Agrupa capacitaciones y evaluaciones de competencias en las columnas definidas en columnConfig
    const itemsPorColumna = columnConfig.reduce((acc, column) => {
      acc[column.id] = {
        capacitaciones: capacitaciones.filter(c => column.states.includes(c.estado)),
        evaluacionesCompetencias: evaluacionesCompetencias.filter(e => column.states.includes(e.estado)),
      };
      return acc;
    }, {});
    setItems(itemsPorColumna);
  }, [capacitaciones, evaluacionesCompetencias]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const capacitacion = capacitaciones.find(c => c.id === active.id);
    if (!capacitacion) return;

    const activeColumn = columnConfig.find(c => c.states.includes(capacitacion.estado));
    
    // Si se suelta sobre la misma columna, no hacer nada
    if (over.id === activeColumn?.id) return;

    const capacitacionId = active.id;
    const newColumnId = over.id;

    const targetColumn = columnConfig.find(c => c.id === newColumnId);
    if (!targetColumn) return;

    // Al mover una tarjeta, se asigna el primer estado definido para esa columna.
    const newEstado = targetColumn.states[0];
    
    onCapacitacionStateChange(capacitacionId, newEstado);
  };

  const getTotalPorColumna = (columnId) => {
    return items[columnId]?.capacitaciones?.length || 0;
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header con estadísticas */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {columnConfig.map((column) => (
            <div key={column.id} className={`rounded-lg p-4 ${column.colorClasses} border border-gray-200`}>
              <div className="text-center">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">{column.title}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {getTotalPorColumna(column.id)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{column.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Kanban Board */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: `${columnConfig.length * 320}px` }}>
            {columnConfig.map((column) => (
              <CapacitacionKanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                capacitaciones={items[column.id]?.capacitaciones || []}
                evaluacionesCompetencias={items[column.id]?.evaluacionesCompetencias || []}
                onCardClick={onCardClick}
                onEvaluacionCardClick={onEvaluacionCardClick}
                colorClasses={column.colorClasses}
                count={getTotalPorColumna(column.id)}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default CapacitacionKanbanBoard; 