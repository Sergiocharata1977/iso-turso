import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ClipboardCheck, User, Calendar, Star, FileText, Activity, Award, X } from "lucide-react";
import { evaluacionesService } from "@/services/evaluacionesService";

const EvaluacionModal = ({ isOpen, onClose, onSave, evaluacion }) => {
  const [formData, setFormData] = useState({
    personal_id: "",
    titulo: "",
    descripcion: "",
    fecha_evaluacion: new Date().toISOString().split('T')[0],
    puntaje: "",
    estado: "pendiente"
  });
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPersonal();
      if (evaluacion) {
        setFormData({
          personal_id: evaluacion.personal_id || "",
          titulo: evaluacion.titulo || "",
          descripcion: evaluacion.descripcion || "",
          fecha_evaluacion: evaluacion.fecha_evaluacion ? 
            new Date(evaluacion.fecha_evaluacion).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0],
          puntaje: evaluacion.puntaje || "",
          estado: evaluacion.estado || "pendiente"
        });
      } else {
        setFormData({
          personal_id: "",
          titulo: "",
          descripcion: "",
          fecha_evaluacion: new Date().toISOString().split('T')[0],
          puntaje: "",
          estado: "pendiente"
        });
      }
    }
  }, [isOpen, evaluacion]);

  const fetchPersonal = async () => {
    try {
      const data = await evaluacionesService.getPersonal();
      setPersonal(data);
    } catch (error) {
      console.error('Error al cargar personal:', error);
      toast.error("Error al cargar lista de personal");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.personal_id) {
      toast.error("Debe seleccionar un empleado");
      return;
    }
    
    if (!formData.titulo) {
      toast.error("El título es obligatorio");
      return;
    }

    if (!formData.fecha_evaluacion) {
      toast.error("La fecha de evaluación es obligatoria");
      return;
    }

    if (formData.puntaje && (formData.puntaje < 0 || formData.puntaje > 100)) {
      toast.error("El puntaje debe estar entre 0 y 100");
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        personal_id: parseInt(formData.personal_id),
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion?.trim() || null,
        fecha_evaluacion: formData.fecha_evaluacion,
        puntaje: formData.puntaje ? parseInt(formData.puntaje) : null,
        estado: formData.estado
      };

      await onSave(dataToSave);
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      toast.error("Error al guardar la evaluación");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStars = (value, onChange) => {
    const stars = [];
    const currentValue = parseInt(value) || 0;
    const starValue = Math.floor(currentValue / 20);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => onChange(i * 20)}
          className={`p-1 ${i <= starValue ? 'text-yellow-400' : 'text-slate-400'} hover:text-yellow-400 transition-colors`}
        >
          <Star className={`h-6 w-6 ${i <= starValue ? 'fill-current' : ''}`} />
        </button>
      );
    }
    
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-2 text-sm text-slate-300">
          {currentValue}/100 ({starValue}/5 estrellas)
        </span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {evaluacion ? "Editar Evaluación" : "Nueva Evaluación"}
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
        
        <form id="evaluacion-form" onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="personal_id" className="text-white flex items-center gap-2">
                <User className="h-4 w-4" />
                Empleado <span className="text-red-400">*</span>
              </Label>
              <Select 
                value={formData.personal_id} 
                onValueChange={(value) => handleChange('personal_id', value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {personal.map((empleado) => (
                    <SelectItem 
                      key={empleado.id} 
                      value={empleado.id.toString()}
                      className="text-white hover:bg-slate-600"
                    >
                      {empleado.nombre} {empleado.apellido}
                      {empleado.puesto && ` - ${empleado.puesto}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado" className="text-white flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Estado
              </Label>
              <Select 
                value={formData.estado} 
                onValueChange={(value) => handleChange('estado', value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="pendiente" className="text-white hover:bg-slate-600">Pendiente</SelectItem>
                  <SelectItem value="en_proceso" className="text-white hover:bg-slate-600">En Proceso</SelectItem>
                  <SelectItem value="completada" className="text-white hover:bg-slate-600">Completada</SelectItem>
                  <SelectItem value="cancelada" className="text-white hover:bg-slate-600">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-white flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Título de la Evaluación <span className="text-red-400">*</span>
            </Label>
            <Input
              id="titulo"
              type="text"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
              placeholder="Ej: Evaluación de Desempeño - Q1 2024"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fecha_evaluacion" className="text-white flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha de Evaluación <span className="text-red-400">*</span>
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

            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Award className="h-4 w-4" />
                Puntaje (0-100)
              </Label>
              <div className="space-y-3">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.puntaje}
                  onChange={(e) => handleChange('puntaje', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                  placeholder="Opcional"
                />
                {formData.puntaje && (
                  <div className="mt-2">
                    {renderStars(formData.puntaje, (value) => handleChange('puntaje', value.toString()))}
                  </div>
                )}
              </div>
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
              placeholder="Descripción detallada de la evaluación, criterios, observaciones, etc."
              rows={4}
            />
          </div>
        </form>
        
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
            className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="evaluacion-form"
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {loading ? "Guardando..." : evaluacion ? "Actualizar" : "Crear"} Evaluación
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluacionModal;
