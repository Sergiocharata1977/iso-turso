import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  FileEdit, 
  Trash2, 
  Calendar, 
  FileText, 
  Activity, 
  Info, 
  Users, 
  CheckCircle,
  AlignLeft
} from 'lucide-react';
import { competenciasService } from '@/services/competenciasService';
import CompetenciaModal from './CompetenciaModal';

const CompetenciaSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [competencia, setCompetencia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Cargar datos de la competencia
  const loadCompetencia = async () => {
    setIsLoading(true);
    try {
      const response = await competenciasService.getById(id);
      if (response.success) {
        setCompetencia(response.data);
      } else {
        toast({
          title: "Error",
          description: "No se pudo cargar la competencia",
          variant: "destructive",
        });
        navigate('/competencias');
      }
    } catch (error) {
      console.error('Error al cargar competencia:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la competencia",
        variant: "destructive",
      });
      navigate('/competencias');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadCompetencia();
    }
  }, [id]);

  // Abrir modal para editar
  const handleEdit = () => {
    setModalOpen(true);
  };

  // Guardar cambios en la competencia
  const handleSave = async (competenciaData) => {
    try {
      await competenciasService.update(id, competenciaData);
      toast({
        title: "Éxito",
        description: "Competencia actualizada correctamente",
      });
      loadCompetencia();
    } catch (error) {
      console.error('Error al actualizar competencia:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la competencia",
        variant: "destructive",
      });
    }
    setModalOpen(false);
  };

  // Confirmar eliminación
  const handleConfirmDelete = () => {
    setDeleteDialogOpen(true);
  };

  // Eliminar competencia
  const handleDelete = async () => {
    try {
      await competenciasService.delete(id);
      toast({
        title: "Éxito",
        description: "Competencia eliminada correctamente",
      });
      navigate('/competencias');
    } catch (error) {
      console.error('Error al eliminar competencia:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la competencia",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Cargando competencia...</p>
      </div>
    );
  }

  if (!competencia) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">No se encontró la competencia</p>
        <Button 
          onClick={() => navigate('/competencias')} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Competencias
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fijo */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/competencias')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Competencias
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleEdit}
              className="flex items-center"
            >
              <FileEdit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              onClick={handleConfirmDelete}
              className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Título y estado */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{competencia.nombre}</h1>
              <p className="text-gray-600">Detalle de competencia</p>
            </div>
            <Badge 
              variant={competencia.estado === 'activa' ? 'success' : 'secondary'}
              className="text-sm"
            >
              {competencia.estado === 'activa' ? 'Activa' : 'Inactiva'}
            </Badge>
          </div>
        </div>

        {/* Tarjetas de información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{competencia.id}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                Fecha de Creación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{formatDate(competencia.created_at)}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                Última Actualización
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{formatDate(competencia.updated_at)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Pestañas de información */}
        <Tabs defaultValue="informacion" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="informacion" className="data-[state=active]:bg-teal-50">
              <Info className="h-4 w-4 mr-2" />
              Información
            </TabsTrigger>
            <TabsTrigger value="personal" className="data-[state=active]:bg-teal-50">
              <Users className="h-4 w-4 mr-2" />
              Personal Asociado
            </TabsTrigger>
            <TabsTrigger value="evaluaciones" className="data-[state=active]:bg-teal-50">
              <CheckCircle className="h-4 w-4 mr-2" />
              Evaluaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="informacion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlignLeft className="h-5 w-5 text-teal-600" />
                  Descripción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {competencia.descripcion || 'No hay descripción disponible para esta competencia.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  Personal con esta Competencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 italic">
                  No hay personal asociado a esta competencia actualmente.
                </p>
                {/* Aquí se podría mostrar una lista de personal asociado a esta competencia */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-teal-600" />
                  Evaluaciones de esta Competencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 italic">
                  No hay evaluaciones registradas para esta competencia.
                </p>
                {/* Aquí se podría mostrar un historial de evaluaciones de esta competencia */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal para editar competencia */}
      {modalOpen && (
        <CompetenciaModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          competencia={competencia}
        />
      )}

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar competencia?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Esta acción no se puede deshacer. Se eliminará permanentemente la competencia
              {competencia && ` "${competencia.nombre}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-600 text-white hover:bg-slate-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompetenciaSingle;
