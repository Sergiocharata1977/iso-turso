import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, User, Calendar, X } from 'lucide-react';
import { personalService } from '@/services/personalService';
import { competenciasService } from '@/services/competenciasService';

const EvaluacionIndividualModal = ({ isOpen, onClose, onSave, evaluacion }) => {
  const [formData, setFormData] = useState({
    empleado_id: '',
    fecha_evaluacion: new Date().toISOString().split('T')[0],
    observaciones: '',
    competencias: []
  });
  const [empleados, setEmpleados] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadEmpleados();
      loadCompetencias();
      if (evaluacion) {
        setFormData({
          empleado_id: evaluacion.empleado_id || '',
          fecha_evaluacion: evaluacion.fecha_evaluacion || new Date().toISOString().split('T')[0],
          observaciones: evaluacion.observaciones || '',
          competencias: evaluacion.competencias || []
        });
      } else {
        setFormData({
          empleado_id: '',
          fecha_evaluacion: new Date().toISOString().split('T')[0],
          observaciones: '',
          competencias: []
        });
      }
    }
  }, [isOpen, evaluacion]);

  // Monitorear cambios en empleados
  useEffect(() => {
    console.log('👥 [EvaluacionModal] Estado de empleados actualizado:', empleados);
    console.log('🔢 [EvaluacionModal] Cantidad de empleados:', empleados.length);
    if (empleados.length > 0) {
      console.log('📝 [EvaluacionModal] Primer empleado:', empleados[0]);
    }
  }, [empleados]);

  // Monitorear cambios en formData
  useEffect(() => {
    console.log('📋 [EvaluacionModal] Estado de formData actualizado:', formData);
  }, [formData]);

  const loadEmpleados = async () => {
    try {
      console.log('🔄 [EvaluacionModal] Cargando empleados...');
      const data = await personalService.getAllPersonal();
      console.log('📋 [EvaluacionModal] Respuesta completa del backend:', data);
      console.log('📊 [EvaluacionModal] Tipo de datos:', typeof data);
      console.log('📈 [EvaluacionModal] Es array:', Array.isArray(data));
      console.log('🔢 [EvaluacionModal] Cantidad de empleados:', data?.length);
      
      if (data && Array.isArray(data) && data.length > 0) {
        console.log('✅ [EvaluacionModal] Datos válidos, estableciendo empleados');
        // Asegurar que cada empleado tenga un ID válido
        const empleadosValidos = data.filter(emp => emp && emp.id);
        console.log('✅ [EvaluacionModal] Empleados válidos:', empleadosValidos.length);
        setEmpleados(empleadosValidos);
      } else {
        console.error('❌ [EvaluacionModal] Datos inválidos o vacíos:', data);
        setEmpleados([]);
      }
    } catch (error) {
      console.error('❌ [EvaluacionModal] Error cargando empleados:', error);
      setEmpleados([]);
    }
  };

  const loadCompetencias = async () => {
    try {
      const data = await competenciasService.getAll();
      const competenciasConPuntaje = (data || []).map(comp => ({
        ...comp,
        puntaje: 0
      }));
      setCompetencias(competenciasConPuntaje);
      setFormData(prev => ({
        ...prev,
        competencias: competenciasConPuntaje
      }));
    } catch (error) {
      console.error('Error cargando competencias:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmpleadoChange = (empleadoId) => {
    console.log('🔄 [EvaluacionModal] Seleccionando personal:', empleadoId);
    console.log('📋 [EvaluacionModal] Lista de empleados:', empleados);
    
    const empleado = empleados.find(emp => emp.id === parseInt(empleadoId));
    console.log('🔍 [EvaluacionModal] Empleado encontrado:', empleado);
    
    if (empleado) {
      setFormData(prev => ({
        ...prev,
        empleado_id: parseInt(empleadoId),
        empleado_nombre: `${empleado.nombres || empleado.nombre || ''} ${empleado.apellidos || empleado.apellido || ''}`.trim()
      }));
      console.log('✅ [EvaluacionModal] Personal seleccionado:', empleado);
    } else {
      console.error('❌ [EvaluacionModal] No se encontró el personal con ID:', empleadoId);
    }
  };

  const handleCompetenciaPuntaje = (competenciaId, puntaje) => {
    setFormData(prev => ({
      ...prev,
      competencias: prev.competencias.map(comp =>
        comp.id === competenciaId ? { ...comp, puntaje } : comp
      )
    }));
  };

  const calcularPuntajeTotal = () => {
    const total = formData.competencias.reduce((sum, comp) => sum + (comp.puntaje || 0), 0);
    return total / formData.competencias.length || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔄 [EvaluacionModal] Iniciando guardado de evaluación...');
    console.log('📋 [EvaluacionModal] Datos del formulario:', formData);
    
    // Validar campos obligatorios
    if (!formData.empleado_id) {
      alert('Por favor selecciona un personal');
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
                  <Label htmlFor="personal" className="text-white flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal *
                  </Label>
                  <Select value={formData.empleado_id} onValueChange={handleEmpleadoChange}>
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500 focus:ring-2 focus:ring-teal-500">
                      <SelectValue placeholder="Seleccionar personal" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-600 border-slate-500">
                      {console.log('🎯 [EvaluacionModal] Renderizando empleados:', empleados)}
                      {empleados.length === 0 ? (
                        <SelectItem value="" disabled className="text-slate-400">
                          No hay empleados disponibles
                        </SelectItem>
                      ) : (
                        empleados.map((empleado) => {
                          console.log('👤 [EvaluacionModal] Empleado en map:', empleado);
                          const nombreCompleto = `${empleado.nombres || empleado.nombre || ''} ${empleado.apellidos || empleado.apellido || ''}`.trim();
                          return (
                            <SelectItem key={empleado.id} value={empleado.id} className="text-white hover:bg-slate-500">
                              {nombreCompleto || `Empleado ${empleado.id}`}
                            </SelectItem>
                          );
                        })
                      )}
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
                    className="bg-slate-600 border-slate-500 text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones" className="text-white">
                  Observaciones Generales
                </Label>
                <textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleChange('observaciones', e.target.value)}
                  className="w-full p-3 bg-slate-600 border border-slate-500 rounded-md text-white focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                  placeholder="Observaciones sobre la evaluación..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Evaluación de Competencias */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Evaluación de Competencias</span>
                <span className="text-lg font-bold text-teal-400">
                  Puntaje Total: {calcularPuntajeTotal().toFixed(1)}/10
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.competencias.map((competencia) => (
                <div key={competencia.id} className="flex items-center justify-between p-4 bg-slate-600 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{competencia.nombre}</h4>
                    {competencia.descripcion && (
                      <p className="text-sm text-slate-300 mt-1">{competencia.descripcion}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    {renderStars(competencia.id, competencia.puntaje || 0)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-500 text-white hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isLoading ? 'Guardando...' : (evaluacion ? 'Actualizar Evaluación' : 'Crear Evaluación')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluacionIndividualModal; 