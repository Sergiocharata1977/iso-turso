import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ESTADOS } from '@/lib/hallazgoEstados';

const HallazgoModal = ({ isOpen, onClose, onSave, hallazgo }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (hallazgo) {
      setFormData({
        ...hallazgo,
        fechaRegistro: hallazgo.fechaRegistro ? new Date(hallazgo.fechaRegistro) : new Date(),
      });
    } else {
      // Reset form for new hallazgo
      setFormData({
        titulo: '',
        descripcion: '',
        origen: 'Auditoría Interna',
        categoria: 'No Conformidad',
        requisitoIncumplido: '',
        fechaRegistro: new Date(),
        estado: 'd1_iniciado',
      });
    }
  }, [hallazgo, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, fechaRegistro: date }));
  };

  const handleSubmit = () => {
    const dataToSave = {
      ...formData,
      fechaRegistro: formData.fechaRegistro ? format(formData.fechaRegistro, 'yyyy-MM-dd') : null,
    };
    onSave(dataToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{hallazgo ? 'Editar Hallazgo' : 'Crear Nuevo Hallazgo'}</DialogTitle>
          <DialogDescription>
            {hallazgo
              ? 'Modifica los detalles del hallazgo existente.'
              : 'Completa el formulario para registrar un nuevo hallazgo.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="titulo" className="text-right">Título</Label>
            <Input id="titulo" name="titulo" value={formData.titulo || ''} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="descripcion" className="text-right">Descripción</Label>
            <Textarea id="descripcion" name="descripcion" value={formData.descripcion || ''} onChange={handleChange} className="col-span-3" />
          </div>
 
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="requisitoIncumplido" className="text-right">Requisito</Label>
            <Input id="requisitoIncumplido" name="requisitoIncumplido" value={formData.requisitoIncumplido || ''} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fechaRegistro" className="text-right">Fecha de Registro</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'col-span-3 justify-start text-left font-normal',
                    !formData.fechaRegistro && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.fechaRegistro ? format(formData.fechaRegistro, 'PPP') : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.fechaRegistro}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoria" className="text-right">Categoría</Label>
            <Select name="categoria" value={formData.categoria} onValueChange={(value) => handleSelectChange('categoria', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No Conformidad">No Conformidad</SelectItem>
                <SelectItem value="Observación">Observación</SelectItem>
                <SelectItem value="Oportunidad de Mejora">Oportunidad de Mejora</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="origen" className="text-right">Origen</Label>
            <Select name="origen" value={formData.origen} onValueChange={(value) => handleSelectChange('origen', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un origen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Auditoría Interna">Auditoría Interna</SelectItem>
                <SelectItem value="Auditoría Externa">Auditoría Externa</SelectItem>
                <SelectItem value="Revisión de Procesos">Revisión de Procesos</SelectItem>
                <SelectItem value="Observación Directa">Observación Directa</SelectItem>
                <SelectItem value="Queja de Cliente">Queja de Cliente</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HallazgoModal;
