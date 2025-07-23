import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { evaluacionesService } from '@/services/evaluacionesService';
import EvaluacionesIndividualesList from './EvaluacionesIndividualesList';
import EvaluacionIndividualModal from './EvaluacionIndividualModal';

const EvaluacionesIndividualesPage = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);
  const { toast } = useToast();

  const loadEvaluaciones = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔄 [EvaluacionesPage] Cargando evaluaciones...');
      const data = await evaluacionesService.getAll();
      console.log('📋 [EvaluacionesPage] Evaluaciones cargadas:', data);
      setEvaluaciones(data || []);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar las evaluaciones. Intente de nuevo más tarde.');
      console.error('❌ [EvaluacionesPage] Error:', err);
      // Removemos toast de aquí para evitar el bucle infinito
    } finally {
      setIsLoading(false);
    }
  }, []); // Sin dependencias

  useEffect(() => {
    loadEvaluaciones();
  }, [loadEvaluaciones]);

  const handleOpenModal = (evaluacion = null) => {
    setSelectedEvaluacion(evaluacion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvaluacion(null);
  };

  const handleSave = async (data) => {
    try {
      if (selectedEvaluacion) {
        await evaluacionesService.update(selectedEvaluacion.id, data);
        toast({ title: 'Éxito', description: 'Evaluación actualizada correctamente.' });
      } else {
        await evaluacionesService.create(data);
        toast({ title: 'Éxito', description: 'Evaluación creada correctamente.' });
      }
      loadEvaluaciones();
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar la evaluación:', err);
      toast({ title: 'Error', description: `No se pudo guardar: ${err.message}`, variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta evaluación?')) {
      try {
        await evaluacionesService.delete(id);
        toast({ title: 'Éxito', description: 'Evaluación eliminada correctamente.' });
        loadEvaluaciones();
      } catch (err) {
        console.error('Error al eliminar la evaluación:', err);
        toast({ title: 'Error', description: `No se pudo eliminar: ${err.message}`, variant: 'destructive' });
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-900 text-white min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Evaluaciones Individuales</h1>
        <Button onClick={() => handleOpenModal()} className="bg-teal-600 hover:bg-teal-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Evaluación
        </Button>
      </header>

      <main>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-semibold">Error al cargar los datos</p>
            <p className="text-slate-400">{error}</p>
          </div>
        ) : (
          <EvaluacionesIndividualesList 
            evaluaciones={evaluaciones}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            onView={handleOpenModal} // Puede ser una vista detallada en el futuro
          />
        )}
      </main>

      {isModalOpen && (
        <EvaluacionIndividualModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          evaluacion={selectedEvaluacion}
        />
      )}
    </div>
  );
};

export default EvaluacionesIndividualesPage;
