import React, { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  LayoutGrid,
  List,
  ChevronRight,
  Briefcase,
  MoreHorizontal,
  Filter
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import PuestoModal from "./PuestoModal";
import PuestoSingle from "./PuestoSingle"; // Importamos el componente de vista detalle
import PuestoCard from './PuestoCard';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { puestosService } from "@/services/puestosService";

// No se requiere cliente Turso - Migrado a API Backend

function PuestosListing() {
  const { toast } = useToast();
  // const alertDialogTitleId = useId();
  // const alertDialogDescriptionId = useId();
  const alertDialogTitleId = "puesto-alert-title";
  const alertDialogDescriptionId = "puesto-alert-description";
  console.log("[PuestosListing] Component Rendering...");
  console.log("[PuestosListing] Top-level Static IDs for AlertDialog: titleId:", alertDialogTitleId, "descriptionId:", alertDialogDescriptionId);
  // Estados para el modal de creación/edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  // Estados de visualización y filtrado
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  // Estados para la confirmación de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [puestoToDelete, setPuestoToDelete] = useState(null);
  // Estado de los datos y carga
  const [puestos, setPuestos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Estados para la vista detalle (Single)
  const [showSingle, setShowSingle] = useState(false);
  const [currentPuesto, setCurrentPuesto] = useState(null);

  useEffect(() => {
    loadPuestos();
  }, []);

  const loadPuestos = async () => {
    try {
      setIsLoading(true);
      
      // Cargar puestos desde la API backend
      const data = await puestosService.getAll();
      setPuestos(data);
      
    } catch (error) {
      console.error("Error al cargar puestos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los puestos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (puestoData) => {
    setIsSaving(true);
    try {
      let savedPuesto;
      
      if (selectedPuesto) {
        // Actualizar puesto existente
        savedPuesto = await puestosService.update(selectedPuesto.id, puestoData);
        toast({
          title: "Puesto actualizado",
          description: "Los datos del puesto han sido actualizados exitosamente"
        });
      } else {
        // Crear nuevo puesto
        savedPuesto = await puestosService.create(puestoData);
        toast({
          title: "Puesto creado",
          description: "Se ha agregado un nuevo puesto exitosamente"
        });
      }
      
      // Recargar la lista completa para asegurar consistencia
      await loadPuestos();
      
      // Cerrar el modal y limpiar la selección
      setIsModalOpen(false);
      setSelectedPuesto(null);
      
    } catch (error) {
      console.error("Error al guardar puesto:", error);
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al guardar el puesto",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Maneja el clic en el botón de editar (ya sea desde la lista o desde la vista detalle)
  const handleEdit = (puesto) => {
    console.log("[PuestosListing] handleEdit called with:", puesto);
    setSelectedPuesto(puesto);
    setIsModalOpen(true);
    console.log("[PuestosListing] isModalOpen set to true, selectedPuesto:", puesto);
  };
  
  // Maneja el clic en una tarjeta o fila para mostrar la vista detalle
  const handleViewDetails = (puesto) => {
    console.log("[PuestosListing] handleViewDetails called with:", puesto);
    setCurrentPuesto(puesto);
    setShowSingle(true);
    console.log("[PuestosListing] showSingle set to true, currentPuesto:", puesto);
  };
  
  // Maneja el regreso desde la vista detalle a la lista
  const handleBackToList = () => {
    console.log("[PuestosListing] handleBackToList called");
    setShowSingle(false);
    setCurrentPuesto(null);
    console.log("[PuestosListing] showSingle set to false, currentPuesto cleared");
  };

  const handleDelete = (id) => {
    console.log("[PuestosListing] handleDelete called with id:", id);
    const puestoFound = puestos.find(p => p.id === id);
    console.log("[PuestosListing] Puesto to delete found:", puestoFound);
    setPuestoToDelete(puestoFound);
    setDeleteDialogOpen(true);
    console.log("[PuestosListing] deleteDialogOpen set to true, puestoToDelete:", puestoFound);
  };

  const confirmDelete = async () => {
    try {
      if (!puestoToDelete) return;
      
      // Eliminar puesto a través del servicio API
      await puestosService.delete(puestoToDelete.id);
      
      // Recargar la lista completa para asegurar consistencia
      await loadPuestos();
      
      toast({
        title: "Puesto eliminado",
        description: "El puesto ha sido eliminado exitosamente"
      });
      
      setDeleteDialogOpen(false);
      

    } catch (error) {
      console.error("Error al eliminar puesto:", error);
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al eliminar el puesto",
        variant: "destructive"
      });
      setDeleteDialogOpen(false);
    }
  };

  const filteredPuestos = puestos.filter(puesto =>
    (puesto.titulo_puesto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (puesto.codigo_puesto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (puesto.departamento_nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Si showSingle es true, mostramos la vista detalle (PuestoSingle) */}
      {showSingle && currentPuesto ? (
        <PuestoSingle 
          puesto={currentPuesto} 
          onBack={handleBackToList} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
        />
      ) : (
        /* Si showSingle es false, mostramos la lista de puestos */
        <>
          {/* Cabecera Principal */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100">Gestión de Puestos</h1>
              <p className="text-muted-foreground mt-1">Administra los puestos de trabajo según ISO 9001.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button onClick={() => {
                setSelectedPuesto(null);
                setIsModalOpen(true);
              }} className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Puesto
              </Button>
            </div>
          </div>

          {/* Barra de Herramientas */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar puestos, departamentos..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:ring-teal-500 focus:border-teal-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 text-sm ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  Tarjetas
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  Tabla
                </Button>
              </div>
            </div>
          </div>

          {/* Contenedor de la lista de puestos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando puestos...</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPuestos.length > 0 ? (
                  filteredPuestos.map((puesto) => (
                    <PuestoCard 
                      key={puesto.id}
                      puesto={puesto}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 col-span-full">
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                      No hay puestos que coincidan con la búsqueda.
                    </p>
                  </div>
                )}
              </div>
            ) : (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted">
                        <th className="text-left p-4">Puesto</th>
                        <th className="text-left p-4">Departamento</th>
                        <th className="text-left p-4">Supervisor</th>
                        <th className="text-left p-4">Estado</th>
                        <th className="text-right p-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPuestos.map((puesto) => (
                        <motion.tr 
                          key={puesto.id}
                          className="border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-800"
                          whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                          onClick={() => handleViewDetails(puesto)}
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <Briefcase className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">{puesto.titulo_puesto}</p>
                                <p className="text-sm text-muted-foreground">
                                  {puesto.codigo_puesto}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{puesto.departamento_nombre}</td>
                          <td className="p-4">{puesto.supervisor || 'N/A'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              puesto.estado === "activo"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {puesto.estado}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(puesto);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(puesto.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredPuestos.length === 0 && (
                    <div className="text-center py-12">
                      <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">
                        No hay puestos registrados. Haz clic en "Nuevo Puesto" para comenzar.
                      </p>
                    </div>
                  )}
                </div>
            )}
        </motion.div>
        </>
      )}

      {/* Modals */}
      <PuestoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPuesto(null);
        }}
        onSave={handleSave}
        puesto={selectedPuesto}
        isSaving={isSaving}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent aria-labelledby={alertDialogTitleId} aria-describedby={alertDialogDescriptionId}>
          <AlertDialogHeader>
            <AlertDialogTitle id={alertDialogTitleId}>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription id={alertDialogDescriptionId}>
              Esta acción no se puede deshacer. Se eliminará permanentemente el puesto {puestoToDelete?.titulo_puesto}.
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
    </div>
  );
}

export default PuestosListing;
