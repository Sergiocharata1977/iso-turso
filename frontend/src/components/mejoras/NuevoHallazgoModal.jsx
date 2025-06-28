import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import hallazgosService from '@/services/hallazgosService';

const NuevoHallazgoModal = ({ isOpen, onClose, onUpdate }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [origen, setOrigen] = useState('');
  const [categoria, setCategoria] = useState('');
  const [requisitoIncumplido, setRequisitoIncumplido] = useState('');
  const [estado, setEstado] = useState('d1_iniciado');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !descripcion || !origen || !categoria) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setIsSubmitting(true);
    try {
      const hallazgoData = {
        titulo,
        descripcion,
        origen,
        categoria,
        requisitoIncumplido,
        estado,
      };
      await hallazgosService.createHallazgo(hallazgoData);
      toast.success('Hallazgo creado con éxito.');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error creating hallazgo:', error);
      toast.error('No se pudo crear el hallazgo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Hallazgo</DialogTitle>
          <DialogDescription>
            Completa los detalles para registrar un nuevo hallazgo en el sistema.
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
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
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
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
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
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
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
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
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
                value={requisitoIncumplido}
                onChange={(e) => setRequisitoIncumplido(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Select value={estado} onValueChange={setEstado}>
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
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creando...' : 'Crear Hallazgo'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NuevoHallazgoModal;
