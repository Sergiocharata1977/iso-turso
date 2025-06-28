import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import procesosService from '@/services/procesosService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Hash, GitBranch, Users, Target, Maximize, Book, Workflow, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProcesoSingle = () => {
  const [proceso, setProceso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProceso = async () => {
      try {
        setLoading(true);
        const data = await procesosService.getProcesoById(id);
        setProceso(data);
      } catch (err) {
        setError('No se pudo cargar el proceso. Es posible que haya sido eliminado.');
        toast({
          title: 'Error',
          description: 'No se pudo cargar el proceso. Inténtalo de nuevo más tarde.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProceso();
    }
    // La dependencia 'toast' se omite intencionadamente para evitar bucles de renderizado.
    // La función es estable y no necesita ser incluida en el array de dependencias.
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-lg text-gray-500">Cargando detalles del proceso...</p></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error al Cargar</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <Button variant="outline" onClick={() => navigate('/procesos')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Procesos
        </Button>
      </div>
    );
  }

  if (!proceso) {
    return null; // O un mensaje de 'no encontrado'
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <Button variant="outline" size="sm" onClick={() => navigate('/procesos')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a Procesos
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <FileText className="w-6 h-6 mr-3 text-blue-600" />
            {proceso.nombre}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Hash className="w-4 h-4 mr-2" />
              <strong>Código:</strong><span className="ml-2">{proceso.codigo}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <GitBranch className="w-4 h-4 mr-2" />
              <strong>Versión:</strong><span className="ml-2">{proceso.version}</span>
            </div>
            <div className="flex items-center text-gray-600 sm:col-span-2 md:col-span-1">
              <Users className="w-4 h-4 mr-2" />
              <strong>Funciones:</strong><span className="ml-2">{proceso.funciones_involucradas || 'No definidas'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center"><Target className="w-5 h-5 mr-2" />1. Objetivo</CardTitle></CardHeader>
          <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.objetivo || 'No definido.'}</p></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center"><Maximize className="w-5 h-5 mr-2" />2. Alcance</CardTitle></CardHeader>
          <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.alcance || 'No definido.'}</p></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center"><Book className="w-5 h-5 mr-2" />3. Definiciones y Abreviaturas</CardTitle></CardHeader>
          <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.definiciones_abreviaturas || 'No definidas.'}</p></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center"><Workflow className="w-5 h-5 mr-2" />4. Desarrollo del Proceso</CardTitle></CardHeader>
          <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.desarrollo || 'No definido.'}</p></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProcesoSingle;
