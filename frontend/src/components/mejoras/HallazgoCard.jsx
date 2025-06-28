import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getEstadoInfo } from '@/lib/hallazgoEstados';
import { format } from 'date-fns';

const getEtapaBadgeClass = (etapa) => {
  switch (etapa) {
    case 'Detección':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100/80 border-purple-200';
    case 'Tratamiento':
      return 'bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200';
    case 'Verificación':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityBadgeClass = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'alta':
      return 'bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200';
    case 'media':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-yellow-200';
    case 'baja':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const HallazgoCard = ({ hallazgo, onClick }) => {
  const estadoInfo = getEstadoInfo(hallazgo.estado);

  return (
    <Card 
      className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer"
      onClick={() => onClick(hallazgo)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">{hallazgo.numeroHallazgo}</span>
            <Badge className={getEtapaBadgeClass(estadoInfo.etapa)}>{estadoInfo.etapa}</Badge>
            <Badge className={getPriorityBadgeClass(hallazgo.prioridad)}>{hallazgo.prioridad}</Badge>
          </div>
          <span className="text-sm text-muted-foreground">{format(new Date(hallazgo.fechaRegistro), 'yyyy-MM-dd')}</span>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-lg">{hallazgo.titulo}</h3>
          <p className="text-sm text-muted-foreground mt-1">{hallazgo.descripcion}</p>
        </div>
        <div className="flex justify-between items-end mt-4">
          <p className="text-sm">
            <span className="font-semibold">Responsable:</span> {hallazgo.responsable}
          </p>
          {hallazgo.accionInmediata && (
              <Badge variant="outline">Con acción inmediata</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HallazgoCard;
