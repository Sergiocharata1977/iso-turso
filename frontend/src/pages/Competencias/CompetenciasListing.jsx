import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Grid3X3, Table2, FileEdit, Trash2, Eye } from 'lucide-react';
import { competenciasService } from '@/services/competenciasService';
import CompetenciaModal from './CompetenciaModal';

const CompetenciasListing = () => {
  const [competencias, setCompetencias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCompetencia, setCurrentCompetencia] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [competenciaToDelete, setCompetenciaToDelete] = useState(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Cargar competencias
  const loadCompetencias = async () => {
    setIsLoading(true);
    try {
      // Llamada directa al servicio
      const data = await competenciasService.getAll();
      
      // Debug para verificar la respuesta
      console.log('✅ Competencias cargadas:', data);
      
      // Actualizar el estado con los datos
      setCompetencias(Array.isArray(data) ? data : []);
      
      // Mostrar mensaje si no hay datos
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('⚠️ No se encontraron competencias');
      }
    } catch (error) {
      console.error('❌ Error al cargar competencias:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las competencias",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompetencias();
  }, []);

  // Filtrar competencias por término de búsqueda
  const filteredCompetencias = competencias.filter(
    (competencia) =>
      competencia.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competencia.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear/editar
  const handleOpenModal = (competencia = null) => {
    setCurrentCompetencia(competencia);
    setModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentCompetencia(null);
  };

  // Guardar competencia (crear o actualizar)
  const handleSaveCompetencia = async (competenciaData) => {
    try {
      if (currentCompetencia) {
        // Actualizar
        await competenciasService.update(currentCompetencia.id, competenciaData);
        toast({
          title: "Éxito",
          description: "Competencia actualizada correctamente",
        });
      } else {
        // Crear
        await competenciasService.create(competenciaData);
        toast({
          title: "Éxito",
          description: "Competencia creada correctamente",
        });
      }
      loadCompetencias();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar competencia:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la competencia",
        variant: "destructive",
      });
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = (competencia) => {
    setCompetenciaToDelete(competencia);
    setDeleteDialogOpen(true);
  };

  // Eliminar competencia
  const handleDeleteCompetencia = async () => {
    if (!competenciaToDelete) return;
    
    try {
      await competenciasService.delete(competenciaToDelete.id);
      toast({
        title: "Éxito",
        description: "Competencia eliminada correctamente",
      });
      loadCompetencias();
    } catch (error) {
      console.error('Error al eliminar competencia:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la competencia",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCompetenciaToDelete(null);
    }
  };

  // Ver detalle de competencia
  const handleViewCompetencia = (id) => {
    navigate(`/competencias/${id}`);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Competencias</h1>
            <p className="text-gray-600">Gestión de competencias del personal</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="outline" className="hidden sm:flex">
              Exportar
            </Button>
            <Button 
              onClick={() => handleOpenModal()} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Competencia
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white border-b p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar competencias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-10 w-10"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('table')}
              className="h-10 w-10"
            >
              <Table2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Cargando competencias...</p>
          </div>
        ) : filteredCompetencias.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500 mb-4">No se encontraron competencias</p>
            <Button 
              onClick={() => handleOpenModal()} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Competencia
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCompetencias.map((competencia) => (
              <Card 
                key={competencia.id}
                className="group cursor-pointer hover:border-teal-500 hover:shadow-lg transition-all duration-300"
                onClick={() => handleViewCompetencia(competencia.id)}
              >
                <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-500 text-white p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg group-hover:text-teal-100 transition-colors">
                      {competencia.nombre}
                    </h3>
                    <Badge variant={competencia.estado === 'activa' ? 'success' : 'secondary'}>
                      {competencia.estado === 'activa' ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 bg-white">
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {competencia.descripcion || 'Sin descripción'}
                  </p>
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCompetencia(competencia.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(competencia);
                      }}
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmDelete(competencia);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-md shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
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
                {filteredCompetencias.map((competencia) => (
                  <tr 
                    key={competencia.id}
                    className="hover:bg-teal-50 cursor-pointer"
                    onClick={() => handleViewCompetencia(competencia.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{competencia.nombre}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {competencia.descripcion || 'Sin descripción'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={competencia.estado === 'activa' ? 'success' : 'secondary'}>
                        {competencia.estado === 'activa' ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCompetencia(competencia.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(competencia);
                          }}
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmDelete(competencia);
                          }}
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
        )}
      </div>

      {/* Modal para crear/editar competencia */}
      {modalOpen && (
        <CompetenciaModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCompetencia}
          competencia={currentCompetencia}
        />
      )}

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar competencia?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Esta acción no se puede deshacer. Se eliminará permanentemente la competencia
              {competenciaToDelete && ` "${competenciaToDelete.nombre}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-600 text-white hover:bg-slate-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompetencia}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompetenciasListing;
