import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, X } from 'lucide-react';

const ProgramacionGrupalModal = ({ isOpen, onClose, onSave, programacion }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: '',
    estado: 'programada'
  });

  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      if (programacion) {
        setFormData({
          titulo: programacion.titulo || '',
          descripcion: programacion.descripcion || '',
          fecha_inicio: programacion.fecha_inicio ? 
            new Date(programacion.fecha_inicio).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0],
          fecha_fin: programacion.fecha_fin ? 
            new Date(programacion.fecha_fin).toISOString().split('T')[0] : '',
          estado: programacion.estado || 'programada'
        });
      } else {
        // Reset para nueva programación
        setFormData({
          titulo: '',
          descripcion: '',
          fecha_inicio: new Date().toISOString().split('T')[0],
          fecha_fin: '',
          estado: 'programada'
        });
      }
    }
  }, [isOpen, programacion]);

  // Manejar cambios en los campos básicos
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error al guardar programación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {programacion ? 'Editar Programación' : 'Nueva Programación'}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {programacion ? 'Modifica los datos de la programación de evaluación grupal' : 'Crea una nueva programación para evaluar competencias de forma grupal'}
          </DialogDescription>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-white flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Título *
                </Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleChange('titulo', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                  placeholder="Título de la programación"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha_inicio" className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha Inicio *
                  </Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    value={formData.fecha_inicio}
                    onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_fin" className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha Fin
                  </Label>
                  <Input
                    id="fecha_fin"
                    type="date"
                    value={formData.fecha_fin}
                    onChange={(e) => handleChange('fecha_fin', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado" className="text-white">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="programada" className="text-white">Programada</SelectItem>
                    <SelectItem value="en_progreso" className="text-white">En Progreso</SelectItem>
                    <SelectItem value="completada" className="text-white">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-white">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
                  placeholder="Descripción de la programación..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.titulo}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isLoading ? 'Guardando...' : (programacion ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramacionGrupalModal;
