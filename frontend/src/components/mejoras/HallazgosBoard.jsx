import React, { useState, useMemo } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { toast } from 'react-toastify';

import { Column } from './Column';
import { Card } from './Card';
import { stages, getStageFromEstado, getInitialStateForStage, canMove } from '../../lib/hallazgoWorkflow';
import hallazgosService from '../../services/hallazgosService';
import accionesService from '../../services/accionesService';

export default function HallazgosBoard({ items, onUpdate, onCardClick }) {
  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require pointer to move 8px to start a drag
      },
    })
  );

  const groupedItems = useMemo(() => {
    const initialGroups = stages.reduce((acc, stage) => {
      acc[stage.id] = [];
      return acc;
    }, {});

    return items.reduce((acc, item) => {
      if (item && item.estado) {
        const stageId = getStageFromEstado(item.estado);
        if (stageId && acc[stageId]) {
          acc[stageId].push(item);
        } else {
          // This can happen if an item has a state not defined in the workflow
        }
      } 
      return acc;
    }, initialGroups);
  }, [items]);

  function findContainer(id) {
    if (stages.some(s => s.id === id)) return id;
    return Object.keys(groupedItems).find(stageId => 
      groupedItems[stageId].some(item => item.id === id)
    );
  }

  function handleDragStart(event) {
    const { active } = event;
    const item = items.find(i => i.id === active.id);
    setActiveItem(item);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      // Handle reordering within the same column if needed in the future
      return;
    }

    const itemToMove = items.find(i => i.id === activeId);
    if (!itemToMove) return;

    if (!canMove(itemToMove.estado, overContainer)) {
      toast.warn('Movimiento no permitido.');
      return;
    }

    const newEstado = getInitialStateForStage(overContainer);
    if (!newEstado) {
      toast.error('La etapa de destino no tiene un estado inicial definido.');
      return;
    }

    try {
      if (itemToMove.type === 'hallazgo') {
        await hallazgosService.updateHallazgoEstado(activeId, newEstado);
      } else if (itemToMove.type === 'accion') {
        await accionesService.updateAccionEstado(activeId, newEstado);
      } else {
        throw new Error('Tipo de item desconocido');
      }
      toast.success(`'${itemToMove.numeroHallazgo || itemToMove.numeroAccion}' movido a ${overContainer.replace(/_/g, ' ')}`);
      onUpdate(); // Notify parent to re-fetch all data
    } catch (error) {
      console.error('Error al actualizar el estado del item:', error);
      toast.error('No se pudo mover el item.');
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-row gap-4 overflow-x-auto pb-4">
          {stages.map(stage => (
            <Column 
              key={stage.id} 
              id={stage.id} 
              title={stage.title} 
              items={groupedItems[stage.id] || []} 
              onCardClick={onCardClick}
            /> 
          ))}
        </div>
        <DragOverlay>
          {activeItem ? <Card item={activeItem} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
