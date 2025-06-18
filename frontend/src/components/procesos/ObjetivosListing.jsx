import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import objetivosCalidadService from '@/services/objetivosCalidadService';
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  Target,
  ArrowLeft,
  ChevronRight,
  Activity
} from "lucide-react";
import ObjetivoModal from "./ObjetivoModal";
import IndicadoresListing from "./IndicadoresListing";


function ObjetivosListing({ procesoId, procesoNombre, onBack }) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [objetivos, setObjetivos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showIndicadores, setShowIndicadores] = useState(false);
  const [currentObjetivo, setCurrentObjetivo] = useState(null);

  useEffect(() => {
    loadObjetivos();
  }, [procesoId]);

  const loadObjetivos = async () => {
    setIsLoading(true);
    try {
      let fetchedObjetivos = await objetivosCalidadService.getAll();
      if (procesoId) {
        fetchedObjetivos = fetchedObjetivos.filter(obj => obj.proceso_id === procesoId);
      }
      setObjetivos(fetchedObjetivos);
      if (fetchedObjetivos.length === 0) {
        toast({
          title: "Información",
          description: procesoId 
            ? "No se encontraron objetivos para este proceso en la API."
            : "No se encontraron objetivos en la API.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error al cargar objetivos desde la API:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los objetivos.",
        variant: "destructive",
      });
      setObjetivos([]); // Clear objectives on error or set to empty if preferred
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (objetivoData) => {
    try {
      setIsLoading(true);
      if (selectedObjetivo && selectedObjetivo.id) {
        await objetivosCalidadService.update(selectedObjetivo.id, {
          ...objetivoData,
          proceso_id: procesoId,
          proceso_nombre: procesoNombre
        });
        toast({
          title: "Objetivo actualizado",
          description: "Los datos del objetivo han sido actualizados exitosamente"
        });
      } else {
        await objetivosCalidadService.create({
          ...objetivoData,
          proceso_id: procesoId,
          proceso_nombre: procesoNombre
        });
        toast({
          title: "Objetivo creado",
          description: "Se ha agregado un nuevo objetivo exitosamente"
        });
      }
      await loadObjetivos();
      setIsModalOpen(false);
      setSelectedObjetivo(null);
    } catch (error) {
      console.error("Error al guardar objetivo:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el objetivo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (objetivo) => {
    setSelectedObjetivo(objetivo);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await objetivosCalidadService.delete(id);
      
      toast({
        title: "Objetivo eliminado",
        description: "El objetivo ha sido eliminado exitosamente"
      });
      await loadObjetivos(); // Reload objectives after deletion
    } catch (error) {
      console.error("Error al eliminar objetivo:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el objetivo",
        variant: "destructive"
      });
    }
  };

  const handleViewIndicadores = (objetivo) => {
    setCurrentObjetivo(objetivo);
    setShowIndicadores(true);
  };

  const handleBackFromIndicadores = () => {
    setShowIndicadores(false);
    setCurrentObjetivo(null);
  };

  const filteredObjetivos = objetivos.filter(objetivo =>
    objetivo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (objetivo.descripcion && objetivo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (objetivo.responsable && objetivo.responsable.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (showIndicadores && currentObjetivo) {
    return (
      <IndicadoresListing
        objetivoId={currentObjetivo.id}
        objetivoTitulo={currentObjetivo.titulo}
        procesoId={procesoId}
        procesoNombre={procesoNombre}
        onBack={handleBackFromIndicadores}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb y título */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Procesos
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{procesoNombre}</h2>
          <p className="text-muted-foreground">
            Objetivos del proceso
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar objetivos..."
              className="pl-8 h-10 w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => {
            setSelectedObjetivo(null);
            setIsModalOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Objetivo
          </Button>
        </div>
      </div>

      {/* Lista de Objetivos */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando objetivos...</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-4">Título</th>
                  <th className="text-left p-4">Descripción</th>
                  <th className="text-left p-4">Responsable</th>
                  <th className="text-left p-4">Meta</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredObjetivos.map((objetivo) => (
                  <motion.tr
                    key={objetivo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewIndicadores(objetivo)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-primary" />
                        <div className="flex items-center">
                          <span className="font-medium">{objetivo.titulo}</span>
                          <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm line-clamp-2">{objetivo.descripcion}</p>
                    </td>
                    <td className="p-4">{objetivo.responsable}</td>
                    <td className="p-4">
                      <p className="text-sm">{objetivo.meta}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        objetivo.estado === "Completado" 
                          ? "bg-green-100 text-green-800"
                          : objetivo.estado === "En progreso"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {objetivo.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(objetivo);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(objetivo.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewIndicadores(objetivo);
                        }}
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredObjetivos.length === 0 && (
              <div className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay objetivos registrados para este proceso. Haz clic en "Nuevo Objetivo" para comenzar.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <ObjetivoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedObjetivo(null);
        }}
        onSave={handleSave}
        objetivo={selectedObjetivo}
        procesoId={procesoId}
        procesoNombre={procesoNombre}
      />
    </div>
  );
}

export default ObjetivosListing;
