import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

// Simulación de datos (reemplazar por fetch real en integración)
const competencias = [
  { id: 1, nombre: 'Trabajo en equipo' },
  { id: 2, nombre: 'Comunicación' },
];
const personas = [
  { id: 1, nombre: 'Juan Pérez' },
  { id: 2, nombre: 'Ana Gómez' },
];
const evaluadores = [
  { id: 1, nombre: 'Supervisor 1' },
  { id: 2, nombre: 'Supervisor 2' },
];

function EvaluacionCompetenciaModal({ isOpen, onClose, onSave, evaluacion }) {
  const isEditMode = Boolean(evaluacion);
  const initialFormData = {
    competencia_id: '',
    persona_id: '',
    evaluador_id: '',
    fecha: '',
    puntaje: '',
    observaciones: '',
    estado: 'pendiente',
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (evaluacion) {
      setFormData({ ...initialFormData, ...evaluacion });
    } else {
      setFormData(initialFormData);
    }
  }, [evaluacion, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
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
            {isEditMode ? 'Editar Evaluación de Competencia' : 'Nueva Evaluación de Competencia'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="evaluacion-competencia-form" className="space-y-6 py-2">
          <div className="space-y-2">
            <Label className="text-white">Competencia</Label>
            <Select value={formData.competencia_id} onValueChange={v => handleSelectChange('competencia_id', v)} required>
              <SelectTrigger className={inputStyles}>
                <SelectValue placeholder="Seleccione competencia" />
              </SelectTrigger>
              <SelectContent>
                {competencias.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Persona evaluada</Label>
            <Select value={formData.persona_id} onValueChange={v => handleSelectChange('persona_id', v)} required>
              <SelectTrigger className={inputStyles}>
                <SelectValue placeholder="Seleccione persona" />
              </SelectTrigger>
              <SelectContent>
                {personas.map(p => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Evaluador</Label>
            <Select value={formData.evaluador_id} onValueChange={v => handleSelectChange('evaluador_id', v)} required>
              <SelectTrigger className={inputStyles}>
                <SelectValue placeholder="Seleccione evaluador" />
              </SelectTrigger>
              <SelectContent>
                {evaluadores.map(e => (
                  <SelectItem key={e.id} value={String(e.id)}>{e.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Fecha</Label>
            <Input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required className={inputStyles} />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Puntaje</Label>
            <Input type="number" name="puntaje" value={formData.puntaje} onChange={handleChange} min="1" max="5" required className={inputStyles} placeholder="1-5" />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Observaciones</Label>
            <Textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className={inputStyles} placeholder="Observaciones de la evaluación" />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Estado</Label>
            <Select value={formData.estado} onValueChange={v => handleSelectChange('estado', v)} required>
              <SelectTrigger className={inputStyles}>
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_progreso">En Progreso</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" form="evaluacion-competencia-form" className="bg-emerald-600 text-white hover:bg-emerald-700">
            {isEditMode ? 'Guardar Cambios' : 'Crear Evaluación'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EvaluacionCompetenciaModal; 