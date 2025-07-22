import React, { useState, useEffect } from 'react';
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
import { Search, Plus, Grid3X3, Table2, FileEdit, Trash2, Eye, Calendar, Users, Star, User } from 'lucide-react';
import { evaluacionesService } from '@/services/evaluacionesService';
import EvaluacionIndividualModalSimple from './EvaluacionIndividualModalSimple';

const EvaluacionesIndividualesSimple = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvaluacion, setCurrentEvaluacion] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [evaluacionToDelete, setEvaluacionToDelete] = useState(null);

  // Cargar evaluaciones
  const loadEvaluaciones = async () => {
    console.log('🔄 [EvaluacionesSimple] Iniciando carga de evaluaciones...');
    setIsLoading(true);
    try {
      // Por ahora usar datos de ejemplo hasta que el servicio funcione
      const datosEjemplo = [
        {
          id: 1,
          empleado_id: 1,
          empleado_nombre: 'Juan Pérez',
          fecha_evaluacion: '2025-07-20',
          observaciones: 'Evaluación trimestral - Buen desempeño general',
          competencias: [
            { competencia_id: 1, nombre: 'Liderazgo', puntaje: 8 },
            { competencia_id: 2, nombre: 'Comunicación', puntaje: 9 },
            { competencia_id: 3, nombre: 'Trabajo en Equipo', puntaje: 7 }
          ],
          promedio: 8.0,
          fecha_creacion: '2025-07-20 10:30:00'
        },
        {
          id: 2,
          empleado_id: 2,
          empleado_nombre: 'María González',
          fecha_evaluacion: '2025-07-19',
          observaciones: 'Evaluación semestral - Excelente rendimiento',
          competencias: [
            { competencia_id: 1, nombre: 'Liderazgo', puntaje: 9 },
            { competencia_id: 2, nombre: 'Comunicación', puntaje: 10 },
            { competencia_id: 4, nombre: 'Resolución de Problemas', puntaje: 8 }
          ],
          promedio: 9.0,
          fecha_creacion: '2025-07-19 14:15:00'
        },
        {
          id: 3,
          empleado_id: 3,
          empleado_nombre: 'Carlos López',
          fecha_evaluacion: '2025-07-18',
          observaciones: 'Evaluación mensual - Necesita mejorar en algunas áreas',
          competencias: [
            { competencia_id: 2, nombre: 'Comunicación', puntaje: 6 },
            { competencia_id: 3, nombre: 'Trabajo en Equipo', puntaje: 7 },
            { competencia_id: 5, nombre: 'Adaptabilidad', puntaje: 5 }
          ],
          promedio: 6.0,
          fecha_creacion: '2025-07-18 09:45:00'
        }
      ];

      setEvaluaciones(datosEjemplo);
      console.log('✅ [EvaluacionesSimple] Evaluaciones cargadas:', datosEjemplo.length);

      // Intentar cargar desde el servicio (comentado por ahora)
      /*
      const data = await evaluacionesService.getAll();
      console.log('📋 [EvaluacionesSimple] Datos del servicio:', data);
      setEvaluaciones(Array.isArray(data) ? data : []);
      */
      
    } catch (error) {
      console.error('❌ [EvaluacionesSimple] Error al cargar evaluaciones:', error);
      // Mantener datos de ejemplo en caso de error
    } finally {
      setIsLoading(false);
      console.log('✅ [EvaluacionesSimple] Carga finalizada');
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

  // Abrir modal para nueva evaluación
  const handleOpenModal = (evaluacion = null) => {
    setCurrentEvaluacion(evaluacion);
    setModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEvaluacion(null);
  };

  // Guardar evaluación
  const handleSaveEvaluacion = async (evaluacionData) => {
    try {
      console.log('🔄 [EvaluacionesSimple] Guardando evaluación:', evaluacionData);
      
      if (currentEvaluacion) {
        // Actualizar evaluación existente
        const updatedEvaluacion = {
          ...currentEvaluacion,
          ...evaluacionData,
          promedio: evaluacionData.competencias.length > 0 
            ? evaluacionData.competencias.reduce((sum, comp) => sum + comp.puntaje, 0) / evaluacionData.competencias.length 
            : 0
        };
        
        setEvaluaciones(prev => 
          prev.map(evaluacion => evaluacion.id === currentEvaluacion.id ? updatedEvaluacion : evaluacion)
        );
        
        console.log('✅ [EvaluacionesSimple] Evaluación actualizada');
      } else {
        // Crear nueva evaluación
        const newEvaluacion = {
          id: Date.now(), // ID temporal
          ...evaluacionData,
          promedio: evaluacionData.competencias.length > 0 
            ? evaluacionData.competencias.reduce((sum, comp) => sum + comp.puntaje, 0) / evaluacionData.competencias.length 
            : 0,
          fecha_creacion: new Date().toISOString()
        };
        
        setEvaluaciones(prev => [newEvaluacion, ...prev]);
        console.log('✅ [EvaluacionesSimple] Nueva evaluación creada');
      }

      // Aquí se haría la llamada al servicio real
      /*
      if (currentEvaluacion) {
        await evaluacionesService.update(currentEvaluacion.id, evaluacionData);
      } else {
        await evaluacionesService.create(evaluacionData);
      }
      await loadEvaluaciones(); // Recargar datos
      */
      
    } catch (error) {
      console.error('❌ [EvaluacionesSimple] Error al guardar evaluación:', error);
      throw error;
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
      console.log('🔄 [EvaluacionesSimple] Eliminando evaluación:', evaluacionToDelete.id);
      
      // Eliminar de la lista local
      setEvaluaciones(prev => prev.filter(evaluacion => evaluacion.id !== evaluacionToDelete.id));
      
      // Aquí se haría la llamada al servicio real
      /*
      await evaluacionesService.delete(evaluacionToDelete.id);
      await loadEvaluaciones(); // Recargar datos
      */
      
      console.log('✅ [EvaluacionesSimple] Evaluación eliminada');
    } catch (error) {
      console.error('❌ [EvaluacionesSimple] Error al eliminar evaluación:', error);
    } finally {
      setDeleteDialogOpen(false);
      setEvaluacionToDelete(null);
    }
  };

  // Obtener badge de promedio
  const getPromedioBadge = (promedio) => {
    if (promedio >= 8) return <Badge className="bg-green-600">Excelente</Badge>;
    if (promedio >= 6) return <Badge className="bg-yellow-600">Bueno</Badge>;
    if (promedio >= 4) return <Badge className="bg-orange-600">Regular</Badge>;
    return <Badge className="bg-red-600">Necesita Mejora</Badge>;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Renderizar vista de tarjetas
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvaluaciones.map((evaluacion) => (
        <Card key={evaluacion.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-teal-600" />
                <CardTitle className="text-lg text-white">{evaluacion.empleado_nombre}</CardTitle>
              </div>
              {getPromedioBadge(evaluacion.promedio)}
            </div>
            <div className="flex items-center text-slate-400 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(evaluacion.fecha_evaluacion)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-slate-300 text-sm line-clamp-2">
                  {evaluacion.observaciones || 'Sin observaciones'}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Competencias:</span>
                <span className="text-white font-medium">{evaluacion.competencias?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Promedio:</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-white font-medium">{evaluacion.promedio?.toFixed(1) || '0.0'}/10</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => console.log('Ver evaluación:', evaluacion.id)}
                className="text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-white"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenModal(evaluacion)}
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <FileEdit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleConfirmDelete(evaluacion)}
                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Renderizar vista de tabla
  const renderTableView = () => (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Competencias
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Promedio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredEvaluaciones.map((evaluacion) => (
              <tr key={evaluacion.id} className="hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-teal-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-white">
                        {evaluacion.empleado_nombre}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {formatDate(evaluacion.fecha_evaluacion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {evaluacion.competencias?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-white">{evaluacion.promedio?.toFixed(1) || '0.0'}/10</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPromedioBadge(evaluacion.promedio)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => console.log('Ver evaluación:', evaluacion.id)}
                      className="text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenModal(evaluacion)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConfirmDelete(evaluacion)}
                      className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
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
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando evaluaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Evaluaciones Individuales</h1>
          <p className="text-slate-400">Gestión de evaluaciones de competencias individuales</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Evaluación
        </Button>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar evaluaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-teal-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-teal-600 hover:bg-teal-700' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? 'bg-teal-600 hover:bg-teal-700' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
          >
            <Table2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Evaluaciones</p>
                <p className="text-2xl font-bold text-white">{evaluaciones.length}</p>
              </div>
              <Users className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Promedio General</p>
                <p className="text-2xl font-bold text-white">
                  {evaluaciones.length > 0 
                    ? (evaluaciones.reduce((sum, evaluacion) => sum + (evaluacion.promedio || 0), 0) / evaluaciones.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Excelentes</p>
                <p className="text-2xl font-bold text-green-400">
                  {evaluaciones.filter(evaluacion => (evaluacion.promedio || 0) >= 8).length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Necesitan Mejora</p>
                <p className="text-2xl font-bold text-red-400">
                  {evaluaciones.filter(evaluacion => (evaluacion.promedio || 0) < 6).length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal */}
      {filteredEvaluaciones.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No hay evaluaciones</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm ? 'No se encontraron evaluaciones que coincidan con tu búsqueda.' : 'Comienza creando tu primera evaluación individual.'}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => handleOpenModal()}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Evaluación
            </Button>
          )}
        </div>
      ) : (
        viewMode === 'grid' ? renderGridView() : renderTableView()
      )}

      {/* Modal de evaluación */}
      <EvaluacionIndividualModalSimple
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvaluacion}
        evaluacion={currentEvaluacion}
      />

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar evaluación?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Esta acción no se puede deshacer. Se eliminará permanentemente la evaluación de{' '}
              <span className="font-semibold">{evaluacionToDelete?.empleado_nombre}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvaluacion}
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

export default EvaluacionesIndividualesSimple;
