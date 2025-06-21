import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserCheck, Users, Pencil, Trash2 } from 'lucide-react';

const PuestoCard = ({ puesto, onEdit, onDelete, onViewDetails }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation(); // Evita que el clic se propague a la tarjeta
    action();
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      onClick={() => onViewDetails(puesto)}
      className="cursor-pointer group"
    >
      <Card className="h-full flex flex-col bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 group-hover:shadow-lg group-hover:border-teal-500 dark:group-hover:border-teal-500 transition-all duration-300">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-500 transition-colors">{puesto.titulo_puesto}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">{puesto.codigo_puesto}</Badge>
              <span className="text-sm text-slate-500 dark:text-slate-400">{puesto.departamento_nombre}</span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} className="opacity-50 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-5 w-5 text-slate-500 dark:text-slate-400" />
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
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
            <UserCheck className="h-4 w-4 mr-2 text-slate-400" />
            <span>Supervisor: {puesto.supervisor || 'No especificado'}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
            <Users className="h-4 w-4 mr-2 text-slate-400" />
            <span>{puesto.empleados_count || 0} empleados</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 pt-2 line-clamp-2">
            {puesto.descripcion_responsabilidades || 'Sin descripción de responsabilidades.'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 pt-4 mt-auto">
          <Badge variant={puesto.estado === 'activo' ? 'success' : 'secondary'}>
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

export default PuestoCard;