import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Card } from './Card';

export function Column({ id, title, hallazgos, onCardClick }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="w-full md:w-1/3 flex flex-col">
      <div className="bg-gray-200 dark:bg-gray-900/50 p-3 rounded-t-lg border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 tracking-wide">{title}</h2>
      </div>
      <div
        ref={setNodeRef}
        className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-b-lg flex-grow min-h-[200px] transition-colors duration-300"
      >
        <SortableContext items={hallazgos.filter(h => h && h.id).map(h => h.id)} strategy={verticalListSortingStrategy}>
          {hallazgos.filter(h => h && h.id).map(hallazgo => (
            <Card key={hallazgo.id} hallazgo={hallazgo} onClick={() => onCardClick(hallazgo)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
