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
  Filter
} from "lucide-react";
import { capacitacionesService } from "@/services/capacitacionesService";
import { toast } from "sonner";
import CapacitacionModal from "./CapacitacionModal";
import CapacitacionSingle from "./CapacitacionSingle";

export default function CapacitacionesListing() {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCapacitacion, setSelectedCapacitacion] = useState(null);
  const [showSingle, setShowSingle] = useState(false);
  const [singleCapacitacionId, setSingleCapacitacionId] = useState(null);

  // Cargar capacitaciones al montar el componente
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

  const handleEdit = (capacitacion, e) => {
    e.stopPropagation(); // Prevenir navegación al single
    setSelectedCapacitacion(capacitacion);
    setModalOpen(true);
  };

  const handleViewSingle = (capacitacionId) => {
    setSingleCapacitacionId(capacitacionId);
    setShowSingle(true);
  };

  const handleBackFromSingle = () => {
    setShowSingle(false);
    setSingleCapacitacionId(null);
    fetchCapacitaciones(); // Refrescar la lista por si hubo cambios
  };

  const handleSave = async (formData) => {
    try {
      if (selectedCapacitacion) {
        // Actualizar capacitación existente
        await capacitacionesService.update(selectedCapacitacion.id, formData);
        toast.success("Capacitación actualizada exitosamente");
      } else {
        // Crear nueva capacitación
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

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevenir navegación al single
    if (window.confirm("¿Está seguro de que desea eliminar esta capacitación?")) {
      try {
        await capacitacionesService.delete(id);
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

  // Filtrar capacitaciones
  const filteredCapacitaciones = capacitaciones.filter((capacitacion) => {
    const matchesSearch = capacitacion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capacitacion.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === "todos" || capacitacion.estado === filterEstado;
    
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'programada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en curso':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
      return 'Fecha no válida';
    }
  };

  // Si estamos en vista single, mostrar el componente single
  if (showSingle) {
    return (
      <CapacitacionSingle 
        capacitacionId={singleCapacitacionId}
        onBack={handleBackFromSingle}
      />
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Capacitaciones</h1>
              <p className="text-gray-600">Administra las capacitaciones del personal según ISO 9001</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Capacitación
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
                  placeholder="Buscar capacitaciones, títulos, estados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
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
          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando capacitaciones...</p>
            </div>
          )}

          {/* Lista de capacitaciones */}
          {!loading && (
            <>
              {filteredCapacitaciones.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron capacitaciones</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterEstado !== "todos" 
                      ? "Intenta ajustar tus filtros de búsqueda"
                      : "Comienza creando tu primera capacitación"
                    }
                  </p>
                  {!searchTerm && filterEstado === "todos" && (
                    <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Capacitación
                    </Button>
                  )}
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
                    : "space-y-4"
                }>
                  {filteredCapacitaciones.map((capacitacion) => (
                    <Card 
                      key={capacitacion.id} 
                      className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border border-gray-200"
                      onClick={() => handleViewSingle(capacitacion.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="bg-emerald-100 p-2 rounded-lg flex-shrink-0">
                              <BookOpen className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                                {capacitacion.titulo}
                              </CardTitle>
                              <p className="text-sm text-gray-500 mt-1">CAP-{capacitacion.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getEstadoBadgeColor(capacitacion.estado)}>
                              {capacitacion.estado}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <CardDescription className="line-clamp-2 text-gray-600">
                            {capacitacion.descripcion || "Sin descripción disponible"}
                          </CardDescription>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{formatDate(capacitacion.fecha_inicio)}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleViewSingle(capacitacion.id); }}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => handleEdit(capacitacion, e)}
                                className="text-gray-600 hover:text-blue-600"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => handleDelete(capacitacion.id, e)}
                                className="text-gray-600 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        <CapacitacionModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          capacitacion={selectedCapacitacion}
        />
      </div>
    </div>
  );
}
