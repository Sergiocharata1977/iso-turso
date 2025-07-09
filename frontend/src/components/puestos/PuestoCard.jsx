import React from 'react';
import { Users, Briefcase, Building2, GraduationCap, Clock, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function PuestoCard({ puesto, onEdit, onDelete, onViewDetails, theme = "light" }) {
  return (
    <div 
      onClick={() => onViewDetails(puesto)}
      className={cn(
        "group bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200",
        "cursor-pointer border border-slate-200 dark:border-slate-700",
        "transform hover:-translate-y-1"
      )}
    >
      {/* Encabezado */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {puesto.titulo_puesto || puesto.nombre}
            </h3>
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Building2 className="w-4 h-4 mr-1" />
              <span>{puesto.departamento?.nombre || 'No especificado'}</span>
            </div>
          </div>
          
          {/* Estado con mejor diseño */}
          <div className="flex items-center">
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium",
              "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
              "flex items-center gap-1"
            )}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {puesto.estado || 'Activo'}
            </span>
          </div>
        </div>

        {/* Descripción con límite de líneas */}
        <div className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          <p className="line-clamp-2">{puesto.descripcion || 'Sin descripción'}</p>
        </div>

        {/* Métricas y KPIs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Users className="w-4 h-4 mr-2" />
            <div>
              <p className="font-medium">0</p>
              <p className="text-xs">Empleados</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 mr-2" />
            <div>
              <p className="font-medium">Experiencia</p>
              <p className="text-xs">{puesto.requisitos_experiencia ? '✓ Requerida' : '✗ No requerida'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requisitos en una sección separada */}
      <div className="border-t border-slate-100 dark:border-slate-700 p-6 pt-4 space-y-3">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-slate-400 mt-1" />
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Experiencia</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {puesto.requisitos_experiencia || 'No especificada'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <GraduationCap className="w-4 h-4 text-slate-400 mt-1" />
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Formación</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {puesto.requisitos_formacion || 'No especificada'}
            </p>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="border-t border-slate-100 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(puesto); }}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              Editar
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(puesto.id); }}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              Eliminar
            </button>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:transform group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
}

// Componente Skeleton para carga
PuestoCard.Skeleton = function PuestoCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 animate-pulse border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
      </div>
    </div>
  );
}; 