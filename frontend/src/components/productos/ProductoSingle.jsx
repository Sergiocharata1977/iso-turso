import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import productosService from '@/services/productosService.js';

const ProductoSingle = ({ producto, onBack, onEdit, onDelete }) => {
  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

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
      case 'En Desarrollo': return 'secondary';
      case 'Obsoleto': return 'destructive';
      default: return 'outline';
    }
  };

  const renderValor = (valor) => {
    if (valor === null || valor === 'null' || valor === '') return <i className="text-gray-400">Vacío</i>;
    return valor;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{producto.nombre}</h1>
            <p className="text-sm text-gray-500">Código: {producto.codigo || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onEdit(producto)}><Edit className="mr-2 h-4 w-4" />Editar</Button>
          <Button variant="destructive" onClick={() => onDelete(producto)}><Trash2 className="mr-2 h-4 w-4" />Eliminar</Button>
        </div>
      </div>

      <Tabs defaultValue="informacion" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="informacion">Información General</TabsTrigger>
          <TabsTrigger value="historial">Control de Cambios</TabsTrigger>
        </TabsList>

        <TabsContent value="informacion">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card><CardHeader><CardTitle className="text-md font-semibold">Descripción</CardTitle></CardHeader><CardContent><p className="text-gray-700">{producto.descripcion || 'Sin descripción.'}</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-md font-semibold">Estado Actual</CardTitle></CardHeader><CardContent><Badge variant={getStatusVariant(producto.estado)}>{producto.estado || 'No definido'}</Badge></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-md font-semibold">Fechas Clave</CardTitle></CardHeader><CardContent className="space-y-2">
              <div className="flex justify-between text-sm"><span className="font-medium text-gray-600">Creación:</span><span className="text-gray-800">{formatDate(producto.fecha_creacion)}</span></div>
              <div className="flex justify-between text-sm"><span className="font-medium text-gray-600">Actualización:</span><span className="text-gray-800">{formatDate(producto.fecha_actualizacion)}</span></div>
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="historial">
          <Card className="mt-6">
            <CardHeader><CardTitle className="flex items-center"><History className="mr-2 h-5 w-5" />Historial de Modificaciones</CardTitle></CardHeader>
            <CardContent>
              {loadingHistorial ? (
                <p>Cargando historial...</p>
              ) : historial.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Campo Modificado</TableHead>
                      <TableHead>Valor Anterior</TableHead>
                      <TableHead>Valor Nuevo</TableHead>
                      <TableHead>Responsable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historial.map((cambio) => (
                      <TableRow key={cambio.id}>
                        <TableCell>{formatDate(cambio.fecha_cambio)}</TableCell>
                        <TableCell className="font-medium">{cambio.campo_modificado}</TableCell>
                        <TableCell>{renderValor(cambio.valor_anterior)}</TableCell>
                        <TableCell>{renderValor(cambio.valor_nuevo)}</TableCell>
                        <TableCell>{cambio.usuario_responsable}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-600">No se han registrado cambios para este producto.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductoSingle;
