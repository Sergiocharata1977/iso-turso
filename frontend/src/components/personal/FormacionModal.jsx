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
import { X, GraduationCap, Building } from "lucide-react";

function FormacionModal({ isOpen, onClose, onSave, formacion }) {
  const isEditMode = Boolean(formacion);
  
  const initialFormData = {
    titulo: "",
    institucion: "",
    fecha: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (formacion) {
      setFormData({
        ...formacion,
        fecha: formacion.fecha ? formacion.fecha.split('T')[0] : "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [formacion, isOpen]);

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
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold text-white">
              {isEditMode ? "Editar Formación" : "Agregar Nueva Formación"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-1">
              {isEditMode ? "Modifica los datos de la formación académica" : "Registra un nuevo título o certificación académica"}
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="formacion-form" className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo" className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Título Obtenido</Label>
              <Input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required className={inputStyles} placeholder="Ej: Ingeniería en Sistemas"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="institucion" className="flex items-center gap-2"><Building className="h-4 w-4" /> Institución Educativa</Label>
              <Input id="institucion" name="institucion" value={formData.institucion} onChange={handleChange} required className={inputStyles} placeholder="Ej: Universidad Nacional"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha" className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Fecha de Finalización</Label>
              <Input id="fecha" name="fecha" type="date" value={formData.fecha} onChange={handleChange} required className={inputStyles}/>
            </div>
          </div>
        </form>

        <DialogFooter className="mt-6">
          <Button onClick={onClose} variant="outline" className="border-slate-600 text-white hover:bg-slate-700 hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" form="formacion-form" className="bg-teal-600 text-white hover:bg-teal-700">
            {isEditMode ? "Guardar Cambios" : "Agregar Formación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FormacionModal; 