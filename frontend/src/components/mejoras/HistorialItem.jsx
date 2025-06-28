import React from 'react';
import { GitCommit, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const getHistoryTypeInfo = (type) => {
  switch (type) {
    case 'estado':
      return {
        Icon: GitCommit,
        className: 'text-blue-500 bg-blue-100',
      };
    case 'creacion':
      return {
        Icon: PlusCircle,
        className: 'text-green-500 bg-green-100',
      };
    default:
      return {
        Icon: GitCommit,
        className: 'text-gray-500 bg-gray-100',
      };
  }
};

const HistorialItem = ({ item, isLast }) => {
  const { Icon, className } = getHistoryTypeInfo(item.tipo);

  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className={cn('flex items-center justify-center w-8 h-8 rounded-full z-10', className)}>
          <Icon className="w-5 h-5" />
        </div>
        {!isLast && <div className="w-px h-full bg-gray-300" />}n      </div>
      <div className="flex-grow pb-8">
        <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">{item.descripcion}</p>
            <div className="text-right">
                <p className="text-xs text-muted-foreground">{item.fecha}</p>
                <p className="text-xs text-muted-foreground">{item.usuario}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialItem;
