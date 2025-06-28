import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import encuestasService from '@/services/encuestasService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';

const ResponderEncuesta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [encuesta, setEncuesta] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEncuesta = async () => {
      try {
        setIsLoading(true);
        const data = await encuestasService.getById(id);
        if (data.preguntas && typeof data.preguntas === 'string') {
          data.preguntas = JSON.parse(data.preguntas);
        }
        setEncuesta(data);
      } catch (err) {
        setError('No se pudo cargar la encuesta. Es posible que no exista o que haya ocurrido un error.');
        toast({
          title: 'Error al cargar encuesta',
          description: err.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEncuesta();
  }, [id, toast]);

  const handleRespuestaChange = (preguntaId, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: valor,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add validation
    try {
      const payload = {
        encuesta_id: parseInt(id, 10),
        respuestas: JSON.stringify(respuestas),
      };
      await encuestasService.addRespuesta(payload);
      toast({
        title: '¡Gracias por responder!',
        description: 'Tus respuestas han sido enviadas con éxito.',
      });
      navigate('/encuestas');
    } catch (err) {
      toast({
        title: 'Error al enviar respuestas',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const renderPregunta = (pregunta) => {
    const preguntaId = pregunta.id;

    switch (pregunta.tipo) {
      case 'texto_abierto':
        return (
          <div key={preguntaId} className="space-y-2 p-4 border rounded-lg">
            <Label htmlFor={`pregunta-${preguntaId}`} className="font-semibold">{pregunta.texto}</Label>
            <Textarea
              id={`pregunta-${preguntaId}`}
              value={respuestas[preguntaId] || ''}
              onChange={(e) => handleRespuestaChange(preguntaId, e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
            />
          </div>
        );
      case 'opcion_multiple':
        return (
          <div key={preguntaId} className="space-y-2 p-4 border rounded-lg">
            <Label className="font-semibold">{pregunta.texto}</Label>
            <RadioGroup
              value={respuestas[preguntaId] || ''}
              onValueChange={(value) => handleRespuestaChange(preguntaId, value)}
              className="mt-2 space-y-1"
            >
              {pregunta.opciones.map((opcion) => (
                <div key={opcion.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={opcion.texto} id={`opcion-${opcion.id}`} />
                  <Label htmlFor={`opcion-${opcion.id}`} className="font-normal">{opcion.texto}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 'escala_numerica':
        return (
          <div key={preguntaId} className="space-y-2 p-4 border rounded-lg">
            <Label className="font-semibold text-center block">{pregunta.texto}</Label>
            <div className="flex items-center justify-center space-x-2 pt-2">
              {[...Array(5)].map((_, i) => (
                <Button
                  key={i}
                  type="button"
                  variant={respuestas[preguntaId] === (i + 1) ? 'default' : 'outline'}
                  onClick={() => handleRespuestaChange(preguntaId, i + 1)}
                  className="w-12 h-12 rounded-full text-lg"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        );
      default:
        return <p key={preguntaId}>Tipo de pregunta no soportado.</p>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold">Error al cargar la encuesta</h2>
        <p className="text-gray-600 max-w-md">{error}</p>
        <Button onClick={() => navigate(-1)} className="mt-6">Volver</Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader className="bg-gray-100/50 border-b">
            <CardTitle className="text-3xl font-bold text-gray-800">{encuesta?.titulo}</CardTitle>
            <CardDescription className="pt-2">{encuesta?.descripcion}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {encuesta?.preguntas?.map(renderPregunta)}
              <Button type="submit" className="w-full text-lg py-6 bg-emerald-600 hover:bg-emerald-700">Enviar Respuestas</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponderEncuesta;
