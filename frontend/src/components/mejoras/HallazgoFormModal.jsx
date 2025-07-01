import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const HallazgoFormModal = ({ isOpen, onClose, onSave, hallazgo }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    origen: '',
    categoria: '',
    requisitoIncumplido: '',
    estado: 'd1_iniciado',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hallazgo) {
      setFormData({
        titulo: hallazgo.titulo || '',
        descripcion: hallazgo.descripcion || '',
        origen: hallazgo.origen || '',
        categoria: hallazgo.categoria || '',
        requisitoIncumplido: hallazgo.requisitoIncumplido || '',
        estado: hallazgo.estado || 'd1_iniciado',
      });
    } else {
      // Reset form for new entry
      setFormData({
        titulo: '',
        descripcion: '',
        origen: '',
        categoria: '',
        requisitoIncumplido: '',
        estado: 'd1_iniciado',
      });
    }
  }, [hallazgo, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, estado: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descripcion || !formData.origen || !formData.categoria) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };
  
  const isEditing = !!hallazgo;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Hallazgo' : 'Registrar Nuevo Hallazgo'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica los detalles del hallazgo.' : 'Completa los detalles para registrar un nuevo hallazgo en el sistema.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="titulo" className="text-right">
                Título
              </Label>
              <Input
                id="titulo"
                placeholder="Un título breve para el hallazgo"
                value={formData.titulo}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="descripcion" className="text-right pt-2">
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Describe el hallazgo detalladamente"
                value={formData.descripcion}
                onChange={handleChange}
                className="col-span-3 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origen" className="text-right">
                Origen
              </Label>
              <Input
                id="origen"
                placeholder="Origen del hallazgo"
                value={formData.origen}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">
                Categoría
              </Label>
              <Input
                id="categoria"
                placeholder="Categoría del hallazgo"
                value={formData.categoria}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requisitoIncumplido" className="text-right">
                Requisito Incumplido
              </Label>
              <Input
                id="requisitoIncumplido"
                placeholder="Requisito incumplido (opcional)"
                value={formData.requisitoIncumplido}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Select value={formData.estado} onValueChange={handleSelectChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="d1_iniciado">Detección - Iniciado</SelectItem>
                  <SelectItem value="d2_con_accion_inmediata">Detección - Con Acción Inmediata</SelectItem>
                  <SelectItem value="d4_corregido_completo">Detección - Corregido Completo</SelectItem>
                  <SelectItem value="t1_en_analisis">Tratamiento - En Análisis</SelectItem>
                  <SelectItem value="t2_no_requiere_accion">Tratamiento - No Requiere Acción</SelectItem>
                  <SelectItem value="t3_programada">Tratamiento - Programada</SelectItem>
                  <SelectItem value="t5_implementacion_finalizada">Tratamiento - Implementación Finalizada</SelectItem>
                  <SelectItem value="c3_verificacion_planificada">Cierre - Verificación Planificada</SelectItem>
                  <SelectItem value="c4_ejecutada_la_verificacion">Cierre - Ejecutada la Verificación</SelectItem>
                  <SelectItem value="c5_cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Hallazgo')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HallazgoFormModal;
