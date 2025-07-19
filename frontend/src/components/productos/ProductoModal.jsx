import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, User } from 'lucide-react';

const ProductoModal = ({ isOpen, onClose, onSave, producto }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
    estado: 'Borrador',
    tipo: 'Producto',
    responsable: '',
    fecha_creacion: new Date().toISOString().split('T')[0],
    version: '1.0'
  });

  // Estados ISO 9001 simplificados
  const estadosISO = [
    { value: 'Borrador', label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
    { value: 'En Revisión', label: 'En Revisión', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Aprobado', label: 'Aprobado', color: 'bg-green-100 text-green-800' },
    { value: 'Activo', label: 'Activo', color: 'bg-blue-100 text-blue-800' },
    { value: 'Descontinuado', label: 'Descontinuado', color: 'bg-red-100 text-red-800' }
  ];

  const tiposProducto = [
    'Producto',
    'Servicio',
    'Software',
    'Documento',
    'Proceso'
  ];

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        codigo: producto.codigo || '',
        estado: producto.estado || 'Borrador',
        tipo: producto.tipo || 'Producto',
        responsable: producto.responsable || '',
        fecha_creacion: producto.fecha_creacion || new Date().toISOString().split('T')[0],
        version: producto.version || '1.0'
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        codigo: '',
        estado: 'Borrador',
        tipo: 'Producto',
        responsable: '',
        fecha_creacion: new Date().toISOString().split('T')[0],
        version: '1.0'
      });
    }
  }, [producto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
          <DialogDescription>
            {producto ? 'Modifica la información del producto' : 'Crea un nuevo producto o servicio para tu organización'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Producto *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ej: Software SGC Pro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                placeholder="Ej: PROD-001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Describe el producto o servicio..."
              rows={3}
            />
          </div>

          {/* Clasificación y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiposProducto.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {estadosISO.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      <div className="flex items-center gap-2">
                        <Badge className={estado.color}>{estado.label}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Versión</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                placeholder="1.0"
              />
            </div>
          </div>

          {/* Responsabilidad y Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="responsable"
                  value={formData.responsable}
                  onChange={(e) => handleInputChange('responsable', e.target.value)}
                  placeholder="Nombre del responsable"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_creacion">Fecha de Creación</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha_creacion"
                  type="date"
                  value={formData.fecha_creacion}
                  onChange={(e) => handleInputChange('fecha_creacion', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {producto ? 'Actualizar' : 'Crear'} Producto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductoModal;
