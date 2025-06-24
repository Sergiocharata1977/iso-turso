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
  Filter
} from "lucide-react";
import { evaluacionesService } from "@/services/evaluacionesService";
import EvaluacionModal from "./EvaluacionModal";
import EvaluacionSingle from "./EvaluacionSingle";
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
    fetchEvaluaciones(); // Refrescar en caso de cambios
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
    if (!puntaje) return <span className="text-gray-400">Sin puntaje</span>;
    
    const stars = [];
    const fullStars = Math.floor(puntaje / 20); // Convertir de 0-100 a 0-5 estrellas
    
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

  if (showSingle) {
    return (
      <EvaluacionSingle 
        evaluacionId={singleEvaluacionId}
        onBack={handleBackFromSingle}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Principal */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Evaluaciones</h1>
              <p className="text-gray-600">Administra las evaluaciones de desempeño según ISO 9001</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Evaluación
              </Button>
            </div>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar evaluaciones, empleados, títulos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-48 border-gray-300">
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
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Tarjetas
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("list")}
              >
                Tabla
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ClipboardCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-xl font-semibold text-gray-900">{evaluaciones.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <ClipboardCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completadas</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {evaluaciones.filter(e => e.estado === 'completada').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <ClipboardCheck className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pendientes</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {evaluaciones.filter(e => e.estado === 'pendiente').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Promedio</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {evaluaciones.filter(e => e.puntaje).length > 0 
                        ? Math.round(evaluaciones.filter(e => e.puntaje).reduce((acc, e) => acc + e.puntaje, 0) / evaluaciones.filter(e => e.puntaje).length)
                        : 0
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Evaluaciones */}
          {filteredEvaluaciones.length === 0 ? (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-12 text-center">
                <ClipboardCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay evaluaciones</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || estadoFilter 
                    ? "No se encontraron evaluaciones con los filtros aplicados." 
                    : "Comience creando su primera evaluación de personal."
                  }
                </p>
                {!searchTerm && !estadoFilter && (
                  <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primera Evaluación
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredEvaluaciones.map((evaluacion) => (
                <Card 
                  key={evaluacion.id} 
                  className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewSingle(evaluacion)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                          <ClipboardCheck className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                            {evaluacion.titulo}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            EVAL-{evaluacion.id}
                          </p>
                        </div>
                      </div>
                      <Badge className={getEstadoBadgeColor(evaluacion.estado)}>
                        {evaluacion.estado}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-900">
                          {evaluacion.personal_nombre} {evaluacion.personal_apellido}
                        </span>
                        {evaluacion.puesto && (
                          <span className="text-sm text-gray-500">• {evaluacion.puesto}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {formatDate(evaluacion.fecha_evaluacion)}
                        </span>
                      </div>
                      {evaluacion.puntaje && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gray-500" />
                          {renderStars(evaluacion.puntaje)}
                        </div>
                      )}
                      {evaluacion.descripcion && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {evaluacion.descripcion}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-100 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSingle(evaluacion);
                        }}
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(evaluacion);
                        }}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(evaluacion.id);
                        }}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Modal */}
          <EvaluacionModal 
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            evaluacion={selectedEvaluacion}
          />
          
          {/* Diálogo de confirmación para eliminar */}
          <ConfirmDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDelete}
            title="Eliminar evaluación"
            message="¿Estás seguro de que deseas eliminar esta evaluación? Esta acción no se puede deshacer."
            confirmText="Eliminar"
            cancelText="Cancelar"
            isDestructive={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EvaluacionesListing;
