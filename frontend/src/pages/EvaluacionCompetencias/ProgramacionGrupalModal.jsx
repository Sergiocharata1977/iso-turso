import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, FileText, Award, X, Plus, Trash2 } from 'lucide-react';
import { personalService } from '@/services/personalService';
import { competenciasService } from '@/services/competenciasService';

const ProgramacionGrupalModal = ({ isOpen, onClose, onSave, programacion }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: '',
    estado: 'programada'
  });

  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      loadEmpleados();
      loadCompetencias();
      
      if (programacion) {
        setFormData({
          titulo: programacion.titulo || '',
          descripcion: programacion.descripcion || '',
          fecha_inicio: programacion.fecha_inicio ? 
            new Date(programacion.fecha_inicio).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0],
          fecha_fin: programacion.fecha_fin ? 
            new Date(programacion.fecha_fin).toISOString().split('T')[0] : '',
          estado: programacion.estado || 'programada',
          empleados_seleccionados: programacion.empleados_seleccionados || [],
          competencias_a_evaluar: programacion.competencias_a_evaluar || []
        });
      } else {
        // Reset para nueva programación
        setFormData({
          titulo: '',
          descripcion: '',
          fecha_inicio: new Date().toISOString().split('T')[0],
          fecha_fin: '',
          estado: 'programada',
          empleados_seleccionados: [],
          competencias_a_evaluar: []
        });
      }
    }
  }, [isOpen, programacion]);

  // Cargar empleados
  const loadEmpleados = async () => {
    try {
      const data = await personalService.getAll();
      setEmpleados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  // Cargar competencias
  const loadCompetencias = async () => {
    try {
      const data = await competenciasService.getAll();
      setCompetencias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar competencias:', error);
    }
  };

  // Manejar cambios en los campos básicos
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Manejar selección de empleados
  const handleEmpleadoToggle = (empleadoId) => {
    setFormData(prev => ({
      ...prev,
      empleados_seleccionados: prev.empleados_seleccionados.includes(empleadoId)
        ? prev.empleados_seleccionados.filter(id => id !== empleadoId)
        : [...prev.empleados_seleccionados, empleadoId]
    }));
  };

  // Manejar selección de competencias
  const handleCompetenciaToggle = (competenciaId) => {
    setFormData(prev => ({
      ...prev,
      competencias_a_evaluar: prev.competencias_a_evaluar.includes(competenciaId)
        ? prev.competencias_a_evaluar.filter(id => id !== competenciaId)
        : [...prev.competencias_a_evaluar, competenciaId]
    }));
  };

  // Seleccionar todos los empleados
  const handleSelectAllEmpleados = () => {
    const todosSeleccionados = formData.empleados_seleccionados.length === empleados.length;
    setFormData(prev => ({
      ...prev,
      empleados_seleccionados: todosSeleccionados ? [] : empleados.map(emp => emp.id)
    }));
  };

  // Seleccionar todas las competencias
  const handleSelectAllCompetencias = () => {
    const todasSeleccionadas = formData.competencias_a_evaluar.length === competencias.length;
    setFormData(prev => ({
      ...prev,
      competencias_a_evaluar: todasSeleccionadas ? [] : competencias.map(comp => comp.id)
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSave = {
        ...formData,
        total_empleados: formData.empleados_seleccionados.length,
        total_competencias: formData.competencias_a_evaluar.length
      };

      await onSave(dataToSave);
    } catch (error) {
      console.error('Error al guardar programación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {programacion ? 'Editar Programación Grupal' : 'Nueva Programación Grupal'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="general" className="data-[state=active]:bg-slate-600 text-white">
                Información General
              </TabsTrigger>
              <TabsTrigger value="empleados" className="data-[state=active]:bg-slate-600 text-white">
                Empleados
              </TabsTrigger>
              <TabsTrigger value="competencias" className="data-[state=active]:bg-slate-600 text-white">
                Competencias
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Información General */}
            <TabsContent value="general" className="space-y-6 mt-6">
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Datos de la Programación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo" className="text-white flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Título de la Programación *
                      </Label>
                      <Input
                        id="titulo"
                        value={formData.titulo}
                        onChange={(e) => handleChange('titulo', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                        placeholder="Ej: Evaluación Trimestral Q1 2024"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado" className="text-white flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Estado
                      </Label>
                      <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="programada" className="text-white">Programada</SelectItem>
                          <SelectItem value="en_progreso" className="text-white">En Progreso</SelectItem>
                          <SelectItem value="completada" className="text-white">Completada</SelectItem>
                          <SelectItem value="cancelada" className="text-white">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha_inicio" className="text-white flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Fecha de Inicio *
                      </Label>
                      <Input
                        id="fecha_inicio"
                        type="date"
                        value={formData.fecha_inicio}
                        onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fecha_fin" className="text-white flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Fecha de Fin
                      </Label>
                      <Input
                        id="fecha_fin"
                        type="date"
                        value={formData.fecha_fin}
                        onChange={(e) => handleChange('fecha_fin', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion" className="text-white flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Descripción
                    </Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => handleChange('descripcion', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
                      placeholder="Describe el objetivo y alcance de esta programación de evaluaciones..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Empleados */}
            <TabsContent value="empleados" className="space-y-6 mt-6">
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Seleccionar Empleados ({formData.empleados_seleccionados.length} seleccionados)
                    </CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllEmpleados}
                      className="bg-transparent border-slate-600 text-white hover:bg-slate-600"
                    >
                      {formData.empleados_seleccionados.length === empleados.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {empleados.map((empleado) => (
                      <div key={empleado.id} className="flex items-center space-x-3 p-3 bg-slate-600 rounded-lg">
                        <Checkbox
                          id={`empleado-${empleado.id}`}
                          checked={formData.empleados_seleccionados.includes(empleado.id)}
                          onCheckedChange={() => handleEmpleadoToggle(empleado.id)}
                          className="border-slate-400"
                        />
                        <Label
                          htmlFor={`empleado-${empleado.id}`}
                          className="text-white cursor-pointer flex-1"
                        >
                          <div className="font-medium">{`${empleado.nombre} ${empleado.apellido || ''}`.trim()}</div>
                          <div className="text-sm text-slate-300">{empleado.email}</div>
                        </Label>
                      </div>
                    ))}
                  </div>

                  {empleados.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <Users className="mx-auto h-12 w-12 mb-2" />
                      <p>No hay empleados disponibles</p>
                      <p className="text-sm">Asegúrate de tener empleados registrados en el sistema</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Competencias */}
            <TabsContent value="competencias" className="space-y-6 mt-6">
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Competencias a Evaluar ({formData.competencias_a_evaluar.length} seleccionadas)
                    </CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllCompetencias}
                      className="bg-transparent border-slate-600 text-white hover:bg-slate-600"
                    >
                      {formData.competencias_a_evaluar.length === competencias.length ? 'Deseleccionar Todas' : 'Seleccionar Todas'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {competencias.map((competencia) => (
                      <div key={competencia.id} className="flex items-start space-x-3 p-4 bg-slate-600 rounded-lg">
                        <Checkbox
                          id={`competencia-${competencia.id}`}
                          checked={formData.competencias_a_evaluar.includes(competencia.id)}
                          onCheckedChange={() => handleCompetenciaToggle(competencia.id)}
                          className="border-slate-400 mt-1"
                        />
                        <Label
                          htmlFor={`competencia-${competencia.id}`}
                          className="text-white cursor-pointer flex-1"
                        >
                          <div className="font-medium">{competencia.nombre}</div>
                          {competencia.descripcion && (
                            <div className="text-sm text-slate-300 mt-1">
                              {competencia.descripcion.substring(0, 100)}...
                            </div>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {competencias.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <Award className="mx-auto h-12 w-12 mb-2" />
                      <p>No hay competencias disponibles</p>
                      <p className="text-sm">Asegúrate de tener competencias creadas en el sistema</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
              disabled={isLoading || !formData.titulo || formData.empleados_seleccionados.length === 0}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isLoading ? 'Guardando...' : (programacion ? 'Actualizar' : 'Crear')} Programación
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramacionGrupalModal;
