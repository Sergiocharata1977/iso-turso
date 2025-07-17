import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

function CompetenciaModal({ isOpen, onClose, onSave, competencia }) {
  const isEditMode = Boolean(competencia);
  const initialFormData = { nombre: '', descripcion: '' };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (competencia) {
      setFormData({ ...initialFormData, ...competencia });
    } else {
      setFormData(initialFormData);
    }
  }, [competencia, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const inputStyles = 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {isEditMode ? 'Editar Competencia' : 'Nueva Competencia'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="competencia-form" className="space-y-6 py-2">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-white">Nombre de la competencia</Label>
            <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className={inputStyles} placeholder="Ej: Trabajo en equipo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-white">Descripción</Label>
            <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} className={inputStyles} placeholder="Descripción breve de la competencia" />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" form="competencia-form" className="bg-emerald-600 text-white hover:bg-emerald-700">
            {isEditMode ? 'Guardar Cambios' : 'Crear Competencia'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CompetenciaModal; 