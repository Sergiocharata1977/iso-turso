import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Target, FileText, Map, Users, Hash } from 'lucide-react';

// Datos iniciales para el formulario
const initialFormData = {
  nombre: '',
  politica_calidad: '',
  alcance: '',
  mapa_procesos: '',
  organigrama: '',
  estado: 'activo'
};

function PoliticaCalidadModal({ isOpen, onClose, onSave, politica }) {
  const [formData, setFormData] = useState(initialFormData);

  // Cargar datos cuando se edita una política existente
  useEffect(() => {
    if (politica) {
      setFormData({
        nombre: politica.nombre || '',
        politica_calidad: politica.politica_calidad || '',
        alcance: politica.alcance || '',
        mapa_procesos: politica.mapa_procesos || '',
        organigrama: politica.organigrama || '',
        estado: politica.estado || 'activo'
      });
    } else {
      setFormData(initialFormData);
    }
  }, [politica, isOpen]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark max-w-4xl bg-card text-card-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {politica ? 'Editar Política de Calidad' : 'Nueva Política de Calidad'}
          </DialogTitle>
          <DialogDescription>
            Completa los campos para registrar o actualizar una política de calidad.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-6">
            
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre de la Política */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="flex items-center">
                  <Hash className="w-4 h-4 mr-2" />
                  Nombre de la Política 
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input 
                  id="nombre" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  placeholder="Ej: Política de Calidad Principal" 
                  required 
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado" className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Estado
                </Label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="borrador">Borrador</option>
                </select>
              </div>
            </div>

            {/* Política de Calidad */}
            <div className="space-y-2">
              <Label htmlFor="politica_calidad" className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Política de Calidad
              </Label>
              <Textarea 
                id="politica_calidad" 
                name="politica_calidad" 
                value={formData.politica_calidad} 
                onChange={handleChange} 
                placeholder="Describe la política de calidad de la organización, incluyendo el compromiso con la mejora continua y la satisfacción del cliente..." 
                className="min-h-[120px]" 
                rows={5}
              />
            </div>

            {/* Alcance */}
            <div className="space-y-2">
              <Label htmlFor="alcance" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Alcance
              </Label>
              <Textarea 
                id="alcance" 
                name="alcance" 
                value={formData.alcance} 
                onChange={handleChange} 
                placeholder="Describe qué procesos, productos, servicios y ubicaciones están incluidos en el sistema de gestión de calidad..." 
                className="min-h-[120px]" 
                rows={5}
              />
            </div>

            {/* Mapa de Procesos */}
            <div className="space-y-2">
              <Label htmlFor="mapa_procesos" className="flex items-center">
                <Map className="w-4 h-4 mr-2" />
                Mapa de Procesos
              </Label>
              <Textarea 
                id="mapa_procesos" 
                name="mapa_procesos" 
                value={formData.mapa_procesos} 
                onChange={handleChange} 
                placeholder="Describe cómo se relacionan los procesos principales de la organización, incluyendo entradas, salidas y dependencias..." 
                className="min-h-[120px]" 
                rows={5}
              />
            </div>

            {/* Organigrama */}
            <div className="space-y-2">
              <Label htmlFor="organigrama" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Organigrama
              </Label>
              <Textarea 
                id="organigrama" 
                name="organigrama" 
                value={formData.organigrama} 
                onChange={handleChange} 
                placeholder="Describe la estructura organizacional, roles, responsabilidades y líneas de autoridad en la organización..." 
                className="min-h-[120px]" 
                rows={5}
              />
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {politica ? 'Guardar Cambios' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PoliticaCalidadModal; 