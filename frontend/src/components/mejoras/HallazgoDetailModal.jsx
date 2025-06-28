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

const HallazgoDetailModal = ({ isOpen, onClose, hallazgo }) => {
  if (!hallazgo) return null;

  const estadoInfo = getEstadoInfo(hallazgo.estado);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {hallazgo.numeroHallazgo}: {hallazgo.titulo}
            </DialogTitle>
            <DialogDescription>
                Visualiza y gestiona los detalles, flujo, acciones e historial del hallazgo.
              </DialogDescription>
            <Button>Cambiar Estado</Button>
          </div>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto">
          <Tabs defaultValue="workflow" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="workflow">Flujo de Proceso</TabsTrigger>
              <TabsTrigger value="actions">Acciones</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="p-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <DetailItem label="Descripción" value={hallazgo.descripcion} />
                <DetailItem label="Responsable" value={hallazgo.responsable} />
                <DetailItem label="Fecha de Registro">
                  {format(new Date(hallazgo.fechaRegistro), 'dd/MM/yyyy')}
                </DetailItem>
                <DetailItem label="Prioridad" value={hallazgo.prioridad} />
                <DetailItem label="Origen" value={hallazgo.origen} />
                <DetailItem label="Estado Actual">
                  <Badge variant="outline">{estadoInfo.label}</Badge>
                </DetailItem>
              </div>
              <div className="mt-6 pt-4 border-t">
                {hallazgo.accionInmediata ? (
                  <DetailItem label="Acción Inmediata Tomada" value={hallazgo.accionInmediata} />
                ) : (
                  <p className="text-muted-foreground text-sm">No hay una acción inmediata registrada.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="workflow" className="p-1 mt-2">
              <div className="space-y-4">
                {Object.entries(ESTADOS_POR_ETAPA).map(([stageKey, stageStates]) => {
                  const statesWithDetails = stageStates.map(stateId => ({
                    id: stateId,
                    label: LABELS[stateId],
                    description: DESCRIPTIONS[stateId],
                  }));

                  return (
                    <WorkflowStage
                      key={stageKey}
                      config={stageConfig[stageKey.toUpperCase()]}
                      states={statesWithDetails}
                      currentState={hallazgo.estado}
                    />
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="p-1 mt-2 bg-gray-50/70 rounded-lg border">
               <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Acciones Correctivas</h3>
                {hallazgo.acciones && hallazgo.acciones.length > 0 ? (
                  <div>
                    {hallazgo.acciones.map((accion) => (
                      <AccionItem key={accion.id} accion={accion} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No hay acciones correctivas registradas.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="p-1 mt-2 bg-gray-50/70 rounded-lg border">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Historial de Cambios</h3>
                {hallazgo.historial && hallazgo.historial.length > 0 ? (
                  <div>
                    {hallazgo.historial
                      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                      .map((item, index) => (
                        <HistorialItem
                          key={item.id}
                          item={item}
                          isLast={index === hallazgo.historial.length - 1}
                        />
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No hay historial de cambios para este hallazgo.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
      </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HallazgoDetailModal;
