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
import { FileText, User, FileTextIcon, Hash, GitBranch, Users, Target, Maximize, Book, Workflow } from 'lucide-react';

// Datos iniciales para el formulario - COMPLETO
const initialFormData = {
  nombre: '',
  codigo: '',
  version: '1.0',
  responsable: '',
  funciones_involucradas: '',
  descripcion: '',
  objetivo: '',
  alcance: '',
  definiciones_abreviaturas: '',
  desarrollo: '',
};

function ProcesoModal({ isOpen, onClose, onSave, proceso }) {
  const [formData, setFormData] = useState(initialFormData);

  // Cargar datos cuando se edita un proceso existente
  useEffect(() => {
    if (proceso) {
      setFormData({
        nombre: proceso.nombre || '',
        codigo: proceso.codigo || '',
        version: proceso.version || '1.0',
        responsable: proceso.responsable || '',
        funciones_involucradas: proceso.funciones_involucradas || '',
        descripcion: proceso.descripcion || '',
        objetivo: proceso.objetivo || '',
        alcance: proceso.alcance || '',
        definiciones_abreviaturas: proceso.definiciones_abreviaturas || '',
        desarrollo: proceso.desarrollo || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [proceso, isOpen]);

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
            {proceso ? 'Editar Proceso' : 'Nuevo Proceso'}
          </DialogTitle>
          <DialogDescription>
            Completa los campos para registrar o actualizar un proceso.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-6">
            
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre del Proceso */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Nombre del Proceso 
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input 
                  id="nombre" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  placeholder="Ej: Proceso de Compras" 
                  required 
                />
              </div>

              {/* Código */}
              <div className="space-y-2">
                <Label htmlFor="codigo" className="flex items-center">
                  <Hash className="w-4 h-4 mr-2" />
                  Código del Proceso
                </Label>
                <Input 
                  id="codigo" 
                  name="codigo" 
                  value={formData.codigo} 
                  onChange={handleChange} 
                  placeholder="Ej: PR-001" 
                />
              </div>

              {/* Versión */}
              <div className="space-y-2">
                <Label htmlFor="version" className="flex items-center">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Versión
                </Label>
                <Input 
                  id="version" 
                  name="version" 
                  value={formData.version} 
                  onChange={handleChange} 
                  placeholder="Ej: 1.0" 
                />
              </div>

              {/* Responsable */}
              <div className="space-y-2">
                <Label htmlFor="responsable" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Responsable
                </Label>
                <Input 
                  id="responsable" 
                  name="responsable" 
                  value={formData.responsable} 
                  onChange={handleChange} 
                  placeholder="Ej: Gerente de Compras" 
                />
              </div>
            </div>

            {/* Funciones Involucradas */}
            <div className="space-y-2">
              <Label htmlFor="funciones_involucradas" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Funciones Involucradas
              </Label>
              <Input 
                id="funciones_involucradas" 
                name="funciones_involucradas" 
                value={formData.funciones_involucradas} 
                onChange={handleChange} 
                placeholder="Ej: Gerencia, Compras, Almacén, Contabilidad" 
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="flex items-center">
                <FileTextIcon className="w-4 h-4 mr-2" />
                Descripción General
              </Label>
              <Textarea 
                id="descripcion" 
                name="descripcion" 
                value={formData.descripcion} 
                onChange={handleChange} 
                placeholder="Describe brevemente el proceso y sus actividades principales" 
                className="min-h-[100px]" 
              />
            </div>

            {/* Objetivo */}
            <div className="space-y-2">
              <Label htmlFor="objetivo" className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                1. Objetivo
              </Label>
              <Textarea 
                id="objetivo" 
                name="objetivo" 
                value={formData.objetivo} 
                onChange={handleChange} 
                placeholder="Definir el propósito y finalidad del proceso" 
                className="min-h-[100px]" 
              />
            </div>

            {/* Alcance */}
            <div className="space-y-2">
              <Label htmlFor="alcance" className="flex items-center">
                <Maximize className="w-4 h-4 mr-2" />
                2. Alcance
              </Label>
              <Textarea 
                id="alcance" 
                name="alcance" 
                value={formData.alcance} 
                onChange={handleChange} 
                placeholder="Definir los límites y cobertura del proceso" 
                className="min-h-[100px]" 
              />
            </div>

            {/* Definiciones y Abreviaturas */}
            <div className="space-y-2">
              <Label htmlFor="definiciones_abreviaturas" className="flex items-center">
                <Book className="w-4 h-4 mr-2" />
                3. Definiciones y Abreviaturas
              </Label>
              <Textarea 
                id="definiciones_abreviaturas" 
                name="definiciones_abreviaturas" 
                value={formData.definiciones_abreviaturas} 
                onChange={handleChange} 
                placeholder="Definir términos técnicos y abreviaturas utilizadas" 
                className="min-h-[100px]" 
              />
            </div>

            {/* Desarrollo del Proceso */}
            <div className="space-y-2">
              <Label htmlFor="desarrollo" className="flex items-center">
                <Workflow className="w-4 h-4 mr-2" />
                4. Desarrollo del Proceso
              </Label>
              <Textarea 
                id="desarrollo" 
                name="desarrollo" 
                value={formData.desarrollo} 
                onChange={handleChange} 
                placeholder="Describir paso a paso el desarrollo y las actividades del proceso" 
                className="min-h-[120px]" 
              />
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {proceso ? 'Guardar Cambios' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProcesoModal;
