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
import { Calendar, FileText, Users, Target } from 'lucide-react';

const ProductoModal = ({ isOpen, onClose, onSave, producto }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
    estado: 'Borrador',
    tipo: 'Producto',
    categoria: '',
    responsable: '',
    fecha_creacion: '',
    fecha_revision: '',
    version: '1.0',
    especificaciones: '',
    requisitos_calidad: '',
    proceso_aprobacion: '',
    documentos_asociados: '',
    observaciones: ''
  });

  // Estados ISO 9001 con workflow
  const estadosISO = [
    { value: 'Borrador', label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
    { value: 'En Revisión', label: 'En Revisión', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Pendiente Aprobación', label: 'Pendiente Aprobación', color: 'bg-orange-100 text-orange-800' },
    { value: 'Aprobado', label: 'Aprobado', color: 'bg-green-100 text-green-800' },
    { value: 'Activo', label: 'Activo', color: 'bg-blue-100 text-blue-800' },
    { value: 'En Modificación', label: 'En Modificación', color: 'bg-purple-100 text-purple-800' },
    { value: 'Descontinuado', label: 'Descontinuado', color: 'bg-red-100 text-red-800' }
  ];

  const tiposProducto = [
    'Producto',
    'Servicio',
    'Software',
    'Documento',
    'Proceso',
    'Equipamiento'
  ];

  const categoriasISO = [
    'Gestión de Calidad',
    'Recursos Humanos',
    'Procesos Productivos',
    'Servicios al Cliente',
    'Compras y Proveedores',
    'Medición y Análisis',
    'Mejora Continua'
  ];

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        codigo: producto.codigo || '',
        estado: producto.estado || 'Borrador',
        tipo: producto.tipo || 'Producto',
        categoria: producto.categoria || '',
        responsable: producto.responsable || '',
        fecha_creacion: producto.fecha_creacion || '',
        fecha_revision: producto.fecha_revision || '',
        version: producto.version || '1.0',
        especificaciones: producto.especificaciones || '',
        requisitos_calidad: producto.requisitos_calidad || '',
        proceso_aprobacion: producto.proceso_aprobacion || '',
        documentos_asociados: producto.documentos_asociados || '',
        observaciones: producto.observaciones || ''
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        codigo: '',
        estado: 'Borrador',
        tipo: 'Producto',
        categoria: '',
        responsable: '',
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_revision: '',
        version: '1.0',
        especificaciones: '',
        requisitos_calidad: '',
        proceso_aprobacion: '',
        documentos_asociados: '',
        observaciones: ''
      });
    }
  }, [producto, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const getEstadoColor = (estado) => {
    const estadoObj = estadosISO.find(e => e.value === estado);
    return estadoObj ? estadoObj.color : 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {producto ? 'Editar Producto/Servicio' : 'Nuevo Producto/Servicio'}
          </DialogTitle>
          <DialogDescription>
            {producto ? 'Modifica los detalles del producto o servicio.' : 'Completa la información para crear un nuevo producto o servicio según ISO 9001.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Software de Gestión ISO 9001"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Ej: ISO-SFT-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleSelectChange('tipo', value)}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposProducto.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="categoria">Categoría ISO</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleSelectChange('categoria', value)}>
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasISO.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe brevemente el producto o servicio."
                rows={3}
              />
            </div>
          </div>

          {/* Estado y Control */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Estado y Control</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select value={formData.estado} onValueChange={(value) => handleSelectChange('estado', value)}>
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosISO.map(estado => (
                      <SelectItem key={estado.value} value={estado.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={estado.color}>{estado.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="version">Versión</Label>
                <Input
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  placeholder="1.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fecha_creacion">Fecha de Creación</Label>
                <Input
                  id="fecha_creacion"
                  name="fecha_creacion"
                  type="date"
                  value={formData.fecha_creacion}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fecha_revision">Fecha de Revisión</Label>
                <Input
                  id="fecha_revision"
                  name="fecha_revision"
                  type="date"
                  value={formData.fecha_revision}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Responsabilidad */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Responsabilidad</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                placeholder="Nombre del responsable del producto/servicio"
              />
            </div>
          </div>

          {/* Especificaciones ISO 9001 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Especificaciones ISO 9001</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="especificaciones">Especificaciones Técnicas</Label>
              <Textarea
                id="especificaciones"
                name="especificaciones"
                value={formData.especificaciones}
                onChange={handleChange}
                placeholder="Especificaciones técnicas, características, requisitos..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="requisitos_calidad">Requisitos de Calidad</Label>
              <Textarea
                id="requisitos_calidad"
                name="requisitos_calidad"
                value={formData.requisitos_calidad}
                onChange={handleChange}
                placeholder="Criterios de aceptación, estándares de calidad..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="proceso_aprobacion">Proceso de Aprobación</Label>
              <Textarea
                id="proceso_aprobacion"
                name="proceso_aprobacion"
                value={formData.proceso_aprobacion}
                onChange={handleChange}
                placeholder="Pasos para la aprobación, responsables, criterios..."
                rows={3}
              />
            </div>
          </div>

          {/* Documentación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Documentación</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="documentos_asociados">Documentos Asociados</Label>
              <Textarea
                id="documentos_asociados"
                name="documentos_asociados"
                value={formData.documentos_asociados}
                onChange={handleChange}
                placeholder="Lista de documentos relacionados (manuales, procedimientos, etc.)"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Observaciones adicionales, notas, comentarios..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {producto ? 'Guardar Cambios' : 'Crear Producto/Servicio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductoModal;
