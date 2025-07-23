import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialState = {
  nombre: '',
  estado: 'activa',
  fecha_inicio: '',
  fecha_fin: '',
};

const ProgramacionCompetenciasModal = ({ isOpen, onClose, onSave, programacion }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Cargar datos si es edición
  useEffect(() => {
    if (programacion) {
      setForm({
        nombre: programacion.nombre || '',
        estado: programacion.estado || 'activa',
        fecha_inicio: programacion.fecha_inicio ? programacion.fecha_inicio.slice(0, 10) : '',
        fecha_fin: programacion.fecha_fin ? programacion.fecha_fin.slice(0, 10) : '',
      });
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [programacion, isOpen]);

  // Validación simple
  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!form.fecha_inicio) newErrors.fecha_inicio = 'La fecha de inicio es obligatoria.';
    if (!form.fecha_fin) newErrors.fecha_fin = 'La fecha de fin es obligatoria.';
    if (form.fecha_inicio && form.fecha_fin && form.fecha_inicio > form.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la de inicio.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar programación
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{programacion ? 'Editar Programación' : 'Nueva Programación'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre de la programación"
              required
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>
          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={form.estado}
              onValueChange={(value) => setForm((prev) => ({ ...prev, estado: value }))}
            >
              <SelectTrigger id="estado">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="inactiva">Inactiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
              <Input
                id="fecha_inicio"
                name="fecha_inicio"
                type="date"
                value={form.fecha_inicio}
                onChange={handleChange}
                required
              />
              {errors.fecha_inicio && <p className="text-red-500 text-xs mt-1">{errors.fecha_inicio}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="fecha_fin">Fecha de fin</Label>
              <Input
                id="fecha_fin"
                name="fecha_fin"
                type="date"
                value={form.fecha_fin}
                onChange={handleChange}
                required
              />
              {errors.fecha_fin && <p className="text-red-500 text-xs mt-1">{errors.fecha_fin}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-600 text-white">
              {programacion ? 'Guardar cambios' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramacionCompetenciasModal; 