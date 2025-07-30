import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar, Clock, Users, FileText, MapPin, CheckCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const NuevaMinutaModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    responsable: '',
    descripcion: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(formData);
      
      // Mostrar confirmación de éxito
      toast({
        title: "✅ Minuta creada exitosamente",
        description: "La minuta ha sido guardada correctamente",
        className: "bg-green-500 text-white border-green-600",
      });
      
      // Marcar como exitoso
      setIsSuccess(true);
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        responsable: '',
        descripcion: ''
      });
      
      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error al guardar:', error);
      toast({
        title: "❌ Error al crear minuta",
        description: error.message || "No se pudo crear la minuta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        titulo: '',
        responsable: '',
        descripcion: ''
      });
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Minuta Creada Exitosamente
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Nueva Minuta de Revisión por la Dirección
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              ¡Minuta creada exitosamente!
            </h3>
            <p className="text-gray-600">
              La minuta "{formData.titulo}" ha sido guardada correctamente.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Cerrando modal automáticamente...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título de la Minuta *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleChange('titulo', e.target.value)}
                  placeholder="Ej: Revisión de Indicadores Q1 2024"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="responsable" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Responsable *
                </Label>
                <Input
                  id="responsable"
                  value={formData.responsable}
                  onChange={(e) => handleChange('responsable', e.target.value)}
                  placeholder="Nombre del responsable de la minuta"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  placeholder="Descripción detallada de la minuta, temas a tratar, objetivos, etc."
                  rows={6}
                  disabled={isLoading}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Crear Minuta
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NuevaMinutaModal; 