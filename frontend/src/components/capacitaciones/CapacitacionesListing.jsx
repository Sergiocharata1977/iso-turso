import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Calendar, 
  BookOpen, 
  Trash2, 
  Edit, 
  User, 
  Users, 
  MapPin, 
  Clock,
  Download,
  Grid3X3,
  List,
  MoreHorizontal,
  Eye,
  Search,
  Filter,
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { capacitacionesService } from "@/services/capacitacionesService";
import { toast } from "sonner";
import CapacitacionModal from "./CapacitacionModal";
import CapacitacionSingle from "./CapacitacionSingle";
import CapacitacionKanbanBoard from "./CapacitacionKanbanBoard";
import UnifiedHeader from "../common/UnifiedHeader";
import UnifiedCard from "../common/UnifiedCard";

export default function CapacitacionesListing() {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [viewMode, setViewMode] = useState("grid"); // grid | list | kanban
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCapacitacion, setSelectedCapacitacion] = useState(null);
  const [showSingle, setShowSingle] = useState(false);
  const [singleCapacitacionId, setSingleCapacitacionId] = useState(null);

  useEffect(() => {
    fetchCapacitaciones();
  }, []);

  const fetchCapacitaciones = async () => {
    try {
      setLoading(true);
      const data = await capacitacionesService.getAll();
      setCapacitaciones(data);
      console.log('✅ Capacitaciones cargadas:', data);
    } catch (error) {
      console.error('❌ Error al cargar capacitaciones:', error);
      toast.error("Error al cargar las capacitaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCapacitacion(null);
    setModalOpen(true);
  };

  const handleEdit = (capacitacion) => {
    setSelectedCapacitacion(capacitacion);
    setModalOpen(true);
  };

  const handleViewSingle = (capacitacion) => {
    setSingleCapacitacionId(capacitacion.id);
    setShowSingle(true);
  };

  const handleBackFromSingle = () => {
    setShowSingle(false);
    setSingleCapacitacionId(null);
    fetchCapacitaciones();
  };

  const handleSave = async (formData) => {
    try {
      if (selectedCapacitacion) {
        await capacitacionesService.update(selectedCapacitacion.id, formData);
        toast.success("Capacitación actualizada exitosamente");
      } else {
        await capacitacionesService.create(formData);
        toast.success("Capacitación creada exitosamente");
      }
      setModalOpen(false);
      fetchCapacitaciones();
    } catch (error) {
      console.error('Error al guardar capacitación:', error);
      toast.error("Error al guardar la capacitación");
    }
  };

  const handleDelete = async (capacitacion) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta capacitación?")) {
      try {
        await capacitacionesService.delete(capacitacion.id);
        toast.success("Capacitación eliminada exitosamente");
        fetchCapacitaciones();
      } catch (error) {
        console.error('Error al eliminar capacitación:', error);
        toast.error("Error al eliminar la capacitación");
      }
    }
  };

  const handleExport = () => {
    toast.info("Función de exportación en desarrollo");
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const filteredCapacitaciones = capacitaciones.filter((capacitacion) => {
    const titleField = capacitacion.nombre || capacitacion.titulo || '';
    const descriptionField = capacitacion.descripcion || '';
    
    const matchesSearch = titleField.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         descriptionField.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === "todos" || capacitacion.estado === filterEstado;
    
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'planificacion':
      case 'planificada':
      case 'programada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en preparacion':
      case 'preparando material':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'en evaluacion':
      case 'evaluando resultados':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completada':
      case 'finalizada':
      case 'cerrada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'planificacion':
      case 'planificada':
        return Target;
      case 'en preparacion':
        return Clock;
      case 'en evaluacion':
        return TrendingUp;
      case 'completada':
        return CheckCircle;
      case 'cancelada':
        return AlertCircle;
      default:
        return BookOpen;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const getStats = () => {
    const total = capacitaciones.length;
    const planificadas = capacitaciones.filter(c => c.estado?.toLowerCase() === 'planificacion').length;
    const enPreparacion = capacitaciones.filter(c => c.estado?.toLowerCase() === 'en preparacion').length;
    const completadas = capacitaciones.filter(c => c.estado?.toLowerCase() === 'completada').length;
    
    return { total, planificadas, enPreparacion, completadas };
  };

  if (showSingle) {
    return (
      <CapacitacionSingle 
        capacitacionId={singleCapacitacionId}
        onBack={handleBackFromSingle}
      />
    );
  }

  // Vista Kanban especial
  if (viewMode === 'kanban') {
    return (
      <div className="p-6 space-y-6">
        <UnifiedHeader
          title="Gestión de Capacitaciones"
          description="Administra las capacitaciones del personal según ISO 9001"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onNew={handleCreate}
          onExport={handleExport}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          showViewToggle={false}
          newButtonText="Nueva Capacitación"
          totalCount={capacitaciones.length}
          lastUpdated="hoy"
          icon={GraduationCap}
          primaryColor="emerald"
        />

        {/* Kanban View Mode Selector */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Tarjetas
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="h-8"
            >
              <Target className="h-4 w-4 mr-2" />
              Kanban
            </Button>
          </div>

          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="planificacion">Planificación</SelectItem>
              <SelectItem value="en preparacion">En Preparación</SelectItem>
              <SelectItem value="en evaluacion">En Evaluación</SelectItem>
              <SelectItem value="completada">Completada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CapacitacionKanbanBoard 
          capacitaciones={filteredCapacitaciones}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleViewSingle}
          loading={loading}
        />

        <CapacitacionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          capacitacion={selectedCapacitacion}
          onSave={handleSave}
        />
      </div>
    );
  }

  const stats = getStats();

  const renderGridView = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 h-20"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredCapacitaciones.length === 0) {
      return (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontraron capacitaciones.</p>
          <Button onClick={handleCreate} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Crear primera capacitación
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCapacitaciones.map((capacitacion) => {
          const StatusIcon = getEstadoIcon(capacitacion.estado);
          const fields = [
            ...(capacitacion.instructor ? [{ 
              icon: User, 
              label: "Instructor", 
              value: capacitacion.instructor 
            }] : []),
            ...(capacitacion.fecha_inicio ? [{ 
              icon: Calendar, 
              label: "Fecha inicio", 
              value: formatDate(capacitacion.fecha_inicio) 
            }] : []),
            ...(capacitacion.modalidad ? [{ 
              icon: MapPin, 
              label: "Modalidad", 
              value: capacitacion.modalidad 
            }] : []),
            ...(capacitacion.duracion_horas ? [{ 
              icon: Clock, 
              label: "Duración", 
              value: `${capacitacion.duracion_horas}h` 
            }] : [])
          ];

          return (
            <div key={capacitacion.id} className="cursor-pointer" onClick={() => handleViewSingle(capacitacion)}>
              <UnifiedCard
                title={capacitacion.nombre || capacitacion.titulo}
                description={capacitacion.descripcion}
                status={capacitacion.estado}
                fields={fields}
                icon={GraduationCap}
                primaryColor="emerald"
                onView={() => handleViewSingle(capacitacion)}
                onEdit={() => handleEdit(capacitacion)}
                onDelete={() => handleDelete(capacitacion)}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderListView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Capacitación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duración
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCapacitaciones.map((capacitacion) => (
                <tr key={capacitacion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => handleViewSingle(capacitacion)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 text-emerald-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {capacitacion.nombre || capacitacion.titulo}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {capacitacion.descripcion}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {capacitacion.instructor || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getEstadoBadgeColor(capacitacion.estado)}>
                      {capacitacion.estado}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(capacitacion.fecha_inicio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {capacitacion.duracion_horas ? `${capacitacion.duracion_horas}h` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => { e.stopPropagation(); handleViewSingle(capacitacion); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => { e.stopPropagation(); handleEdit(capacitacion); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => { e.stopPropagation(); handleDelete(capacitacion); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <UnifiedHeader
        title="Gestión de Capacitaciones"
        description="Administra las capacitaciones del personal según ISO 9001"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNew={handleCreate}
        onExport={handleExport}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        newButtonText="Nueva Capacitación"
        totalCount={capacitaciones.length}
        lastUpdated="hoy"
        icon={GraduationCap}
        primaryColor="emerald"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planificadas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.planificadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Preparación</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enPreparacion}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completadas}</div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Tarjetas
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8"
          >
            <List className="h-4 w-4 mr-2" />
            Lista
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('kanban')}
            className="h-8"
          >
            <Target className="h-4 w-4 mr-2" />
            Kanban
          </Button>
        </div>

        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="planificacion">Planificación</SelectItem>
            <SelectItem value="en preparacion">En Preparación</SelectItem>
            <SelectItem value="en evaluacion">En Evaluación</SelectItem>
            <SelectItem value="completada">Completada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewMode === 'grid' ? renderGridView() : renderListView()}

      <CapacitacionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        capacitacion={selectedCapacitacion}
        onSave={handleSave}
      />
    </div>
  );
}
