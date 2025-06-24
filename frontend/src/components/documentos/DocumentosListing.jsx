import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileDown, Plus, Trash2, Edit, Search, FileText, Download, Filter, Eye, Grid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import documentosService from '../../services/documentosService';
import DocumentoModal from './DocumentoModal';

const DocumentosListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [documentos, setDocumentos] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentoToDelete, setDocumentoToDelete] = useState(null);

  const fetchDocumentos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await documentosService.getDocumentos();
      setDocumentos(data || []);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar los documentos. Por favor, intenta de nuevo más tarde."
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  // Memoizar documentos filtrados
  const filteredDocumentos = useMemo(() => {
    if (!searchTerm.trim()) return documentos;
    
    const searchLower = searchTerm.toLowerCase();
    return documentos.filter(doc => 
      doc.titulo?.toLowerCase().includes(searchLower) ||
      doc.archivo?.toLowerCase().includes(searchLower) ||
      doc.descripcion?.toLowerCase().includes(searchLower) ||
      doc.version?.toLowerCase().includes(searchLower)
    );
  }, [documentos, searchTerm]);

  // Memoizar handlers
  const handleViewSingle = useCallback((id) => {
    navigate(`/documentos/${id}`);
  }, [navigate]);

  const handleEdit = useCallback((documento) => {
    setSelectedDocumento(documento);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((documento) => {
    setDocumentoToDelete(documento);
    setDeleteDialogOpen(true);
  }, []);

  const handleDownload = useCallback(async (documento) => {
    try {
      await documentosService.downloadDocumento(documento.id);
      toast({
        title: "Descarga iniciada",
        description: `Descargando ${documento.archivo}`
      });
    } catch (error) {
      console.error('Error al descargar documento:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al descargar el documento"
      });
    }
  }, [toast]);

  const confirmDelete = useCallback(async () => {
    if (!documentoToDelete) return;
    
    try {
      await documentosService.deleteDocumento(documentoToDelete.id);
      setDocumentos(prev => prev.filter(d => d.id !== documentoToDelete.id));
      toast({
        title: "Éxito",
        description: "Documento eliminado correctamente"
      });
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al eliminar el documento"
      });
    } finally {
      setDeleteDialogOpen(false);
      setDocumentoToDelete(null);
    }
  }, [documentoToDelete, toast]);

  const handleNewDocumento = useCallback(() => {
    setSelectedDocumento(null);
    setIsModalOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    toast({
      title: "Exportación",
      description: "Funcionalidad de exportación en desarrollo"
    });
  }, [toast]);

  // Memoizar badge de extensión
  const getExtensionBadge = useCallback((archivo) => {
    if (!archivo) return null;
    
    const extension = archivo.split('.').pop()?.toUpperCase();
    let variant = 'secondary';
    let className = '';
    
    switch (extension) {
      case 'PDF':
        variant = 'destructive';
        className = 'bg-red-100 text-red-800';
        break;
      case 'DOC':
      case 'DOCX':
        variant = 'default';
        className = 'bg-blue-100 text-blue-800';
        break;
      case 'XLS':
      case 'XLSX':
        variant = 'default';
        className = 'bg-green-100 text-green-800';
        break;
      case 'PPT':
      case 'PPTX':
        variant = 'default';
        className = 'bg-orange-100 text-orange-800';
        break;
      default:
        variant = 'secondary';
        className = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <Badge variant={variant} className={`text-xs ${className}`}>
        {extension}
      </Badge>
    );
  }, []);

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredDocumentos.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay documentos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No se encontraron documentos que coincidan con tu búsqueda.' : 'Comienza subiendo un nuevo documento.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={handleNewDocumento} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Documento
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocumentos.map(doc => (
            <Card 
              key={doc.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleViewSingle(doc.id)}
            >
              <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {getExtensionBadge(doc.archivo)}
                      <h3 className="font-semibold text-lg line-clamp-1">{doc.titulo}</h3>
                    </div>
                    <p className="text-sm opacity-90">Versión: {doc.version}</p>
                  </div>
                  <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(doc)}
                      className="h-8 w-8 p-0 hover:bg-teal-700"
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(doc)}
                      className="h-8 w-8 p-0 hover:bg-teal-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(doc)}
                      className="h-8 w-8 p-0 hover:bg-teal-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Archivo</p>
                    <p className="font-medium line-clamp-1" title={doc.archivo}>{doc.archivo}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fecha de creación</p>
                    <p className="font-medium">{new Date(doc.fecha_creacion).toLocaleDateString()}</p>
                  </div>
                  {doc.descripcion && (
                    <div>
                      <p className="text-gray-500">Descripción</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{doc.descripcion}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex items-center text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-4 w-4 mr-2" />
                  <span className="text-sm">Click para ver detalles</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // Vista de tabla (lista)
    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Archivo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versión</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocumentos.map(doc => (
                  <tr 
                    key={doc.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewSingle(doc.id)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doc.titulo}</div>
                        {doc.descripcion && (
                          <div className="text-sm text-gray-500 line-clamp-1">{doc.descripcion}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getExtensionBadge(doc.archivo)}
                        <span className="ml-2 text-sm text-gray-900 line-clamp-1">{doc.archivo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(doc.fecha_creacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(doc)}
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(doc)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(doc)}
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
        </CardContent>
      </Card>
    );
  }, [filteredDocumentos, viewMode, handleViewSingle, handleDownload, handleEdit, handleDelete]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Header Principal */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Documentos</h1>
              <p className="text-gray-600">Administra los documentos y archivos del sistema</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button onClick={handleNewDocumento} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Documento
              </Button>
            </div>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4 mr-1" />
                Tarjetas
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                Tabla
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent}
        </div>
      </div>

      {/* Modal para crear/editar */}
      {isModalOpen && (
        <DocumentoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchDocumentos}
          documento={selectedDocumento}
        />
      )}

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el documento{' '}
              <span className="font-semibold">{documentoToDelete?.titulo}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentosListing;
