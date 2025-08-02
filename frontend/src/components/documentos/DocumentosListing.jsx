import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Download, Eye, Edit, Trash2, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { usePaginationWithFilters } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import documentosService from '@/services/documentosService';
import DocumentoModal from './DocumentoModal';
import { useAuth } from '@/context/AuthContext';

const DocumentosListing = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const { toast } = useToast();
  const { user } = useAuth();

  // Hook de paginación con filtros
  const {
    data: paginatedDocumentos,
    paginationInfo,
    searchTerm,
    updateSearchTerm,
    goToPage,
    changeItemsPerPage,
  } = usePaginationWithFilters(documentos, {
    itemsPerPage: 12
  });

  useEffect(() => {
    loadDocumentos();
  }, []);

  const loadDocumentos = async () => {
    try {
      setLoading(true);
      const data = await documentosService.getDocumentos();
      console.log('📄 Datos recibidos:', data);
      setDocumentos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      setDocumentos([]);
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDocumento(null);
    setIsModalOpen(true);
  };

  const handleEdit = (documento) => {
    setSelectedDocumento(documento);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este documento?')) {
      try {
        await documentosService.deleteDocumento(id);
        toast({
          title: "Éxito",
          description: "Documento eliminado correctamente",
        });
        loadDocumentos();
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el documento",
          variant: "destructive"
        });
      }
    }
  };

  const handleDownload = async (documento) => {
    try {
      await documentosService.downloadDocumento(documento.id, documento.archivo_nombre);
      toast({
        title: "Descarga iniciada",
        description: `Descargando ${documento.archivo_nombre}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar el documento",
        variant: "destructive"
      });
    }
  };

  // Los datos ya están filtrados y paginados por el hook

  const renderGridView = () => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (paginatedDocumentos.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No se encontraron documentos con ese criterio' : 'No hay documentos registrados'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agregar primer documento
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedDocumentos.map((documento) => (
          <Card key={documento.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-emerald-600" />
                  <div>
                    <CardTitle className="text-lg">{documento.titulo}</CardTitle>
                    <p className="text-sm text-gray-500">Versión {documento.version}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {documento.descripcion || 'Sin descripción'}
              </p>
              <div className="text-xs text-gray-500 mb-4">
                <p>Archivo: {documento.archivo_nombre}</p>
                <p>Tamaño: {documento.tamaño ? `${(documento.tamaño / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(documento)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(documento)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(documento.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderListView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      );
    }

    if (paginatedDocumentos.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No se encontraron documentos con ese criterio' : 'No hay documentos registrados'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agregar primer documento
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Versión
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Archivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamaño
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDocumentos.map((documento) => (
                <tr key={documento.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-emerald-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {documento.titulo}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {documento.descripcion || 'Sin descripción'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {documento.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {documento.archivo_nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {documento.tamaño ? `${(documento.tamaño / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(documento)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(documento)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(documento.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentos</h1>
        <p className="text-gray-600">Gestión de documentos del sistema de calidad</p>
      </div>

      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => updateSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
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
        
        <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Documento
        </Button>
      </div>

      {/* Renderizado según vista seleccionada */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {/* Paginación */}
      {!loading && paginationInfo.totalPages > 1 && (
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

      {/* Modal para crear/editar */}
      <DocumentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={loadDocumentos}
        documento={selectedDocumento}
      />
    </div>
  );
};

export default DocumentosListing;
