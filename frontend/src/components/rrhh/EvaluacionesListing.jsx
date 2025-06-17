import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  Users,
  LayoutGrid,
  List,
  ClipboardCheck,
  Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { evaluacionesService } from "@/services/evaluacionesService";
import personalService from "@/services/personalService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EvaluacionModal from "./EvaluacionModal";

// Componente para mostrar el listado de evaluaciones
function EvaluacionesListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [evaluacionToDelete, setEvaluacionToDelete] = useState(null);
  const queryClient = useQueryClient();

  // Query para obtener todas las evaluaciones
  const { 
    data: evaluaciones = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['evaluaciones'],
    queryFn: evaluacionesService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Query para obtener datos del personal (para mostrar nombres)
  const { 
    data: personal = [] 
  } = useQuery({
    queryKey: ['personal'],
    queryFn: personalService.getAllPersonal,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutación para crear evaluación
  const createMutation = useMutation({
    mutationFn: evaluacionesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluaciones'] });
      toast({
        title: "Evaluación creada",
        description: "Se ha agregado una nueva evaluación exitosamente"
      });
      setIsModalOpen(false);
      setSelectedEvaluacion(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al crear la evaluación",
        variant: "destructive"
      });
    }
  });

  // Mutación para actualizar evaluación
  const updateMutation = useMutation({
    mutationFn: ({ id, evaluacion }) => evaluacionesService.update(id, evaluacion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluaciones'] });
      toast({
        title: "Evaluación actualizada",
        description: "Los datos de la evaluación han sido actualizados exitosamente"
      });
      setIsModalOpen(false);
      setSelectedEvaluacion(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al actualizar la evaluación",
        variant: "destructive"
      });
    }
  });

  // Mutación para eliminar evaluación
  const deleteMutation = useMutation({
    mutationFn: (id) => evaluacionesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluaciones'] });
      toast({
        title: "Evaluación eliminada",
        description: "La evaluación ha sido eliminada exitosamente"
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al eliminar la evaluación",
        variant: "destructive"
      });
    }
  });

  // Filtrar evaluaciones según término de búsqueda
  const filteredEvaluaciones = evaluaciones.filter((evaluacion) => {
    const personalInfo = personal.find(p => p.id === evaluacion.personal_id);
    const nombreCompleto = personalInfo ? `${personalInfo.nombre} ${personalInfo.apellido}` : '';
    
    return (
      nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluacion.tipo_evaluacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluacion.fecha?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Manejadores de eventos
  const handleOpenModal = (evaluacion = null) => {
    setSelectedEvaluacion(evaluacion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvaluacion(null);
  };

  const handleSaveEvaluacion = (evaluacionData) => {
    if (selectedEvaluacion) {
      updateMutation.mutate({ id: selectedEvaluacion.id, evaluacion: evaluacionData });
    } else {
      createMutation.mutate(evaluacionData);
    }
  };

  const handleDeleteClick = (evaluacion) => {
    setEvaluacionToDelete(evaluacion);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (evaluacionToDelete) {
      deleteMutation.mutate(evaluacionToDelete.id);
    }
  };

  const handleExportToExcel = () => {
    // Implementación futura para exportar a Excel
    toast({
      title: "Exportación iniciada",
      description: "Se está generando el archivo Excel con las evaluaciones"
    });
  };

  // Función para obtener el nombre del empleado según su ID
  const getEmployeeName = (personalId) => {
    const empleado = personal.find(p => p.id === personalId);
    return empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Empleado no encontrado';
  };

  // Función para renderizar las estrellas según la puntuación
  const renderStars = (puntuacion) => {
    const stars = [];
    const score = parseInt(puntuacion) || 0;
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < score ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
        />
      );
    }
    
    return <div className="flex">{stars}</div>;
  };

  // Renderizar mensaje de carga o error
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Cargando evaluaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Error al cargar las evaluaciones</h3>
        <p className="text-red-700">{error.message || "Ha ocurrido un error inesperado"}</p>
      </div>
    );
  }

  // Renderizar la interfaz principal
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        {/* Cabecera con título y botones de acción */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <ClipboardCheck className="mr-2" /> Evaluaciones de Personal
            </h1>
            <p className="text-muted-foreground">
              Gestione las evaluaciones de desempeño del personal
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleOpenModal()} variant="default">
              <Plus className="mr-2 h-4 w-4" /> Nueva Evaluación
            </Button>
            <Button onClick={handleExportToExcel} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Exportar
            </Button>
          </div>
        </div>

        {/* Barra de búsqueda y cambio de vista */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por empleado, tipo o fecha..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Vista:</span>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mensaje cuando no hay evaluaciones */}
        {filteredEvaluaciones.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay evaluaciones disponibles</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? "No se encontraron evaluaciones con ese criterio de búsqueda" : "Comience creando una nueva evaluación"}
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Limpiar búsqueda
              </Button>
            )}
          </div>
        )}

        {/* Vista de cuadrícula */}
        {viewMode === "grid" && filteredEvaluaciones.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvaluaciones.map((evaluacion) => (
              <motion.div
                key={evaluacion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          {getEmployeeName(evaluacion.personal_id)}
                        </CardTitle>
                        <CardDescription>
                          {evaluacion.tipo_evaluacion || "Evaluación estándar"}
                        </CardDescription>
                      </div>
                      <Badge variant={evaluacion.estado === "completada" ? "success" : "secondary"}>
                        {evaluacion.estado || "Pendiente"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fecha:</span>
                        <span className="text-sm font-medium">{evaluacion.fecha || "No especificada"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Puntuación:</span>
                        <span>{renderStars(evaluacion.puntuacion)}</span>
                      </div>
                      {evaluacion.comentarios && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">Comentarios:</p>
                          <p className="text-sm mt-1 line-clamp-3">{evaluacion.comentarios}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(evaluacion)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(evaluacion)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Vista de lista */}
        {viewMode === "list" && filteredEvaluaciones.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left">Empleado</th>
                  <th className="p-3 text-left">Tipo</th>
                  <th className="p-3 text-left">Fecha</th>
                  <th className="p-3 text-left">Puntuación</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvaluaciones.map((evaluacion) => (
                  <tr key={evaluacion.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">{getEmployeeName(evaluacion.personal_id)}</td>
                    <td className="p-3">{evaluacion.tipo_evaluacion || "Estándar"}</td>
                    <td className="p-3">{evaluacion.fecha || "No especificada"}</td>
                    <td className="p-3">{renderStars(evaluacion.puntuacion)}</td>
                    <td className="p-3">
                      <Badge variant={evaluacion.estado === "completada" ? "success" : "secondary"}>
                        {evaluacion.estado || "Pendiente"}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(evaluacion)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(evaluacion)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para crear/editar evaluación */}
      {isModalOpen && (
        <EvaluacionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveEvaluacion}
          evaluacion={selectedEvaluacion}
          personal={personal}
        />
      )}

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la evaluación de
              {evaluacionToDelete && ` ${getEmployeeName(evaluacionToDelete.personal_id)}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EvaluacionesListing;
