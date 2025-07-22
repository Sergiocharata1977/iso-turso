import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { X, FileText, AlignLeft, Activity } from 'lucide-react';

const CompetenciaModal = ({ isOpen, onClose, onSave, competencia }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activa'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos de la competencia si estamos editando
  useEffect(() => {
    if (competencia) {
      setFormData({
        nombre: competencia.nombre || '',
        descripcion: competencia.descripcion || '',
        estado: competencia.estado || 'activa'
      });
    } else {
      // Reset form para nueva competencia
      setFormData({
        nombre: '',
        descripcion: '',
        estado: 'activa'
      });
    }
    setErrors({});
  }, [competencia]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Manejar cambios en campos de select
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario selecciona
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar competencia:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {competencia ? 'Editar Competencia' : 'Nueva Competencia'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form id="competenciaForm" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-white flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre de la competencia"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-white flex items-center gap-2">
              <AlignLeft className="h-4 w-4" />
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción detallada de la competencia"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estado" className="text-white flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Estado
            </Label>
            <Select
              value={formData.estado}
              onValueChange={(value) => handleSelectChange('estado', value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="activa" className="hover:bg-slate-700 focus:bg-slate-700">Activa</SelectItem>
                <SelectItem value="inactiva" className="hover:bg-slate-700 focus:bg-slate-700">Inactiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        
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
            form="competenciaForm"
            disabled={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isSubmitting ? 'Guardando...' : competencia ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompetenciaModal;
