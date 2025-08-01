import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Download, X, Maximize, FileText, AlertCircle } from 'lucide-react';
import documentosService from '@/services/documentosService';
import { useToast } from '@/components/ui/use-toast';

/**
 * Componente para visualizar documentos (especialmente PDFs) en pantalla
 */
const DocumentViewer = ({ documento, isOpen, onClose }) => {
  const [viewUrl, setViewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && documento) {
      loadDocument();
    } else {
      // Limpiar URL cuando se cierra
      if (viewUrl) {
        window.URL.revokeObjectURL(viewUrl);
        setViewUrl(null);
      }
    }

    // Cleanup al desmontar
    return () => {
      if (viewUrl) {
        window.URL.revokeObjectURL(viewUrl);
      }
    };
  }, [isOpen, documento]);

  const loadDocument = async () => {
    if (!documento?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const url = await documentosService.getViewUrl(documento.id);
      setViewUrl(url);
    } catch (error) {
      console.error('Error cargando documento:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "No se pudo cargar el documento para visualización",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await documentosService.downloadDocumento(documento.id, documento.nombre);
      toast({
        title: "Descarga iniciada",
        description: `Se ha iniciado la descarga de ${documento.nombre}`,
      });
    } catch (error) {
      toast({
        title: "Error de descarga",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleOpenFullscreen = () => {
    if (viewUrl) {
      window.open(viewUrl, '_blank');
    }
  };

  const isPDF = documento?.tipo_archivo?.toLowerCase().includes('pdf') || 
                documento?.nombre?.toLowerCase().endsWith('.pdf');

  if (!documento) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <DialogTitle className="truncate">{documento.nombre}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              {viewUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenFullscreen}
                >
                  <Maximize className="h-4 w-4 mr-2" />
                  Pantalla completa
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando documento...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <Card className="max-w-md">
                <CardContent className="text-center p-6">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Error al cargar</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={loadDocument} variant="outline">
                    Reintentar
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {viewUrl && !isLoading && !error && (
            <div className="h-full w-full">
              {isPDF ? (
                <iframe
                  src={viewUrl}
                  className="w-full h-full border-0 rounded"
                  title={`Vista de ${documento.nombre}`}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Card className="max-w-md">
                    <CardContent className="text-center p-6">
                      <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Vista previa no disponible</h3>
                      <p className="text-gray-600 mb-4">
                        Este tipo de archivo no se puede visualizar en el navegador.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Descargar archivo
                        </Button>
                        <Button variant="outline" onClick={handleOpenFullscreen}>
                          <Eye className="h-4 w-4 mr-2" />
                          Abrir en nueva pestaña
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Información del documento */}
        <div className="flex-shrink-0 mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Tipo:</span> {documento.tipo_archivo || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Tamaño:</span> {documento.tamaño || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Subido:</span> {
                documento.fecha_subida 
                  ? new Date(documento.fecha_subida).toLocaleDateString('es-ES')
                  : 'N/A'
              }
            </div>
            <div>
              <span className="font-medium">Versión:</span> {documento.version || '1.0'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer; 