import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import minutasService from '@/services/minutasService';

const MinutasModal = ({ isOpen, onClose, onSave, minuta }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    responsable: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (minuta) {
      setFormData({
        titulo: minuta.titulo || '',
        responsable: minuta.responsable || '',
        descripcion: minuta.descripcion || ''
      });
    } else {
      setFormData({
        titulo: '',
        responsable: '',
        descripcion: ''
      });
    }
  }, [minuta]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.responsable) {
      toast({ title: 'Error', description: 'Título y responsable son obligatorios', variant: 'destructive' });
      return;
    }

    setLoading(true);
    
    try {
      if (minuta) {
        await minutasService.update(minuta.id, formData);
        toast({ title: 'Éxito', description: 'Minuta actualizada' });
      } else {
        await minutasService.create(formData);
        toast({ title: 'Éxito', description: 'Minuta creada' });
      }
      onSave();
    } catch (error) {
      toast({ title: 'Error', description: 'Error al guardar minuta', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {minuta ? 'Editar Minuta' : 'Nueva Minuta'}
          </DialogTitle>
          <DialogDescription>
            {minuta ? 'Actualiza los detalles de la minuta' : 'Crea una nueva minuta'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo" className="text-slate-100">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ingrese el título"
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="responsable" className="text-slate-100">
              Responsable <span className="text-red-500">*</span>
            </Label>
            <Input
              id="responsable"
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
              placeholder="Nombre del responsable"
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="descripcion" className="text-slate-100">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción opcional"
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                minuta ? 'Actualizar' : 'Crear'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MinutasModal;
