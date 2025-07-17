import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Props: isOpen, onClose, onSave, personas, competencias, evaluadores
const ProgramarEvaluacionCompetenciaModal = ({ isOpen, onClose, onSave, personas = [], competencias = [], evaluadores = [] }) => {
  const [form, setForm] = useState({
    persona_id: '',
    competencia_id: '',
    evaluador_id: '',
    fecha_programada: '',
    observaciones: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm({ persona_id: '', competencia_id: '', evaluador_id: '', fecha_programada: '', observaciones: '' });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Programar Evaluación de Competencia</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Persona a Evaluar</label>
            <Select value={form.persona_id} onValueChange={v => handleSelect('persona_id', v)} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar persona" />
              </SelectTrigger>
              <SelectContent>
                {personas.map(p => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.nombres} {p.apellidos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1">Competencia</label>
            <Select value={form.competencia_id} onValueChange={v => handleSelect('competencia_id', v)} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar competencia" />
              </SelectTrigger>
              <SelectContent>
                {competencias.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1">Evaluador</label>
            <Select value={form.evaluador_id} onValueChange={v => handleSelect('evaluador_id', v)} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar evaluador" />
              </SelectTrigger>
              <SelectContent>
                {evaluadores.map(e => (
                  <SelectItem key={e.id} value={String(e.id)}>{e.name || e.nombres}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1">Fecha Programada</label>
            <Input type="datetime-local" name="fecha_programada" value={form.fecha_programada} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1">Observaciones</label>
            <Textarea name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones (opcional)" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Programar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramarEvaluacionCompetenciaModal; 