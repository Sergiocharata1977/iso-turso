import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Pencil, Trash2, FileText, Target, Map, Users, Eye, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedHeader from '@/components/common/UnifiedHeader';
import PoliticaCalidadModal from './PoliticaCalidadModal';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import politicaCalidadService from '@/services/politicaCalidadService';

const PoliticaCalidadCard = React.memo(({ politica, onEdit, onDelete, onNavigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col h-full group cursor-pointer overflow-hidden"
    onClick={onNavigate}
  >
    {/* Header con gradiente */}
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <h3 className="font-bold text-lg truncate">{politica.nombre}</h3>
        </div>
        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
          {politica.estado || 'Activo'}
        </Badge>
      </div>
      {politica.created_at && (
        <div className="flex items-center gap-1 mt-2 text-blue-100">
          <Calendar className="h-3 w-3" />
          <span className="text-xs">{new Date(politica.created_at).toLocaleDateString()}</span>
        </div>
      )}
    </div>

    {/* Contenido */}
    <CardContent className="p-4 flex-1">
      <div className="space-y-3">
        {/* Política de Calidad */}
        {politica.politica_calidad && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Target className="h-4 w-4 text-blue-500" />
              Política de Calidad
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {politica.politica_calidad}
            </p>
          </div>
        )}

        {/* Alcance */}
        {politica.alcance && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText className="h-4 w-4 text-green-500" />
              Alcance
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {politica.alcance}
            </p>
          </div>
        )}

        {/* Mapa de Procesos */}
        {politica.mapa_procesos && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Map className="h-4 w-4 text-purple-500" />
              Mapa de Procesos
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {politica.mapa_procesos}
            </p>
          </div>
        )}

        {/* Organigrama */}
        {politica.organigrama && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Users className="h-4 w-4 text-orange-500" />
              Organigrama
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {politica.organigrama}
            </p>
          </div>
        )}
      </div>
    </CardContent>

    {/* Footer con acciones */}
    <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            Ver
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex items-center gap-1"
          >
            <Pencil className="h-3 w-3" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Eliminar
          </Button>
        </div>
      </div>
    </CardFooter>
  </motion.div>
));

const PoliticaCalidadListItem = React.memo(({ politica, onEdit, onDelete, onNavigate }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 cursor-pointer"
    onClick={onNavigate}
  >
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{politica.nombre}</h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {politica.estado || 'Activo'}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-3 space-y-2">
        {politica.politica_calidad && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Target className="h-4 w-4" />
            <span className="line-clamp-1">{politica.politica_calidad}</span>
          </div>
        )}
        {politica.alcance && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="h-4 w-4" />
            <span className="line-clamp-1">{politica.alcance}</span>
          </div>
        )}
        {politica.mapa_procesos && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Map className="h-4 w-4" />
            <span className="line-clamp-1">{politica.mapa_procesos}</span>
          </div>
        )}
        {politica.organigrama && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span className="line-clamp-1">{politica.organigrama}</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
));

export default function PoliticaCalidadListing() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [politicas, setPoliticas] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPolitica, setCurrentPolitica] = useState(null);
  const [politicaToDelete, setPoliticaToDelete] = useState(null);

  const loadPoliticas = async () => {
    try {
      setIsLoading(true);
      const response = await politicaCalidadService.getAllSafe();
      console.log('📋 Respuesta completa:', response);
      
      // Extraer el array de datos del response de axios
      const data = response.data || response;
      console.log('📋 Políticas extraídas:', data);
      
      setPoliticas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error cargando políticas de calidad:', error);
      toast({ title: 'Error', description: 'No se pudieron cargar las políticas de calidad.', variant: 'destructive' });
      setPoliticas([]); // Asegurar que siempre sea un array
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPoliticas();
  }, []);

  const handleSave = async (politicaData) => {
    try {
      console.log('💾 Guardando política de calidad:', politicaData);
      
      const action = currentPolitica
        ? politicaCalidadService.updateSafe(currentPolitica.id, politicaData)
        : politicaCalidadService.createSafe(politicaData);

      const savedPolitica = await action;
      console.log('✅ Política de calidad guardada:', savedPolitica);

      toast({ 
        title: `Política de calidad ${currentPolitica ? 'actualizada' : 'creada'}`, 
        description: `La política "${savedPolitica.nombre}" se guardó correctamente.`
      });

      await loadPoliticas();
      setIsModalOpen(false);
      setCurrentPolitica(null);
    } catch (error) {
      console.error('❌ Error guardando política de calidad:', error);
      toast({ title: 'Error', description: error.message || 'No se pudo guardar la política de calidad.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('🗑️ Eliminando política de calidad:', id);
      await politicaCalidadService.deleteSafe(id);
      toast({ title: 'Política de calidad eliminada', description: 'La política de calidad ha sido eliminada correctamente.' });
      await loadPoliticas();
      setPoliticaToDelete(null);
    } catch (error) {
      console.error('❌ Error eliminando política de calidad:', error);
      toast({ title: 'Error', description: 'No se pudo eliminar la política de calidad.', variant: 'destructive' });
    }
  };

  const handleEdit = (politica) => {
    console.log('✏️ Editando política de calidad:', politica);
    setCurrentPolitica(politica);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setPoliticaToDelete(id);
  };

  const handleNavigate = (politica) => {
    console.log('🔍 Navegando a política de calidad:', politica);
    navigate(`/politica-calidad/${politica.id}`);
  };

  const filteredPoliticas = useMemo(() => {
    // Asegurar que politicas sea un array antes de filtrar
    if (!Array.isArray(politicas)) {
      console.warn('⚠️ politicas no es un array:', politicas);
      return [];
    }
    
    return politicas.filter(politica =>
      (politica.nombre || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (politica.politica_calidad || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (politica.alcance || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (politica.mapa_procesos || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (politica.organigrama || '').toLowerCase().includes(searchText.toLowerCase())
    );
  }, [politicas, searchText]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header unificado */}
      <UnifiedHeader
        title="Gestión de Políticas de Calidad"
        description="Administra las políticas de calidad de la organización según ISO 9001"
        icon={Target}
        searchTerm={searchText}
        onSearchChange={setSearchText}
        onNew={() => { setCurrentPolitica(null); setIsModalOpen(true); }}
        newButtonText="Nueva Política"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={filteredPoliticas.length}
        lastUpdated="hoy"
        primaryColor="blue"
        showViewToggle={true}
        showExport={false}
      />

      {/* Contenido */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando políticas de calidad...</p>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPoliticas.map(politica => (
                <PoliticaCalidadCard
                  key={politica.id}
                  politica={politica}
                  onEdit={() => handleEdit(politica)}
                  onDelete={() => confirmDelete(politica.id)}
                  onNavigate={() => handleNavigate(politica)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPoliticas.map(politica => (
                <PoliticaCalidadListItem
                  key={politica.id}
                  politica={politica}
                  onEdit={() => handleEdit(politica)}
                  onDelete={() => confirmDelete(politica.id)}
                  onNavigate={() => handleNavigate(politica)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de Política de Calidad */}
      <PoliticaCalidadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentPolitica(null);
        }}
        onSave={handleSave}
        politica={currentPolitica}
      />

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={!!politicaToDelete} onOpenChange={() => setPoliticaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la política de calidad.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(politicaToDelete)}
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