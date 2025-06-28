import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, FileText, MessageSquare, Shield, Star } from 'lucide-react';

const getInitialFormData = (ticket) => ({
  titulo: ticket?.titulo || '',
  descripcion: ticket?.descripcion || '',
  prioridad: ticket?.prioridad || 'Media',
  estado: ticket?.estado || 'Abierto',
});

function TicketModal({ isOpen, onClose, onSave, ticket }) {
  const [formData, setFormData] = useState(getInitialFormData(ticket));

  useEffect(() => {
    setFormData(getInitialFormData(ticket));
  }, [ticket, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {ticket ? 'Editar Ticket' : 'Crear Nuevo Ticket'}
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-1">
            {ticket ? 'Actualiza los detalles de este ticket.' : 'Completa la información para crear un nuevo ticket.'}
          </DialogDescription>
        </DialogHeader>
        
        <form id="ticket-form" onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-gray-700 font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" /> Título del Ticket
            </Label>
            <Input
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="focus:ring-teal-500 focus:border-teal-500"
              placeholder="Ej: Falla en el sistema de transmisión"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-gray-700 font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-500" /> Descripción Detallada
            </Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="min-h-[120px] resize-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="Describe el problema o la solicitud en detalle..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="prioridad" className="text-gray-700 font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" /> Prioridad
              </Label>
              <Select name="prioridad" value={formData.prioridad} onValueChange={(value) => handleSelectChange('prioridad', value)}>
                <SelectTrigger className="focus:ring-teal-500">
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baja">Baja</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado" className="text-gray-700 font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-gray-500" /> Estado
              </Label>
              <Select name="estado" value={formData.estado} onValueChange={(value) => handleSelectChange('estado', value)}>
                <SelectTrigger className="focus:ring-teal-500">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Abierto">Abierto</SelectItem>
                  <SelectItem value="En Proceso">En Proceso</SelectItem>
                  <SelectItem value="Resuelto">Resuelto</SelectItem>
                  <SelectItem value="Cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>

        <DialogFooter className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="ticket-form" className="bg-teal-600 hover:bg-teal-700 text-white">
            {ticket ? 'Actualizar Ticket' : 'Crear Ticket'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TicketModal;
