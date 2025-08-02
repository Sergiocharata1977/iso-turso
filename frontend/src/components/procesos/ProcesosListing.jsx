import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Pencil, Trash2, FileText, User, GitBranch, Hash, Workflow, Grid3X3, List, Eye, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedHeader from '@/components/common/UnifiedHeader';
import ProcesoModal from './ProcesoModal';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import procesosService from '@/services/procesosService';

const ProcesoCard = React.memo(({ proceso, onEdit, onDelete, onNavigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col h-full group cursor-pointer overflow-hidden"
    onClick={onNavigate}
  >
    {/* Header con gradiente */}
    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h3 className="font-bold text-lg truncate">{proceso.nombre}</h3>
        </div>
        {proceso.codigo && (
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {proceso.codigo}
          </Badge>
        )}
      </div>
      {proceso.version && (
        <div className="flex items-center gap-1 mt-2 text-emerald-100">
          <GitBranch className="h-3 w-3" />
          <span className="text-xs">v{proceso.version}</span>
        </div>
      )}
    </div>

    {/* Contenido */}
    <CardContent className="flex-grow p-4 space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
        {proceso.descripcion || 'Sin descripción disponible'}
      </p>
      
      <div className="space-y-2">
        {proceso.responsable && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-800 dark:text-gray-200">{proceso.responsable}</span>
            </span>
          </div>
        )}
        
        {proceso.funciones_involucradas && (
          <div className="flex items-center gap-2 text-sm">
            <Workflow className="h-4 w-4 text-purple-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-400 line-clamp-1">
              {proceso.funciones_involucradas}
            </span>
          </div>
        )}

        {/* Stats mini */}
        <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Activo</span>
          </div>
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3" />
            <span>{proceso.id?.slice(-6) || 'N/A'}</span>
          </div>
        </div>
      </div>
    </CardContent>

    {/* Footer con acciones */}
    <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        onClick={(e) => { e.stopPropagation(); onNavigate(); }}
      >
        <Eye className="h-4 w-4 mr-1" />
        Ver
      </Button>
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
          onClick={(e) => { e.stopPropagation(); onEdit(proceso); }}
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
          onClick={(e) => { e.stopPropagation(); onDelete(proceso.id); }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </CardFooter>
  </motion.div>
));

const ProcesoListItem = React.memo(({ proceso, onEdit, onDelete, onNavigate }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:border-emerald-500 transition-all duration-300 cursor-pointer"
    onClick={onNavigate}
  >
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-500" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{proceso.nombre}</h3>
            {proceso.codigo && (
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                {proceso.codigo}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {proceso.responsable && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{proceso.responsable}</span>
            </div>
          )}
          
          {proceso.version && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <GitBranch className="h-4 w-4" />
              <span>v{proceso.version}</span>
            </div>
          )}
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-emerald-600"
              onClick={(e) => { e.stopPropagation(); onNavigate(); }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-emerald-600"
              onClick={(e) => { e.stopPropagation(); onEdit(proceso); }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-red-600"
              onClick={(e) => { e.stopPropagation(); onDelete(proceso.id); }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {proceso.descripcion && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-1">
          {proceso.descripcion}
        </p>
      )}
      
      {proceso.funciones_involucradas && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Workflow className="h-4 w-4" />
          <span>{proceso.funciones_involucradas}</span>
        </div>
      )}
    </div>
  </motion.div>
));

export default function ProcesosListing() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [procesos, setProcesos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProceso, setCurrentProceso] = useState(null);
  const [procesoToDelete, setProcesoToDelete] = useState(null);

  const loadProcesos = async () => {
    try {
      setIsLoading(true);
      const response = await procesosService.getAll();
      console.log('📋 Respuesta completa:', response);
      
      // Extraer el array de datos del response
      const data = Array.isArray(response) ? response : (response.data || []);
      console.log('📋 Procesos extraídos:', data);
      
      setProcesos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error cargando procesos:', error);
      toast({ title: 'Error', description: 'No se pudieron cargar los procesos.', variant: 'destructive' });
      setProcesos([]); // Asegurar que siempre sea un array
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProcesos();
  }, []);

  const handleSave = async (procesoData) => {
    try {
      console.log('💾 Guardando proceso:', procesoData);
      
      const action = currentProceso
        ? procesosService.update(currentProceso.id, procesoData)
        : procesosService.create(procesoData);

      const savedProceso = await action;
      console.log('✅ Proceso guardado:', savedProceso);

      toast({ 
        title: `Proceso ${currentProceso ? 'actualizado' : 'creado'}`, 
        description: `El proceso "${savedProceso.nombre}" se guardó correctamente.`
      });

      await loadProcesos();
      setIsModalOpen(false);
      setCurrentProceso(null);
    } catch (error) {
      console.error('❌ Error guardando proceso:', error);
      toast({ title: 'Error', description: error.message || 'No se pudo guardar el proceso.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('🗑️ Eliminando proceso:', id);
      await procesosService.delete(id);
      toast({ title: 'Proceso eliminado', description: 'El proceso ha sido eliminado correctamente.' });
      await loadProcesos();
      setProcesoToDelete(null);
    } catch (error) {
      console.error('❌ Error eliminando proceso:', error);
      toast({ title: 'Error', description: 'No se pudo eliminar el proceso.', variant: 'destructive' });
    }
  };

  const handleEdit = (proceso) => {
    console.log('✏️ Editando proceso:', proceso);
    setCurrentProceso(proceso);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setProcesoToDelete(id);
  };

  const handleNavigate = (proceso) => {
    console.log('🔍 Navegando a proceso:', proceso);
    navigate(`/procesos/${proceso.id}`);
  };

  const filteredProcesos = useMemo(() => {
    // Asegurar que procesos sea un array antes de filtrar
    if (!Array.isArray(procesos)) {
      console.warn('⚠️ procesos no es un array:', procesos);
      return [];
    }
    
    return procesos.filter(proceso =>
      (proceso.nombre || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (proceso.descripcion || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (proceso.responsable || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (proceso.codigo || '').toLowerCase().includes(searchText.toLowerCase())
    );
  }, [procesos, searchText]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header unificado */}
      <UnifiedHeader
        title="Gestión de Procesos"
        description="Administra los procesos de la organización según ISO 9001"
        icon={FileText}
        searchTerm={searchText}
        onSearchChange={setSearchText}
        onNew={() => { setCurrentProceso(null); setIsModalOpen(true); }}
        newButtonText="Nuevo Proceso"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={filteredProcesos.length}
        lastUpdated="hoy"
        primaryColor="emerald"
        showViewToggle={true}
        showExport={false}
      />

      {/* Contenido */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredProcesos.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            {searchText ? 'No se encontraron procesos' : 'No hay procesos registrados'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {searchText ? 'Intenta con otros términos de búsqueda.' : 'Empieza creando un nuevo proceso para tu organización.'}
          </p>
          {!searchText && (
            <Button variant="outline" className="mt-4" onClick={() => { setCurrentProceso(null); setIsModalOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Crear Primer Proceso
            </Button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProcesos.map(proceso => (
                <ProcesoCard
                  key={proceso.id}
                  proceso={proceso}
                  onEdit={handleEdit}
                  onDelete={confirmDelete}
                  onNavigate={() => handleNavigate(proceso)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProcesos.map(proceso => (
                <ProcesoListItem
                  key={proceso.id}
                  proceso={proceso}
                  onEdit={handleEdit}
                  onDelete={confirmDelete}
                  onNavigate={() => handleNavigate(proceso)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de Proceso */}
      <ProcesoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentProceso(null);
        }}
        onSave={handleSave}
        proceso={currentProceso}
      />

      {/* Dialog de Confirmación para Eliminar */}
      <AlertDialog open={!!procesoToDelete} onOpenChange={() => setProcesoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el proceso y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(procesoToDelete)} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 