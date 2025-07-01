import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const HallazgoForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    origen: '',
    proceso_involucrado: '',
    categoria: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="titulo">Título del Hallazgo</Label>
        <Input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción detallada</Label>
        <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="origen">Origen</Label>
        <Input id="origen" name="origen" value={formData.origen} onChange={handleChange} placeholder="Ej: Auditoría Interna, Queja de Cliente" />
      </div>
      <div>
        <Label htmlFor="proceso_involucrado">Proceso Involucrado</Label>
        <Input id="proceso_involucrado" name="proceso_involucrado" value={formData.proceso_involucrado} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="categoria">Categoría</Label>
        <Input id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} placeholder="Ej: No Conformidad, Oportunidad de Mejora" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Registrar Hallazgo</Button>
      </div>
    </form>
  );
};

export default HallazgoForm;
