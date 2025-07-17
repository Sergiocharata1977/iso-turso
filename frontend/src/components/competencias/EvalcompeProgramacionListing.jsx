import { useState, useEffect } from 'react';
import evalcompeProgramacionService from '@/services/evalcompeProgramacionService';
import competenciasService from '@/services/competenciasService';
import personalService from '@/services/personalService';
import { usuariosService } from '@/services/usuariosService';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Plus, AlertCircle } from 'lucide-react';
import ProgramarEvaluacionCompetenciaModal from './ProgramarEvaluacionCompetenciaModal';

const ORGANIZATION_ID = window.localStorage.getItem('organization_id') || 1;

const EvalcompeProgramacionListing = () => {
  const [programaciones, setProgramaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgramacion, setSelectedProgramacion] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [evaluadores, setEvaluadores] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProgramaciones();
    fetchAuxData();
  }, []);

  const fetchProgramaciones = async () => {
    try {
      setLoading(true);
      const data = await evalcompeProgramacionService.getAll(ORGANIZATION_ID);
      if (!Array.isArray(data)) {
        setError('La respuesta del servidor no es un array');
        setProgramaciones([]);
        return;
      }
      setProgramaciones(data);
    } catch (error) {
      setError(error.message);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar el listado de programaciones de evaluaciones de competencias.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAuxData = async () => {
    try {
      const [personasData, competenciasData, evaluadoresData] = await Promise.all([
        personalService.getAllPersonal(),
        competenciasService.getAll(ORGANIZATION_ID),
        usuariosService.getAll()
      ]);
      setPersonas(Array.isArray(personasData) ? personasData : (personasData.data || []));
      setCompetencias(Array.isArray(competenciasData) ? competenciasData : (competenciasData.data || []));
      setEvaluadores(Array.isArray(evaluadoresData) ? evaluadoresData : (evaluadoresData.data || []));
    } catch (error) {
      console.error('Error cargando datos auxiliares:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar personas, competencias o evaluadores.' });
    }
  };

  const handleOpenModal = (programacion = null) => {
    setSelectedProgramacion(programacion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgramacion(null);
  };

  const handleSave = async (programacionData) => {
    try {
      if (selectedProgramacion) {
        await evalcompeProgramacionService.update(selectedProgramacion.id, programacionData);
        toast({ title: 'Éxito', description: 'Programación actualizada correctamente.' });
      } else {
        await evalcompeProgramacionService.create({ ...programacionData, organization_id: ORGANIZATION_ID });
        toast({ title: 'Éxito', description: 'Programación creada correctamente.' });
      }
      handleCloseModal();
      fetchProgramaciones();
    } catch (error) {
      console.error('[EvalcompeProgramacionListing] Error al guardar:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'No se pudo guardar la programación.' });
    }
  };

  const handleDelete = async (programacion) => {
    if (!programacion?.id) return;
    if (window.confirm('¿Estás seguro de que quieres eliminar esta programación?')) {
      try {
        await evalcompeProgramacionService.delete(programacion.id);
        toast({ title: 'Éxito', description: 'Programación eliminada correctamente.' });
        fetchProgramaciones();
      } catch (error) {
        console.error('[EvalcompeProgramacionListing] Error al eliminar:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar la programación.' });
      }
    }
  };

  const filteredProgramaciones = programaciones.filter(p =>
    (p.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando programaciones de evaluaciones de competencias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProgramaciones}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Programaciones de Evaluaciones de Competencias</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar programación..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva programación
          </Button>
        </div>
      </div>
      {filteredProgramaciones.length === 0 ? (
        <div className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontraron programaciones de evaluaciones de competencias.</p>
          <Button onClick={() => handleOpenModal()} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Agregar primera programación
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProgramaciones.map((programacion) => (
            <Card key={programacion.id} className="hover:shadow-md transition-shadow flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-base font-semibold">{programacion.nombre || 'Sin nombre'}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{programacion.descripcion || 'Sin descripción'}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => handleOpenModal(programacion)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(programacion)}>Eliminar</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ProgramarEvaluacionCompetenciaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        personas={personas}
        competencias={competencias}
        evaluadores={evaluadores}
      />
    </div>
  );
};

export default EvalcompeProgramacionListing; 