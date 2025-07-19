import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  History, 
  Package, 
  Calendar, 
  User, 
  FileText,
  Settings,
  Link,
  Save,
  X
} from 'lucide-react';
import productosService from '@/services/productosService.js';

const ProductoSingle = ({ producto, onBack, onEdit, onDelete }) => {
  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (producto?.id) {
      const fetchHistorial = async () => {
        setLoadingHistorial(true);
        try {
          const data = await productosService.getHistorial(producto.id);
          setHistorial(data);
        } catch (error) {
          console.error('Error al cargar el historial:', error);
        } finally {
          setLoadingHistorial(false);
        }
      };
      fetchHistorial();
    }
  }, [producto?.id]);

  useEffect(() => {
    if (producto) {
      setEditData({
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
    }
  }, [producto]);

  if (!producto) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Activo': return 'success';
      case 'Aprobado': return 'success';
      case 'En Revisión': return 'warning';
      case 'Borrador': return 'secondary';
      case 'Descontinuado': return 'destructive';
      default: return 'outline';
    }
  };

  const handleSave = async () => {
    try {
      await productosService.updateProducto(producto.id, editData);
      setIsEditing(false);
      // Recargar datos
      window.location.reload();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
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
  };

  const renderValor = (valor) => {
    if (valor === null || valor === 'null' || valor === '') return <i className="text-gray-400">Vacío</i>;
    return valor;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-emerald-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{producto.nombre}</h1>
              <p className="text-sm text-gray-500">Código: {producto.codigo || 'Sin código'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button onClick={() => onDelete(producto)} variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Save className="h-4 w-4" />
                Guardar
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Estado y Tipo */}
      <div className="flex items-center gap-4">
        <Badge variant={getStatusVariant(producto.estado)} className="text-sm">
          {producto.estado}
        </Badge>
        <Badge variant="outline" className="text-sm">
          {producto.tipo}
        </Badge>
        <Badge variant="outline" className="text-sm">
          v{producto.version}
        </Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="detalles">Detalles Técnicos</TabsTrigger>
          <TabsTrigger value="relaciones">Relaciones</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        {/* Información General */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  {isEditing ? (
                    <Input
                      value={editData.nombre}
                      onChange={(e) => setEditData({...editData, nombre: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-1">{renderValor(producto.nombre)}</p>
                  )}
                </div>
                
                <div>
                  <Label>Descripción</Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.descripcion}
                      onChange={(e) => setEditData({...editData, descripcion: e.target.value})}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">{renderValor(producto.descripcion)}</p>
                  )}
                </div>

                <div>
                  <Label>Responsable</Label>
                  {isEditing ? (
                    <Input
                      value={editData.responsable}
                      onChange={(e) => setEditData({...editData, responsable: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-1">{renderValor(producto.responsable)}</p>
                  )}
                </div>

                <div>
                  <Label>Categoría</Label>
                  {isEditing ? (
                    <Input
                      value={editData.categoria}
                      onChange={(e) => setEditData({...editData, categoria: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-1">{renderValor(producto.categoria)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Fecha de Creación</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editData.fecha_creacion}
                      onChange={(e) => setEditData({...editData, fecha_creacion: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-1">{formatDate(producto.fecha_creacion)}</p>
                  )}
                </div>

                <div>
                  <Label>Fecha de Revisión</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editData.fecha_revision}
                      onChange={(e) => setEditData({...editData, fecha_revision: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-1">{formatDate(producto.fecha_revision)}</p>
                  )}
                </div>

                <div>
                  <Label>Estado</Label>
                  {isEditing ? (
                    <Select value={editData.estado} onValueChange={(value) => setEditData({...editData, estado: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Borrador">Borrador</SelectItem>
                        <SelectItem value="En Revisión">En Revisión</SelectItem>
                        <SelectItem value="Aprobado">Aprobado</SelectItem>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Descontinuado">Descontinuado</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-gray-900 mt-1">{producto.estado}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detalles Técnicos */}
        <TabsContent value="detalles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Especificaciones Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Especificaciones</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.especificaciones}
                    onChange={(e) => setEditData({...editData, especificaciones: e.target.value})}
                    className="mt-1"
                    rows={4}
                    placeholder="Especificaciones técnicas del producto..."
                  />
                ) : (
                  <p className="text-sm text-gray-600 mt-1">{renderValor(producto.especificaciones)}</p>
                )}
              </div>

              <div>
                <Label>Requisitos de Calidad</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.requisitos_calidad}
                    onChange={(e) => setEditData({...editData, requisitos_calidad: e.target.value})}
                    className="mt-1"
                    rows={4}
                    placeholder="Requisitos de calidad ISO 9001..."
                  />
                ) : (
                  <p className="text-sm text-gray-600 mt-1">{renderValor(producto.requisitos_calidad)}</p>
                )}
              </div>

              <div>
                <Label>Proceso de Aprobación</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.proceso_aprobacion}
                    onChange={(e) => setEditData({...editData, proceso_aprobacion: e.target.value})}
                    className="mt-1"
                    rows={3}
                    placeholder="Proceso de aprobación y workflow..."
                  />
                ) : (
                  <p className="text-sm text-gray-600 mt-1">{renderValor(producto.proceso_aprobacion)}</p>
                )}
              </div>

              <div>
                <Label>Observaciones</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.observaciones}
                    onChange={(e) => setEditData({...editData, observaciones: e.target.value})}
                    className="mt-1"
                    rows={3}
                    placeholder="Observaciones adicionales..."
                  />
                ) : (
                  <p className="text-sm text-gray-600 mt-1">{renderValor(producto.observaciones)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relaciones */}
        <TabsContent value="relaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Relaciones del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Las relaciones con Documentos y Procesos se implementarán próximamente</p>
                <p className="text-sm">Usando la tabla relaciones_sgc</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historial */}
        <TabsContent value="historial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historial de Cambios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistorial ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Cargando historial...</p>
                </div>
              ) : historial.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo</TableHead>
                      <TableHead>Valor Anterior</TableHead>
                      <TableHead>Valor Nuevo</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historial.map((cambio, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{cambio.campo_modificado}</TableCell>
                        <TableCell>{cambio.valor_anterior || 'Vacío'}</TableCell>
                        <TableCell>{cambio.valor_nuevo || 'Vacío'}</TableCell>
                        <TableCell>{cambio.usuario_responsable || 'Sistema'}</TableCell>
                        <TableCell>{formatDate(cambio.fecha_cambio)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay cambios registrados en el historial</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductoSingle;
