import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, Edit, Trash2, Calendar, Users, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { evaluacionesGrupalesService } from '../../services/evaluacionesGrupales';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const EvaluacionGrupalSingle = ({ evaluacionId, onBack }) => {
  const [evaluacion, setEvaluacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Obtener el usuario del contexto

  useEffect(() => {
    if (evaluacionId && user?.organization_id) {
      loadEvaluacion();
    }
  }, [evaluacionId, user?.organization_id]);

  const loadEvaluacion = async () => {
    try {
      setLoading(true);
      const data = await evaluacionesGrupalesService.getById(evaluacionId, user.organization_id);
      setEvaluacion(data);
    } catch (error) {
      console.error('Error al cargar evaluación:', error);
      toast.error('Error al cargar la evaluación grupal');
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Por ahora, solo mostramos un toast
    toast.info('Funcionalidad de edición no implementada desde vista individual');
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta evaluación grupal?')) {
      try {
        await evaluacionesGrupalesService.delete(evaluacionId, user.organization_id);
        toast.success('Evaluación grupal eliminada exitosamente');
        onBack();
      } catch (error) {
        console.error('Error al eliminar evaluación:', error);
        toast.error('Error al eliminar la evaluación grupal');
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'planificada': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'en_progreso': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      'completada': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'cancelada': { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    
    const config = estados[estado] || estados['planificada'];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {estado?.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!evaluacion) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">Evaluación no encontrada</h2>
          <Button onClick={onBack} className="mt-4">
            Volver a Evaluaciones
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Evaluación Grupal</h1>
            <p className="text-gray-600 mt-1">Sistema de Gestión de Calidad ISO 9001</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Card Principal */}
      <Card className="mb-6 border-l-4 border-l-teal-500">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                {evaluacion.titulo}
              </CardTitle>
              <div className="flex items-center gap-4">
                {getEstadoBadge(evaluacion.estado)}
                <span className="text-sm text-gray-500">
                  Creado: {formatDate(evaluacion.created_at)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tarjetas informativas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Fecha de Evaluación</h3>
              </div>
              <p className="text-blue-800">{formatDate(evaluacion.fecha_evaluacion)}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Proceso</h3>
              </div>
              <p className="text-purple-800">{evaluacion.proceso_capacitacion || 'No especificado'}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-900">Empleados</h3>
              </div>
              <p className="text-orange-800">{evaluacion.total_empleados || 0} participantes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descripción */}
      {evaluacion.descripcion && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Descripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed text-justify">
              {evaluacion.descripcion}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="detalles" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="detalles" className="data-[state=active]:bg-white text-gray-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Detalles
          </TabsTrigger>
          <TabsTrigger value="empleados" className="data-[state=active]:bg-white text-gray-700">
            <Users className="h-4 w-4 mr-2" />
            Empleados
          </TabsTrigger>
          <TabsTrigger value="observaciones" className="data-[state=active]:bg-white text-gray-700">
            <FileText className="h-4 w-4 mr-2" />
            Observaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="detalles" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <div className="mt-1">
                    {getEstadoBadge(evaluacion.estado)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Proceso de Capacitación</label>
                  <p className="mt-1 text-gray-900">{evaluacion.proceso_capacitacion || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Evaluación</label>
                  <p className="mt-1 text-gray-900">{formatDate(evaluacion.fecha_evaluacion)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fechas del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
                  <p className="mt-1 text-gray-900">{formatDate(evaluacion.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Última Actualización</label>
                  <p className="mt-1 text-gray-900">{formatDate(evaluacion.updated_at)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="empleados" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Empleados Evaluados</CardTitle>
            </CardHeader>
            <CardContent>
              {evaluacion.empleados && evaluacion.empleados.length > 0 ? (
                <div className="space-y-2">
                  {evaluacion.empleados.map((empleado, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                      <p className="font-medium">{empleado.nombre}</p>
                      <p className="text-sm text-gray-600">{empleado.puesto}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay empleados asignados a esta evaluación</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="observaciones" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Observaciones Generales</CardTitle>
            </CardHeader>
            <CardContent>
              {evaluacion.observaciones_generales ? (
                <p className="text-gray-700 leading-relaxed">
                  {evaluacion.observaciones_generales}
                </p>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay observaciones registradas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EvaluacionGrupalSingle;
