import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Download, Pencil, Trash2, SlidersHorizontal, TrendingUp, Calendar, User, Target, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedHeader from '@/components/common/UnifiedHeader';
import MedicionModal from './MedicionModal';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import medicionesService from '@/services/medicionesService';

/**
 * Card componente para mostrar cada medición individual
 * Incluye información del indicador, valor, fecha y acciones
 */
const MedicionCard = React.memo(({ medicion, onEdit, onDelete }) => {
  // Determinar si la medición cumple con la meta
  const cumpleMeta = medicion.valor >= (medicion.meta || 0);
  
  // Formatear fecha para mostrar
  const fechaFormateada = new Date(medicion.fecha_medicion).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg hover:border-emerald-500 transition-all duration-300 flex flex-col h-full group"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors duration-300 flex items-center justify-between">
          <span className="truncate">{medicion.indicador_nombre || 'Sin indicador'}</span>
          <Badge 
            variant={cumpleMeta ? 'default' : 'secondary'}
            className={`ml-2 text-xs ${cumpleMeta ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
          >
            {cumpleMeta ? '✓ Cumple' : '✗ No cumple'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span>Valor: <span className="font-semibold text-gray-800 dark:text-gray-200">{medicion.valor}</span></span>
          {medicion.meta && (
            <span className="text-muted-foreground">
              (Meta: {medicion.meta})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-500" />
          <span>Fecha: <span className="font-semibold text-gray-800 dark:text-gray-200">{fechaFormateada}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-emerald-500" />
          <span>Responsable: <span className="font-semibold text-gray-800 dark:text-gray-200">{medicion.responsable || 'No asignado'}</span></span>
        </div>
        {medicion.observaciones && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            {medicion.observaciones}
          </p>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-2">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-emerald-600" onClick={() => onEdit(medicion)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600" onClick={() => onDelete(medicion.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </motion.div>
  );
});

/**
 * Componente de lista para mostrar mediciones en formato de tabla
 */
const MedicionListItem = React.memo(({ medicion, onEdit, onDelete }) => {
  const cumpleMeta = medicion.valor >= (medicion.meta || 0);
  
  const fechaFormateada = new Date(medicion.fecha_medicion).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:border-emerald-500 transition-all duration-300"
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{medicion.indicador_nombre || 'Sin indicador'}</h3>
              <Badge 
                variant={cumpleMeta ? 'default' : 'secondary'}
                className={`ml-2 text-xs ${cumpleMeta ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
              >
                {cumpleMeta ? '✓ Cumple' : '✗ No cumple'}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Target className="h-4 w-4" />
              <span>{medicion.valor}{medicion.meta && ` / ${medicion.meta}`}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{fechaFormateada}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{medicion.responsable || 'No asignado'}</span>
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-emerald-600"
                onClick={() => onEdit(medicion)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-red-600"
                onClick={() => onDelete(medicion.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {medicion.observaciones && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-1">
            {medicion.observaciones}
          </p>
        )}
      </div>
    </motion.div>
  );
});

/**
 * Componente principal para el listado de mediciones
 * Gestiona la visualización, búsqueda, creación, edición y eliminación de mediciones
 */
export default function MedicionesListing() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Estados principales
  const [isLoading, setIsLoading] = useState(true);
  const [mediciones, setMediciones] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMedicion, setCurrentMedicion] = useState(null);
  const [medicionToDelete, setMedicionToDelete] = useState(null);

  /**
   * Carga todas las mediciones desde el servicio
   */
  const loadMediciones = async () => {
    try {
      setIsLoading(true);
      const response = await medicionesService.getAll();
      const data = Array.isArray(response) ? response : (response.data || []);
      setMediciones(data);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'No se pudieron cargar las mediciones.', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMediciones();
  }, []);

  /**
   * Maneja el guardado de mediciones (crear/editar)
   */
  const handleSave = async (medicionData) => {
    try {
      const action = currentMedicion
        ? medicionesService.update(currentMedicion.id, medicionData)
        : medicionesService.create(medicionData);

      const savedMedicion = await action;

      toast({ 
        title: `Medición ${currentMedicion ? 'actualizada' : 'creada'}`, 
        description: `La medición se guardó correctamente.`,
        className: 'bg-emerald-50 border-emerald-200 text-emerald-800'
      });

      await loadMediciones();
      setIsModalOpen(false);
      setCurrentMedicion(null);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message || 'No se pudo guardar la medición.', 
        variant: 'destructive' 
      });
    }
  };

  /**
   * Maneja la eliminación de mediciones
   */
  const handleDelete = async (id) => {
    try {
      await medicionesService.delete(id);
      toast({ 
        title: 'Medición eliminada', 
        description: 'La medición ha sido eliminada correctamente.',
        className: 'bg-emerald-50 border-emerald-200 text-emerald-800'
      });
      await loadMediciones();
      setMedicionToDelete(null);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'No se pudo eliminar la medición.', 
        variant: 'destructive' 
      });
    }
  };

  /**
   * Abre el modal para editar una medición
   */
  const handleEdit = (medicion) => {
    setCurrentMedicion(medicion);
    setIsModalOpen(true);
  };

  /**
   * Confirma la eliminación de una medición
   */
  const confirmDelete = (id) => {
    setMedicionToDelete(id);
  };

  /**
   * Filtrado de mediciones basado en texto de búsqueda
   */
  const filteredMediciones = useMemo(() => 
    mediciones.filter(medicion =>
      (medicion.indicador_nombre || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (medicion.responsable || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (medicion.observaciones || '').toLowerCase().includes(searchText.toLowerCase()) ||
      medicion.valor.toString().includes(searchText)
    ), [mediciones, searchText]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header unificado */}
      <UnifiedHeader
        title="Mediciones de Indicadores"
        description="Registra y monitorea las mediciones de todos los indicadores de calidad, según ISO 9001"
        icon={Activity}
        searchTerm={searchText}
        onSearchChange={setSearchText}
        onNew={() => { setCurrentMedicion(null); setIsModalOpen(true); }}
        newButtonText="Nueva Medición"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={filteredMediciones.length}
        lastUpdated="hoy"
        primaryColor="emerald"
        showViewToggle={true}
        showExport={false}
      />

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredMediciones.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron mediciones
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Empieza registrando una nueva medición para un indicador.
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => { setCurrentMedicion(null); setIsModalOpen(true); }}
          >
            <Plus className="h-4 w-4 mr-2" /> Crear Medición
          </Button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMediciones.map(medicion => (
                <MedicionCard
                  key={medicion.id}
                  medicion={medicion}
                  onEdit={handleEdit}
                  onDelete={confirmDelete}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMediciones.map(medicion => (
                <MedicionListItem
                  key={medicion.id}
                  medicion={medicion}
                  onEdit={handleEdit}
                  onDelete={confirmDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de Medición */}
      <MedicionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        medicion={currentMedicion}
      />

      {/* Dialog de Confirmación de Eliminación */}
      <AlertDialog open={!!medicionToDelete} onOpenChange={(open) => !open && setMedicionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar esta medición?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La medición será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMedicionToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDelete(medicionToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 