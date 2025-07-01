import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getEstadoInfo, ESTADOS_POR_ETAPA, LABELS, DESCRIPTIONS } from '@/lib/hallazgoEstados';

import hallazgosService from '@/services/hallazgosService';
import { toast } from 'react-toastify';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import WorkflowStage from './WorkflowStage';
import AccionItem from './AccionItem';
import HistorialItem from './HistorialItem';
import { Search, Activity, CheckCircle } from 'lucide-react';

const DetailItem = ({ label, value, children }) => (
  <div className="mb-3">
    <p className="text-sm font-semibold text-gray-600">{label}</p>
    {children ? <div className="text-sm text-gray-800">{children}</div> : <p className="text-sm text-gray-800">{value || 'No especificado'}</p>}
  </div>
);

const stageIcons = {
  'Detección': Search,
  'Tratamiento': Activity,
  'Verificación': CheckCircle,
};

const stageConfig = {
  'DETECCION': {
    emoji: '🟪',
    title: 'DETECCIÓN DEL HALLAZGO',
    subtitle: 'Momento inicial donde se documenta el hecho y se aplican acciones inmediatas.',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-400',
    titleColor: 'text-purple-800',
  },
  'TRATAMIENTO': {
    emoji: '🟩',
    title: 'TRATAMIENTO DEL HALLAZGO',
    subtitle: 'Se analiza la causa raíz y se decide si requiere acciones estructurales.',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    titleColor: 'text-green-800',
  },
  'VERIFICACION': {
    emoji: '🟩',
    title: 'CONTROL Y VERIFICACIÓN',
    subtitle: 'Se valida la eficacia de las acciones aplicadas.',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    titleColor: 'text-green-800',
  },
};

const HallazgoDetailModal = ({ isOpen, onClose, hallazgo, onUpdate }) => {
  if (!hallazgo) return null;

  const estadoInfo = getEstadoInfo(hallazgo.estado);

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detalle del Hallazgo: {hallazgo.codigo}</DialogTitle>
          <DialogDescription>
            Visualiza y gestiona los detalles del hallazgo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-3 items-start gap-4">
            <p className="text-sm font-semibold text-gray-600 col-span-1 pt-1">Descripción</p>
            <p className="text-sm text-gray-800 col-span-2">{hallazgo.descripcion || 'No especificada'}</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-sm font-semibold text-gray-600">Responsable</p>
            <p className="text-sm text-gray-800 col-span-2">{hallazgo.responsable || 'No especificado'}</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-sm font-semibold text-gray-600">Fecha</p>
            <p className="text-sm text-gray-800 col-span-2">{format(new Date(hallazgo.fecha), 'dd/MM/yyyy')}</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-sm font-semibold text-gray-600">Prioridad</p>
            <p className="text-sm text-gray-800 col-span-2">{hallazgo.prioridad || 'No especificada'}</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-sm font-semibold text-gray-600">Estado</p>
            <div className="col-span-2">
              <Badge className={`${estadoInfo.bgColor} ${estadoInfo.textColor} border ${estadoInfo.borderColor}`}>{estadoInfo.label}</Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HallazgoDetailModal;
