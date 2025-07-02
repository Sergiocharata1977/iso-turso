import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Briefcase } from 'lucide-react';
import procesosService from '../../services/procesosService';
import ProcesoModal from './ProcesoModal';
import GenericCard from '../ui/GenericCard';
import ListingHeader from '../common/ListingHeader';
import { useToast } from "@/components/ui/use-toast";

const ProcesosListing = () => {
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProcesos();
  }, []);

  const fetchProcesos = async () => {
    try {
      setLoading(true);
      const data = await procesosService.getAllProcesos();
      setProcesos(data || []);
    } catch (error) {
      setError(error.message);
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los procesos." });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (proceso = null) => {
    setSelectedProceso(proceso);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProceso(null);
  };

  const handleSave = async (procesoData) => {
    try {
      if (selectedProceso) {
        const updatedProceso = await procesosService.updateProceso(selectedProceso.id, procesoData);
        setProcesos(procesos.map(p => p.id === selectedProceso.id ? updatedProceso : p));
        toast({ title: "Éxito", description: "Proceso actualizado correctamente." });
      } else {
        const newProceso = await procesosService.createProceso(procesoData);
        setProcesos([...procesos, newProceso]);
        toast({ title: "Éxito", description: "Proceso creado correctamente." });
      }
      handleCloseModal();
      fetchProcesos(); // Re-fetch all data to ensure consistency
    } catch (error) {
      console.error('Error saving proceso:', error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar el proceso." });
    }
  };

  const handleDelete = async (id) => {
    // e.stopPropagation(); // Stop click from bubbling to the card
    if (window.confirm('¿Estás seguro de que quieres eliminar este proceso?')) {
      try {
        await procesosService.deleteProceso(id);
        toast({ title: "Éxito", description: "Proceso eliminado correctamente." });
        fetchProcesos(); // Re-fetch data after deletion
      } catch (error) {
        console.error('Error deleting proceso:', error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar el proceso." });
      }
    }
  };

  const filteredProcesos = procesos.filter(proceso =>
    proceso.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-4 text-white">Cargando procesos...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <ListingHeader
        title="Gestión de Procesos"
        subtitle="Administra los procesos de la organización"
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onAddNew={() => handleOpenModal()}
        addNewLabel="Nuevo Proceso"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProcesos.map(proceso => (
          <GenericCard
            theme="light"
            key={proceso.id}
            icon={Briefcase}
            title={proceso.nombre}
            description={proceso.descripcion}
            tags={[`Responsable: ${proceso.responsable || 'No asignado'}`]}
            onCardClick={() => navigate(`/procesos/${proceso.id}`)}
            actions={[
              {
                icon: Edit,
                onClick: (e) => { e.stopPropagation(); handleOpenModal(proceso); },
                tooltip: 'Editar Proceso',
              },
              {
                icon: Trash2,
                onClick: (e) => { e.stopPropagation(); handleDelete(proceso.id); },
                tooltip: 'Eliminar Proceso',
              },
            ]}
          />
        ))}
      </div>

      {isModalOpen && (
        <ProcesoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          proceso={selectedProceso}
        />
      )}
    </div>
  );
};

export default ProcesosListing;
