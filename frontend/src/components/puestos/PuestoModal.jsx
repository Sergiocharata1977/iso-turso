import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { 
  Briefcase, 
  GraduationCap, 
  ClipboardList, 
  Clock,
  X
} from "lucide-react";

const initialFormData = {
  nombre: "",
  descripcion: "",
  departamento_id: null,
  requisitos_experiencia: "",
  requisitos_formacion: "",
};

function PuestoModal({ isOpen, onClose, onSave, puesto, isSaving, organizacionId }) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      if (puesto) {
        setFormData({
          ...initialFormData,
          ...puesto,
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isOpen, puesto]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    
    // Asegurar que siempre se incluya el organization_id
    if (organizacionId) {
      dataToSave.organization_id = organizacionId;
    }
    
    onSave(dataToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[70%] bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {puesto ? "Editar Puesto" : "Nuevo Puesto"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {puesto ? "Modifica los datos del puesto" : "Crea un nuevo puesto de trabajo"}
          </DialogDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-white hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form id="puesto-form" onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-white flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Nombre del Puesto <span className="text-red-400">*</span>
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
              placeholder="Ej: Gerente de Calidad"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-white flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
              placeholder="Describa las funciones principales del puesto..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requisitos_experiencia" className="text-white flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Experiencia Requerida
            </Label>
            <Textarea
              id="requisitos_experiencia"
              value={formData.requisitos_experiencia}
              onChange={(e) => handleInputChange('requisitos_experiencia', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 min-h-[100px]"
              placeholder="Ej: 3 años en puestos similares, experiencia en gestión de equipos, conocimiento en sistemas de calidad ISO 9001..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requisitos_formacion" className="text-white flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Formación Requerida
            </Label>
            <Textarea
              id="requisitos_formacion"
              value={formData.requisitos_formacion}
              onChange={(e) => handleInputChange('requisitos_formacion', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 min-h-[100px]"
              placeholder="Ej: Licenciatura en Administración, Ingeniería Industrial o carreras afines. Certificaciones en calidad deseable..."
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="puesto-form"
            className="bg-teal-600 hover:bg-teal-700 text-white"
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : (puesto ? "Guardar Cambios" : "Crear Puesto")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PuestoModal; 