import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Package,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Grid,
  List
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { usePaginationWithFilters } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import ProductoModal from './ProductoModal';
import ProductoSingle from './ProductoSingle';
import productosService from '@/services/productosService';

function ProductosListing() {
  const { toast } = useToast();
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [currentProducto, setCurrentProducto] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid | list

  // Hook de paginación con filtros
  const {
    data: paginatedProductos,
    paginationInfo,
    searchTerm,
    updateSearchTerm,
    goToPage,
    changeItemsPerPage,
  } = usePaginationWithFilters(productos, {
    itemsPerPage: 12
  });

  const loadProductos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productosService.getProductos();
      setProductos(data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProductos();
  }, [loadProductos]);

  useEffect(() => {
    if (currentProducto) {
      const updatedProducto = productos.find(p => p.id === currentProducto.id);
      if (updatedProducto) {
        setCurrentProducto(updatedProducto);
      } else {
        setCurrentProducto(null);
      }
    }
  }, [productos, currentProducto]);

  const handleSave = async (productoData) => {
    try {
      if (selectedProducto) {
        await productosService.updateProducto(selectedProducto.id, productoData);
        toast({ title: 'Producto actualizado con éxito' });
      } else {
        await productosService.createProducto(productoData);
        toast({ title: 'Producto creado con éxito' });
      }
      setIsModalOpen(false);
      setSelectedProducto(null);
      await loadProductos();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast({
          title: 'Error: Código Duplicado',
          description: 'Ya existe un producto con ese código. Por favor, utiliza un código diferente.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error al guardar',
          description: error.message || 'Ocurrió un error inesperado.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEdit = (producto) => {
    setSelectedProducto(producto);
    setIsModalOpen(true);
  };

  const confirmDelete = (producto) => {
    setProductoToDelete(producto);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!productoToDelete) return;
    try {
      await productosService.deleteProducto(productoToDelete.id);
      toast({ title: 'Producto eliminado con éxito' });
      if (currentProducto?.id === productoToDelete.id) {
        setCurrentProducto(null);
      }
      await loadProductos();
    } catch (error) {
      toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' });
    } finally {
      setIsDeleteDialogOpen(false);
      setProductoToDelete(null);
    }
  };

  const handleViewDetail = (producto) => {
    setCurrentProducto(producto);
  };

  const handleBackToList = () => {
    setCurrentProducto(null);
  };

  const getEstadoBadge = (estado) => {
    const estadosISO = {
      'Borrador': { variant: 'secondary', icon: <Clock className="h-3 w-3 mr-1" />, color: 'text-gray-600' },
      'En Revisión': { variant: 'outline', icon: <AlertCircle className="h-3 w-3 mr-1" />, color: 'text-yellow-600' },
      'Pendiente Aprobación': { variant: 'outline', icon: <AlertCircle className="h-3 w-3 mr-1" />, color: 'text-orange-600' },
      'Aprobado': { variant: 'default', icon: <CheckCircle2 className="h-3 w-3 mr-1" />, color: 'text-green-600' },
      'Activo': { variant: 'success', icon: <CheckCircle2 className="h-3 w-3 mr-1" />, color: 'text-blue-600' },
      'En Modificación': { variant: 'outline', icon: <Pencil className="h-3 w-3 mr-1" />, color: 'text-purple-600' },
      'Descontinuado': { variant: 'destructive', icon: <XCircle className="h-3 w-3 mr-1" />, color: 'text-red-600' }
    };
    
    const estadoConfig = estadosISO[estado] || estadosISO['Borrador'];
    
    return (
      <Badge variant={estadoConfig.variant} className={estadoConfig.color}>
        {estadoConfig.icon}
        {estado || 'Indefinido'}
      </Badge>
    );
  };

  // Los datos ya están filtrados y paginados por el hook

  const renderGridView = () => {
    if (paginatedProductos.length === 0) {
      return (
        <div className="col-span-full text-center py-12 bg-gray-50 border rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">
            No se encontraron productos. {searchTerm ? 'Intenta con otra búsqueda.' : "Haz clic en 'Nuevo Producto' para comenzar."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {paginatedProductos.map((producto) => (
          <motion.div
            key={producto.id}
            layoutId={`producto-card-${producto.id}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between group transition-all duration-300 hover:shadow-lg hover:border-teal-500"
          >
            <div className="p-4 cursor-pointer" onClick={() => handleViewDetail(producto)}>
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition-colors">{producto.nombre}</h2>
              <div className="flex items-center gap-2 mt-3">
                {getEstadoBadge(producto.estado)}
              </div>
            </div>
            <div className="bg-gray-50 p-2 flex justify-end items-center space-x-1 rounded-b-lg border-t">
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(producto); }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); confirmDelete(producto); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderListView = () => {
    if (paginatedProductos.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 border rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">
            No se encontraron productos. {searchTerm ? 'Intenta con otra búsqueda.' : "Haz clic en 'Nuevo Producto' para comenzar."}
          </p>
        </div>
      );
    }

    return (
      <div className="pt-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProductos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetail(producto)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-teal-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {producto.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            {producto.descripcion || 'Sin descripción'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {producto.codigo || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEstadoBadge(producto.estado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(producto)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => confirmDelete(producto)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (currentProducto) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <ProductoSingle 
          producto={currentProducto} 
          onBack={handleBackToList} 
          onEdit={handleEdit}
          onDelete={confirmDelete}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6">
        <div className="flex items-center gap-4">
          <Package className="h-8 w-8 text-teal-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos y Servicios</h1>
            <p className="text-sm text-muted-foreground">Crea, edita y gestiona los productos de tu organización.</p>
          </div>
        </div>
        <Button onClick={() => {
          setSelectedProducto(null);
          setIsModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </header>

      <main className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o código..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => updateSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Selector de vista */}
            <div className="flex items-center gap-1 bg-white border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar los datos</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={loadProductos}>Reintentar</Button>
          </div>
        ) : (
          <>
            {/* Renderizado según vista seleccionada */}
            {viewMode === 'grid' ? renderGridView() : renderListView()}

            {/* Paginación */}
            {!isLoading && paginationInfo.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={paginationInfo.currentPage}
                  totalPages={paginationInfo.totalPages}
                  totalItems={paginationInfo.totalItems}
                  itemsPerPage={paginationInfo.itemsPerPage}
                  startItem={paginationInfo.startItem}
                  endItem={paginationInfo.endItem}
                  onPageChange={goToPage}
                  onItemsPerPageChange={changeItemsPerPage}
                  itemsPerPageOptions={[6, 12, 24, 48]}
                  showItemsPerPage={true}
                  showInfo={true}
                />
              </div>
            )}
          </>
        )}
      </main>

      {isModalOpen && (
        <ProductoModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedProducto(null); }}
          onSave={handleSave}
          producto={selectedProducto}
        />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription className="pt-2">
              ¿Estás seguro de que deseas eliminar el producto "{productoToDelete?.nombre}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductosListing;
