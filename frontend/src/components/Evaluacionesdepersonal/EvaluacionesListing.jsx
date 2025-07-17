import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  LayoutGrid,
  List,
  ClipboardCheck,
  Star,
  Calendar,
  Eye,
  User,
  Filter,
  Target,
  Clock,
  CheckCircle
} from "lucide-react";
import { evaluacionesService } from "@/services/evaluacionesService";
import EvaluacionModal from "./EvaluacionModal";
import EvaluacionSingle from "./EvaluacionSingle";
import UnifiedHeader from "../common/UnifiedHeader";
import UnifiedCard from "../common/UnifiedCard";
import ConfirmDialog from '../ui/confirm-dialog';

const EvaluacionesListing = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [filteredEvaluaciones, setFilteredEvaluaciones] = useState([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [evaluacionToDelete, setEvaluacionToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);
  const [showSingle, setShowSingle] = useState(false);
  const [singleEvaluacionId, setSingleEvaluacionId] = useState(null);

  useEffect(() => {
    fetchEvaluaciones();
  }, []);

  useEffect(() => {
    filterEvaluaciones();
  }, [evaluaciones, searchTerm, estadoFilter]);

  const fetchEvaluaciones = async () => {
    try {
      setLoading(true);
      console.log('🔍 Cargando evaluaciones...');
      const data = await evaluacionesService.getAll();
      setEvaluaciones(data);
      console.log('✅ Evaluaciones cargadas:', data);
    } catch (error) {
      console.error('❌ Error al cargar evaluaciones:', error);
      toast.error("Error al cargar evaluaciones");
    } finally {
      setLoading(false);
    }
  };

  const filterEvaluaciones = () => {
    let filtered = evaluaciones;

    if (searchTerm) {
      filtered = filtered.filter(evaluacion => 
        evaluacion.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluacion.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${evaluacion.personal_nombre} ${evaluacion.personal_apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (estadoFilter && estadoFilter !== 'all') {
      filtered = filtered.filter(evaluacion => evaluacion.estado === estadoFilter);
    }

    setFilteredEvaluaciones(filtered);
  };

  const handleCreate = () => {
    setSelectedEvaluacion(null);
    setModalOpen(true);
  };

  const handleEdit = (evaluacion) => {
    setSelectedEvaluacion(evaluacion);
    setModalOpen(true);
  };

  const handleViewSingle = (evaluacion) => {
    setSingleEvaluacionId(evaluacion.id);
    setShowSingle(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedEvaluacion) {
        await evaluacionesService.update(selectedEvaluacion.id, formData);
        toast.success("Evaluación actualizada exitosamente");
      } else {
        await evaluacionesService.create(formData);
        toast.success("Evaluación creada exitosamente");
      }
      setModalOpen(false);
      fetchEvaluaciones();
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      toast.error("Error al guardar la evaluación");
    }
  };

  const handleDeleteClick = (id) => {
    setEvaluacionToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!evaluacionToDelete) return;
    
    try {
      await evaluacionesService.delete(evaluacionToDelete);
      toast.success('Evaluación eliminada exitosamente');
      fetchEvaluaciones();
    } catch (error) {
      toast.error('Error al eliminar la evaluación');
      console.error('Error:', error);
    } finally {
      setEvaluacionToDelete(null);
    }
  };

  const handleExport = () => {
    toast.info("Función de exportación en desarrollo");
  };

  const handleBackFromSingle = () => {
    setShowSingle(false);
    setSingleEvaluacionId(null);
    fetchEvaluaciones();
  };

  const getEstadoBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const renderStars = (puntaje) => {
    if (!puntaje) return null;
    
    const stars = [];
    const fullStars = Math.floor(puntaje / 20);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-sm text-gray-600 ml-1">({puntaje})</span>
      </div>
    );
  };

  const getStats = () => {
    const total = evaluaciones.length;
    const completadas = evaluaciones.filter(e => e.estado === 'completada').length;
    const pendientes = evaluaciones.filter(e => e.estado === 'pendiente').length;
    const promedio = evaluaciones.reduce((acc, e) => acc + (e.puntaje_total || 0), 0) / (evaluaciones.length || 1);
    
    return { total, completadas, pendientes, promedio };
  };

  if (showSingle) {
    return (
      <EvaluacionSingle 
        evaluacionId={singleEvaluacionId}
        onBack={handleBackFromSingle}
      />
    );
  }

  const stats = getStats();

  const renderGridView = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 h-20"></div>
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

    if (filteredEvaluaciones.length === 0) {
      return (
        <div className="text-center py-12">
          <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontraron evaluaciones.</p>
          <Button onClick={handleCreate} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Crear primera evaluación
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEvaluaciones.map((evaluacion) => {
          const fields = [
            ...(evaluacion.personal_nombre ? [{ 
              icon: User, 
              label: "Evaluado", 
              value: `${evaluacion.personal_nombre} ${evaluacion.personal_apellido || ''}` 
            }] : []),
            ...(evaluacion.fecha_inicio ? [{ 
              icon: Calendar, 
              label: "Fecha", 
              value: formatDate(evaluacion.fecha_inicio) 
            }] : []),
            ...(evaluacion.puntaje_total ? [{ 
              icon: Star, 
              label: "Puntaje", 
              value: `${evaluacion.puntaje_total}/100` 
            }] : [])
          ];

          return (
            <UnifiedCard
              key={evaluacion.id}
              title={evaluacion.titulo}
              description={evaluacion.descripcion}
              status={evaluacion.estado}
              fields={fields}
              icon={ClipboardCheck}
              primaryColor="purple"
              onView={() => handleViewSingle(evaluacion)}
              onEdit={() => handleEdit(evaluacion)}
              onDelete={() => handleDeleteClick(evaluacion.id)}
            />
          );
        })}
      </div>
    );
  };

  const renderListView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
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
                  Evaluación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Evaluado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Puntaje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEvaluaciones.map((evaluacion) => (
                <tr key={evaluacion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ClipboardCheck className="h-5 w-5 text-purple-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {evaluacion.titulo}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {evaluacion.descripcion}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {evaluacion.personal_nombre} {evaluacion.personal_apellido}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getEstadoBadgeColor(evaluacion.estado)}>
                      {evaluacion.estado}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {evaluacion.puntaje_total ? (
                      <div className="flex items-center">
                        {renderStars(evaluacion.puntaje_total)}
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin puntaje</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(evaluacion.fecha_inicio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewSingle(evaluacion)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(evaluacion)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(evaluacion.id)}
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
        title="Gestión de Evaluaciones"
        description="Administra las evaluaciones de desempeño según ISO 9001"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNew={handleCreate}
        onExport={handleExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        newButtonText="Nueva Evaluación"
        totalCount={evaluaciones.length}
        lastUpdated="hoy"
        icon={ClipboardCheck}
        primaryColor="purple"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.promedio.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="en_proceso">En Proceso</SelectItem>
            <SelectItem value="completada">Completada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewMode === 'grid' ? renderGridView() : renderListView()}

      <EvaluacionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        evaluacion={selectedEvaluacion}
        onSave={handleSave}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar eliminación"
        description="¿Estás seguro de que deseas eliminar esta evaluación? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default EvaluacionesListing;
