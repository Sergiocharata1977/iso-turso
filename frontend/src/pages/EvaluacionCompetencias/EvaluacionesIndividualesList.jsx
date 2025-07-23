import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

const EvaluacionesIndividualesList = ({ evaluaciones, onEdit, onDelete, onView }) => {

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'completada':
        return <Badge className="bg-green-500 text-white">Completada</Badge>;
      case 'pendiente':
        return <Badge variant="secondary">Pendiente</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-900/50 hover:bg-slate-800/50 border-b-slate-700">
            <TableHead className="text-white">Empleado</TableHead>
            <TableHead className="text-white">Fecha</TableHead>
            <TableHead className="text-white text-center">Puntaje Total</TableHead>
            <TableHead className="text-white text-center">Estado</TableHead>
            <TableHead className="text-white text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluaciones.length > 0 ? (
            evaluaciones.map((evaluacion) => (
              <TableRow key={evaluacion.id} className="border-b-slate-700 hover:bg-slate-700/50">
                <TableCell className="font-medium text-white">{evaluacion.empleado_nombre || 'N/A'}</TableCell>
                <TableCell className="text-slate-300">{new Date(evaluacion.fecha_evaluacion).toLocaleDateString()}</TableCell>
                <TableCell className="text-center font-bold text-teal-400">{evaluacion.puntaje_total?.toFixed(1) || '0.0'}/10</TableCell>
                <TableCell className="text-center">{getStatusBadge(evaluacion.estado)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onView(evaluacion)} className="text-slate-400 hover:text-white hover:bg-slate-700">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(evaluacion)} className="text-slate-400 hover:text-white hover:bg-slate-700">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(evaluacion.id)} className="text-red-500 hover:text-red-400 hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-400 py-10">
                No se encontraron evaluaciones.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EvaluacionesIndividualesList;
