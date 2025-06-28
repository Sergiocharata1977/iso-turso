import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import normasService from '../../services/normasService';

const NormaSingleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [norma, setNorma] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNorma = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await normasService.getNormaById(id);
      setNorma(data);
    } catch (err) {
      setError('No se pudo cargar la norma. Por favor, intente de nuevo más tarde.');
      toast({
        variant: 'destructive',
        title: 'Error de Carga',
        description: 'No se pudo obtener los detalles de la norma.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchNorma();
  }, [fetchNorma]);

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
        <Button onClick={() => navigate('/normas')} className="mt-4">Volver al Listado</Button>
      </div>
    );
  }

  if (!norma) {
    return <div className="p-6 text-center">No se encontró la norma.</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/normas')} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Puntos de Norma
          </Button>
        </div>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-white">
                <CardTitle className="text-2xl lg:text-3xl font-bold flex items-center">
                  <FileText className="h-8 w-8 mr-3 opacity-90" />
                  {norma.titulo}
                </CardTitle>
                <p className="text-sm opacity-90 mt-1">Punto de Control ISO 9001:2015</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Código del Punto</h3>
                    <p className="text-xl font-bold text-teal-600">{norma.codigo}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Título</h3>
                    <p className="text-lg font-semibold text-gray-800">{norma.titulo}</p>
                  </div>
                </div>
                
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-teal-700 mb-2 flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Información
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Norma:</span> ISO 9001:2015</p>
                    <p><span className="font-medium">Tipo:</span> Punto de Control</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{norma.descripcion}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Punto de Control</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-slate-700 leading-relaxed italic">
                    {norma.observaciones || 'No hay observaciones adicionales para este punto de control.'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NormaSingleView;
