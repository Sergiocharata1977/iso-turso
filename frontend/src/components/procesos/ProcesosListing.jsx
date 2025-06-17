import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  FileText,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft,
  ArrowLeft
} from "lucide-react";
import ProcesoModal from "./ProcesoModal";
import ObjetivosListing from "./ObjetivosListing";
import ProcesoSingle from "./ProcesoSingle";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";
import procesosService from '@/services/procesosService';

// Componente de tarjeta de proceso
const ProcesoCard = React.memo(({ proceso, onView, onEdit, onDelete }) => {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-card border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold truncate">{proceso.nombre}</h3>
              <p className="text-sm text-muted-foreground">{proceso.tipo}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{proceso.descripcion}</p>
          <p className="text-sm font-medium">Responsable: <span className="text-muted-foreground">{proceso.responsable || "No asignado"}</span></p>
          
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={isDark ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-blue-400" : "bg-blue-50 hover:bg-blue-100 border-blue-200"}
              onClick={(e) => {
                e.stopPropagation();
                onView(proceso);
              }}
            >
              <FileText className="h-4 w-4 mr-1 text-blue-600" />
              <span className="text-blue-600">Ver</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isDark ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-green-400" : "bg-green-50 hover:bg-green-100 border-green-200"}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(proceso);
              }}
            >
              <Pencil className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-green-600">Editar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isDark ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-red-400" : "bg-red-50 hover:bg-red-100 border-red-200"}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(proceso.id);
              }}
            >
              <Trash2 className="h-4 w-4 mr-1 text-red-600" />
              <span className="text-red-600">Borrar</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

function ProcesosListing() {
  const { isDark } = useTheme();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [procesoToDelete, setProcesoToDelete] = useState(null);
  const [procesos, setProcesos] = useState([]);
  const [showObjetivos, setShowObjetivos] = useState(false);
  const [showProcesoSingle, setShowProcesoSingle] = useState(false);
  const [currentProceso, setCurrentProceso] = useState(null);

  useEffect(() => {
    loadProcesos();
  }, []);

  const loadProcesos = async () => {
    try {
      setIsLoading(true);
      const data = await procesosService.getAll();
      setProcesos(data);
    } catch (error) {
      console.error("Error al cargar procesos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los procesos. Por favor, intenta nuevamente más tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (procesoData) => {
    try {
      setIsLoading(true);
      let response;
      if (procesoData.id) {
        response = await procesosService.update(procesoData.id, procesoData);
        toast({
          title: "Proceso actualizado",
          description: `El proceso "${procesoData.nombre}" ha sido actualizado exitosamente.`
        });
      } else {
        response = await procesosService.create(procesoData);
        toast({
          title: "Proceso creado",
          description: `El proceso "${procesoData.nombre}" ha sido creado exitosamente.`
        });
      }
      await loadProcesos();
      setIsModalOpen(false);
      setSelectedProceso(null);
    } catch (error) {
      console.error("Error al guardar proceso:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el proceso. Por favor, intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (proceso) => {
    setSelectedProceso(proceso);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const proceso = procesos.find(p => p.id === id);
    setProcesoToDelete(proceso);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!procesoToDelete) return;
    try {
      setIsLoading(true);
      await procesosService.delete(procesoToDelete.id);
      toast({
        title: "Proceso eliminado",
        description: `El proceso "${procesoToDelete.nombre}" ha sido eliminado exitosamente.`
      });
      await loadProcesos();
    } catch (error) {
      console.error("Error al eliminar proceso:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el proceso. Por favor, intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setProcesoToDelete(null);
      setIsLoading(false);
    }
  };

  const handleViewProceso = (proceso) => {
    setCurrentProceso(proceso);
    setShowProcesoSingle(true);
  };
  
  const handleViewObjetivos = (proceso) => {
    setCurrentProceso(proceso);
    setShowObjetivos(true);
  };

  const handleBackFromObjetivos = () => {
    setShowObjetivos(false);
    setCurrentProceso(null);
  };
  
  const handleBackFromProceso = () => {
    setShowProcesoSingle(false);
    setCurrentProceso(null);
  };

  // Si estamos viendo los objetivos de un proceso o la vista detallada
  if (showObjetivos && currentProceso) {
    return (
      <ObjetivosListing 
        proceso={currentProceso} 
        onBack={handleBackFromObjetivos}
      />
    );
  } else if (showProcesoSingle && currentProceso) {
    return (
      <ProcesoSingle 
        proceso={currentProceso} 
        onBack={handleBackFromProceso}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  // Filtrar procesos según búsqueda
  const filteredProcesos = procesos.filter(proceso =>
    proceso.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proceso.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proceso.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proceso.responsable?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Procesos</h1>
          <div className="flex items-center space-x-3">
            <div className="bg-muted p-1 rounded-lg border flex items-center">
              <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                size="sm"
                className={viewMode === "grid" ? "shadow-sm" : ""}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                <span>Tarjetas</span>
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                size="sm"
                className={viewMode === "list" ? "shadow-sm" : ""}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                <span>Lista</span>
              </Button>
            </div>
            <Button onClick={() => {
              setSelectedProceso(null);
              setIsModalOpen(true);
            }} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proceso
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar procesos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </motion.div>
          ) : filteredProcesos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                No hay procesos que coincidan con tu búsqueda.
                {searchTerm ? " Intenta con otros términos." : " Haz clic en 'Nuevo Proceso' para comenzar."}
              </p>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence>
                {filteredProcesos.map((proceso) => (
                  <ProcesoCard
                    key={proceso.id}
                    proceso={proceso}
                    onView={handleViewProceso}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full overflow-auto"
            >
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Proceso</th>
                    <th className="p-2 text-left">Descripción</th>
                    <th className="p-2 text-left">Tipo</th>
                    <th className="p-2 text-left">Responsable</th>
                    <th className="p-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredProcesos.map((proceso) => (
                      <motion.tr
                        key={proceso.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleViewProceso(proceso)}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div className="flex items-center">
                              <span className="font-medium">{proceso.nombre}</span>
                              <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm line-clamp-2">{proceso.descripcion}</p>
                        </td>
                        <td className="p-4">{proceso.tipo}</td>
                        <td className="p-4">{proceso.responsable}</td>
                        <td className="p-4 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProceso(proceso);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1 text-blue-600" />
                            <span className="text-blue-600">Ver</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 hover:bg-green-100 border-green-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(proceso);
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-1 text-green-600" />
                            <span className="text-green-600">Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 hover:bg-red-100 border-red-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(proceso.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1 text-red-600" />
                            <span className="text-red-600">Borrar</span>
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal para crear/editar proceso */}
      <ProcesoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProceso(null);
        }}
        onSave={handleSave}
        proceso={selectedProceso}
      />

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el proceso {procesoToDelete?.nombre}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

export default ProcesosListing;
