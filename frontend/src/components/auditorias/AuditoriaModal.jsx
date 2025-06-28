import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

const initialFormData = {
  objetivo: '',
  fecha_programada: '',
  proceso_id: '',
  puesto_responsable_id: '',
  estado: 'Planificada',
  puntos_evaluados: [],
};

function AuditoriaModal({ isOpen, onClose, onSave, auditoria, procesos = [], puestos = [] }) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (auditoria) {
      setFormData({
        ...auditoria,
        fecha_programada: auditoria.fecha_programada ? new Date(auditoria.fecha_programada).toISOString().split('T')[0] : '',
        puntos_evaluados: auditoria.puntos_evaluados || [],
      });
    } else {
      setFormData(initialFormData);
    }
  }, [auditoria, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePuntoChange = (index, e) => {
    const { name, value } = e.target;
    const puntos = [...formData.puntos_evaluados];
    puntos[index][name] = value;
    setFormData(prev => ({ ...prev, puntos_evaluados: puntos }));
  };

  const addPunto = () => {
    setFormData(prev => ({ ...prev, puntos_evaluados: [...prev.puntos_evaluados, { norma: '', requisito: '', descripcion: '' }] }));
  };

  const removePunto = (index) => {
    const puntos = [...formData.puntos_evaluados];
    puntos.splice(index, 1);
    setFormData(prev => ({ ...prev, puntos_evaluados: puntos }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{auditoria ? 'Editar Auditoría' : 'Crear Nueva Auditoría'}</DialogTitle>
          <DialogDescription>
            {auditoria ? 'Modifica los detalles de la auditoría.' : 'Completa el formulario para registrar una nueva auditoría.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="objetivo" className="text-right">Objetivo</Label>
            <Input id="objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fecha_programada" className="text-right">Fecha Programada</Label>
            <Input id="fecha_programada" name="fecha_programada" type="date" value={formData.fecha_programada} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="proceso_id" className="text-right">Proceso</Label>
            <Select onValueChange={(value) => handleSelectChange('proceso_id', value)} value={formData.proceso_id?.toString()}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un proceso" />
              </SelectTrigger>
              <SelectContent>
                {procesos.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="puesto_responsable_id" className="text-right">Puesto Responsable</Label>
            <Select onValueChange={(value) => handleSelectChange('puesto_responsable_id', value)} value={formData.puesto_responsable_id?.toString()}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un puesto" />
              </SelectTrigger>
              <SelectContent>
                {puestos.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estado" className="text-right">Estado</Label>
            <Select onValueChange={(value) => handleSelectChange('estado', value)} value={formData.estado}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planificada">Planificada</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Puntos a Evaluar</h4>
            {formData.puntos_evaluados.map((punto, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <Input name="norma" placeholder="Norma" value={punto.norma} onChange={(e) => handlePuntoChange(index, e)} className="col-span-3" />
                <Input name="requisito" placeholder="Requisito" value={punto.requisito} onChange={(e) => handlePuntoChange(index, e)} className="col-span-3" />
                <Input name="descripcion" placeholder="Descripción" value={punto.descripcion} onChange={(e) => handlePuntoChange(index, e)} className="col-span-5" />
                <Button type="button" variant="destructive" size="icon" onClick={() => removePunto(index)} className="col-span-1">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addPunto} className="mt-2">Añadir Punto</Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AuditoriaModal;
