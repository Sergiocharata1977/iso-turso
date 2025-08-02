import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import documentosService from '@/services/documentosService';
import DocumentoModal from './DocumentoModal';
import { useAuth } from '@/context/AuthContext';

const DocumentosListing = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const { toast } = useToast();
  const { user } = useAuth();

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

  const filteredDocumentos = Array.isArray(documentos) ? documentos.filter(doc =>
    doc.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Documento
        </Button>
      </div>

      {/* Lista de documentos */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredDocumentos.length === 0 ? (
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
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocumentos.map((documento) => (
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
