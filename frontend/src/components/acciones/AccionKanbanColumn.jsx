import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { AccionKanbanCard } from './AccionKanbanCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AccionKanbanColumn({ id, title, acciones, onCardClick }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div ref={setNodeRef} className="w-80 flex-shrink-0">
      <Card className="bg-gray-50 dark:bg-gray-900/50 h-full flex flex-col">
        <CardHeader className="p-4 border-b dark:border-gray-700">
          <CardTitle className="flex items-center justify-between">
            <span className="font-semibold text-base text-gray-800 dark:text-gray-200">{title}</span>
            <span className="text-sm font-normal text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">
              {acciones.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-grow min-h-[200px]">
          <SortableContext items={acciones.map(a => a.id)}>
            <div className="space-y-4">
              {acciones.map((accion) => (
                <AccionKanbanCard key={accion.id} accion={accion} onClick={onCardClick} />
              ))}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}
