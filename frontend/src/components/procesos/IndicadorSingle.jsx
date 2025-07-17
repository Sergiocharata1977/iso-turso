import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import indicadoresService from '@/services/indicadoresService';
import objetivosCalidadService from '@/services/objetivosCalidadService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Target, Calendar, User, Hash, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const InfoCard = ({ icon, title, children }) => (
  <Card className="bg-gray-50 dark:bg-gray-800/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{children}</div>
    </CardContent>
  </Card>
);

export default function IndicadorSingle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [indicador, setIndicador] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [objetivos, setObjetivos] = useState([]);
  const [showObjetivoSelect, setShowObjetivoSelect] = useState(false);
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [isSavingObjetivo, setIsSavingObjetivo] = useState(false);

  useEffect(() => {
    const fetchIndicador = async () => {
      try {
        setIsLoading(true);
        const data = await indicadoresService.getById(id);
        if (data) {
          setIndicador(data);
        } else {
          toast({
            title: 'Indicador no encontrado',
            description: 'No se pudo encontrar el indicador solicitado. Volviendo al listado.',
            variant: 'destructive',
          });
          navigate('/indicadores');
        }
      } catch (error) {
        toast({
          title: 'Error al cargar el indicador',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/indicadores');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchIndicador();
      loadObjetivos();
    }
  }, [id]);

  // Cargar objetivos de calidad reales
  const loadObjetivos = async () => {
    try {
      const data = await objetivosCalidadService.getAll();
      setObjetivos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los objetivos de calidad",
        variant: "destructive"
      });
    }
  };

  // Guardar objetivo de calidad seleccionado
  const handleSaveObjetivo = async () => {
    if (!selectedObjetivo) return;
    setIsSavingObjetivo(true);
    try {
      await indicadoresService.update(indicador.id, {
        ...indicador,
        objetivo_calidad_id: selectedObjetivo,
        organization_id: user.organization_id
      });
      toast({
        title: "Objetivo asignado",
        description: "La relación con el objetivo de calidad se ha guardado correctamente.",
        variant: "success"
      });
      setShowObjetivoSelect(false);
      // Actualizar el indicador local para mostrar el cambio
      const objetivoSeleccionado = objetivos.find(o => o.id == selectedObjetivo);
      setIndicador(prev => ({
        ...prev,
        objetivo_calidad_id: selectedObjetivo,
        objetivo_calidad: objetivoSeleccionado
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar el objetivo de calidad",
        variant: "destructive"
      });
    } finally {
      setIsSavingObjetivo(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div></div>;
  }

  if (!indicador) {
    return <div className="text-center py-10">Indicador no encontrado.</div>;
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button onClick={() => navigate('/indicadores')} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-grow">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Detalle del Indicador</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{indicador.nombre}</p>
          </div>
          <Button onClick={() => navigate(`/indicadores/${id}/mediciones`)} className="bg-teal-600 hover:bg-teal-700 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Ver Mediciones
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Layout principal: contenido + relaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal (contenido del indicador) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-l-4 border-teal-500">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{indicador.nombre}</CardTitle>
                {/* Mostrar objetivo de calidad actual */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-gray-600">
                    <Target className="w-4 h-4 mr-2" />
                    <strong>Objetivo de Calidad:</strong>
                    <span className="ml-2">{indicador.objetivo_calidad?.descripcion || 'No asignado'}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">{indicador.descripcion}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard title="Meta del Indicador" icon={<Target className="h-5 w-5 text-teal-500" />}>
                {indicador.meta}
              </InfoCard>
              <InfoCard title="Frecuencia" icon={<Calendar className="h-5 w-5 text-blue-500" />}>
                {indicador.frecuencia}
              </InfoCard>
              <InfoCard title="Responsable" icon={<User className="h-5 w-5 text-orange-500" />}>
                {indicador.responsable}
              </InfoCard>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Fórmula de Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
                  {indicador.formula}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Columna de relaciones */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Relaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {/* Botón para asignar/cambiar objetivo de calidad */}
                  {!showObjetivoSelect ? (
                    <Button 
                      className="btn-relacion-exclusive w-full" 
                      onClick={() => { 
                        setShowObjetivoSelect(true); 
                        setSelectedObjetivo(indicador.objetivo_calidad_id || ''); 
                      }}
                    >
                      {indicador.objetivo_calidad ? 'Cambiar Objetivo' : 'Asignar Objetivo'}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <select 
                        value={selectedObjetivo || ''} 
                        onChange={(e) => setSelectedObjetivo(e.target.value)} 
                        className="w-full p-2 border rounded"
                      >
                        <option value="" disabled>Seleccione un objetivo de calidad</option>
                        {objetivos.map((o) => (
                          <option key={o.id} value={o.id}>{o.descripcion}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSaveObjetivo} 
                          disabled={!selectedObjetivo || isSavingObjetivo} 
                          className="btn-relacion-exclusive flex-1"
                        >
                          {isSavingObjetivo ? 'Guardando...' : 'Guardar'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowObjetivoSelect(false)} 
                          disabled={isSavingObjetivo}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* Aquí se pueden agregar más relaciones en el futuro */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
