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
import { X, Award, Star } from "lucide-react";

function HabilidadesModal({ isOpen, onClose, onSave, habilidad }) {
  const isEditMode = Boolean(habilidad);
  
  const initialFormData = {
    habilidad: "",
    nivel: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (habilidad) {
      setFormData(habilidad);
    } else {
      setFormData(initialFormData);
    }
  }, [habilidad, isOpen]);

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
              {isEditMode ? "Editar Habilidad o Idioma" : "Agregar Nueva Habilidad o Idioma"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-1">
              {isEditMode ? "Modifica los datos de la habilidad o competencia" : "Registra una nueva habilidad, competencia o idioma"}
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="habilidad-form" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="habilidad" className="flex items-center gap-2"><Award className="h-4 w-4" /> Habilidad o Idioma</Label>
              <Input id="habilidad" name="habilidad" value={formData.habilidad} onChange={handleChange} required className={inputStyles} placeholder="Ej: Inglés, Liderazgo"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nivel" className="flex items-center gap-2"><Star className="h-4 w-4" /> Nivel</Label>
              <Input id="nivel" name="nivel" value={formData.nivel} onChange={handleChange} required className={inputStyles} placeholder="Ej: Avanzado, B2, Experto"/>
            </div>
          </div>
        </form>

        <DialogFooter className="mt-6">
          <Button onClick={onClose} variant="outline" className="border-slate-600 text-white hover:bg-slate-700 hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" form="habilidad-form" className="bg-teal-600 text-white hover:bg-teal-700">
            {isEditMode ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default HabilidadesModal; 