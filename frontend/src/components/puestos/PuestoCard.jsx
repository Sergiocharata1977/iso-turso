import React from 'react';
import { Users, Briefcase, Building2, GraduationCap, Clock, ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function PuestoCard({ puesto, onEdit, onDelete, onViewDetails, theme = "light", primaryColor = "emerald" }) {
  const getColorClasses = () => {
    switch (primaryColor) {
      case 'emerald':
        return {
          gradient: 'from-emerald-500 to-emerald-600',
          hoverBorder: 'hover:border-emerald-500',
          textHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
          badgeDot: 'bg-emerald-500',
          iconHover: 'group-hover:text-emerald-500',
          viewButton: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
        };
      case 'blue':
        return {
          gradient: 'from-blue-500 to-blue-600',
          hoverBorder: 'hover:border-blue-500',
          textHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          badgeDot: 'bg-blue-500',
          iconHover: 'group-hover:text-blue-500',
          viewButton: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
        };
      default:
        return {
          gradient: 'from-emerald-500 to-emerald-600',
          hoverBorder: 'hover:border-emerald-500',
          textHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
          badgeDot: 'bg-emerald-500',
          iconHover: 'group-hover:text-emerald-500',
          viewButton: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div 
      onClick={() => onViewDetails(puesto)}
      className={cn(
        "group bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300",
        "cursor-pointer border border-slate-200 dark:border-slate-700",
        "transform hover:-translate-y-1 overflow-hidden",
        colors.hoverBorder
      )}
    >
      {/* Header con gradiente */}
      <div className={`bg-gradient-to-r ${colors.gradient} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <h3 className="font-bold text-lg truncate">{puesto.nombre}</h3>
          </div>
          {puesto.codigo_puesto && (
            <div className="bg-white/20 text-white border-white/30 px-2 py-1 rounded text-xs font-medium">
              {puesto.codigo_puesto}
            </div>
          )}
        </div>
        {puesto.departamento && (
          <div className="flex items-center gap-1 mt-2 text-white/90">
            <Building2 className="h-3 w-3" />
            <span className="text-sm">{puesto.departamento.nombre}</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-grow p-4 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
          {puesto.descripcion || 'Sin descripción disponible'}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-800 dark:text-gray-200">0 empleados</span>
            </span>
          </div>
          
          {puesto.requisitos_experiencia && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400 line-clamp-1">
                {puesto.requisitos_experiencia}
              </span>
            </div>
          )}

          {puesto.requisitos_formacion && (
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400 line-clamp-1">
                {puesto.requisitos_formacion}
              </span>
            </div>
          )}

          {/* Stats mini */}
          <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${colors.badgeDot}`}></div>
              <span>{puesto.estado || 'Activo'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              <span>Puesto</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className={colors.viewButton}
          onClick={(e) => { e.stopPropagation(); onViewDetails(puesto); }}
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            onClick={(e) => { e.stopPropagation(); onEdit(puesto); }}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
            onClick={(e) => { e.stopPropagation(); onDelete(puesto.id); }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Componente Skeleton para carga
PuestoCard.Skeleton = function PuestoCardSkeleton({ theme = "light", primaryColor = "emerald" }) {
  const colors = primaryColor === 'emerald' ? 'from-emerald-500 to-emerald-600' : 'from-blue-500 to-blue-600';
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse overflow-hidden">
      <div className={`bg-gradient-to-r ${colors} p-4 h-20`}></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="flex gap-1">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 