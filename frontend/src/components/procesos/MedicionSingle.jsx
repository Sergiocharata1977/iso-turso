import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import medicionesService from '@/services/medicionesService';
import indicadoresService from '@/services/indicadoresService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, Calendar, User, Hash, FileText, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const InfoCard = ({ icon, title, children, className = "" }) => (
  <Card className={`bg-gray-50 dark:bg-gray-800/50 ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{children}</div>
    </CardContent>
  </Card>
);

export default function MedicionSingle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [medicion, setMedicion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [indicadores, setIndicadores] = useState([]);
  const [showIndicadorSelect, setShowIndicadorSelect] = useState(false);
  const [selectedIndicador, setSelectedIndicador] = useState(null);
  const [isSavingIndicador, setIsSavingIndicador] = useState(false);

  useEffect(() => {
    const fetchMedicion = async () => {
      try {
        setIsLoading(true);
        const data = await medicionesService.getById(id);
        if (data) {
          setMedicion(data);
        } else {
          toast({
            title: 'Medición no encontrada',
            description: 'No se pudo encontrar la medición solicitada. Volviendo al listado.',
            variant: 'destructive',
          });
          navigate('/mediciones');
        }
      } catch (error) {
        toast({
          title: 'Error al cargar la medición',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/mediciones');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMedicion();
      loadIndicadores();
    }
  }, [id]);

  // Cargar indicadores reales
  const loadIndicadores = async () => {
    try {
      const data = await indicadoresService.getAll();
      setIndicadores(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los indicadores",
        variant: "destructive"
      });
    }
  };

  // Guardar indicador seleccionado
  const handleSaveIndicador = async () => {
    if (!selectedIndicador) return;
    setIsSavingIndicador(true);
    try {
      await medicionesService.update(medicion.id, {
        ...medicion,
        indicador_id: selectedIndicador,
        organization_id: user.organization_id
      });
      toast({
        title: "Indicador asignado",
        description: "La relación con el indicador se ha guardado correctamente.",
        variant: "success"
      });
      setShowIndicadorSelect(false);
      // Actualizar la medición local para mostrar el cambio
      const indicadorSeleccionado = indicadores.find(i => i.id == selectedIndicador);
      setMedicion(prev => ({
        ...prev,
        indicador_id: selectedIndicador,
        indicador: indicadorSeleccionado
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar el indicador",
        variant: "destructive"
      });
    } finally {
      setIsSavingIndicador(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div></div>;
  }

  if (!medicion) {
    return <div className="text-center py-10">Medición no encontrada.</div>;
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button onClick={() => navigate('/mediciones')} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-grow">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Detalle de la Medición</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {medicion.indicador?.nombre || 'Indicador no especificado'}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Layout principal: contenido + relaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal (contenido de la medición) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-l-4 border-teal-500">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-teal-500" />
                  Medición #{medicion.id}
                </CardTitle>
                {/* Mostrar indicador actual */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <strong>Indicador:</strong>
                    <span className="ml-2">{medicion.indicador?.nombre || 'No asignado'}</span>
                  </div>
                  {medicion.indicador?.descripcion && (
                    <p className="text-sm text-gray-500 mt-2 ml-6">
                      {medicion.indicador.descripcion}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-teal-600 mb-2">
                    {medicion.valor}
                  </div>
                  <p className="text-gray-600">Valor medido</p>
                  {medicion.indicador?.meta && (
                    <p className="text-sm text-gray-500 mt-2">
                      Meta: {medicion.indicador.meta}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard 
                title="Fecha de Medición" 
                icon={<Calendar className="h-5 w-5 text-blue-500" />}
              >
                {formatDate(medicion.fecha_medicion)}
              </InfoCard>
              <InfoCard 
                title="Responsable" 
                icon={<User className="h-5 w-5 text-orange-500" />}
              >
                {medicion.responsable || 'No especificado'}
              </InfoCard>
            </div>

            {medicion.observaciones && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Observaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {medicion.observaciones}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Información del indicador relacionado */}
            {medicion.indicador && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    Información del Indicador
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Meta</h4>
                    <p className="text-gray-600">{medicion.indicador.meta || 'No definida'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Frecuencia</h4>
                    <p className="text-gray-600">{medicion.indicador.frecuencia || 'No definida'}</p>
                  </div>
                  {medicion.indicador.formula && (
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-700">Fórmula</h4>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono mt-1">
                        {medicion.indicador.formula}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Columna de relaciones */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Relaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {/* Botón para asignar/cambiar indicador */}
                  {!showIndicadorSelect ? (
                    <Button 
                      className="btn-relacion-exclusive w-full" 
                      onClick={() => { 
                        setShowIndicadorSelect(true); 
                        setSelectedIndicador(medicion.indicador_id || ''); 
                      }}
                    >
                      {medicion.indicador ? 'Cambiar Indicador' : 'Asignar Indicador'}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <select 
                        value={selectedIndicador || ''} 
                        onChange={(e) => setSelectedIndicador(e.target.value)} 
                        className="w-full p-2 border rounded"
                      >
                        <option value="" disabled>Seleccione un indicador</option>
                        {indicadores.map((i) => (
                          <option key={i.id} value={i.id}>{i.nombre}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSaveIndicador} 
                          disabled={!selectedIndicador || isSavingIndicador} 
                          className="btn-relacion-exclusive flex-1"
                        >
                          {isSavingIndicador ? 'Guardando...' : 'Guardar'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowIndicadorSelect(false)} 
                          disabled={isSavingIndicador}
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