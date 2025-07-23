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
import { Search, Plus, Grid3X3, Table2, FileEdit, Trash2, Eye, Calendar, Users, Star } from 'lucide-react';
import { evalcompeProgramacionService } from '@/services/evalcompeProgramacionService';
import ProgramacionGrupalModal from './ProgramacionGrupalModalSimple';

const ProgramacionCompetenciasList = () => {
  const [programaciones, setProgramaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProgramacion, setCurrentProgramacion] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programacionToDelete, setProgramacionToDelete] = useState(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Cargar programaciones
  const loadProgramaciones = async () => {
    console.log('🔄 [ProgramacionList] Iniciando carga de programaciones...');
    setIsLoading(true);
    try {
      const data = await evalcompeProgramacionService.getAll();
      console.log('📋 [ProgramacionList] Datos recibidos del servicio:', data);
      console.log('📋 [ProgramacionList] Tipo de datos:', typeof data);
      console.log('📋 [ProgramacionList] Es array:', Array.isArray(data));
      console.log('📋 [ProgramacionList] Longitud:', data?.length);
      
      if (Array.isArray(data)) {
        setProgramaciones(data);
        console.log('✅ [ProgramacionList] Programaciones establecidas en estado:', data.length);
      } else {
        console.log('⚠️ [ProgramacionList] Los datos no son un array, estableciendo array vacío');
        setProgramaciones([]);
      }
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('⚠️ [ProgramacionList] No se encontraron programaciones para mostrar');
      }
    } catch (error) {
      console.error('❌ [ProgramacionList] Error al cargar programaciones:', error);
      console.error('📋 [ProgramacionList] Detalles del error:', error.message);
      setProgramaciones([]); // Asegurar que el estado sea un array vacío en caso de error
      toast({
        title: "Error",
        description: "No se pudieron cargar las programaciones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('✅ [ProgramacionList] Carga finalizada');
    }
  };

  useEffect(() => {
    loadProgramaciones();
  }, []);

  // Filtrar programaciones por término de búsqueda
  const filteredProgramaciones = programaciones.filter(
    (programacion) =>
      programacion.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programacion.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear/editar
  const handleOpenModal = (programacion = null) => {
    setCurrentProgramacion(programacion);
    setModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentProgramacion(null);
  };

  // Guardar programación (crear o actualizar)
  const handleSaveProgramacion = async (programacionData) => {
    try {
      if (currentProgramacion) {
        // Actualizar
        await evalcompeProgramacionService.update(currentProgramacion.id, programacionData);
        toast({
          title: "Éxito",
          description: "Programación actualizada correctamente",
        });
      } else {
        // Crear
        await evalcompeProgramacionService.create(programacionData);
        toast({
          title: "Éxito",
          description: "Programación creada correctamente",
        });
      }
      loadProgramaciones();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar programación:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la programación",
        variant: "destructive",
      });
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = (programacion) => {
    setProgramacionToDelete(programacion);
    setDeleteDialogOpen(true);
  };

  // Eliminar programación
  const handleDeleteProgramacion = async () => {
    if (!programacionToDelete) return;
    
    try {
      await evalcompeProgramacionService.delete(programacionToDelete.id);
      toast({
        title: "Éxito",
        description: "Programación eliminada correctamente",
      });
      loadProgramaciones();
    } catch (error) {
      console.error('Error al eliminar programación:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la programación",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProgramacionToDelete(null);
    }
  };

  // Ver detalle de programación (ejecutar evaluaciones)
  const handleViewProgramacion = (id) => {
    navigate(`/app/evaluacion-competencias/${id}`);
  };

  // Renderizar vista de tarjetas
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProgramaciones.map((programacion) => (
        <Card key={programacion.id} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">{programacion.titulo || programacion.nombre}</CardTitle>
              </div>
              <Badge variant={programacion.estado === 'completada' ? 'default' : 'secondary'}>
                {programacion.estado}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Empleados:</span>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="font-semibold">{programacion.total_empleados || 0}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Fecha Inicio:</strong> {programacion.fecha_inicio ? new Date(programacion.fecha_inicio).toLocaleDateString() : 'No definida'}
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Fecha Fin:</strong> {programacion.fecha_fin ? new Date(programacion.fecha_fin).toLocaleDateString() : 'No definida'}
              </div>
              
              {programacion.descripcion && (
                <div className="text-sm text-gray-600">
                  <strong>Descripción:</strong> {programacion.descripcion.substring(0, 100)}...
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewProgramacion(programacion.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenModal(programacion)}
                >
                  <FileEdit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConfirmDelete(programacion)}
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
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empleados
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Inicio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Fin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProgramaciones.map((programacion) => (
            <tr key={programacion.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">{programacion.titulo || programacion.nombre}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={programacion.estado === 'completada' ? 'default' : 'secondary'}>
                  {programacion.estado}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-green-500 mr-1" />
                  <span>{programacion.total_empleados || 0}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {programacion.fecha_inicio ? new Date(programacion.fecha_inicio).toLocaleDateString() : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {programacion.fecha_fin ? new Date(programacion.fecha_fin).toLocaleDateString() : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewProgramacion(programacion.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenModal(programacion)}
                >
                  <FileEdit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConfirmDelete(programacion)}
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
            Programación de Evaluaciones Grupales
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión de programaciones de evaluaciones de competencias grupales según ISO 9001
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
            Nueva Programación
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar programaciones..."
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
      {filteredProgramaciones.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay programaciones</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando una nueva programación de evaluaciones grupales.
          </p>
          <div className="mt-6">
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Programación
            </Button>
          </div>
        </div>
      ) : (
        viewMode === 'grid' ? renderGridView() : renderTableView()
      )}

      {/* Modal de programación */}
      {modalOpen && (
        <ProgramacionGrupalModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveProgramacion}
          programacion={currentProgramacion}
        />
      )}

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la programación "{programacionToDelete?.titulo || programacionToDelete?.nombre}".
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProgramacion}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProgramacionCompetenciasList; 