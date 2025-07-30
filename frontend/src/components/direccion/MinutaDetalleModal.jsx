import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  Clock, 
  Calendar,
  Edit,
  Download,
  Eye,
  Share2,
  Printer
} from 'lucide-react';
import DocumentUploader from '@/components/common/DocumentUploader';
import ChangeHistory from '@/components/common/ChangeHistory';
import { Label } from '@/components/ui/label';

const MinutaDetalleModal = ({ 
  isOpen, 
  onClose, 
  minuta, 
  documentos = [], 
  historial = [],
  onEdit,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState('detalles');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
  };

  const tabs = [
    { id: 'detalles', name: 'Detalles', icon: FileText },
    { id: 'documentos', name: 'Documentos', icon: FileText },
    { id: 'historial', name: 'Historial', icon: Clock }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: minuta?.titulo,
        text: `Minuta: ${minuta?.titulo}`,
        url: window.location.href
      });
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detalles de la Minuta
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(minuta)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {minuta?.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Responsable</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{minuta?.responsable || 'No asignado'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Fecha de Creación</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {minuta?.created_at ? formatDate(minuta.created_at) : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Última Actualización</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {minuta?.created_at ? formatTimeAgo(minuta.created_at) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Descripción</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {minuta?.descripcion || 'Sin descripción'}
                    </p>
                  </div>
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
                  {tab.id === 'documentos' && documentos.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {documentos.length}
                    </Badge>
                  )}
                  {tab.id === 'historial' && historial.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {historial.length}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido de las pestañas */}
          <div className="min-h-[400px]">
            {activeTab === 'detalles' && (
              <div className="space-y-6">
                {/* Información adicional */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información Adicional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-emerald-50 rounded-lg">
                        <FileText className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                        <p className="font-semibold text-emerald-800">Minuta de Revisión</p>
                        <p className="text-sm text-emerald-600">Tipo de documento</p>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="font-semibold text-blue-800">Responsable</p>
                        <p className="text-sm text-blue-600">{minuta?.responsable || 'No asignado'}</p>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="font-semibold text-purple-800">Estado</p>
                        <p className="text-sm text-purple-600">Activo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Acciones rápidas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {onEdit && (
                        <Button
                          variant="outline"
                          onClick={() => onEdit(minuta)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Editar Minuta
                        </Button>
                      )}
                      
                      {onDownload && (
                        <Button
                          variant="outline"
                          onClick={() => onDownload(minuta)}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Descargar PDF
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        onClick={handleShare}
                        className="flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Compartir
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Imprimir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                  existingDocuments={documentos}
                  maxFiles={10}
                  readOnly={true}
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
      </DialogContent>
    </Dialog>
  );
};

export default MinutaDetalleModal; 