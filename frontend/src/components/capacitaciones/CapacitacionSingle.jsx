import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText
} from "lucide-react";
import { capacitacionesService } from "@/services/capacitacionesService";
import CapacitacionModal from "./CapacitacionModal";

const CapacitacionSingle = ({ capacitacionId, onBack }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [capacitacion, setCapacitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Usar el ID desde props o desde params
  const id = capacitacionId || paramId;

  useEffect(() => {
    if (id) {
      fetchCapacitacion();
    }
  }, [id]);

  const fetchCapacitacion = async () => {
    try {
      setLoading(true);
      console.log(`🔍 Cargando capacitación ID: ${id}`);
      const data = await capacitacionesService.getById(id);
      setCapacitacion(data);
      console.log('✅ Capacitación cargada:', data);
    } catch (error) {
      console.error("❌ Error al obtener capacitación:", error);
      toast.error("Error al cargar la capacitación");
      handleBack();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      await capacitacionesService.update(id, formData);
      toast.success("Capacitación actualizada exitosamente");
      setModalOpen(false);
      fetchCapacitacion(); // Recargar datos
    } catch (error) {
      console.error('Error al actualizar capacitación:', error);
      toast.error("Error al actualizar la capacitación");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Está seguro de que desea eliminar esta capacitación?")) {
      try {
        await capacitacionesService.delete(id);
        toast.success("Capacitación eliminada exitosamente");
        handleBack();
      } catch (error) {
        console.error("Error al eliminar capacitación:", error);
        toast.error("Error al eliminar la capacitación");
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/capacitaciones");
    }
  };

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

  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'programada':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'en curso':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'completada':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'cancelada':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const formatDateShort = (dateString) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!capacitacion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Capacitación no encontrada</h2>
            <p className="text-gray-600 mb-6">La capacitación que buscas no existe o ha sido eliminada.</p>
            <Button onClick={handleBack} className="bg-slate-800 hover:bg-slate-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Capacitaciones
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detalle de Capacitación</h1>
              <p className="text-gray-600 text-sm">CAP-{capacitacion.id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleEdit}
              className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDelete}
              className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                      {capacitacion.titulo}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Badge className={getEstadoBadgeColor(capacitacion.estado)}>
                        <span className="mr-1">{getEstadoIcon(capacitacion.estado)}</span>
                        {capacitacion.estado}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Creado el {formatDateShort(capacitacion.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Descripción</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {capacitacion.descripcion || "No se ha proporcionado una descripción para esta capacitación."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información de Fechas */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  Programación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</p>
                  <p className="text-gray-900 font-medium">{formatDate(capacitacion.fecha_inicio)}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-1">Última Actualización</p>
                  <p className="text-gray-600 text-sm">
                    {capacitacion.updated_at ? formatDateShort(capacitacion.updated_at) : 'Sin actualizaciones'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Información del Sistema */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Información del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">ID</span>
                  <span className="text-sm font-mono text-gray-900">{capacitacion.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Estado</span>
                  <Badge className={getEstadoBadgeColor(capacitacion.estado)} variant="outline">
                    {capacitacion.estado}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Fecha Creación</span>
                  <span className="text-sm text-gray-900">{formatDateShort(capacitacion.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal de Edición */}
        <CapacitacionModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          capacitacion={capacitacion}
        />
      </div>
    </div>
  );
};

export default CapacitacionSingle;
