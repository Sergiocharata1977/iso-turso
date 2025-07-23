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
import UnifiedCard from '@/components/common/UnifiedCard';
import UnifiedHeader from '@/components/common/UnifiedHeader';

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
      const data = await evaluacionesService.getAll();
      console.log('📋 [EvaluacionesSimple] Datos del servicio:', data);
      setEvaluaciones(Array.isArray(data) ? data : []);
      console.log('✅ [EvaluacionesSimple] Evaluaciones cargadas:', Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error('❌ [EvaluacionesSimple] Error al cargar evaluaciones:', error);
      setEvaluaciones([]);
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

      // Llamada al servicio real
      if (currentEvaluacion) {
        await evaluacionesService.update(currentEvaluacion.id, evaluacionData);
      } else {
        await evaluacionesService.create(evaluacionData);
      }
      await loadEvaluaciones(); // Recargar datos
      
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
      
      // Llamada al servicio real
      await evaluacionesService.delete(evaluacionToDelete.id);
      await loadEvaluaciones(); // Recargar datos
      
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

  // Renderizar vista de tarjetas usando UnifiedCard
  const renderGridView = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 h-20"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredEvaluaciones.length === 0) {
      return (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontraron evaluaciones.</p>
          <Button onClick={() => handleOpenModal()} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Crear primera evaluación
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEvaluaciones.map((evaluacion) => {
          const fields = [
            { 
              icon: Calendar, 
              label: "Fecha", 
              value: formatDate(evaluacion.fecha_evaluacion) 
            },
            { 
              icon: Star, 
              label: "Promedio", 
              value: `${evaluacion.promedio?.toFixed(1) || '0.0'}/10` 
            },
            { 
              icon: Users, 
              label: "Competencias", 
              value: `${evaluacion.competencias?.length || 0} evaluadas` 
            }
          ];

          return (
            <UnifiedCard
              key={evaluacion.id}
              title={evaluacion.empleado_nombre}
              subtitle={`ID: ${evaluacion.id}`}
              description={evaluacion.observaciones || 'Sin observaciones'}
              status={evaluacion.promedio >= 8 ? 'Excelente' : evaluacion.promedio >= 6 ? 'Bueno' : evaluacion.promedio >= 4 ? 'Regular' : 'Necesita Mejora'}
              fields={fields}
              icon={User}
              primaryColor="teal"
              onView={() => console.log('Ver evaluación:', evaluacion.id)}
              onEdit={() => handleOpenModal(evaluacion)}
              onDelete={() => handleConfirmDelete(evaluacion)}
            />
          );
        })}
      </div>
    );
  };

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
      {/* Header usando UnifiedHeader */}
      <UnifiedHeader
        title="Evaluaciones Individuales"
        subtitle="Gestión de evaluaciones de competencias individuales"
        searchPlaceholder="Buscar evaluaciones..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNew={() => handleOpenModal()}
        newButtonText="Nueva Evaluación"
        stats={[
          { label: "Total Evaluaciones", value: evaluaciones.length, icon: Users },
          { 
            label: "Promedio General", 
            value: evaluaciones.length > 0 
              ? (evaluaciones.reduce((sum, evaluacion) => sum + (evaluacion.promedio || 0), 0) / evaluaciones.length).toFixed(1)
              : '0.0',
            icon: Star 
          },
          { 
            label: "Excelentes", 
            value: evaluaciones.filter(evaluacion => (evaluacion.promedio || 0) >= 8).length,
            icon: Star 
          },
          { 
            label: "Necesitan Mejora", 
            value: evaluaciones.filter(evaluacion => (evaluacion.promedio || 0) < 6).length,
            icon: User 
          }
        ]}
      />

      {/* Contenido principal */}
      {filteredEvaluaciones.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
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
