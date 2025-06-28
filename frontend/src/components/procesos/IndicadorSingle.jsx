import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import indicadoresService from '@/services/indicadoresService';
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
  const [indicador, setIndicador] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        <div className="space-y-6">
          <Card className="border-l-4 border-teal-500">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{indicador.nombre}</CardTitle>
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
      </main>
    </div>
  );
}
