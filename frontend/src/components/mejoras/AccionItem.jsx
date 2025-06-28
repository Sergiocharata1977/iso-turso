import React from 'react';
import { cn } from '@/lib/utils';

const getActionTypeInfo = (type) => {
  switch (type) {
    case 'inmediata':
      return {
        title: 'Acción Inmediata',
        className: 'border-purple-500',
      };
    case 'correctiva':
      return {
        title: 'Acción Correctiva',
        className: 'border-green-500',
      };
    default:
      return {
        title: 'Acción',
        className: 'border-gray-500',
      };
  }
};

const AccionItem = ({ accion }) => {
  const { title, className } = getActionTypeInfo(accion.tipo);

  return (
    <div className={cn('flex items-start p-3 bg-white rounded-lg border-l-4 shadow-sm', className)}>
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{accion.descripcion}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Fecha: {accion.fecha} | Estado: <span className="font-medium">{accion.estado}</span>
        </p>
      </div>
    </div>
  );
};

export default AccionItem;
