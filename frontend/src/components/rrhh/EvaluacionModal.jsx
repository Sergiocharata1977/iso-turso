import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { 
  ClipboardCheck, 
  Users, 
  Calendar,
  Star,
  Target,
  FileText,
  Briefcase,
  Building,
  User,
  Plus,
  Trash
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { departamentosService } from "@/services/departamentos";
import { puestosService } from "@/services/puestos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

function EvaluacionModal({ isOpen, onClose, onSave, evaluacion, personal }) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    personal_id: "",
    tipo_evaluacion: "Desempeño",
    fecha: new Date().toISOString().split('T')[0],
    estado: "pendiente",
    puntuacion: 0,
    fortalezas: "",
    areas_oportunidad: "",
    comentarios: "",
    planes_accion: "",
    competencias: [
      { nombre: "Liderazgo", puntuacion: 0, comentario: "" },
      { nombre: "Conocimiento técnico", puntuacion: 0, comentario: "" },
      { nombre: "Comunicación", puntuacion: 0, comentario: "" },
      { nombre: "Trabajo en equipo", puntuacion: 0, comentario: "" },
      { nombre: "Resolución de problemas", puntuacion: 0, comentario: "" }
    ],
    objetivos: [
      { descripcion: "", cumplimiento: 0, comentario: "" },
      { descripcion: "", cumplimiento: 0, comentario: "" }
    ]
  });

  // Consulta para obtener departamentos desde la API
  const { 
    data: departamentos = [], 
    isLoading: isLoadingDepartamentos
  } = useQuery({
    queryKey: ['departamentos'],
    queryFn: departamentosService.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Consulta para obtener puestos desde la API
  const { 
    data: puestos = [], 
    isLoading: isLoadingPuestos
  } = useQuery({
    queryKey: ['puestos'],
    queryFn: puestosService.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Efecto para inicializar el formulario cuando se abre el modal
  useEffect(() => {
    if (evaluacion) {
      // Si estamos editando una evaluación existente
      setFormData({
        ...evaluacion,
        competencias: evaluacion.competencias || formData.competencias,
        objetivos: evaluacion.objetivos || formData.objetivos
      });
    } else {
      // Si estamos creando una nueva evaluación
      setFormData({
        personal_id: "",
        tipo_evaluacion: "Desempeño",
        fecha: new Date().toISOString().split('T')[0],
        estado: "pendiente",
        puntuacion: 0,
        fortalezas: "",
        areas_oportunidad: "",
        comentarios: "",
        planes_accion: "",
        competencias: [
          { nombre: "Liderazgo", puntuacion: 0, comentario: "" },
          { nombre: "Conocimiento técnico", puntuacion: 0, comentario: "" },
          { nombre: "Comunicación", puntuacion: 0, comentario: "" },
          { nombre: "Trabajo en equipo", puntuacion: 0, comentario: "" },
          { nombre: "Resolución de problemas", puntuacion: 0, comentario: "" }
        ],
        objetivos: [
          { descripcion: "", cumplimiento: 0, comentario: "" },
          { descripcion: "", cumplimiento: 0, comentario: "" }
        ]
      });
    }
  }, [evaluacion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (!formData.personal_id) {
      toast({
        title: "Error",
        description: "Debe seleccionar un empleado",
        variant: "destructive"
      });
      return;
    }
    
    // Calcular la puntuación general como el promedio de las puntuaciones de competencias
    const competenciasPuntuaciones = formData.competencias.map(c => c.puntuacion);
    const puntuacionPromedio = competenciasPuntuaciones.length > 0 ?
      competenciasPuntuaciones.reduce((a, b) => a + b, 0) / competenciasPuntuaciones.length : 0;
    
    const evaluacionFinal = {
      ...formData,
      puntuacion: Math.round(puntuacionPromedio)
    };
    
    onSave(evaluacionFinal);
  };

  const handleCompetenciaChange = (index, field, value) => {
    const updatedCompetencias = [...formData.competencias];
    updatedCompetencias[index] = {
      ...updatedCompetencias[index],
      [field]: field === 'puntuacion' ? parseInt(value) : value
    };
    setFormData({ ...formData, competencias: updatedCompetencias });
  };

  const handleObjetivoChange = (index, field, value) => {
    const updatedObjetivos = [...formData.objetivos];
    updatedObjetivos[index] = {
      ...updatedObjetivos[index],
      [field]: field === 'cumplimiento' ? parseInt(value) : value
    };
    setFormData({ ...formData, objetivos: updatedObjetivos });
  };

  const addCompetencia = () => {
    setFormData({
      ...formData,
      competencias: [
        ...formData.competencias,
        { nombre: "", puntuacion: 0, comentario: "" }
      ]
    });
  };

  const removeCompetencia = (index) => {
    const updatedCompetencias = [...formData.competencias];
    updatedCompetencias.splice(index, 1);
    setFormData({ ...formData, competencias: updatedCompetencias });
  };

  const addObjetivo = () => {
    setFormData({
      ...formData,
      objetivos: [
        ...formData.objetivos,
        { descripcion: "", cumplimiento: 0, comentario: "" }
      ]
    });
  };

  const removeObjetivo = (index) => {
    const updatedObjetivos = [...formData.objetivos];
    updatedObjetivos.splice(index, 1);
    setFormData({ ...formData, objetivos: updatedObjetivos });
  };

  // Función para obtener el nombre del empleado según su ID
  const getEmployeeName = (personalId) => {
    const empleado = personal.find(p => p.id === personalId);
    return empleado ? `${empleado.nombre} ${empleado.apellido}` : '';
  };

  // Renderizar estrellas para puntuación
  const renderStars = (value, onChange) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer ${
              star <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
            onClick={() => onChange(star)}
          />
        ))}
        <span className="ml-2 text-sm">{value}/5</span>
      </div>
    );
  };

  if (isLoadingDepartamentos || isLoadingPuestos) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="ml-2">Cargando datos...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {evaluacion ? "Editar Evaluación" : "Nueva Evaluación"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="competencias">Competencias</TabsTrigger>
              <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
              <TabsTrigger value="comentarios">Comentarios</TabsTrigger>
            </TabsList>
            
            {/* Pestaña de información general */}
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personal_id">Empleado</Label>
                  <Select 
                    value={formData.personal_id} 
                    onValueChange={(value) => setFormData({...formData, personal_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {personal.map((empleado) => (
                        <SelectItem key={empleado.id} value={empleado.id}>
                          {empleado.nombre} {empleado.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo_evaluacion">Tipo de Evaluación</Label>
                  <Select 
                    value={formData.tipo_evaluacion} 
                    onValueChange={(value) => setFormData({...formData, tipo_evaluacion: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Desempeño">Desempeño</SelectItem>
                      <SelectItem value="Competencias">Competencias</SelectItem>
                      <SelectItem value="Objetivos">Objetivos</SelectItem>
                      <SelectItem value="360 grados">360 grados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha de Evaluación</Label>
                  <Input
                    type="date"
                    id="fecha"
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select 
                    value={formData.estado} 
                    onValueChange={(value) => setFormData({...formData, estado: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en_proceso">En Proceso</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            {/* Pestaña de competencias */}
            <TabsContent value="competencias" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Competencias</h3>
                <Button type="button" variant="outline" size="sm" onClick={addCompetencia}>
                  <Plus className="h-4 w-4 mr-1" /> Agregar Competencia
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.competencias.map((competencia, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Competencia {index + 1}</h4>
                      {formData.competencias.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeCompetencia(index)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input
                          value={competencia.nombre}
                          onChange={(e) => handleCompetenciaChange(index, 'nombre', e.target.value)}
                          placeholder="Nombre de la competencia"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Puntuación</Label>
                        {renderStars(competencia.puntuacion, (value) => 
                          handleCompetenciaChange(index, 'puntuacion', value)
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Comentario</Label>
                      <Textarea
                        value={competencia.comentario}
                        onChange={(e) => handleCompetenciaChange(index, 'comentario', e.target.value)}
                        placeholder="Comentarios sobre esta competencia"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Pestaña de objetivos */}
            <TabsContent value="objetivos" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Objetivos</h3>
                <Button type="button" variant="outline" size="sm" onClick={addObjetivo}>
                  <Plus className="h-4 w-4 mr-1" /> Agregar Objetivo
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.objetivos.map((objetivo, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Objetivo {index + 1}</h4>
                      {formData.objetivos.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeObjetivo(index)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea
                        value={objetivo.descripcion}
                        onChange={(e) => handleObjetivoChange(index, 'descripcion', e.target.value)}
                        placeholder="Descripción del objetivo"
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cumplimiento (%)</Label>
                        <div className="flex items-center">
                          <Input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={objetivo.cumplimiento}
                            onChange={(e) => handleObjetivoChange(index, 'cumplimiento', e.target.value)}
                            className="flex-1"
                          />
                          <span className="ml-2 w-12 text-center">{objetivo.cumplimiento}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Comentario</Label>
                        <Input
                          value={objetivo.comentario}
                          onChange={(e) => handleObjetivoChange(index, 'comentario', e.target.value)}
                          placeholder="Comentario breve"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Pestaña de comentarios */}
            <TabsContent value="comentarios" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fortalezas">Fortalezas</Label>
                  <Textarea
                    id="fortalezas"
                    value={formData.fortalezas}
                    onChange={(e) => setFormData({...formData, fortalezas: e.target.value})}
                    placeholder="Fortalezas identificadas"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="areas_oportunidad">Áreas de Oportunidad</Label>
                  <Textarea
                    id="areas_oportunidad"
                    value={formData.areas_oportunidad}
                    onChange={(e) => setFormData({...formData, areas_oportunidad: e.target.value})}
                    placeholder="Áreas de mejora identificadas"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comentarios">Comentarios Generales</Label>
                  <Textarea
                    id="comentarios"
                    value={formData.comentarios}
                    onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
                    placeholder="Comentarios generales sobre la evaluación"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="planes_accion">Planes de Acción</Label>
                  <Textarea
                    id="planes_accion"
                    value={formData.planes_accion}
                    onChange={(e) => setFormData({...formData, planes_accion: e.target.value})}
                    placeholder="Planes de acción propuestos"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {evaluacion ? "Actualizar" : "Crear"} Evaluación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EvaluacionModal;
