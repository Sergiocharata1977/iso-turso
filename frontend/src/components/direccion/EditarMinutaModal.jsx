import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  Save,
  X
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import DocumentUploader from '@/components/common/DocumentUploader';
import ChangeHistory from '@/components/common/ChangeHistory';

const EditarMinutaModal = ({ isOpen, onClose, onSave, minuta, documentos = [], historial = [] }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    responsable: '',
    descripcion: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();

  // Cargar datos de la minuta cuando se abre el modal
  useEffect(() => {
    if (minuta && isOpen) {
      setFormData({
        titulo: minuta.titulo || '',
        responsable: minuta.responsable || '',
        descripcion: minuta.descripcion || ''
      });
      setIsSuccess(false);
    }
  }, [minuta, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(minuta.id, formData);
      
      toast({
        title: "✅ Minuta actualizada exitosamente",
        description: "Los cambios han sido guardados correctamente",
        className: "bg-green-500 text-white border-green-600",
      });
      
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast({
        title: "❌ Error al actualizar minuta",
        description: error.message || "No se pudo actualizar la minuta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentUploaded = (document) => {
    toast({
      title: "✅ Documento adjuntado",
      description: `${document.nombre} ha sido adjuntado a la minuta`,
    });
  };

  const handleDocumentDeleted = (documentId) => {
    toast({
      title: "✅ Documento eliminado",
      description: "El documento ha sido eliminado de la minuta",
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'general', name: 'Información General', icon: FileText },
    { id: 'documentos', name: 'Documentos', icon: FileText },
    { id: 'historial', name: 'Historial', icon: Clock }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Minuta Actualizada Exitosamente
              </>
            ) : (
              <>
                <Edit className="w-5 h-5" />
                Editar Minuta: {minuta?.titulo}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              ¡Minuta actualizada exitosamente!
            </h3>
            <p className="text-gray-600">
              Los cambios han sido guardados correctamente.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Cerrando modal automáticamente...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Información básica de la minuta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Información de la Minuta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">ID</Label>
                    <p className="text-sm">{minuta?.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Fecha de Creación</Label>
                    <p className="text-sm">{minuta?.created_at ? formatDate(minuta.created_at) : 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pestañas */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Contenido de las pestañas */}
            <div className="min-h-[400px]">
              {activeTab === 'general' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="titulo">Título de la Minuta *</Label>
                      <Input
                        id="titulo"
                        value={formData.titulo}
                        onChange={(e) => handleChange('titulo', e.target.value)}
                        placeholder="Ej: Revisión de Indicadores Q1 2024"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="responsable" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Responsable *
                      </Label>
                      <Input
                        id="responsable"
                        value={formData.responsable}
                        onChange={(e) => handleChange('responsable', e.target.value)}
                        placeholder="Nombre del responsable de la minuta"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        placeholder="Descripción detallada de la minuta, temas a tratar, objetivos, etc."
                        rows={6}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleClose}
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              )}

              {activeTab === 'documentos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Documentos Adjuntos</h3>
                    <Badge variant="outline">
                      {documentos.length} documento{documentos.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <DocumentUploader
                    onDocumentUploaded={handleDocumentUploaded}
                    onDocumentDeleted={handleDocumentDeleted}
                    existingDocuments={documentos}
                    maxFiles={10}
                  />
                </div>
              )}

              {activeTab === 'historial' && (
                <ChangeHistory 
                  changes={historial}
                  title="Historial de Cambios de la Minuta"
                />
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditarMinutaModal; 