import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Building2, FileText, Target, X } from "lucide-react";

const initialFormData = {
  nombre: "",
  descripcion: "",
  objetivos: "",
};

function DepartamentoModal({ isOpen, onClose, onSave, departamento, organizacionId }) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      if (departamento) {
        setFormData({
          nombre: departamento.nombre || "",
          descripcion: departamento.descripcion || "",
          objetivos: departamento.objetivos || "",
          id: departamento.id,
        });
      } else {
        setFormData(initialFormData);
      }
    } 
  }, [departamento, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (!departamento && organizacionId) {
      dataToSave.organization_id = organizacionId;
    }
    onSave(dataToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {departamento ? "Editar Departamento" : "Nuevo Departamento"}
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
        
        <form id="departamento-form" onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-white flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Nombre del Departamento
            </Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
              placeholder="Ej: Recursos Humanos"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-white flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              value={formData.descripcion}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
              placeholder="Describe la función principal del departamento..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivos" className="text-white flex items-center gap-2">
              <Target className="h-4 w-4" />
              Objetivos
            </Label>
            <Textarea
              id="objetivos"
              name="objetivos"
              rows={4}
              value={formData.objetivos}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
              placeholder="Define los objetivos clave del departamento..."
            />
          </div>
        </form>

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
            form="departamento-form"
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {departamento ? "Guardar Cambios" : "Crear Departamento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DepartamentoModal;
