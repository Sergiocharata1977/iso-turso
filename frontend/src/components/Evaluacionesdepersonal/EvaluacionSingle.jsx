import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ClipboardCheck,
  User,
  Calendar,
  Star,
  FileText,
  Building
} from "lucide-react";
import { evaluacionesService } from "@/services/evaluacionesService";
import EvaluacionModal from "./EvaluacionModal";

const EvaluacionSingle = ({ evaluacionId, onBack }) => {
  const [evaluacion, setEvaluacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (evaluacionId) {
      fetchEvaluacion();
    }
  }, [evaluacionId]);

  const fetchEvaluacion = async () => {
    try {
      setLoading(true);
      console.log('🔍 Cargando evaluación:', evaluacionId);
      const data = await evaluacionesService.getById(evaluacionId);
      setEvaluacion(data);
      console.log('✅ Evaluación cargada:', data);
    } catch (error) {
      console.error('❌ Error al cargar evaluación:', error);
      toast.error("Error al cargar la evaluación");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      await evaluacionesService.update(evaluacion.id, formData);
      toast.success("Evaluación actualizada exitosamente");
      setModalOpen(false);
      fetchEvaluacion(); // Recargar datos
    } catch (error) {
      console.error('Error al actualizar evaluación:', error);
      toast.error("Error al actualizar la evaluación");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Está seguro de que desea eliminar esta evaluación?")) {
      try {
        await evaluacionesService.delete(evaluacion.id);
        toast.success("Evaluación eliminada exitosamente");
        onBack(); // Volver al listado
      } catch (error) {
        console.error("Error al eliminar evaluación:", error);
        toast.error("Error al eliminar la evaluación");
      }
    }
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
        weekday: 'long',
        year: 'numeric',
        month: 'long',
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
          className={`h-5 w-5 ${i < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-lg font-semibold ml-2">({puntaje}/100)</span>
      </div>
    );
  };

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

  if (!evaluacion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <ClipboardCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Evaluación no encontrada</h3>
              <p className="text-gray-600">La evaluación solicitada no existe o ha sido eliminada.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{evaluacion.titulo}</h1>
              <p className="text-gray-600">EVAL-{evaluacion.id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleEdit}
              variant="outline" 
              className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button 
              onClick={handleDelete}
              variant="outline" 
              className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Información Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Info General */}
          <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-purple-600" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Empleado</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">
                      {evaluacion.personal_nombre} {evaluacion.personal_apellido}
                    </span>
                  </div>
                  {evaluacion.puesto && (
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{evaluacion.puesto}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <div className="mt-1">
                    <Badge className={getEstadoBadgeColor(evaluacion.estado)}>
                      {evaluacion.estado}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de Evaluación</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">
                      {formatDate(evaluacion.fecha_evaluacion)}
                    </span>
                  </div>
                </div>
                {evaluacion.puntaje && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Puntaje</label>
                    <div className="mt-1">
                      {renderStars(evaluacion.puntaje)}
                    </div>
                  </div>
                )}
              </div>
              
              {evaluacion.descripcion && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Descripción</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {evaluacion.descripcion}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ID</span>
                  <span className="font-semibold">EVAL-{evaluacion.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado</span>
                  <Badge className={getEstadoBadgeColor(evaluacion.estado)}>
                    {evaluacion.estado}
                  </Badge>
                </div>
                {evaluacion.puntaje && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Puntaje</span>
                    <span className="font-semibold">{evaluacion.puntaje}/100</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Creado</span>
                  <span className="text-sm">
                    {formatDate(evaluacion.created_at)}
                  </span>
                </div>
                {evaluacion.updated_at !== evaluacion.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Actualizado</span>
                    <span className="text-sm">
                      {formatDate(evaluacion.updated_at)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleEdit}
                  variant="outline" 
                  className="w-full justify-start gap-2 border-gray-300"
                >
                  <Edit className="h-4 w-4" />
                  Editar Evaluación
                </Button>
                <Button 
                  onClick={handleDelete}
                  variant="outline" 
                  className="w-full justify-start gap-2 border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar Evaluación
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal */}
        <EvaluacionModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          evaluacion={evaluacion}
        />
      </div>
    </div>
  );
};

export default EvaluacionSingle;
