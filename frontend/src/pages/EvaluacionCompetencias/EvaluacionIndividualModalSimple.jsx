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
import { personalService } from '@/services/personalService';
import { competenciasService } from '@/services/competenciasService';

const EvaluacionIndividualModalSimple = ({ isOpen, onClose, onSave, evaluacion }) => {
  const [formData, setFormData] = useState({
    empleado_id: '',
    empleado_nombre: '',
    fecha_evaluacion: new Date().toISOString().split('T')[0],
    observaciones: '',
    competencias: []
  });

  const [empleados, setEmpleados] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      loadEmpleados();
      loadCompetencias();
      
      if (evaluacion) {
        // Modo edición
        setFormData({
          empleado_id: evaluacion.empleado_id || '',
          empleado_nombre: evaluacion.empleado_nombre || '',
          fecha_evaluacion: evaluacion.fecha_evaluacion ? 
            new Date(evaluacion.fecha_evaluacion).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0],
          observaciones: evaluacion.observaciones || '',
          competencias: evaluacion.competencias || []
        });
      } else {
        // Modo creación
        setFormData({
          empleado_id: '',
          empleado_nombre: '',
          fecha_evaluacion: new Date().toISOString().split('T')[0],
          observaciones: '',
          competencias: []
        });
      }
    }
  }, [isOpen, evaluacion]);

  // Cargar empleados desde la base de datos
  const loadEmpleados = async () => {
    try {
      console.log('🔄 [EvaluacionModal] Cargando empleados...');
      const data = await personalService.getAllPersonal();
      const empleadosData = Array.isArray(data) ? data : [];
      setEmpleados(empleadosData);
      console.log('✅ [EvaluacionModal] Empleados cargados:', empleadosData.length);
    } catch (error) {
      console.error('❌ [EvaluacionModal] Error al cargar empleados:', error);
      setEmpleados([]);
    }
  };

  // Cargar competencias desde la base de datos
  const loadCompetencias = async () => {
    try {
      console.log('🔄 [EvaluacionModal] Cargando competencias...');
      const data = await competenciasService.getAll();
      const competenciasData = Array.isArray(data) ? data : [];
      setCompetencias(competenciasData);
      
      // Si es nueva evaluación, inicializar competencias con puntaje 0
      if (!evaluacion && competenciasData.length > 0) {
        const competenciasIniciales = competenciasData.map(comp => ({
          competencia_id: comp.id,
          competencia_nombre: comp.nombre,
          puntaje: 0
        }));
        setFormData(prev => ({ ...prev, competencias: competenciasIniciales }));
      }
      console.log('✅ [EvaluacionModal] Competencias cargadas:', competenciasData.length);
    } catch (error) {
      console.error('❌ [EvaluacionModal] Error al cargar competencias:', error);
      setCompetencias([]);
    }
  };

  // Manejar cambios en campos básicos
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar selección de empleado
  const handleEmpleadoChange = (empleadoId) => {
    console.log('🔄 [EvaluacionModal] Seleccionando empleado:', empleadoId);
    const empleado = empleados.find(emp => emp.id === parseInt(empleadoId));
    if (empleado) {
      setFormData(prev => ({
        ...prev,
        empleado_id: parseInt(empleadoId), // Convertir a número
        empleado_nombre: `${empleado.nombres || empleado.nombre || ''} ${empleado.apellidos || empleado.apellido || ''}`.trim()
      }));
      console.log('✅ [EvaluacionModal] Empleado seleccionado:', empleado);
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

  // Calcular puntaje total
  const calcularPuntajeTotal = () => {
    if (formData.competencias.length === 0) return 0;
    const suma = formData.competencias.reduce((acc, comp) => acc + (comp.puntaje || 0), 0);
    return (suma / formData.competencias.length).toFixed(1);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔄 [EvaluacionModal] Iniciando guardado de evaluación...');
    console.log('📋 [EvaluacionModal] Datos del formulario:', formData);
    
    // Validar campos obligatorios
    if (!formData.empleado_id) {
      alert('Por favor selecciona un empleado');
      return;
    }
    
    if (!formData.fecha_evaluacion) {
      alert('Por favor selecciona una fecha de evaluación');
      return;
    }
    
    if (!formData.competencias || formData.competencias.length === 0) {
      alert('No hay competencias para evaluar');
      return;
    }
    
    setIsLoading(true);

    try {
      const dataToSave = {
        ...formData,
        puntaje_total: parseFloat(calcularPuntajeTotal()),
        estado: formData.competencias.every(comp => comp.puntaje > 0) ? 'completada' : 'pendiente'
      };

      console.log('💾 [EvaluacionModal] Datos a guardar:', dataToSave);
      await onSave(dataToSave);
      console.log('✅ [EvaluacionModal] Evaluación guardada exitosamente');
    } catch (error) {
      console.error('❌ [EvaluacionModal] Error al guardar evaluación:', error);
      alert('Error al guardar la evaluación: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar estrellas para puntaje
  const renderStars = (competenciaId, currentPuntaje) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleCompetenciaPuntaje(competenciaId, star)}
            className={`w-6 h-6 ${
              star <= currentPuntaje
                ? 'text-yellow-400'
                : 'text-slate-400'
            } hover:text-yellow-300 hover:scale-110 transition-all duration-200 cursor-pointer`}
          >
            <Star 
              className={`w-full h-full ${
                star <= currentPuntaje ? 'fill-yellow-400' : 'fill-none'
              }`} 
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-white">{currentPuntaje}/10</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {evaluacion ? 'Editar Evaluación Individual' : 'Nueva Evaluación Individual'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
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
                  <Select value={formData.empleado_id} onValueChange={handleEmpleadoChange}>
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500 focus:ring-2 focus:ring-teal-500">
                      <SelectValue placeholder="Seleccionar empleado" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-600 border-slate-500">
                      {empleados.filter(emp => emp.id).map((empleado) => (
                        <SelectItem key={empleado.id} value={empleado.id} className="text-white hover:bg-slate-500">
                          {`${empleado.nombres || empleado.nombre || ''} ${empleado.apellidos || empleado.apellido || ''}`.trim()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha" className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Evaluación *
                  </Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha_evaluacion}
                    onChange={(e) => handleChange('fecha_evaluacion', e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones" className="text-white flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observaciones Generales
                </Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleChange('observaciones', e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Observaciones sobre la evaluación..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Evaluación de competencias */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5" />
                Evaluación de Competencias
                <div className="ml-auto text-sm">
                  Puntaje Total: <span className="font-bold text-teal-400">{calcularPuntajeTotal()}/10</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.competencias.map((comp) => (
                <div key={comp.competencia_id} className="p-4 bg-slate-600 rounded-lg">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{comp.competencia_nombre}</h4>
                      <div className="text-sm text-slate-300">
                        Puntaje: {comp.puntaje}/10
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      {renderStars(comp.competencia_id, comp.puntaje)}
                    </div>
                  </div>
                </div>
              ))}

              {formData.competencias.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Award className="mx-auto h-12 w-12 mb-2" />
                  <p>No hay competencias disponibles</p>
                  <p className="text-sm">Asegúrate de tener competencias creadas en el sistema</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                console.log('🖱️ [EvaluacionModal] Botón clickeado');
                console.log('📋 [EvaluacionModal] Estado del formulario:', {
                  empleado_id: formData.empleado_id,
                  isLoading,
                  competencias: formData.competencias.length
                });
              }}
            >
              {isLoading ? 'Guardando...' : (evaluacion ? 'Actualizar' : 'Crear')} Evaluación
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluacionIndividualModalSimple;
