import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  File, 
  Download, 
  Trash2, 
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import documentosService from '@/services/documentosService';

const DocumentUploader = ({ 
  onDocumentUploaded, 
  onDocumentDeleted, 
  existingDocuments = [],
  maxFiles = 5,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'],
  maxSizeMB = 10
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    
    if (existingDocuments.length + fileArray.length > maxFiles) {
      toast({
        title: "❌ Demasiados archivos",
        description: `Máximo ${maxFiles} archivos permitidos`,
        variant: "destructive",
      });
      return;
    }

    for (const file of fileArray) {
      // Validar tipo de archivo
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        toast({
          title: "❌ Tipo de archivo no válido",
          description: `Solo se permiten: ${acceptedTypes.join(', ')}`,
          variant: "destructive",
        });
        continue;
      }

      // Validar tamaño
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "❌ Archivo demasiado grande",
          description: `Máximo ${maxSizeMB}MB por archivo`,
          variant: "destructive",
        });
        continue;
      }

      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await documentosService.uploadDocument(file, 'minuta');
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "✅ Documento subido exitosamente",
        description: `${file.name} ha sido adjuntado`,
      });

      if (onDocumentUploaded) {
        onDocumentUploaded(response.data);
      }

    } catch (error) {
      console.error('Error al subir archivo:', error);
      toast({
        title: "❌ Error al subir documento",
        description: error.message || "No se pudo subir el archivo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = async (documentId, fileName) => {
    try {
      await documentosService.deleteDocumento(documentId);
      
      toast({
        title: "✅ Documento eliminado",
        description: `${fileName} ha sido eliminado`,
      });

      if (onDocumentDeleted) {
        onDocumentDeleted(documentId);
      }
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      toast({
        title: "❌ Error al eliminar documento",
        description: error.message || "No se pudo eliminar el archivo",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await documentosService.downloadDocumento(documentId);
      
      // Crear blob y descargar
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "✅ Descarga iniciada",
        description: `${fileName} se está descargando`,
      });
    } catch (error) {
      console.error('Error al descargar:', error);
      toast({
        title: "❌ Error al descargar",
        description: error.message || "No se pudo descargar el archivo",
        variant: "destructive",
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      default: return '📎';
    }
  };

  return (
    <div className="space-y-4">
      {/* Área de subida */}
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
      }`}>
        <CardContent className="p-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="text-center"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Arrastra archivos aquí o haz clic para seleccionar
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Tipos permitidos: {acceptedTypes.join(', ')} | Máximo: {maxSizeMB}MB por archivo
            </p>
            
            <Input
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <Button
              onClick={() => document.getElementById('file-upload').click()}
              disabled={isUploading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subiendo... {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Seleccionar Archivos
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de documentos existentes */}
      {existingDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="w-5 h-5" />
              Documentos Adjuntos ({existingDocuments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(doc.nombre)}</span>
                    <div>
                      <p className="font-medium text-sm">{doc.nombre}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(doc.tamaño)} • {new Date(doc.fecha_subida).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(doc.id, doc.nombre)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDocument(doc.id, doc.nombre)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUploader; 