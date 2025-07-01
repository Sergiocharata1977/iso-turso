import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function KanbanColumn({ id, title, hallazgos }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div ref={setNodeRef} className="w-80 flex-shrink-0">
      <Card className="bg-gray-50 dark:bg-gray-900/50 h-full flex flex-col">
        <CardHeader className="p-4 border-b dark:border-gray-700">
          <CardTitle className="flex items-center justify-between">
            <span className="font-semibold text-base text-gray-800 dark:text-gray-200">{title}</span>
            <span className="text-sm font-normal text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">
              {hallazgos.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-grow min-h-[200px]">
          <SortableContext items={hallazgos.map(h => h.id)}>
            <div className="space-y-4">
              {hallazgos.map((hallazgo) => (
                <KanbanCard key={hallazgo.id} hallazgo={hallazgo} />
              ))}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}
