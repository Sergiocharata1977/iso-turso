import React, { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import HallazgoKanbanColumn from './HallazgoKanbanColumn';

// Definición de las columnas del Kanban, sus estados correspondientes y colores.
const columnConfig = [
  { id: 'deteccion', title: 'Detección', states: ['deteccion', 'd1_iniciado'], colorClasses: 'bg-orange-100 dark:bg-orange-900/40' },
  { id: 'planificacion', title: 'Planificación A.I.', states: ['planificacion_ai', 'd1_accion_inmediata_programada', 'd2_accion_inmediata_programada'], colorClasses: 'bg-blue-100 dark:bg-blue-900/40' },
  { id: 'ejecucion', title: 'Ejecución A.I.', states: ['ejecucion_ai', 'd2_analisis_causa_raiz_programado'], colorClasses: 'bg-indigo-100 dark:bg-indigo-900/40' },
  { id: 'analisis', title: 'Análisis y Plan de Acción', states: ['analisis_plan_accion', 'd3_plan_accion_definido'], colorClasses: 'bg-purple-100 dark:bg-purple-900/40' },
  { id: 'verificacion_cierre', title: 'Verificación y Cierre', states: ['verificacion_cierre', 'd4_verificacion_programada', 'd5_verificacion_eficacia_realizada'], colorClasses: 'bg-green-100 dark:bg-green-900/40' },
];

const HallazgoKanbanBoard = ({ hallazgos, onCardClick, onHallazgoStateChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Permite clics si el cursor no se mueve más de 10px
      },
    })
  );
  const [items, setItems] = useState({});

  useEffect(() => {
    // Agrupa los hallazgos en las columnas definidas en columnConfig
    const hallazgosPorColumna = columnConfig.reduce((acc, column) => {
      acc[column.id] = hallazgos.filter(h => column.states.includes(h.estado));
      return acc;
    }, {});
    setItems(hallazgosPorColumna);
  }, [hallazgos]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const hallazgo = hallazgos.find(h => h.id === active.id);
    if (!hallazgo) return;

    const activeColumn = columnConfig.find(c => c.states.includes(hallazgo.estado));
    
    // Si se suelta sobre la misma columna, no hacer nada
    if (over.id === activeColumn?.id) return;

    const hallazgoId = active.id;
    const newColumnId = over.id;

    const targetColumn = columnConfig.find(c => c.id === newColumnId);
    if (!targetColumn) return;

    // Al mover una tarjeta, se asigna el primer estado definido para esa columna.
    const newEstado = targetColumn.states[0];
    
    onHallazgoStateChange(hallazgoId, newEstado);
  };

  return (
    <div className="flex flex-col flex-grow p-4">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex-grow overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: `${columnConfig.length * 320}px` }}>
            {columnConfig.map((column) => (
              <HallazgoKanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                hallazgos={items[column.id] || []}
                onCardClick={onCardClick}
                colorClasses={column.colorClasses}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default HallazgoKanbanBoard;
