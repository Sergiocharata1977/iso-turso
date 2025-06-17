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
  Building2,
  Users,
  LayoutGrid,
  List,
  ChevronRight,
  Briefcase
} from "lucide-react";
import PuestoModal from "./PuestoModal";
import PuestoSingle from "./PuestoSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { puestosService } from "@/services/puestos";

// No se requiere cliente Turso - Migrado a API Backend

function PuestosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentPuesto, setCurrentPuesto] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [puestoToDelete, setPuestoToDelete] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    }
  };

  const handleEdit = (puesto) => {
    setSelectedPuesto(puesto);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setPuestoToDelete(puestos.find(p => p.id === id));
    setDeleteDialogOpen(true);
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
      
      // Si estamos viendo el detalle del puesto eliminado, volver a la lista
      if (showSingle && currentPuesto?.id === puestoToDelete.id) {
        setShowSingle(false);
      }
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

  const handleViewPuesto = (puesto) => {
    setCurrentPuesto(puesto);
    setShowSingle(true);
  };

  const filteredPuestos = puestos.filter(puesto =>
    puesto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puesto.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puesto.departamento?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showSingle) {
    return (
      <PuestoSingle
        puesto={currentPuesto}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="bg-background border border-input rounded-md p-1 flex items-center">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0 rounded-sm"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0 rounded-sm"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar puestos..."
              className="pl-8 h-10 w-full sm:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => {
            setSelectedPuesto(null);
            setIsModalOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Puesto
          </Button>
        </div>
      </div>

      {/* Lista de puestos */}
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
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPuestos.map((puesto) => (
              <motion.div
                key={puesto.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => handleViewPuesto(puesto)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">{puesto.nombre}</h3>
                        <p className="text-sm text-muted-foreground">{puesto.codigo}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      puesto.estado === "activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {puesto.estado}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{puesto.departamento || "No especificado"}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Supervisor: {puesto.supervisor || "No especificado"}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm line-clamp-3">{puesto.descripcion}</p>
                  <div className="mt-4 flex justify-end space-x-2">
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
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredPuestos.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay puestos registrados. Haz clic en "Nuevo Puesto" para comenzar.
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border cursor-pointer hover:bg-accent/50"
                    onClick={() => handleViewPuesto(puesto)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{puesto.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {puesto.codigo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{puesto.departamento}</td>
                    <td className="p-4">{puesto.supervisor}</td>
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

      {/* Modals */}
      <PuestoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPuesto(null);
        }}
        onSave={handleSave}
        puesto={selectedPuesto}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el puesto {puestoToDelete?.nombre}.
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
