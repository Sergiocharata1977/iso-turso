import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, User, Calendar, FileText, X, Award } from 'lucide-react';

const EvaluacionIndividualModalSimple = ({ isOpen, onClose, onSave, evaluacion }) => {
  const [formData, setFormData] = useState({
    empleado_id: '',
    empleado_nombre: '',
    fecha_evaluacion: new Date().toISOString().split('T')[0],
    observaciones: '',
    competencias: []
  });

  const [empleados, setEmpleados] = useState([
    { id: 1, nombre: 'Juan', apellido: 'Pérez' },
    { id: 2, nombre: 'María', apellido: 'González' },
    { id: 3, nombre: 'Carlos', apellido: 'López' },
    { id: 4, nombre: 'Ana', apellido: 'Martínez' }
  ]);

  const [competencias, setCompetencias] = useState([
    { id: 1, nombre: 'Liderazgo', descripcion: 'Capacidad de dirigir equipos' },
    { id: 2, nombre: 'Comunicación', descripcion: 'Habilidades de comunicación efectiva' },
    { id: 3, nombre: 'Trabajo en Equipo', descripcion: 'Colaboración y cooperación' },
    { id: 4, nombre: 'Resolución de Problemas', descripcion: 'Análisis y solución de problemas' },
    { id: 5, nombre: 'Adaptabilidad', descripcion: 'Flexibilidad ante cambios' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      if (evaluacion) {
        // Modo edición
        setFormData({
          empleado_id: evaluacion.empleado_id || '',
          empleado_nombre: evaluacion.empleado_nombre || '',
          fecha_evaluacion: evaluacion.fecha_evaluacion ? 
            new Date(evaluacion.fecha_evaluacion).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0],
          observaciones: evaluacion.observaciones || '',
          competencias: evaluacion.competencias || competencias.map(comp => ({
            competencia_id: comp.id,
            nombre: comp.nombre,
            puntaje: 0
          }))
        });
      } else {
        // Modo creación
        setFormData({
          empleado_id: '',
          empleado_nombre: '',
          fecha_evaluacion: new Date().toISOString().split('T')[0],
          observaciones: '',
          competencias: competencias.map(comp => ({
            competencia_id: comp.id,
            nombre: comp.nombre,
            puntaje: 0
          }))
        });
      }
    }
  }, [isOpen, evaluacion, competencias]);

  // Manejar cambios en campos básicos
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar selección de empleado
  const handleEmpleadoChange = (empleadoId) => {
    const empleado = empleados.find(emp => emp.id === parseInt(empleadoId));
    if (empleado) {
      setFormData(prev => ({
        ...prev,
        empleado_id: empleado.id,
        empleado_nombre: `${empleado.nombre} ${empleado.apellido}`
      }));
    }
  };

  // Manejar cambio de puntaje de competencia
  const handleCompetenciaPuntaje = (competenciaId, puntaje) => {
    setFormData(prev => ({
      ...prev,
      competencias: prev.competencias.map(comp =>
        comp.competencia_id === competenciaId
          ? { ...comp, puntaje: parseInt(puntaje) || 0 }
          : comp
      )
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.empleado_id) {
      alert('Por favor selecciona un empleado');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 [EvaluacionModal] Guardando evaluación:', formData);
      
      // Preparar datos para enviar
      const evaluacionData = {
        empleado_id: formData.empleado_id,
        fecha_evaluacion: formData.fecha_evaluacion,
        observaciones: formData.observaciones,
        competencias: formData.competencias.filter(comp => comp.puntaje > 0) // Solo competencias con puntaje
      };

      await onSave(evaluacionData);
      console.log('✅ [EvaluacionModal] Evaluación guardada exitosamente');
      
      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('❌ [EvaluacionModal] Error al guardar evaluación:', error);
      alert('Error al guardar la evaluación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar estrellas para puntaje
  const renderStars = (competenciaId, puntaje) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleCompetenciaPuntaje(competenciaId, star)}
            className={`w-6 h-6 ${
              star <= puntaje 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 hover:text-yellow-200'
            } transition-colors`}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
        <span className="ml-2 text-white font-medium">{puntaje}/10</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold text-white">
              {evaluacion ? 'Editar Evaluación Individual' : 'Nueva Evaluación Individual'}
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              {evaluacion ? 'Modifica los datos de la evaluación individual' : 'Crea una nueva evaluación individual de competencias'}
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empleado" className="text-white flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Empleado *
                  </Label>
                  <Select value={formData.empleado_id.toString()} onValueChange={handleEmpleadoChange}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Seleccionar empleado" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {empleados.map((empleado) => (
                        <SelectItem key={empleado.id} value={empleado.id.toString()}>
                          {empleado.nombre} {empleado.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_evaluacion" className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Evaluación *
                  </Label>
                  <Input
                    id="fecha_evaluacion"
                    type="date"
                    value={formData.fecha_evaluacion}
                    onChange={(e) => handleChange('fecha_evaluacion', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones" className="text-white flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observaciones
                </Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleChange('observaciones', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                  placeholder="Observaciones generales sobre la evaluación..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Evaluación de Competencias */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5" />
                Evaluación de Competencias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.competencias.map((competencia) => (
                <div
                  key={competencia.competencia_id}
                  className="p-4 bg-slate-600 rounded-lg border border-slate-500"
                >
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{competencia.nombre}</h4>
                        <p className="text-slate-300 text-sm">
                          {competencias.find(c => c.id === competencia.competencia_id)?.descripcion}
                        </p>
                      </div>
                      <Badge 
                        className={`${
                          competencia.puntaje >= 8 ? 'bg-green-600' :
                          competencia.puntaje >= 6 ? 'bg-yellow-600' :
                          competencia.puntaje >= 4 ? 'bg-orange-600' :
                          competencia.puntaje > 0 ? 'bg-red-600' : 'bg-gray-600'
                        }`}
                      >
                        {competencia.puntaje > 0 ? `${competencia.puntaje}/10` : 'Sin evaluar'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">Puntaje:</span>
                      {renderStars(competencia.competencia_id, competencia.puntaje)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                evaluacion ? 'Actualizar Evaluación' : 'Crear Evaluación'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluacionIndividualModalSimple;
