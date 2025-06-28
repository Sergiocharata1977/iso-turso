import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Card({ hallazgo, isOverlay = false, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: hallazgo.id,
    disabled: isOverlay, // Disable hook logic for the overlay card
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0 : 1, // Hide original card, not the overlay one
  };

  return (
    <div
      ref={setNodeRef}
      style={isOverlay ? {} : style} // Overlay position is handled by DragOverlay, not sortable
      {...attributes}
      className={cn(
        "bg-white p-3 mb-3 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-700",
        isOverlay && "shadow-xl ring-2 ring-emerald-500",
        "transition-opacity duration-200"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow cursor-pointer" onClick={onClick}>
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{hallazgo.numeroHallazgo}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{hallazgo.titulo}</p>
        </div>
        <div {...listeners} className="p-1 cursor-grab text-gray-400 hover:text-gray-700">
          <GripVertical size={16} />
        </div>
      </div>
    </div>
  );
}
