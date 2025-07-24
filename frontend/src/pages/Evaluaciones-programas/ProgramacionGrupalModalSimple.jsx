import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import { evalcompeProgramacionService } from '@/services/evalcompeProgramacionService';

const ProgramacionGrupalModal = ({ isOpen, onClose, programacion = null, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    lugar: '',
    capacidad_maxima: '',
    estado: 'programada',
    tipo_evaluacion: 'grupal'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (programacion) {
      setFormData({
        titulo: programacion.titulo || '',
        descripcion: programacion.descripcion || '',
        fecha_inicio: programacion.fecha_inicio ? programacion.fecha_inicio.split('T')[0] : '',
        fecha_fin: programacion.fecha_fin ? programacion.fecha_fin.split('T')[0] : '',
        lugar: programacion.lugar || '',
        capacidad_maxima: programacion.capacidad_maxima?.toString() || '',
        estado: programacion.estado || 'programada',
        tipo_evaluacion: programacion.tipo_evaluacion || 'grupal'
      });
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        lugar: '',
        capacidad_maxima: '',
        estado: 'programada',
        tipo_evaluacion: 'grupal'
      });
    }
  }, [programacion, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSave = {
        ...formData,
        capacidad_maxima: parseInt(formData.capacidad_maxima) || 0
      };

      if (programacion) {
        // Actualizar
        await evalcompeProgramacionService.update(programacion.id, dataToSave);
        toast({
          title: "Éxito",
          description: "Programación actualizada correctamente",
        });
      } else {
        // Crear nuevo
        await evalcompeProgramacionService.create(dataToSave);
        toast({
          title: "Éxito",
          description: "Programación creada correctamente",
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar programación:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la programación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {programacion ? 'Editar Programación' : 'Nueva Programación Grupal'}
          </DialogTitle>
          <DialogDescription>
            {programacion ? 'Modifica los datos de la programación' : 'Crea una nueva programación de evaluación grupal'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder="Título de la programación"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_evaluacion">Tipo de Evaluación</Label>
              <Select
                value={formData.tipo_evaluacion}
                onValueChange={(value) => handleInputChange('tipo_evaluacion', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grupal">Grupal</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="mixta">Mixta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => handleInputChange('fecha_inicio', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_fin">Fecha de Fin *</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => handleInputChange('fecha_fin', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lugar">Lugar</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="lugar"
                  value={formData.lugar}
                  onChange={(e) => handleInputChange('lugar', e.target.value)}
                  placeholder="Ubicación de la evaluación"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidad_maxima">Capacidad Máxima</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="capacidad_maxima"
                  type="number"
                  value={formData.capacidad_maxima}
                  onChange={(e) => handleInputChange('capacidad_maxima', e.target.value)}
                  placeholder="Número máximo de participantes"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleInputChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programada">Programada</SelectItem>
                  <SelectItem value="en_curso">En Curso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Descripción detallada de la programación"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : (programacion ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramacionGrupalModal; 