import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { AccionKanbanColumn } from './AccionKanbanColumn';
import { AccionKanbanCard } from './AccionKanbanCard';
// import { accionesService } from '@/services/accionesService'; // A crear
import { toast } from 'sonner';

// Estados basados en la imagen proporcionada
const estadoMap = {
  'i3_programada': 'Programada',
  'i5_implementacion_finalizada': 'Implementación Finalizada',
  'c3_planificacion_de_la_verificacion': 'Planificación Verificación',
  'c4_ejecutada_la_verificacion': 'Verificación Ejecutada',
  'c5_cerrado': 'Cerrado',
};

export function AccionKanbanBoard({ acciones, onStateChange }) {
  const [columns, setColumns] = useState([]);
  const [activeAccion, setActiveAccion] = useState(null);

  useEffect(() => {
    const groupedAcciones = Object.keys(estadoMap).reduce((acc, estadoKey) => {
      acc[estadoKey] = acciones
        .filter(a => a.estado === estadoKey)
        .sort((a, b) => a.orden - b.orden); // Asumiendo que hay un campo 'orden'
      return acc;
    }, {});

    const boardColumns = Object.keys(estadoMap).map(estadoKey => ({
      id: estadoKey,
      title: estadoMap[estadoKey],
      acciones: groupedAcciones[estadoKey] || [],
    }));
    setColumns(boardColumns);
  }, [acciones]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 10px
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
      // Mover a otra columna (cambio de estado)
      const accionId = activeId;
      const targetState = overContainer;
      console.log(`Solicitando cambio de estado para la acción ${activeId} a ${targetState}`);

      // Notificar al componente padre que se ha solicitado un cambio de estado.
      // El padre se encargará de abrir el modal y, si se confirma, de actualizar los datos.
      if (onStateChange) {
        onStateChange(activeId, targetState);
      } else {
        console.warn('onStateChange no fue proporcionado a AccionKanbanBoard');
      }
    } else {
      // Reordenar en la misma columna (lógica pendiente si es necesaria)
      toast.info('Reordenamiento en la misma columna pendiente.');
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <SortableContext items={columns.map(col => col.id)}>
          {columns.map(col => (
            <AccionKanbanColumn key={col.id} id={col.id} title={col.title} acciones={col.acciones} />
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeAccion && <AccionKanbanCard accion={activeAccion} />}
      </DragOverlay>
    </DndContext>
  );
}
