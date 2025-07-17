import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { AccionKanbanColumn } from './AccionKanbanColumn';
import { AccionKanbanCard } from './AccionKanbanCard';
import { toast } from 'sonner';
import { accionWorkflow, ACCION_ESTADOS } from '@/config/accionWorkflow';

export function AccionKanbanBoard({ acciones, onStateChange, onCardClick }) {
  const [columns, setColumns] = useState([]);
  const [activeAccion, setActiveAccion] = useState(null);

  useEffect(() => {
    const statesForBoard = Object.keys(accionWorkflow).filter(
      (key) => key !== ACCION_ESTADOS.CERRADA
    );

    const groupedAcciones = statesForBoard.reduce((acc, estadoKey) => {
      acc[estadoKey] = acciones.filter((a) => a.estado === estadoKey);
      return acc;
    }, {});

    const boardColumns = statesForBoard.map((estadoKey) => ({
      id: estadoKey,
      title: accionWorkflow[estadoKey].title,
      acciones: groupedAcciones[estadoKey] || [],
      colorClasses: accionWorkflow[estadoKey].colorClasses,
    }));
    setColumns(boardColumns);
  }, [acciones]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function handleDragStart(event) {
    if (event.active.data.current?.type === 'Accion') {
      setActiveAccion(event.active.data.current.accion);
    }
  }

  async function handleDragEnd(event) {
    setActiveAccion(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer !== overContainer) {
      const targetState = overContainer;
      
      if (onStateChange) {
        onStateChange(activeId, targetState);
      } else {
        console.warn('onStateChange handler not provided to AccionKanbanBoard');
      }
    } else {
      toast.info('Reordenamiento dentro de la misma columna no implementado.');
    }
  }

  return (
    <div className="flex flex-col flex-grow">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-grow overflow-x-auto pb-4">
          <div className="flex gap-4">
          <SortableContext items={columns.map(col => col.id)}>
            {columns.map(col => (
              <AccionKanbanColumn 
                key={col.id} 
                id={col.id} 
                title={col.title} 
                acciones={col.acciones} 
                onCardClick={onCardClick}
                colorClasses={col.colorClasses}
              />
            ))}
          </SortableContext>
          </div>
        </div>
        <DragOverlay>
          {activeAccion && <AccionKanbanCard accion={activeAccion} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
