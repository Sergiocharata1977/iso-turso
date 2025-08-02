import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import objetivosCalidadService from '@/services/objetivosCalidadService';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Target,
  LayoutGrid,
  Table as TableIcon,
  ArrowLeft,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import UnifiedHeader from '../common/UnifiedHeader';
import UnifiedCard from '../common/UnifiedCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ObjetivoModal from './ObjetivoModal';
import ObjetivoSingle from './ObjetivoSingle';

function ObjetivosListing({ procesoId, procesoNombre, onBack }) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [objetivos, setObjetivos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [objetivoToDelete, setObjetivoToDelete] = useState(null);
  const [view, setView] = useState('listing');
  const [currentObjetivo, setCurrentObjetivo] = useState(null);

  useEffect(() => {
    loadObjetivos();
  }, [procesoId]);

  const loadObjetivos = async () => {
    setIsLoading(true);
    try {
      let response = await objetivosCalidadService.getAll();
      let fetchedObjetivos = Array.isArray(response) ? response : (response.data || []);
      if (procesoId) {
        fetchedObjetivos = fetchedObjetivos.filter(obj => obj.proceso_id === procesoId);
      }
      setObjetivos(fetchedObjetivos);
    } catch (error) {
      console.error("Error al cargar objetivos desde la API:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los objetivos. " + (error.message || ""),
        variant: "destructive",
      });
      setObjetivos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (objetivoData) => {
    try {
      setIsLoading(true);
      if (selectedObjetivo && selectedObjetivo.id) {
        await objetivosCalidadService.update(selectedObjetivo.id, objetivoData);
        toast({ title: "Objetivo actualizado", description: "Los datos del objetivo han sido actualizados exitosamente" });
      } else {
        await objetivosCalidadService.create(objetivoData);
        toast({ title: "Objetivo creado", description: "Se ha agregado un nuevo objetivo exitosamente" });
      }
      await loadObjetivos();
      setIsModalOpen(false);
      setSelectedObjetivo(null);
    } catch (error) {
      console.error("Error al guardar objetivo:", error);
      toast({ title: "Error", description: "Ocurrió un error al guardar el objetivo: " + (error.message || ""), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (objetivo) => {
    setSelectedObjetivo(objetivo);
    setIsModalOpen(true);
  };

  const handleView = (objetivo) => {
    setCurrentObjetivo(objetivo);
    setView('single');
  };

  const handleBackToListing = () => {
    setView('listing');
    setCurrentObjetivo(null);
  };

  const confirmDelete = (objetivo) => {
    setObjetivoToDelete(objetivo);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!objetivoToDelete) return;
    try {
      setIsLoading(true);
      await objetivosCalidadService.delete(objetivoToDelete.id);
      toast({
        title: "Objetivo eliminado",
        description: `El objetivo "${objetivoToDelete.codigo}" ha sido eliminado.`,
      });
      await loadObjetivos();
    } catch (error) {
      console.error("Error al eliminar objetivo:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el objetivo. " + (error.message || ""),
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setObjetivoToDelete(null);
      setIsLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedObjetivo(null);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    toast({
      title: "Exportación",
      description: "Función de exportación en desarrollo",
    });
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'en progreso': return 'bg-blue-100 text-blue-800';
      case 'completado': return 'bg-green-100 text-green-800';
      case 'activo': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'en progreso': return Clock;
      case 'completado': return CheckCircle;
      case 'activo': return CheckCircle;
      case 'cancelado': return AlertCircle;
      default: return Target;
    }
  };

  const filteredObjetivos = objetivos.filter(objetivo =>
    (objetivo.codigo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (objetivo.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
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

  const getStats = () => {
    const total = objetivos.length;
    const activos = objetivos.filter(obj => obj.estado === 'activo').length;
    const completados = objetivos.filter(obj => obj.estado === 'completado').length;
    const enProgreso = objetivos.filter(obj => obj.estado === 'en progreso').length;
    
    return { total, activos, completados, enProgreso };
  };

  if (view === 'single') {
    return (
      <ObjetivoSingle
        objetivo={currentObjetivo}
        onBack={handleBackToListing}
        onEdit={handleEdit}
        onDelete={() => confirmDelete(currentObjetivo)}
      />
    );
  }

  const stats = getStats();

  const renderGridView = () => {
    if (isLoading) {
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

    if (filteredObjetivos.length === 0) {
      return (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontraron objetivos de calidad.</p>
          <Button onClick={handleNew} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Crear primer objetivo
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredObjetivos.map((objetivo) => {
          const StatusIcon = getStatusIcon(objetivo.estado);
          const fields = [
            ...(objetivo.responsable ? [{ 
              icon: StatusIcon, 
              label: "Responsable", 
              value: objetivo.responsable 
            }] : []),
            ...(objetivo.meta ? [{ 
              icon: TrendingUp, 
              label: "Meta", 
              value: objetivo.meta 
            }] : []),
            ...(objetivo.fecha_limite ? [{ 
              icon: Calendar, 
              label: "Fecha límite", 
              value: formatDate(objetivo.fecha_limite) 
            }] : [])
          ];

          return (
            <UnifiedCard
              key={objetivo.id}
              title={objetivo.codigo}
              description={objetivo.descripcion}
              status={objetivo.estado}
              code={objetivo.codigo}
              fields={fields}
              icon={Target}
              primaryColor="emerald"
              onView={() => handleView(objetivo)}
              onEdit={() => handleEdit(objetivo)}
              onDelete={() => confirmDelete(objetivo)}
            />
          );
        })}
      </div>
    );
  };

  const renderListView = () => {
    if (isLoading) {
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
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Meta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredObjetivos.map((objetivo) => (
                <tr key={objetivo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 text-emerald-500 mr-3" />
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {objetivo.codigo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                      {objetivo.descripcion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(objetivo.estado)}>
                      {objetivo.estado}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {objetivo.meta || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {objetivo.responsable || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(objetivo)}
                      >
                        <Target className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(objetivo)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDelete(objetivo)}
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

  const headerTitle = procesoId ? "Objetivos de Calidad" : "Objetivos de Calidad";
  const headerDescription = procesoId ? 
    `Objetivos del proceso: ${procesoNombre}` : 
    "Administra los objetivos de calidad según ISO 9001";

  return (
    <div className="p-6 space-y-6">
      {/* Header con botón de volver si es necesario */}
      {procesoId && onBack && (
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Procesos
          </Button>
        </div>
      )}

      <UnifiedHeader
        title={headerTitle}
        description={headerDescription}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNew={handleNew}
        onExport={handleExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        newButtonText="Nuevo Objetivo"
        totalCount={objetivos.length}
        lastUpdated="hoy"
        icon={Target}
        primaryColor="emerald"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total</div>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Activos</div>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Completados</div>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">En Progreso</div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enProgreso}</div>
          </CardContent>
        </Card>
      </div>

      {viewMode === 'grid' ? renderGridView() : renderListView()}

      <ObjetivoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        objetivo={selectedObjetivo}
        onSave={handleSave}
        procesoId={procesoId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El objetivo será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ObjetivosListing;
