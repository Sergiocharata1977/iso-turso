import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, ArrowRight } from 'lucide-react';
import { getEstadoInfo } from '@/lib/hallazgoEstados';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const getPriorityBadgeClass = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'alta':
      return 'bg-red-500 border-transparent text-white';
    case 'media':
      return 'bg-yellow-500 border-transparent text-white';
    case 'baja':
      return 'bg-green-500 border-transparent text-white';
    default:
      return 'bg-gray-400 border-transparent text-white';
  }
};

const getEstadoBadgeClass = (estado) => {
    const estadoInfo = getEstadoInfo(estado);
    switch (estadoInfo.etapa) {
        case 'Detección':
            return 'bg-purple-500 border-transparent text-white';
        case 'Tratamiento':
            return 'bg-blue-500 border-transparent text-white';
        case 'Verificación':
            return 'bg-teal-500 border-transparent text-white';
        case 'Cerrado':
            return 'bg-slate-600 border-transparent text-white';
        default:
            return 'bg-gray-400 border-transparent text-white';
    }
};

const HallazgoCard = ({ hallazgo, onClick }) => {
  if (!hallazgo) {
    return null;
  }

  return (
    <Card className="w-full overflow-hidden transition-shadow duration-300 hover:shadow-lg dark:bg-slate-800">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-800 dark:text-gray-100">{hallazgo.codigo}</span>
            <Badge className={getPriorityBadgeClass(hallazgo.prioridad)}>{hallazgo.prioridad}</Badge>
          </div>
          <Badge className={getEstadoBadgeClass(hallazgo.estado)}>{hallazgo.estado}</Badge>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm min-h-[40px]">
          {hallazgo.descripcion}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{hallazgo.responsable || 'No asignado'}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{hallazgo.fecha ? format(new Date(hallazgo.fecha), 'dd/MM/yyyy', { locale: es }) : 'N/A'}</span>
            </div>
          </div>
         
          <Button variant="ghost" size="sm" onClick={() => onClick(hallazgo)}>
            Ver Detalles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HallazgoCard;
