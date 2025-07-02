import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

const ListingHeader = ({ 
  title,
  subtitle,
  searchTerm,
  onSearchChange,
  onAddNew,
  addNewLabel,
  children // Para botones adicionales como Filtros o Exportar
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4">
      {/* Fila superior: Título y botón de Añadir */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
          {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {onAddNew && (
          <Button onClick={onAddNew} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> {addNewLabel || 'Nuevo'}
          </Button>
        )}
      </div>

      {/* Fila inferior: Búsqueda y botones de acción */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ListingHeader;
