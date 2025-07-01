import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, FileText } from 'lucide-react';

const prioridadVariantMap = {
  Alta: 'destructive',
  Media: 'warning',
  Baja: 'default',
};

const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
    <Icon className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
    <span className="truncate">{text || 'No disponible'}</span>
  </div>
);

export function KanbanCard({ hallazgo }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: hallazgo.id,
    data: { type: 'Hallazgo', hallazgo },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCardClick = (e) => {
    if (e.target.closest('a, button')) return;
    navigate(`/mejoras/${hallazgo.id}`);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={handleCardClick} className="cursor-grab active:cursor-grabbing">
      <Card className="bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow border-l-4 border-transparent hover:border-blue-500">
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{hallazgo.numeroHallazgo}</span>
            <Badge variant={prioridadVariantMap[hallazgo.prioridad] || 'secondary'}>{hallazgo.prioridad}</Badge>
          </div>
          <CardTitle className="text-base font-bold mt-1 text-gray-800 dark:text-white">{hallazgo.titulo}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{hallazgo.descripcion}</p>
          <div className="space-y-2 pt-2 border-t dark:border-gray-700">
            <InfoRow icon={User} text={hallazgo.responsable} />
            <InfoRow icon={Calendar} text={new Date(hallazgo.fechaRegistro).toLocaleDateString()} />
            <InfoRow icon={FileText} text={hallazgo.origen} />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
           <Badge variant="outline">{hallazgo.tipo}</Badge>
           <a href={`/mejoras/${hallazgo.id}`} className="text-xs font-semibold text-blue-600 hover:underline">Ver detalles</a>
        </CardFooter>
      </Card>
    </div>
  );
}

