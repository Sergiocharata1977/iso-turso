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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Hash, GitBranch, Users, Target, Maximize, Book, Workflow } from 'lucide-react';

// Datos iniciales para el formulario
const initialFormData = {
  nombre: '',
  codigo: '',
  version: '1.0',
  objetivo: '',
  alcance: '',
  funciones_involucradas: '',
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
        objetivo: proceso.objetivo || '',
        alcance: proceso.alcance || '',
        funciones_involucradas: proceso.funciones_involucradas || '',
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
      <DialogContent className="dark max-w-4xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {proceso ? 'Editar Proceso' : 'Nuevo Proceso'}
          </DialogTitle>
          <DialogDescription>
            Completa los campos para registrar o actualizar un proceso.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="principales" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="principales">Datos Principales</TabsTrigger>
              <TabsTrigger value="documentacion">Documentación del Proceso</TabsTrigger>
            </TabsList>
            
            <TabsContent value="principales" className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nombre" className="flex items-center"><FileText className="w-4 h-4 mr-2" />Nombre del Proceso <span className="text-red-500 ml-1">*</span></Label>
                    <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Gestión de Compras" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codigo" className="flex items-center"><Hash className="w-4 h-4 mr-2" />Código <span className="text-red-500 ml-1">*</span></Label>
                    <Input id="codigo" name="codigo" value={formData.codigo} onChange={handleChange} placeholder="Ej: PRC-COMP-001" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="version" className="flex items-center"><GitBranch className="w-4 h-4 mr-2" />Versión <span className="text-red-500 ml-1">*</span></Label>
                    <Input id="version" name="version" value={formData.version} onChange={handleChange} placeholder="Ej: 1.0" required />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="funciones_involucradas" className="flex items-center"><Users className="w-4 h-4 mr-2" />Funciones Involucradas</Label>
                    <Input id="funciones_involucradas" name="funciones_involucradas" value={formData.funciones_involucradas} onChange={handleChange} placeholder="Ej: Gerente de Compras, Analista de Calidad" />
                  </div>

                </div>
              </div>
            </TabsContent>

            <TabsContent value="documentacion" className="pt-6">
              <div className="space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="objetivo" className="flex items-center"><Target className="w-4 h-4 mr-2" />1. Objetivo</Label>
                  <Textarea id="objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange} placeholder="¿Cuál es el propósito de este proceso?" className="min-h-[80px]" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alcance" className="flex items-center"><Maximize className="w-4 h-4 mr-2" />2. Alcance</Label>
                  <Textarea id="alcance" name="alcance" value={formData.alcance} onChange={handleChange} placeholder="¿Dónde empieza y termina el proceso?" className="min-h-[100px]" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="definiciones_abreviaturas" className="flex items-center"><Book className="w-4 h-4 mr-2" />3. Definiciones y Abreviaturas</Label>
                  <Textarea id="definiciones_abreviaturas" name="definiciones_abreviaturas" value={formData.definiciones_abreviaturas} onChange={handleChange} placeholder="Ej: OC (Orden de Compra), SGC (Sistema de Gestión de Calidad)" className="min-h-[100px]" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desarrollo" className="flex items-center"><Workflow className="w-4 h-4 mr-2" />4. Desarrollo del Proceso</Label>
                  <Textarea id="desarrollo" name="desarrollo" value={formData.desarrollo} onChange={handleChange} placeholder="Describe paso a paso las actividades del proceso." className="min-h-[150px]" />
                </div>

              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="pt-8">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
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
