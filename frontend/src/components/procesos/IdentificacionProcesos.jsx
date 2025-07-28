import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Target, Map, Users, Save, RotateCcw, CheckCircle } from 'lucide-react';
import identificacionProcesosService from '@/services/identificacionProcesosService';

const IdentificacionProcesos = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    politica_calidad: '',
    alcance: '',
    mapa_procesos: '',
    organigrama: ''
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await identificacionProcesosService.getSafe();
      
      if (data) {
        setFormData({
          politica_calidad: data.politica_calidad || '',
          alcance: data.alcance || '',
          mapa_procesos: data.mapa_procesos || '',
          organigrama: data.organigrama || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos de identificación de procesos.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await identificacionProcesosService.updateSafe(formData);
      
      toast({
        title: 'Guardado exitosamente',
        description: 'Los datos de identificación de procesos se han guardado correctamente.',
        className: 'bg-green-50 border-green-200 text-green-800'
      });
    } catch (error) {
      console.error('Error al guardar:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los datos. Inténtalo de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('¿Estás seguro de que quieres limpiar todos los campos? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setIsSaving(true);
      await identificacionProcesosService.clear();
      
      setFormData({
        politica_calidad: '',
        alcance: '',
        mapa_procesos: '',
        organigrama: ''
      });
      
      toast({
        title: 'Campos limpiados',
        description: 'Todos los campos han sido limpiados correctamente.',
        className: 'bg-blue-50 border-blue-200 text-blue-800'
      });
    } catch (error) {
      console.error('Error al limpiar:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron limpiar los campos. Inténtalo de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando identificación de procesos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Identificación de Procesos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configura los elementos fundamentales del sistema de gestión de calidad
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleClear}
            variant="outline"
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Formulario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Política de Calidad */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Política de Calidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="politica_calidad">
                Define la política de calidad de la organización
              </Label>
              <Textarea
                id="politica_calidad"
                name="politica_calidad"
                value={formData.politica_calidad}
                onChange={handleChange}
                placeholder="Describe la política de calidad de tu organización, incluyendo el compromiso con la mejora continua y la satisfacción del cliente..."
                className="min-h-[120px] resize-none"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alcance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Alcance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="alcance">
                Define el alcance del sistema de gestión
              </Label>
              <Textarea
                id="alcance"
                name="alcance"
                value={formData.alcance}
                onChange={handleChange}
                placeholder="Describe qué procesos, productos, servicios y ubicaciones están incluidos en el sistema de gestión de calidad..."
                className="min-h-[120px] resize-none"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mapa de Procesos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-purple-600" />
              Mapa de Procesos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="mapa_procesos">
                Describe la interrelación entre procesos
              </Label>
              <Textarea
                id="mapa_procesos"
                name="mapa_procesos"
                value={formData.mapa_procesos}
                onChange={handleChange}
                placeholder="Describe cómo se relacionan los procesos principales de la organización, incluyendo entradas, salidas y dependencias..."
                className="min-h-[120px] resize-none"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Organigrama */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              Organigrama
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="organigrama">
                Estructura organizacional y responsabilidades
              </Label>
              <Textarea
                id="organigrama"
                name="organigrama"
                value={formData.organigrama}
                onChange={handleChange}
                placeholder="Describe la estructura organizacional, roles, responsabilidades y líneas de autoridad en la organización..."
                className="min-h-[120px] resize-none"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Información importante
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                Estos elementos son fundamentales para el sistema de gestión de calidad ISO 9001. 
                Se recomienda revisarlos periódicamente y actualizarlos cuando sea necesario. 
                Los cambios en estos elementos pueden requerir la actualización de otros documentos del sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IdentificacionProcesos; 