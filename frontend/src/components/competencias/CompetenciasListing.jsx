import { useState, useEffect } from 'react';
import competenciasService from '@/services/competenciasService';
import CompetenciaModal from './CompetenciaModal';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, AlertCircle, CheckCircle, Clock, Award, Plus } from 'lucide-react';

// TODO: Reemplazar por el hook real de autenticación/organización
const ORGANIZATION_ID = window.localStorage.getItem('organization_id') || 1;

const CompetenciasListing = () => {
  // Estados principales
  const [competencias, setCompetencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompetencia, setSelectedCompetencia] = useState(null);
  const { toast } = useToast();

  // Cargar competencias al montar
  useEffect(() => {
    fetchCompetencias();
  }, []);

  // Función para obtener competencias del servicio
  const fetchCompetencias = async () => {
    try {
      setLoading(true);
      const data = await competenciasService.getAll(ORGANIZATION_ID);
      console.log('[CompetenciasListing] Datos recibidos:', data);
      if (!Array.isArray(data)) {
        setError('La respuesta del servidor no es un array');
        setCompetencias([]);
        return;
      }
      setCompetencias(data);
    } catch (error) {
      setError(error.message);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar el listado de competencias.' });
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para crear/editar
  const handleOpenModal = (competencia = null) => {
    setSelectedCompetencia(competencia);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompetencia(null);
  };

  // Guardar competencia (alta/modificación)
  const handleSave = async (competenciaData) => {
    try {
      if (selectedCompetencia) {
        await competenciasService.update(selectedCompetencia.id, competenciaData);
        toast({ title: 'Éxito', description: 'Competencia actualizada correctamente.' });
      } else {
        await competenciasService.create({ ...competenciaData, organization_id: ORGANIZATION_ID });
        toast({ title: 'Éxito', description: 'Competencia creada correctamente.' });
      }
      handleCloseModal();
      fetchCompetencias();
    } catch (error) {
      console.error('[CompetenciasListing] Error al guardar:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'No se pudo guardar la competencia.' });
    }
  };

  // Eliminar competencia
  const handleDelete = async (competencia) => {
    if (!competencia?.id) return;
    if (window.confirm('¿Estás seguro de que quieres eliminar esta competencia?')) {
      try {
        await competenciasService.delete(competencia.id);
        toast({ title: 'Éxito', description: 'Competencia eliminada correctamente.' });
        fetchCompetencias();
      } catch (error) {
        console.error('[CompetenciasListing] Error al eliminar:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar la competencia.' });
      }
    }
  };

  // Filtrado por búsqueda
  const filteredCompetencias = competencias.filter(c =>
    (c.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renderizado de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando competencias...</p>
        </div>
      </div>
    );
  }

  // Renderizado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCompetencias}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Renderizado de listado vacío
  if (filteredCompetencias.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No se encontraron competencias.</p>
        <Button onClick={() => handleOpenModal()} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Agregar primera competencia
        </Button>
      </div>
    );
  }

  // Renderizado principal (cards)
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión de Competencias</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar competencia..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva competencia
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCompetencias.map((competencia) => (
          <Card key={competencia.id} className="hover:shadow-md transition-shadow flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{competencia.nombre || 'Sin nombre'}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{competencia.descripcion || 'Sin descripción'}</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => handleOpenModal(competencia)}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(competencia)}>Eliminar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <CompetenciaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        competencia={selectedCompetencia}
        onSave={handleSave}
      />
    </div>
  );
};

export default CompetenciasListing; 