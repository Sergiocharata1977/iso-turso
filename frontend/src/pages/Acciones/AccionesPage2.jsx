import React, { useState, useEffect, useCallback, useMemo } from 'react';
import accionesService from '@/services/accionesService';
import { toast } from 'react-toastify';
import { AccionKanbanBoard } from '@/components/acciones/AccionKanbanBoard';
import AccionStatCard from '@/components/acciones/AccionStatCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import AccionWorkflowManager from '@/components/acciones/AccionWorkflowManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { List, Trello, BarChart, FileText, PlayCircle, ClipboardCheck, CheckCircle, Filter, ChevronDown, Search } from 'lucide-react';
import { ACCION_ESTADOS } from '@/config/accionWorkflow';
import AccionesCharts from '@/components/acciones/AccionesCharts';
import { usePaginationWithFilters } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";

const AccionesPage2 = () => {
  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('kanban'); // 'kanban', 'list', 'charts'
  const [selectedAccion, setSelectedAccion] = useState(null);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Estados para filtros avanzados
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterPrioridad, setFilterPrioridad] = useState('todos');
  const [showFilters, setShowFilters] = useState(false);

  // Hook de paginación con filtros
  const {
    data: paginatedAcciones,
    paginationInfo,
    searchTerm,
    updateSearchTerm,
    goToPage,
    changeItemsPerPage,
  } = usePaginationWithFilters(acciones, {
    itemsPerPage: view === 'kanban' ? 50 : 12 // Más elementos para Kanban
  });

  const fetchAcciones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await accionesService.getAllAcciones();
      setAcciones(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'No se pudieron cargar las acciones.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcciones();
  }, [fetchAcciones]);

  const handleCardClick = (id) => {
    const accion = acciones.find(a => a.id === id);
    if (accion) {
      setSelectedAccion(accion);
      setIsWorkflowModalOpen(true);
    }
  };

  const handleWorkflowUpdate = async (formData) => {
    if (!selectedAccion) return;

    try {
      await accionesService.updateAccion(selectedAccion.id, formData);
      toast.success('Acción actualizada con éxito');
      setIsWorkflowModalOpen(false);
      setSelectedAccion(null);
      fetchAcciones();
    } catch (error) {
      console.error('Error al actualizar la acción:', error);
      toast.error(error.response?.data?.message || 'No se pudo actualizar la acción.');
    }
  };

  // Aplicar filtros adicionales a los datos ya paginados y filtrados por texto
  const filteredAcciones = useMemo(() => {
    return paginatedAcciones.filter(accion => {
      // Filtro por estado
      const matchesEstado = filterEstado === 'todos' || 
        accion.estado?.toLowerCase() === filterEstado.toLowerCase();
      
      // Filtro por tipo
      const matchesTipo = filterTipo === 'todos' || 
        accion.tipo?.toLowerCase() === filterTipo.toLowerCase();
      
      // Filtro por prioridad
      const matchesPrioridad = filterPrioridad === 'todos' || 
        accion.prioridad?.toLowerCase() === filterPrioridad.toLowerCase();
      
      return matchesEstado && matchesTipo && matchesPrioridad;
    });
  }, [paginatedAcciones, filterEstado, filterTipo, filterPrioridad]);

  // Obtener opciones únicas para los filtros
  const filterOptions = useMemo(() => {
    const estados = [...new Set(acciones.map(a => a.estado).filter(Boolean))];
    const tipos = [...new Set(acciones.map(a => a.tipo).filter(Boolean))];
    const prioridades = [...new Set(acciones.map(a => a.prioridad).filter(Boolean))];
    
    return { estados, tipos, prioridades };
  }, [acciones]);

  const stats = {
    total: Array.isArray(acciones) ? acciones.length : 0,
    planificacion: Array.isArray(acciones) ? acciones.filter(a => a.estado === ACCION_ESTADOS.PLANIFICACION).length : 0,
    ejecucion: Array.isArray(acciones) ? acciones.filter(a => a.estado === ACCION_ESTADOS.EJECUCION).length : 0,
    verificacion: Array.isArray(acciones) ? acciones.filter(a => a.estado === ACCION_ESTADOS.PLANIFICACION_VERIFICACION || a.estado === ACCION_ESTADOS.EJECUCION_VERIFICACION).length : 0,
  };

  const renderListView = () => (
    <div className="space-y-4">
      {filteredAcciones.map(accion => (
        <Card key={accion.id} className="hover:shadow-md cursor-pointer" onClick={() => navigate(`/acciones/${accion.id}`)}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{accion.titulo}</h3>
              <p className="text-sm text-gray-500">{accion.numeroAccion}</p>
            </div>
            <Badge>{accion.estado}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) return <div className="p-8 text-center">Cargando acciones...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Acciones</h1>
          <p className="text-muted-foreground">Supervisa y gestiona todas las acciones de mejora.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AccionStatCard title="Total Acciones" value={stats.total} icon={<FileText className="h-4 w-4 text-white/80" />} colorClass="bg-blue-500" />
          <AccionStatCard title="En Planificación" value={stats.planificacion} icon={<PlayCircle className="h-4 w-4 text-white/80" />} colorClass="bg-orange-500" />
          <AccionStatCard title="En Ejecución" value={stats.ejecucion} icon={<ClipboardCheck className="h-4 w-4 text-white/80" />} colorClass="bg-purple-500" />
          <AccionStatCard title="En Verificación" value={stats.verificacion} icon={<CheckCircle className="h-4 w-4 text-white/80" />} colorClass="bg-green-500" />
        </div>

        {/* Búsqueda y Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
          {/* Barra de búsqueda */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar acciones por título, número, descripción..."
                value={searchTerm}
                onChange={(e) => updateSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Filtros Avanzados */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              {/* Filtro por Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    {filterOptions.estados.map(estado => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    {filterOptions.tipos.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Prioridad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <Select value={filterPrioridad} onValueChange={setFilterPrioridad}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las prioridades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las prioridades</SelectItem>
                    {filterOptions.prioridades.map(prioridad => (
                      <SelectItem key={prioridad} value={prioridad}>
                        {prioridad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2 p-1 rounded-lg bg-muted">
                  <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('list')}>
                      <List className="h-4 w-4 mr-2"/>Lista
                  </Button>
                  <Button variant={view === 'kanban' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('kanban')}>
                      <Trello className="h-4 w-4 mr-2"/>Kanban
                  </Button>
                  <Button variant={view === 'charts' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('charts')}>
                      <BarChart className="h-4 w-4 mr-2"/>Gráficos
                  </Button>
              </div>
          </div>

          {view === 'kanban' && <AccionKanbanBoard acciones={filteredAcciones} onCardClick={handleCardClick} />}
          {view === 'list' && renderListView()}
          {view === 'charts' && <AccionesCharts acciones={filteredAcciones} />}
          
          {/* Paginación solo para vistas list y charts (Kanban maneja muchos elementos) */}
          {view !== 'kanban' && !loading && paginationInfo.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={paginationInfo.currentPage}
                totalPages={paginationInfo.totalPages}
                totalItems={paginationInfo.totalItems}
                itemsPerPage={paginationInfo.itemsPerPage}
                startItem={paginationInfo.startItem}
                endItem={paginationInfo.endItem}
                onPageChange={goToPage}
                onItemsPerPageChange={changeItemsPerPage}
                itemsPerPageOptions={[6, 12, 24, 48]}
                showItemsPerPage={true}
                showInfo={true}
              />
            </div>
          )}
        </div>

        {selectedAccion && (
          <Dialog open={isWorkflowModalOpen} onOpenChange={setIsWorkflowModalOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Flujo de Trabajo: {selectedAccion.numeroAccion}</DialogTitle>
                <p className="text-sm text-muted-foreground">{selectedAccion.titulo}</p>
              </DialogHeader>
              <AccionWorkflowManager
                accion={selectedAccion}
                onUpdate={handleWorkflowUpdate}
                isLoading={loading}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AccionesPage2;
