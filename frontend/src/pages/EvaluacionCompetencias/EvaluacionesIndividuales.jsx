import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Search, Plus, Grid3X3, Table2, FileEdit, Trash2, Eye, Star, User } from 'lucide-react';
import { evaluacionesService } from '@/services/evaluacionesService';
import EvaluacionIndividualModal from './EvaluacionIndividualModal';

const EvaluacionesIndividuales = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvaluacion, setCurrentEvaluacion] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [evaluacionToDelete, setEvaluacionToDelete] = useState(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Cargar evaluaciones individuales
  const loadEvaluaciones = async () => {
    setIsLoading(true);
    try {
      const data = await evaluacionesService.getAll();
      console.log('✅ Evaluaciones individuales cargadas:', data);
      setEvaluaciones(Array.isArray(data) ? data : []);
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('⚠️ No se encontraron evaluaciones individuales');
      }
    } catch (error) {
      console.error('❌ Error al cargar evaluaciones:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las evaluaciones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluaciones();
  }, []);

  // Filtrar evaluaciones por término de búsqueda
  const filteredEvaluaciones = evaluaciones.filter(
    (evaluacion) =>
      evaluacion.empleado_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluacion.observaciones?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear/editar
  const handleOpenModal = (evaluacion = null) => {
    setCurrentEvaluacion(evaluacion);
    setModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEvaluacion(null);
  };

  // Guardar evaluación (crear o actualizar)
  const handleSaveEvaluacion = async (evaluacionData) => {
    try {
      if (currentEvaluacion) {
        // Actualizar
        await evaluacionesService.update(currentEvaluacion.id, evaluacionData);
        toast({
          title: "Éxito",
          description: "Evaluación actualizada correctamente",
        });
      } else {
        // Crear
        await evaluacionesService.create(evaluacionData);
        toast({
          title: "Éxito",
          description: "Evaluación creada correctamente",
        });
      }
      loadEvaluaciones();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la evaluación",
        variant: "destructive",
      });
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = (evaluacion) => {
    setEvaluacionToDelete(evaluacion);
    setDeleteDialogOpen(true);
  };

  // Eliminar evaluación
  const handleDeleteEvaluacion = async () => {
    if (!evaluacionToDelete) return;
    
    try {
      await evaluacionesService.delete(evaluacionToDelete.id);
      toast({
        title: "Éxito",
        description: "Evaluación eliminada correctamente",
      });
      loadEvaluaciones();
    } catch (error) {
      console.error('Error al eliminar evaluación:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la evaluación",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setEvaluacionToDelete(null);
    }
  };

  // Ver detalle de evaluación
  const handleViewEvaluacion = (id) => {
    navigate(`/evaluaciones-individuales/${id}`);
  };

  // Renderizar vista de tarjetas
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvaluaciones.map((evaluacion) => (
        <Card key={evaluacion.id} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">{evaluacion.empleado_nombre}</CardTitle>
              </div>
              <Badge variant={evaluacion.estado === 'completada' ? 'default' : 'secondary'}>
                {evaluacion.estado}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Puntaje Total:</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{evaluacion.puntaje_total || 0}/10</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Fecha:</strong> {new Date(evaluacion.fecha_evaluacion).toLocaleDateString()}
              </div>
              
              {evaluacion.observaciones && (
                <div className="text-sm text-gray-600">
                  <strong>Observaciones:</strong> {evaluacion.observaciones.substring(0, 100)}...
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewEvaluacion(evaluacion.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenModal(evaluacion)}
                >
                  <FileEdit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConfirmDelete(evaluacion)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Renderizar vista de tabla
  const renderTableView = () => (
    <div className="bg-white rounded-lg border">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empleado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Puntaje
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredEvaluaciones.map((evaluacion) => (
            <tr key={evaluacion.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">{evaluacion.empleado_nombre}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(evaluacion.fecha_evaluacion).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{evaluacion.puntaje_total || 0}/10</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={evaluacion.estado === 'completada' ? 'default' : 'secondary'}>
                  {evaluacion.estado}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewEvaluacion(evaluacion.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenModal(evaluacion)}
                >
                  <FileEdit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConfirmDelete(evaluacion)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Evaluaciones Individuales
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión de evaluaciones de competencias individuales según ISO 9001
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            Exportar
          </Button>
          <Button 
            onClick={() => handleOpenModal()}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Evaluación
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar evaluaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="bg-muted border rounded-md p-1 flex">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <Table2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      {filteredEvaluaciones.length === 0 ? (
        <div className="text-center py-12">
          <Star className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay evaluaciones</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando una nueva evaluación individual.
          </p>
          <div className="mt-6">
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Evaluación
            </Button>
          </div>
        </div>
      ) : (
        viewMode === 'grid' ? renderGridView() : renderTableView()
      )}

      {/* Modal de evaluación */}
      {modalOpen && (
        <EvaluacionIndividualModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveEvaluacion}
          evaluacion={currentEvaluacion}
        />
      )}

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la evaluación de {evaluacionToDelete?.empleado_nombre}.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvaluacion}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EvaluacionesIndividuales;
