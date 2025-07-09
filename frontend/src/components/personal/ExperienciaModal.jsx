import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Briefcase, Building, Calendar, FileText } from "lucide-react";

function ExperienciaModal({ isOpen, onClose, onSave, experiencia }) {
  const isEditMode = Boolean(experiencia);
  
  const initialFormData = {
    empresa: "",
    puesto: "",
    fecha_inicio: "",
    fecha_fin: "",
    descripcion: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (experiencia) {
      setFormData({
        ...experiencia,
        fecha_inicio: experiencia.fecha_inicio ? experiencia.fecha_inicio.split('T')[0] : "",
        fecha_fin: experiencia.fecha_fin ? experiencia.fecha_fin.split('T')[0] : "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [experiencia, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const inputStyles = "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold text-white">
              {isEditMode ? "Editar Experiencia" : "Agregar Nueva Experiencia Laboral"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-1">
              {isEditMode ? "Modifica los datos de la experiencia laboral" : "Registra un nuevo empleo o experiencia profesional"}
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="experiencia-form" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="empresa" className="flex items-center gap-2"><Building className="h-4 w-4" /> Empresa</Label>
              <Input id="empresa" name="empresa" value={formData.empresa} onChange={handleChange} required className={inputStyles} placeholder="Nombre de la empresa"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="puesto" className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Puesto</Label>
              <Input id="puesto" name="puesto" value={formData.puesto} onChange={handleChange} required className={inputStyles} placeholder="Cargo que ocupaba"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Fecha de Inicio</Label>
              <Input id="fecha_inicio" name="fecha_inicio" type="date" value={formData.fecha_inicio} onChange={handleChange} required className={inputStyles}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_fin" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Fecha de Fin</Label>
              <Input id="fecha_fin" name="fecha_fin" type="date" value={formData.fecha_fin} onChange={handleChange} className={inputStyles}/>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Descripción de Tareas</Label>
            <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} className={inputStyles} placeholder="Breve descripción de las responsabilidades y logros..." rows={4}/>
          </div>
        </form>

        <DialogFooter className="mt-6">
          <Button onClick={onClose} variant="outline" className="border-slate-600 text-white hover:bg-slate-700 hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" form="experiencia-form" className="bg-teal-600 text-white hover:bg-teal-700">
            {isEditMode ? "Guardar Cambios" : "Agregar Experiencia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExperienciaModal; 