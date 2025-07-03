import React, { useState, useEffect } from 'react';
import { direccionService } from '@/services/direccionService';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';

const TextTabContent = ({ title, description, content, fieldName, onSave, isSaving }) => {
  const [text, setText] = useState(content || '');

  useEffect(() => {
    setText(content || '');
  }, [content]);

  const handleSave = () => {
    onSave({ [fieldName]: text });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={15}
          className="w-full p-2 border rounded"
          disabled={isSaving}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ImageTabContent = ({ title, description, imageUrl, onSave, isSaving }) => {
  // La lógica de subida de archivos se implementará más adelante
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center min-h-[200px] flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="max-w-full h-auto mx-auto rounded-md" />
          ) : (
            <p className="text-gray-500">No hay imagen cargada.</p>
          )}
        </div>
        <Input type="file" className="w-full" disabled={true} />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => onSave({})} disabled={true}>
          Subir Imagen (Próximamente)
        </Button>
      </CardFooter>
    </Card>
  );
};

const PlanificacionDireccionPage = () => {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const data = await direccionService.getConfiguracion();
        setConfig(data);
      } catch (err) {
        setError('Error al cargar la configuración.');
        toast({
          title: "Error de Carga",
          description: err.message || "No se pudo obtener la configuración del servidor.",
          variant: "destructive",
        });
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async (updatedData) => {
    setIsSaving(true);
    try {
      const updatedConfig = await direccionService.updateConfiguracion(updatedData);
      setConfig(updatedConfig);
      toast({
        title: "Éxito",
        description: "La configuración se ha guardado correctamente.",
        className: "bg-green-500 text-white",
      });
    } catch (err) {
      toast({
        title: "Error al Guardar",
        description: err.message || "No se pudo guardar la configuración.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-12 w-12 animate-spin text-teal-500"/></div>;
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Planificación y Revisión por la Dirección</h1>
      
      <Tabs defaultValue="politica" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="politica">Política de Calidad</TabsTrigger>
          <TabsTrigger value="alcance">Alcance</TabsTrigger>
          <TabsTrigger value="estrategia">Estrategia</TabsTrigger>
          <TabsTrigger value="organigrama">Organigrama</TabsTrigger>
          <TabsTrigger value="mapa_procesos">Mapa de Procesos</TabsTrigger>
        </TabsList>

        <TabsContent value="politica">
          <TextTabContent 
            title="Política de Calidad"
            description="Defina la política de calidad de la organización. Este texto será visible para todos los miembros."
            content={config?.politica_calidad}
            fieldName="politica_calidad"
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="alcance">
          <TextTabContent 
            title="Alcance del Sistema de Gestión"
            description="Especifique los límites y la aplicabilidad del Sistema de Gestión de Calidad."
            content={config?.alcance}
            fieldName="alcance"
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="estrategia">
          <TextTabContent 
            title="Estrategia Organizacional"
            description="Describa la dirección estratégica y los objetivos a largo plazo de la empresa."
            content={config?.estrategia}
            fieldName="estrategia"
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="organigrama">
          <ImageTabContent 
            title="Organigrama de la Empresa"
            description="Suba una imagen del organigrama actualizado de la organización."
            imageUrl={config?.organigrama_url}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="mapa_procesos">
          <ImageTabContent 
            title="Mapa de Interrelación de Procesos"
            description="Suba una imagen que muestre cómo interactúan los procesos del SGC."
            imageUrl={config?.mapa_procesos_url}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default PlanificacionDireccionPage;
