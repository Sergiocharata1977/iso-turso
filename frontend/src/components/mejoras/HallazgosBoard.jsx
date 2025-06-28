import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column } from './Column';
import { Card } from './Card';
import HallazgoDetailModal from './HallazgoDetailModal';
import hallazgosService from '../../services/hallazgosService';
import { STAGES, getStageFromEstado, getInitialStateForStage, canMove } from '../../lib/hallazgoWorkflow';
import { toast } from 'react-toastify';

export default function HallazgosBoard({ hallazgos: initialHallazgos, onCardClick, onUpdate }) {
  const [hallazgos, setHallazgos] = useState(initialHallazgos);
  const [activeHallazgo, setActiveHallazgo] = useState(null);

  useEffect(() => {
    setHallazgos(initialHallazgos);
  }, [initialHallazgos]);

  const columns = React.useMemo(() => {
    console.log('🔍 DEBUG: Hallazgos recibidos:', hallazgos);
    console.log('🔍 DEBUG: Cantidad de hallazgos:', hallazgos?.length);
    
    const grouped = {
      [STAGES.DETECCION]: [],
      [STAGES.TRATAMIENTO]: [],
      [STAGES.VERIFICACION]: [],
    };
    
    // Filtrar elementos null o indefinidos
    // Usar numeroHallazgo como clave única ya que algunos hallazgos tienen id null
    const validHallazgos = hallazgos?.filter(h => h && h.numeroHallazgo && h.estado) || [];
    console.log('🔍 DEBUG: Hallazgos válidos después del filtro:', validHallazgos.length);
    console.log('✅ DEBUG: Usando numeroHallazgo como identificador único');
    
    validHallazgos.forEach((h, index) => {
      const stage = getStageFromEstado(h.estado);
      console.log(`🔍 DEBUG: Hallazgo ${index + 1}: ${h.numeroHallazgo} - Estado: "${h.estado}" - Stage: "${stage}"`);
      if (stage) {
        grouped[stage].push(h);
      } else {
        console.warn(`⚠️  Hallazgo ${h.numeroHallazgo} tiene estado "${h.estado}" que no mapea a ningún stage`);
      }
    });
    
    console.log('🔍 DEBUG: Grouped final:', {
      [STAGES.DETECCION]: grouped[STAGES.DETECCION].length,
      [STAGES.TRATAMIENTO]: grouped[STAGES.TRATAMIENTO].length,
      [STAGES.VERIFICACION]: grouped[STAGES.VERIFICACION].length,
    });
    
    return grouped;
  }, [hallazgos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function findContainer(id) {
    if (id in columns) {
      return id;
    }
    return Object.keys(columns).find((key) => columns[key].find(item => item.id === id));
  }

  function handleDragStart(event) {
    const { active } = event;
    const hallazgo = hallazgos?.find(h => h && h.id === active.id);
    setActiveHallazgo(hallazgo);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveHallazgo(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      if (activeId !== overId) {
        const oldIndex = hallazgos.findIndex((h) => h && h.id === activeId);
        const newIndex = hallazgos.findIndex((h) => h && h.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrderedHallazgos = arrayMove(hallazgos, oldIndex, newIndex);
          setHallazgos(newOrderedHallazgos);
          const orderedIds = newOrderedHallazgos.map(h => h.id);
          hallazgosService.updateHallazgosOrder(orderedIds).catch(err => {
            console.error("Failed to save order:", err);
            toast.error("No se pudo guardar el nuevo orden.");
            setHallazgos(hallazgos); // Revert
          });
        }
      }
      return;
    }

    const hallazgoToMove = hallazgos.find(h => h && h.id === activeId);
    if (!canMove(hallazgoToMove.estado, overContainer)) {
      toast.warn("Movimiento no permitido.");
      return;
    }

    const newEstado = getInitialStateForStage(overContainer);
    if (!newEstado) return;

    try {
      await hallazgosService.updateHallazgoEstado(activeId, newEstado);
      toast.success(`Hallazgo movido a ${overContainer}`);
      onUpdate(); // Notify parent to re-fetch
    } catch (error) {
      console.error("Error updating hallazgo state:", error);
      toast.error("Error al mover el hallazgo.");
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {Object.entries(columns).map(([id, hallazgos]) => (
            <Column key={id} id={id} title={id} hallazgos={hallazgos} onCardClick={onCardClick}/> 
          ))}
        </div>
        <DragOverlay>
          {activeHallazgo ? <Card hallazgo={activeHallazgo} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
