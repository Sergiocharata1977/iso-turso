import React, { useState, useEffect, useContext } from 'react';
import { X, Plus, Trash2, Star, Users, FileText, Calendar, Activity, User, Briefcase, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { evaluacionesGrupalesService } from '../../services/evaluacionesGrupales';
import { AuthContext } from '../../context/AuthContext';

const EvaluacionGrupalModal = ({ isOpen, onClose, onSave, evaluacion }) => {
  const { organizationId } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    proceso_capacitacion: '',
    fecha_evaluacion: '',
    estado: 'planificada',
    observaciones_generales: '',
    empleados: []
  });

  const [competenciasEstandar, setCompetenciasEstandar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && organizationId) {
      loadCompetenciasEstandar();
      if (evaluacion) {
        loadEvaluacionCompleta();
      } else {
        resetForm();
      }
    }
  }, [isOpen, evaluacion, organizationId]);

  const loadCompetenciasEstandar = async () => {
    try {
      const competencias = await evaluacionesGrupalesService.getCompetenciasEstandar(organizationId);
      setCompetenciasEstandar(competencias);
    } catch (error) {
      console.error('Error al cargar competencias:', error);
    }
  };

  const loadEvaluacionCompleta = async () => {
    try {
      setLoading(true);
      const evaluacionCompleta = await evaluacionesGrupalesService.getById(evaluacion.id, organizationId);
      setFormData({
        titulo: evaluacionCompleta.titulo || '',
        descripcion: evaluacionCompleta.descripcion || '',
        proceso_capacitacion: evaluacionCompleta.proceso_capacitacion || '',
        fecha_evaluacion: evaluacionCompleta.fecha_evaluacion || '',
        estado: evaluacionCompleta.estado || 'planificada',
        observaciones_generales: evaluacionCompleta.observaciones_generales || '',
        empleados: evaluacionCompleta.empleados || []
      });
    } catch (error) {
      console.error('Error al cargar evaluación completa:', error);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      proceso_capacitacion: '',
      fecha_evaluacion: '',
      estado: 'planificada',
      observaciones_generales: '',
      empleados: []
    });
  };

  const handleInputChange = (field, value) => {
    const safeValue = value === null || value === undefined ? '' : value;
    setFormData(prev => ({
      ...prev,
      [field]: safeValue
    }));
  };

  const agregarEmpleado = () => {
    const competenciasDefault = {};
    competenciasEstandar.forEach(comp => {
      competenciasDefault[comp.nombre] = 0;
    });

    const nuevoEmpleado = {
      id: Date.now(),
      nombre_empleado: '',
      puesto: '',
      competencias: competenciasDefault,
      observaciones_individuales: ''
    };

    setFormData(prev => ({
      ...prev,
      empleados: [...prev.empleados, nuevoEmpleado]
    }));
  };

  const eliminarEmpleado = (empleadoId) => {
    setFormData(prev => ({
      ...prev,
      empleados: prev.empleados.filter(emp => emp.id !== empleadoId)
    }));
  };

  const actualizarEmpleado = (empleadoId, field, value) => {
    setFormData(prev => ({
      ...prev,
      empleados: prev.empleados.map(emp => {
        if (emp.id === empleadoId) {
          return { ...emp, [field]: value };
        }
        return emp;
      })
    }));
  };

  const actualizarCompetenciaEmpleado = (empleadoId, competencia, calificacion) => {
    setFormData(prev => ({
      ...prev,
      empleados: prev.empleados.map(emp => {
        if (emp.id === empleadoId) {
          return {
            ...emp,
            competencias: {
              ...emp.competencias,
              [competencia]: parseInt(calificacion)
            }
          };
        }
        return emp;
      })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderStarRating = (empleadoId, competencia, valor) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => actualizarCompetenciaEmpleado(empleadoId, competencia, i)}
          className={`p-1 ${i <= valor ? 'text-yellow-400' : 'text-slate-400'} hover:text-yellow-400 transition-colors`}
        >
          <Star className={`h-5 w-5 ${i <= valor ? 'fill-current' : ''}`} />
        </button>
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {evaluacion ? 'Editar Evaluación Grupal' : 'Nueva Evaluación Grupal'}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-white hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <Tabs defaultValue="general" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="general" className="data-[state=active]:bg-slate-600 text-white">
                Información General
              </TabsTrigger>
              <TabsTrigger value="empleados" className="data-[state=active]:bg-slate-600 text-white">
                Empleados y Competencias
              </TabsTrigger>
            </TabsList>

            <form id="evaluacion-grupal-form" onSubmit={handleSubmit}>
              <TabsContent value="general" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-white flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Título de la Evaluación <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Ej: Evaluación Grupal - Capacitación ISO 9001"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fecha_evaluacion" className="text-white flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Fecha de Evaluación
                    </Label>
                    <Input
                      id="fecha_evaluacion"
                      type="date"
                      value={formData.fecha_evaluacion}
                      onChange={(e) => handleInputChange('fecha_evaluacion', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado" className="text-white flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Estado
                    </Label>
                    <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="planificada" className="text-white hover:bg-slate-600">Planificada</SelectItem>
                        <SelectItem value="en_proceso" className="text-white hover:bg-slate-600">En Proceso</SelectItem>
                        <SelectItem value="completada" className="text-white hover:bg-slate-600">Completada</SelectItem>
                        <SelectItem value="cancelada" className="text-white hover:bg-slate-600">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proceso_capacitacion" className="text-white flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Proceso de Capacitación
                  </Label>
                  <Input
                    id="proceso_capacitacion"
                    value={formData.proceso_capacitacion}
                    onChange={(e) => handleInputChange('proceso_capacitacion', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Nombre del proceso o programa de capacitación"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
                    placeholder="Descripción general de la evaluación grupal..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones_generales" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Observaciones Generales
                  </Label>
                  <Textarea
                    id="observaciones_generales"
                    value={formData.observaciones_generales}
                    onChange={(e) => handleInputChange('observaciones_generales', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
                    placeholder="Observaciones generales del grupo..."
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="empleados" className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Empleados Evaluados</h3>
                  <Button
                    type="button"
                    onClick={agregarEmpleado}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Empleado
                  </Button>
                </div>

                {formData.empleados.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Users className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                    <p>No hay empleados agregados</p>
                    <p className="text-sm">Haz clic en "Agregar Empleado" para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formData.empleados.map((empleado, index) => (
                      <Card key={empleado.id || index} className="bg-slate-700 border-slate-600">
                        <CardHeader className="pb-4 bg-slate-600 border-b border-slate-500">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base text-white flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Empleado #{index + 1}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => eliminarEmpleado(empleado.id || index)}
                              className="text-red-400 hover:text-red-300 border-red-600 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-white flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Nombre del Empleado
                              </Label>
                              <Input
                                value={empleado.nombre_empleado}
                                onChange={(e) => actualizarEmpleado(empleado.id || index, 'nombre_empleado', e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                                placeholder="Nombre completo"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                Puesto
                              </Label>
                              <Input
                                value={empleado.puesto}
                                onChange={(e) => actualizarEmpleado(empleado.id || index, 'puesto', e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                                placeholder="Puesto de trabajo"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-white text-base font-medium">
                              Evaluación por Competencias (1-5 estrellas)
                            </Label>
                            <div className="space-y-3">
                              {competenciasEstandar.map(competencia => (
                                <div key={competencia.id} className="flex justify-between items-center p-3 bg-slate-600 rounded-lg">
                                  <span className="font-medium text-white">{competencia.nombre}</span>
                                  {renderStarRating(
                                    empleado.id || index, 
                                    competencia.nombre, 
                                    empleado.competencias?.[competencia.nombre] || 0
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Observaciones Individuales
                            </Label>
                            <Textarea
                              value={empleado.observaciones_individuales}
                              onChange={(e) => actualizarEmpleado(empleado.id || index, 'observaciones_individuales', e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
                              placeholder="Observaciones específicas para este empleado..."
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </form>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-700 mt-6">
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
                form="evaluacion-grupal-form"
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {evaluacion ? 'Actualizar' : 'Crear'} Evaluación
              </Button>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EvaluacionGrupalModal;
