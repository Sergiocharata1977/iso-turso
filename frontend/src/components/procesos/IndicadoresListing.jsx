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
  BarChart2,
  SlidersHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import IndicadorModal from "./IndicadorModal";
import MedicionesListing from "./MedicionesListing";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { indicadoresService } from "@/services";

const IndicadorCard = React.memo(({ indicador, onView, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold truncate">{indicador.titulo}</h3>
        <Badge variant="outline">{indicador.unidad_medida}</Badge>
      </div>
      <p className="text-muted-foreground line-clamp-2 mb-4">{indicador.descripcion}</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Límite de aceptación:</span>
          <span className="font-medium">{indicador.limite_aceptacion}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Frecuencia:</span>
          <span>{indicador.frecuencia_medicion}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Responsable:</span>
          <span>{indicador.responsable}</span>
        </div>
      </div>
    </div>
    <CardFooter className="border-t p-4 bg-muted/30 flex justify-between">
      <Button variant="outline" size="sm" onClick={() => onView(indicador)}>
        <BarChart2 className="h-4 w-4 mr-2" />
        Mediciones
      </Button>
      <div className="space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(indicador)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(indicador.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardFooter>
  </motion.div>
));

export default function IndicadoresListing({ objetivoId, objetivoTitulo, procesoId }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [indicadores, setIndicadores] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [indicadorToDelete, setIndicadorToDelete] = useState(null);
  const [showMediciones, setShowMediciones] = useState(false);
  const [currentIndicador, setCurrentIndicador] = useState(null);

  useEffect(() => {
    loadIndicadores();
  }, [objetivoId]);

  const loadIndicadores = async () => {
    try {
      setIsLoading(true);
      
      // Cargar desde API backend
      const data = await indicadoresService.getByObjetivo(objetivoId);
      
      if (data && Array.isArray(data)) {
        setIndicadores(data);
      } else {
        setIndicadores([]);
      }
    } catch (error) {
      console.error("Error al cargar indicadores:", error);
      toast({ 
        title: "Error", 
        description: "No se pudieron cargar los indicadores", 
        variant: "destructive" 
      });
      setIndicadores([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (indicadorData) => {
    try {
      setIsLoading(true);
      let savedIndicador;
      
      if (currentIndicador) {
        // Actualizar indicador existente
        savedIndicador = await indicadoresService.update(currentIndicador.id, indicadorData);
        toast({
          title: "Indicador actualizado",
          description: "El indicador ha sido actualizado exitosamente"
        });
      } else {
        // Crear nuevo indicador
        indicadorData = {
          ...indicadorData,
          objetivo_id: objetivoId,
          objetivo_titulo: objetivoTitulo,
          proceso_id: procesoId
        };
        
        savedIndicador = await indicadoresService.create(indicadorData);
        toast({
          title: "Indicador creado",
          description: "El indicador ha sido creado exitosamente"
        });
      }
      
      await loadIndicadores();
      setIsModalOpen(false);
      setCurrentIndicador(null);
    } catch (error) {
      console.error("Error al guardar indicador:", error);
      toast({
        title: "Error", 
        description: "No se pudo guardar el indicador",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      setIsDeleteDialogOpen(false);
      
      await indicadoresService.delete(id);
      await loadIndicadores();
      
      toast({
        title: "Indicador eliminado",
        description: "El indicador ha sido eliminado exitosamente"
      });
    } catch (error) {
      console.error("Error al eliminar indicador:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el indicador",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (indicador) => {
    setCurrentIndicador(indicador);
    setIsModalOpen(true);
  };
  
  const confirmDelete = (id) => {
    setIndicadorToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleViewMediciones = (indicador) => {
    setCurrentIndicador(indicador);
    setShowMediciones(true);
  };
  
  const handleCloseMediciones = () => {
    setShowMediciones(false);
    setCurrentIndicador(null);
  };
  
  const filteredIndicadores = indicadores.filter(indicador => 
    indicador.titulo.toLowerCase().includes(searchText.toLowerCase()) || 
    indicador.descripcion.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Indicadores</h2>
          <p className="text-muted-foreground">
            {objetivoTitulo ? `Indicadores para: ${objetivoTitulo}` : "Todos los indicadores"}
          </p>
        </div>
        <Button onClick={() => { setCurrentIndicador(null); setIsModalOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo Indicador
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar indicadores..."
            className="pl-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Exportar
        </Button>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" /> Filtrar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredIndicadores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay indicadores disponibles para este objetivo.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => { setCurrentIndicador(null); setIsModalOpen(true); }}
          >
            <Plus className="h-4 w-4 mr-2" /> Crear indicador
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndicadores.map(indicador => (
            <IndicadorCard
              key={indicador.id}
              indicador={indicador}
              onView={handleViewMediciones}
              onEdit={handleEdit}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}

      {/* Modal para crear/editar indicador */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentIndicador ? "Editar Indicador" : "Nuevo Indicador"}
            </DialogTitle>
          </DialogHeader>
          <IndicadorModal
            indicador={currentIndicador}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal para ver mediciones */}
      <Dialog open={showMediciones} onOpenChange={setShowMediciones}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Mediciones de: {currentIndicador?.titulo}
            </DialogTitle>
          </DialogHeader>
          {currentIndicador && (
            <MedicionesListing 
              indicadorId={currentIndicador.id} 
              indicadorData={currentIndicador}
              onClose={handleCloseMediciones}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar indicador?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El indicador será eliminado permanentemente 
              junto con todas sus mediciones asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDelete(indicadorToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
