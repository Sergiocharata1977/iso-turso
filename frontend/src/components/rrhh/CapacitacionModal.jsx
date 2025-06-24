import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, FileText, Calendar, Activity, X } from "lucide-react";

function CapacitacionModal({ isOpen, onClose, onSave, capacitacion }) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: "",
    estado: "Programada",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (capacitacion) {
      setFormData({
        titulo: capacitacion.titulo || "",
        descripcion: capacitacion.descripcion || "",
        fecha_inicio: capacitacion.fecha_inicio || "",
        estado: capacitacion.estado || "Programada",
      });
    } else {
      setFormData({
        titulo: "",
        descripcion: "",
        fecha_inicio: "",
        estado: "Programada",
      });
    }
    setErrors({});
  }, [capacitacion, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es obligatorio";
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = "La fecha de inicio es obligatoria";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      setErrors({});
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {capacitacion ? "Editar Capacitación" : "Nueva Capacitación"}
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
        
        <form id="capacitacion-form" onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-white flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Título <span className="text-red-400">*</span>
            </Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 ${
                errors.titulo ? "border-red-500" : ""
              }`}
              placeholder="Ej: Introducción a ISO 9001"
            />
            {errors.titulo && (
              <p className="text-sm text-red-400">{errors.titulo}</p>
            )}
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
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none min-h-[100px]"
              placeholder="Descripción de la capacitación..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_inicio" className="text-white flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha de Inicio <span className="text-red-400">*</span>
            </Label>
            <Input
              id="fecha_inicio"
              type="date"
              value={formData.fecha_inicio}
              onChange={(e) => handleChange('fecha_inicio', e.target.value)}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 ${
                errors.fecha_inicio ? "border-red-500" : ""
              }`}
            />
            {errors.fecha_inicio && (
              <p className="text-sm text-red-400">{errors.fecha_inicio}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado" className="text-white flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Estado
            </Label>
            <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="Programada" className="text-white hover:bg-slate-600">Programada</SelectItem>
                <SelectItem value="En Curso" className="text-white hover:bg-slate-600">En Curso</SelectItem>
                <SelectItem value="Completada" className="text-white hover:bg-slate-600">Completada</SelectItem>
                <SelectItem value="Cancelada" className="text-white hover:bg-slate-600">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="capacitacion-form"
            disabled={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700 text-white min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              capacitacion ? "Actualizar" : "Crear"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CapacitacionModal;
