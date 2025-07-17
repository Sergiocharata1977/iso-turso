import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Download, Pencil, Trash2, SlidersHorizontal, BarChart3, Target, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedHeader from '@/components/common/UnifiedHeader';
import IndicadorModal from './IndicadorModal';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import indicadoresService from '@/services/indicadoresService';

const IndicadorCard = React.memo(({ indicador, onEdit, onDelete, onNavigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg hover:border-emerald-500 transition-all duration-300 flex flex-col h-full group cursor-pointer"
    onClick={onNavigate}
  >
    <CardHeader>
      <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors duration-300 flex items-center justify-between">
        <span className="truncate">{indicador.nombre}</span>
        {indicador.tipo && (
          <Badge 
            variant={indicador.tipo === 'manual' ? 'default' : 'secondary'}
            className={`ml-2 text-xs ${indicador.tipo === 'manual' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}
          >
            {indicador.tipo}
          </Badge>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-grow space-y-3 text-sm text-gray-600 dark:text-gray-400">
      <p className="line-clamp-2">{indicador.descripcion}</p>
      <div className="flex items-center gap-2 pt-2">
        <Target className="h-4 w-4 text-emerald-500" />
        <span>Meta: <span className="font-semibold text-gray-800 dark:text-gray-200">{indicador.meta}</span></span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-emerald-500" />
        <span>Frecuencia: <span className="font-semibold text-gray-800 dark:text-gray-200">{indicador.frecuencia}</span></span>
      </div>
    </CardContent>
    <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-2">
      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-emerald-600" onClick={(e) => { e.stopPropagation(); onEdit(indicador); }}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(indicador.id); }}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </CardFooter>
  </motion.div>
));

export default function IndicadoresListing() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [indicadores, setIndicadores] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndicador, setCurrentIndicador] = useState(null);
  const [indicadorToDelete, setIndicadorToDelete] = useState(null);

  const loadIndicadores = async () => {
    try {
      setIsLoading(true);
      const data = await indicadoresService.getAll();
      setIndicadores(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar los indicadores.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIndicadores();
  }, []);

  const handleSave = async (indicadorData) => {
    try {
      const action = currentIndicador
        ? indicadoresService.update(currentIndicador.id, indicadorData)
        : indicadoresService.create(indicadorData);

      const savedIndicador = await action;

      toast({ 
        title: `Indicador ${currentIndicador ? 'actualizado' : 'creado'}`, 
        description: `El indicador "${savedIndicador.nombre}" se guardó correctamente.`
      });

      await loadIndicadores();
      setIsModalOpen(false);
      setCurrentIndicador(null);
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'No se pudo guardar el indicador.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await indicadoresService.delete(id);
      toast({ title: 'Indicador eliminado', description: 'El indicador ha sido eliminado correctamente.' });
      await loadIndicadores();
      setIndicadorToDelete(null);
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el indicador.', variant: 'destructive' });
    }
  };

  const handleEdit = (indicador) => {
    setCurrentIndicador(indicador);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setIndicadorToDelete(id);
  };

  const handleNavigate = (indicador) => {
    if (indicador.tipo === 'manual') {
      navigate(`/indicadores/${indicador.id}`);
    } else {
      toast({
        title: 'Indicador Calculado',
        description: 'La vista detallada para indicadores calculados aún no está implementada.',
      });
    }
  };

  const filteredIndicadores = useMemo(() => 
    indicadores.filter(indicador =>
      indicador.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      indicador.descripcion.toLowerCase().includes(searchText.toLowerCase()) ||
      indicador.responsable.toLowerCase().includes(searchText.toLowerCase())
    ), [indicadores, searchText]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header unificado */}
      <UnifiedHeader
        title="Indicadores de Calidad"
        description="Gestiona y monitorea todos los indicadores clave de la organización, según ISO 9001"
        icon={BarChart3}
        searchTerm={searchText}
        onSearchChange={setSearchText}
        onNew={() => { setCurrentIndicador(null); setIsModalOpen(true); }}
        newButtonText="Nuevo Indicador"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={filteredIndicadores.length}
        lastUpdated="hoy"
        primaryColor="emerald"
        showViewToggle={true}
        showExport={false}
      />

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>
      ) : filteredIndicadores.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No se encontraron indicadores</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Empieza creando un nuevo indicador de calidad.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setCurrentIndicador(null); setIsModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Crear Indicador
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIndicadores.map(indicador => (
            <IndicadorCard
              key={indicador.id}
              indicador={indicador}
              onEdit={handleEdit}
              onDelete={confirmDelete}
              onNavigate={() => handleNavigate(indicador)}
            />
          ))}
        </div>
      )}

      {/* Modal de Indicador */}
      <IndicadorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentIndicador(null);
        }}
        onSave={handleSave}
        indicador={currentIndicador}
      />

      {/* Dialog de Confirmación para Eliminar */}
      <AlertDialog open={!!indicadorToDelete} onOpenChange={() => setIndicadorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el indicador y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(indicadorToDelete)} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
