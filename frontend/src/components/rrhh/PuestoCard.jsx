import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserCheck, Users, Pencil, Trash2 } from 'lucide-react';

const themeClasses = {
  dark: {
    card: 'bg-slate-900/50 border-slate-800 group-hover:border-teal-500',
    title: 'text-slate-100 group-hover:text-teal-500',
    text: 'text-slate-300',
    icon: 'text-slate-400',
    badge: 'border-slate-700 text-slate-300',
    footerText: 'text-slate-500',
    actionIcon: 'text-slate-400',
  },
  light: {
    card: 'bg-white border-slate-200 group-hover:border-teal-500 group-hover:shadow-md',
    title: 'text-slate-800 group-hover:text-teal-600',
    text: 'text-slate-600',
    icon: 'text-slate-500',
    badge: 'border-slate-300 text-slate-600',
    footerText: 'text-slate-400',
    actionIcon: 'text-slate-500',
  },
};

const PuestoCard = ({ puesto, onEdit, onDelete, onViewDetails, theme = 'dark' }) => {
  const styles = themeClasses[theme];

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onViewDetails(puesto)}
      className="cursor-pointer group h-full"
    >
      <Card className={`h-full flex flex-col transition-all duration-300 ${styles.card}`}>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className={`text-lg font-bold transition-colors ${styles.title}`}>{puesto.titulo_puesto}</CardTitle>
            <div className={`flex items-center gap-2 text-sm ${styles.text}`}>
              {puesto.codigo_puesto && <Badge variant="outline" className={`font-mono text-xs ${styles.badge}`}>{puesto.codigo_puesto}</Badge>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} className="opacity-50 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className={`h-5 w-5 ${styles.actionIcon}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => handleActionClick(e, () => onEdit(puesto))}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleActionClick(e, () => onDelete(puesto.id))} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow space-y-3 pt-2">
          <div className={`flex items-center text-sm ${styles.text}`}>
            <UserCheck className={`h-4 w-4 mr-2 ${styles.icon}`} />
            <span>Supervisor: {puesto.supervisor || 'No especificado'}</span>
          </div>
          <div className={`flex items-center text-sm ${styles.text}`}>
            <Users className={`h-4 w-4 mr-2 ${styles.icon}`} />
            <span>{puesto.empleados_count || 0} empleados</span>
          </div>
          <p className={`text-sm pt-2 line-clamp-2 ${styles.text}`}>
            {puesto.descripcion_responsabilidades || 'Sin descripción.'}
          </p>
        </CardContent>
        <CardFooter className={`flex justify-between items-center text-xs pt-4 mt-auto ${styles.footerText}`}>
          <Badge variant={puesto.estado === 'Activo' ? 'success' : 'secondary'}>
            {puesto.estado}
          </Badge>
          <span>
            Actualizado: {new Date(puesto.updated_at).toLocaleDateString()}
          </span>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

PuestoCard.Skeleton = ({ theme = 'dark' }) => {
  const skeletonStyles = {
    dark: { card: 'bg-slate-900/50', pulse: 'bg-slate-800' },
    light: { card: 'bg-white', pulse: 'bg-slate-200' },
  };
  const styles = skeletonStyles[theme];

  return (
    <div className={`border border-slate-200 dark:border-slate-800 rounded-lg p-4 w-full h-full ${styles.card}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className={`h-5 w-32 rounded ${styles.pulse} animate-pulse`}></div>
          <div className={`h-4 w-20 rounded ${styles.pulse} animate-pulse`}></div>
        </div>
        <div className={`h-6 w-6 rounded-full ${styles.pulse} animate-pulse`}></div>
      </div>
      <div className="space-y-3 mt-4">
        <div className={`h-4 w-4/5 rounded ${styles.pulse} animate-pulse`}></div>
        <div className={`h-4 w-3/5 rounded ${styles.pulse} animate-pulse`}></div>
        <div className={`h-4 w-1/2 rounded ${styles.pulse} animate-pulse`}></div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className={`h-5 w-16 rounded-full ${styles.pulse} animate-pulse`}></div>
        <div className={`h-4 w-24 rounded ${styles.pulse} animate-pulse`}></div>
      </div>
    </div>
  );
};

export default PuestoCard;