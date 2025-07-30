import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  FileText,
  Users,
  Calendar,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import minutasService from '@/services/minutasService';
import NuevaMinutaModal from '@/components/direccion/NuevaMinutaModal';
import EditarMinutaModal from '@/components/direccion/EditarMinutaModal';
import MinutaDetalleModal from '@/components/direccion/MinutaDetalleModal';

const MinutasPage = () => {
  const [minutas, setMinutas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('tarjetas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMinuta, setSelectedMinuta] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [stats, setStats] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchMinutas();
    fetchStats();
  }, []);

  const fetchMinutas = async () => {
    try {
      setIsLoading(true);
      const response = await minutasService.getAll();
      
      // El API devuelve { status: 'success', data: [...] }
      const minutasData = response.data?.data || response.data || [];
      setMinutas(minutasData);
    } catch (error) {
      console.error('Error al obtener minutas:', error);
      setError('No se pudieron cargar las minutas');
      toast({
        title: "❌ Error",
        description: "No se pudieron cargar las minutas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await minutasService.getStats();
      
      // El API devuelve { status: 'success', data: {...} }
      const statsData = response.data?.data || response.data || {};
      setStats(statsData);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      // Si falla, establecer estadísticas por defecto
      setStats({
        total: 0,
        responsables: 0,
        esteMes: 0,
        documentos: 0
      });
    }
  };

  const fetchDocumentos = async (minutaId) => {
    try {
      const response = await minutasService.getDocumentos(minutaId);
      setDocumentos(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      setDocumentos([]);
    }
  };

  const fetchHistorial = async (minutaId) => {
    try {
      const response = await minutasService.getHistorial(minutaId);
      setHistorial(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error al obtener historial:', error);
      setHistorial([]);
    }
  };

  const handleCreateMinuta = async (formData) => {
    try {
      const nuevaMinuta = await minutasService.create(formData);
      const minutaData = nuevaMinuta.data?.data || nuevaMinuta.data;
      setMinutas(prevMinutas => [...prevMinutas, minutaData]);
      // No mostrar toast aquí porque el modal ya lo maneja
      return nuevaMinuta;
    } catch (error) {
      console.error('Error al crear minuta:', error);
      // No mostrar toast aquí porque el modal ya lo maneja
      throw error;
    }
  };

  const handleUpdateMinuta = async (id, formData) => {
    try {
      const response = await minutasService.update(id, formData);
      const updatedMinuta = response.data?.data || response.data;
      setMinutas(prevMinutas => 
        prevMinutas.map(minuta => 
          minuta.id === id ? updatedMinuta : minuta
        )
      );
      return response;
    } catch (error) {
      console.error('Error al actualizar minuta:', error);
      throw error;
    }
  };

  const handleDeleteMinuta = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta minuta?')) {
      return;
    }

    try {
      await minutasService.delete(id);
      setMinutas(prevMinutas => prevMinutas.filter(minuta => minuta.id !== id));
      toast({
        title: "✅ Minuta eliminada",
        description: "La minuta ha sido eliminada correctamente",
      });
    } catch (error) {
      console.error('Error al eliminar minuta:', error);
      toast({
        title: "❌ Error",
        description: "No se pudo eliminar la minuta",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = async (minuta) => {
    setSelectedMinuta(minuta);
    await Promise.all([
      fetchDocumentos(minuta.id),
      fetchHistorial(minuta.id)
    ]);
    setIsDetailModalOpen(true);
  };

  const handleEditMinuta = async (minuta) => {
    setSelectedMinuta(minuta);
    await Promise.all([
      fetchDocumentos(minuta.id),
      fetchHistorial(minuta.id)
    ]);
    setIsEditModalOpen(true);
  };

  const handleDownloadPDF = async (minuta) => {
    try {
      const response = await minutasService.downloadPDF(minuta.id);
      
      // Crear blob y descargar
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `minuta-${minuta.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "✅ Descarga iniciada",
        description: "El PDF se está descargando",
      });
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      toast({
        title: "❌ Error al descargar",
        description: "No se pudo descargar el PDF",
        variant: "destructive",
      });
    }
  };

  const filteredMinutas = minutas.filter(minuta =>
    minuta.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    minuta.responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    minuta.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-gray-600">Cargando minutas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">❌</div>
          <p className="text-gray-600">{error}</p>
          <Button onClick={fetchMinutas} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minutas</h1>
          <p className="text-gray-600">Gestión de minutas de revisión por la dirección</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Minuta
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.total || 0}</p>
                  <p className="text-sm text-gray-600">Total Minutas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.responsables || 0}</p>
                  <p className="text-sm text-gray-600">Responsables</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.esteMes || 0}</p>
                  <p className="text-sm text-gray-600">Este Mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.documentos || 0}</p>
                  <p className="text-sm text-gray-600">Documentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar minutas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'tarjetas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tarjetas')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'tabla' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tabla')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Lista de minutas */}
      {filteredMinutas.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No se encontraron minutas' : 'No hay minutas'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Crea tu primera minuta para comenzar'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Minuta
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'tarjetas' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredMinutas.map((minuta) => (
            <Card key={minuta.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{minuta.titulo}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{minuta.responsable}</span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(minuta)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditMinuta(minuta)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadPDF(minuta)}>
                        <Download className="w-4 h-4 mr-2" />
                        Descargar PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteMinuta(minuta.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {minuta.descripcion || 'Sin descripción'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(minuta.created_at)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {formatTimeAgo(minuta.created_at)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modales */}
      <NuevaMinutaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateMinuta}
      />

      <EditarMinutaModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateMinuta}
        minuta={selectedMinuta}
        documentos={documentos}
        historial={historial}
      />

      <MinutaDetalleModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        minuta={selectedMinuta}
        documentos={documentos}
        historial={historial}
        onEdit={handleEditMinuta}
        onDownload={handleDownloadPDF}
      />
    </div>
  );
};

export default MinutasPage;
