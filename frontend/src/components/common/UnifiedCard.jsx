import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Pencil, Trash2, Eye, MoreHorizontal, FileText } from 'lucide-react';

const UnifiedCard = ({ 
  title, 
  subtitle, 
  description, 
  status, 
  responsible, 
  code, 
  fields = [], 
  onEdit, 
  onDelete, 
  onView, 
  icon: Icon = FileText,
  primaryColor = "emerald",
  className = "",
  ...props 
}) => {
  const getColorClasses = () => {
    switch (primaryColor) {
      case 'emerald':
        return {
          gradient: 'from-emerald-500 to-emerald-600',
          hoverBorder: 'hover:border-emerald-500',
          iconColor: 'text-emerald-500',
          viewButton: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
        };
      case 'blue':
        return {
          gradient: 'from-blue-500 to-blue-600',
          hoverBorder: 'hover:border-blue-500',
          iconColor: 'text-blue-500',
          viewButton: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
        };
      case 'purple':
        return {
          gradient: 'from-purple-500 to-purple-600',
          hoverBorder: 'hover:border-purple-500',
          iconColor: 'text-purple-500',
          viewButton: 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
        };
      case 'orange':
        return {
          gradient: 'from-orange-500 to-orange-600',
          hoverBorder: 'hover:border-orange-500',
          iconColor: 'text-orange-500',
          viewButton: 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
        };
      default:
        return {
          gradient: 'from-emerald-500 to-emerald-600',
          hoverBorder: 'hover:border-emerald-500',
          iconColor: 'text-emerald-500',
          viewButton: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
        };
    }
  };

  const colors = getColorClasses();

  const getStatusColor = (status) => {
    // Validación robusta para evitar errores
    if (!status || typeof status !== 'string') {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    switch (status.toLowerCase()) {
      case 'activo':
      case 'completado':
      case 'completada':
      case 'excelente':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'en_proceso':
      case 'en progreso':
      case 'pendiente':
      case 'bueno':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelado':
      case 'cancelada':
      case 'inactivo':
      case 'regular':
      case 'necesita mejora':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-xl ${colors.hoverBorder} transition-all duration-300 flex flex-col h-full group overflow-hidden cursor-pointer ${className}`}
      onClick={(e) => {
        console.log('🖱️ UnifiedCard onClick INICIADO');
        console.log('🎯 Target:', e.target);
        console.log('🎯 Closest button:', e.target.closest('button'));
        
        // Evitar que el click se propague a los botones de acción
        if (e.target.closest('button')) {
          console.log('❌ UnifiedCard: Click en botón, ignorando');
          return;
        }
        
        console.log('✅ UnifiedCard: Click válido, llamando onView');
        console.log('🔧 onView function:', onView);
        
        if (onView) {
          onView();
          console.log('✅ UnifiedCard: onView ejecutado');
        } else {
          console.log('❌ UnifiedCard: onView no está definido');
        }
      }}
      {...props}
    >
      {/* Header con gradiente */}
      <div className={`bg-gradient-to-r ${colors.gradient} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <h3 className="font-bold text-lg truncate">{title}</h3>
          </div>
          {code && (
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {code}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-white/90 text-sm mt-1 truncate">{subtitle}</p>
        )}
      </div>

      {/* Contenido */}
      <CardContent className="flex-grow p-4 space-y-3">
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
            {description}
          </p>
        )}
        
        <div className="space-y-2">
          {responsible && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></div>
              <span className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-800 dark:text-gray-200">{responsible}</span>
              </span>
            </div>
          )}
          
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {field.icon && <field.icon className={`h-4 w-4 ${colors.iconColor} flex-shrink-0`} />}
              <span className="text-gray-600 dark:text-gray-400 line-clamp-1">
                {field.label && <span className="font-medium text-gray-800 dark:text-gray-200">{field.label}: </span>}
                {field.value}
              </span>
            </div>
          ))}

          {status && (
            <div className="flex items-center gap-2 pt-2">
              <Badge className={getStatusColor(typeof status === 'string' ? status : String(status))}>
                {typeof status === 'string' ? status : String(status)}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer con acciones */}
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex gap-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              className={colors.viewButton}
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          )}
        </div>
      </CardFooter>
    </motion.div>
  );
};

export default UnifiedCard; 