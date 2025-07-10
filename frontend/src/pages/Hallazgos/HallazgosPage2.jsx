import React, { useState, useEffect, useCallback } from 'react';
import { hallazgosService } from '@/services/hallazgosService';
import { toast } from 'react-toastify';
import HallazgoKanbanBoard from '@/components/hallazgos/HallazgoKanbanBoard';
import DashboardView from '@/components/mejoras/DashboardView';
import HallazgoStatCard from '@/components/hallazgos/HallazgoStatCard';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertTriangle, List, Trello, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import HallazgoForm from '@/components/hallazgos/HallazgoForm';
import HallazgoWorkflowManager from '@/components/hallazgos/HallazgoWorkflowManager';
import { Card, CardContent } from '@/components/ui/card'; // Añadido para la vista de lista
import { Badge } from '@/components/ui/badge'; // Añadido para la vista de lista

const HallazgosPage2 = () => {
  const [hallazgos, setHallazgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('kanban'); // 'kanban', 'list', o 'charts'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHallazgo, setSelectedHallazgo] = useState(null);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchHallazgos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await hallazgosService.getAllHallazgos();
      setHallazgos(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'No se pudieron cargar los hallazgos.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHallazgos();
  }, [fetchHallazgos]);

  const handleCardClick = (id) => {
    const hallazgo = hallazgos.find(h => h.id === id);
    if (hallazgo) {
      setSelectedHallazgo(hallazgo);
      setIsWorkflowModalOpen(true);
    }
  };

  const handleWorkflowSubmit = async (formData, nextState) => {
    if (!selectedHallazgo) return;

    try {
      const dataToUpdate = { ...formData, estado: nextState };
      await hallazgosService.updateHallazgo(selectedHallazgo.id, dataToUpdate);
      toast.success('Hallazgo actualizado con éxito');
      setIsWorkflowModalOpen(false);
      setSelectedHallazgo(null);
      fetchHallazgos();
    } catch (error) {
      console.error('Error al actualizar el hallazgo:', error);
      toast.error(error.response?.data?.message || 'No se pudo actualizar el hallazgo.');
    }
  };

  const handleRowClick = (id) => {
    navigate(`/hallazgos/${id}`);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const newHallazgoData = { 
        ...formData, 
        estado: 'deteccion', // Estado inicial según el nuevo flujo
        fecha_deteccion: new Date().toISOString() 
      };
      await hallazgosService.createHallazgo(newHallazgoData);
      toast.success('Hallazgo registrado con éxito');
      setIsModalOpen(false);
      fetchHallazgos();
    } catch (error) {
      console.error('Error al crear el hallazgo:', error);
      toast.error(error.response?.data?.message || 'No se pudo registrar el hallazgo.');
    }
  };

  const handleHallazgoStateChange = async (hallazgoId, newEstado) => {
    const originalHallazgos = [...hallazgos];
    const updatedHallazgos = hallazgos.map(h => 
      h.id === hallazgoId ? { ...h, estado: newEstado } : h
    );
    setHallazgos(updatedHallazgos);

    try {
      await hallazgosService.updateHallazgo(hallazgoId, { estado: newEstado });
      toast.success('Estado del hallazgo actualizado.');
    } catch (error) {
      console.error('Error al actualizar el estado del hallazgo:', error);
      toast.error('No se pudo actualizar el estado.');
      setHallazgos(originalHallazgos);
    }
  };

  const stats = {
    total: Array.isArray(hallazgos) ? hallazgos.length : 0,
    deteccion: Array.isArray(hallazgos) ? hallazgos.filter(h => h.estado === 'deteccion').length : 0,
    tratamiento: Array.isArray(hallazgos) ? hallazgos.filter(h => ['planificacion_ai', 'ejecucion_ai', 'analisis_plan_accion'].includes(h.estado)).length : 0,
    verificacion: Array.isArray(hallazgos) ? hallazgos.filter(h => h.estado === 'verificacion_cierre').length : 0,
  };

  // Función para renderizar la vista de lista (movida adentro del componente)
  const renderListView = () => (
    <div className="space-y-4">
      {hallazgos.map(hallazgo => (
        <Card key={hallazgo.id} className="hover:shadow-md cursor-pointer transition-shadow" onClick={() => handleRowClick(hallazgo.id)}>
            <CardContent className="p-4 flex justify-between items-center">
                <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="font-bold text-lg">{hallazgo.numeroHallazgo}</span>
                        <Badge variant="secondary">{hallazgo.estado}</Badge>
                    </div>
                    <h3 className="font-semibold text-xl mb-1">{hallazgo.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{hallazgo.descripcion}</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                    <p>{new Date(hallazgo.fecha_deteccion).toLocaleDateString()}</p>
                </div>
            </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) return <div className="p-8 text-center">Cargando hallazgos...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
              <h1 className="text-3xl font-bold">Sistema de Mejoras ISO 9001</h1>
              <p className="text-muted-foreground">Gestión de hallazgos y acciones correctivas</p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Nuevo Hallazgo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Hallazgo</DialogTitle>
              </DialogHeader>
              <HallazgoForm onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <HallazgoStatCard title="Total Hallazgos" value={stats.total} icon={<FileText className="h-4 w-4 text-white/80" />} colorClass="bg-blue-500" />
          <HallazgoStatCard title="En Detección" value={stats.deteccion} icon={<AlertTriangle className="h-4 w-4 text-white/80" />} colorClass="bg-orange-500" />
          <HallazgoStatCard title="En Tratamiento" value={stats.tratamiento} icon={<Clock className="h-4 w-4 text-white/80" />} colorClass="bg-purple-500" />
          <HallazgoStatCard title="En Verificación" value={stats.verificacion} icon={<CheckCircle className="h-4 w-4 text-white/80" />} colorClass="bg-green-500" />
        </div>

        <div className="pt-4">
          <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2 p-1 rounded-lg bg-muted">
                  <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('list')}>
                      <List className="h-4 w-4 mr-2"/>
                      Lista
                  </Button>
                  <Button variant={view === 'kanban' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('kanban')}>
                      <Trello className="h-4 w-4 mr-2"/>
                      Kanban
                  </Button>
                  <Button variant={view === 'charts' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('charts')}>
                      <BarChart className="h-4 w-4 mr-2"/>
                      Gráficos
                  </Button>
              </div>
          </div>

          {view === 'kanban' && (
              <HallazgoKanbanBoard
                  hallazgos={hallazgos}
                  onCardClick={handleCardClick}
                  onViewDetailsClick={handleRowClick} // Conectado al nuevo botón
                  onHallazgoStateChange={handleHallazgoStateChange}
              />
          )}
          {view === 'list' && renderListView()}
          {view === 'charts' && <DashboardView hallazgos={hallazgos} />}
        </div>

        {selectedHallazgo && (
          <Dialog open={isWorkflowModalOpen} onOpenChange={setIsWorkflowModalOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Flujo de Trabajo: {selectedHallazgo.numeroHallazgo}</DialogTitle>
                <p className="text-sm text-muted-foreground">{selectedHallazgo.titulo}</p>
              </DialogHeader>
              <HallazgoWorkflowManager
                hallazgo={selectedHallazgo}
                onUpdate={handleWorkflowSubmit}
                onCancel={() => {
                  setIsWorkflowModalOpen(false);
                  setSelectedHallazgo(null);
                }}
              />
            </DialogContent>
          </Dialog>
        )}

      </div>
    </div>
  );
};

export default HallazgosPage2;
