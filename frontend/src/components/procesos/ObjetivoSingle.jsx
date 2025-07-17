import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Calendar, User, CheckCircle, Clock, Flag, Pencil, Trash2, TrendingUp, ListChecks, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import procesosService from '@/services/procesosService';
import objetivosCalidadService from '@/services/objetivosCalidadService';

const getEstadoInfo = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'en progreso':
      return { text: 'En Progreso', className: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'completado':
      return { text: 'Completado', className: 'bg-green-100 text-green-800 border-green-200' };
    case 'activo':
        return { text: 'Activo', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'cancelado':
      return { text: 'Cancelado', className: 'bg-red-100 text-red-800 border-red-200' };
    default:
      return { text: estado || 'No definido', className: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
};

const InfoCard = ({ icon: Icon, title, value, className }) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-lg font-bold">{value}</div>
    </CardContent>
  </Card>
);

const ObjetivoSingle = ({ objetivo, onBack, onEdit, onDelete }) => {
  const [procesos, setProcesos] = useState([]);
  const [showProcesoSelect, setShowProcesoSelect] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState(null);
  const [isSavingProceso, setIsSavingProceso] = useState(false);
  const [objetivoActual, setObjetivoActual] = useState(objetivo);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (objetivo) {
      setObjetivoActual(objetivo);
      loadProcesos();
    }
  }, [objetivo]);

  // Cargar procesos reales
  const loadProcesos = async () => {
    try {
      const data = await procesosService.getAllProcesos();
      setProcesos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los procesos",
        variant: "destructive"
      });
    }
  };

  // Guardar proceso seleccionado
  const handleSaveProceso = async () => {
    if (!selectedProceso) return;
    setIsSavingProceso(true);
    try {
      await objetivosCalidadService.update(objetivoActual.id, {
        ...objetivoActual,
        proceso_id: selectedProceso,
        organization_id: user.organization_id
      });
      toast({
        title: "Proceso asignado",
        description: "La relación con el proceso se ha guardado correctamente.",
        variant: "success"
      });
      setShowProcesoSelect(false);
      // Actualizar el objetivo local para mostrar el cambio
      const procesoSeleccionado = procesos.find(p => p.id == selectedProceso);
      setObjetivoActual(prev => ({
        ...prev,
        proceso_id: selectedProceso,
        proceso: procesoSeleccionado
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar el proceso",
        variant: "destructive"
      });
    } finally {
      setIsSavingProceso(false);
    }
  };

  if (!objetivoActual) return null;

  const { text: estadoText, className: estadoClassName } = getEstadoInfo(objetivoActual.estado);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-gray-50/50">
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className='flex items-center gap-4'>
                <Button onClick={onBack} variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Detalle del Objetivo</h1>
                    <p className="text-sm text-gray-500">Sistema de Gestión de Calidad ISO 9001</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => onEdit(objetivoActual)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                </Button>
                <Button variant="destructive" onClick={() => onDelete(objetivoActual.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                </Button>
            </div>
        </div>
      </div>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Layout principal: contenido + relaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal (contenido del objetivo) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-l-4 border-teal-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold text-gray-800">{objetivoActual.descripcion}</CardTitle>
                        <p className="text-sm text-muted-foreground font-mono mt-1">Código: {objetivoActual.codigo}</p>
                    </div>
                    <Badge variant="outline" className={estadoClassName}>{estadoText}</Badge>
                </div>
                {/* Mostrar proceso actual */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <strong>Proceso:</strong>
                    <span className="ml-2">{objetivoActual.proceso?.nombre || 'No asignado'}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                 <InfoCard icon={Target} title="Meta del Objetivo" value={objetivoActual.meta || 'N/A'} />
                 <InfoCard icon={User} title="Responsable" value={objetivoActual.responsable || 'N/A'} />
                 <InfoCard icon={Calendar} title="Plazo" value={`${formatDate(objetivoActual.fecha_inicio)} - ${formatDate(objetivoActual.fecha_fin)}`} />
              </CardContent>
            </Card>

            <Tabs defaultValue="indicadores" className="w-full">
              <TabsList>
                <TabsTrigger value="indicadores">
                    <TrendingUp className='h-4 w-4 mr-2' />
                    Indicadores
                </TabsTrigger>
                <TabsTrigger value="planes">
                    <ListChecks className='h-4 w-4 mr-2' />
                    Planes de Acción
                </TabsTrigger>
              </TabsList>
              <TabsContent value="indicadores">
                <Card>
                  <CardHeader>
                    <CardTitle>Indicadores Clave</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground'>Próximamente: Aquí se mostrarán los indicadores asociados para medir el progreso de este objetivo.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="planes">
                <Card>
                  <CardHeader>
                    <CardTitle>Planes de Acción</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground'>Próximamente: Aquí se listarán los planes de acción detallados para alcanzar este objetivo.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Columna de relaciones */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {/* Botón para asignar/cambiar proceso */}
                  {!showProcesoSelect ? (
                    <Button 
                      className="btn-relacion-exclusive w-full" 
                      onClick={() => { 
                        setShowProcesoSelect(true); 
                        setSelectedProceso(objetivoActual.proceso_id || ''); 
                      }}
                    >
                      {objetivoActual.proceso ? 'Cambiar Proceso' : 'Asignar Proceso'}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <select 
                        value={selectedProceso || ''} 
                        onChange={(e) => setSelectedProceso(e.target.value)} 
                        className="w-full p-2 border rounded"
                      >
                        <option value="" disabled>Seleccione un proceso</option>
                        {procesos.map((p) => (
                          <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSaveProceso} 
                          disabled={!selectedProceso || isSavingProceso} 
                          className="btn-relacion-exclusive flex-1"
                        >
                          {isSavingProceso ? 'Guardando...' : 'Guardar'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowProcesoSelect(false)} 
                          disabled={isSavingProceso}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* Aquí se pueden agregar más relaciones en el futuro */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ObjetivoSingle;
