import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutGrid,
  ListIcon,
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PersonalModal from "./PersonalModal";
import PersonalSingle from "./PersonalSingle";
import PersonalCard from "./PersonalCard";
import PersonalTableView from "./PersonalTableView";

// Importa el servicio desde la ubicación correcta
import { personalService } from "@/services";

function PersonalListing() {
  const { toast } = useToast();
  const [personal, setPersonal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showSingleView, setShowSingleView] = useState(false);
  const [currentPerson, setCurrentPerson] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    loadPersonal();
  }, []);

  // Efecto para logging cuando el personal cambia
  useEffect(() => {
    console.log(`Personal cargado: ${personal.length} registros`);
  }, [personal]);

  const loadPersonal = async () => {
    try {
      setIsLoading(true);
      const result = await personalService.getAllPersonal();
      setPersonal(result);
    } catch (error) {
      console.error("Error al cargar personal:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de personal",
        variant: "destructive"
      });
      setPersonal([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (personData) => {
    try {
      setIsLoading(true);
      const isUpdate = !!personData.id;
      if (isUpdate) {
        await personalService.updatePersonal(personData.id, personData);
      } else {
        await personalService.createPersonal(personData);
      }
      await loadPersonal();
      setIsModalOpen(false);
      setSelectedPerson(null);
    } catch (error) {
      console.error("Error al guardar personal:", error);
      toast({
        title: "Error",
        description: `No se pudo ${personData.id ? 'actualizar' : 'crear'} el registro de personal`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (person) => {
    console.log("Ver detalles de:", person);
    setCurrentPerson(person);
    setShowSingleView(true);
  };

  const handleEdit = (person) => {
    console.log("Editar:", person);
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const person = personal.find((p) => p.id === id);
    setPersonToDelete(person);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!personToDelete) return;
    try {
      setIsLoading(true);
      await personalService.deletePersonal(personToDelete.id);
      toast({
        title: "Eliminado",
        description: `Se eliminó el registro de ${personToDelete.nombre}`,
      });
      await loadPersonal();
      setDeleteDialogOpen(false);
      setPersonToDelete(null);
    } catch (error) {
      console.error("Error al eliminar personal:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el registro de personal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    console.log("Agregar nuevo personal");
    setSelectedPerson(null);
    setIsModalOpen(true);
  };

  const handleBackFromSingle = () => {
    setShowSingleView(false);
    setCurrentPerson(null);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredPersonal.length / itemsPerPage)) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Filtrar personal según término de búsqueda
  const filteredPersonal = personal.filter(person => 
    person.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.puesto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.departamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calcular total de páginas para paginación
  const totalPages = Math.ceil(filteredPersonal.length / itemsPerPage);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  
  // Obtener los registros para la página actual
  const paginatedPersonal = filteredPersonal.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Si estamos viendo la vista detallada de una persona
  if (showSingleView && currentPerson) {
    return (
      <PersonalSingle
        person={currentPerson}
        onBack={handleBackFromSingle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestión de Personal</h1>
          <div className="flex items-center space-x-3">
            <div className="flex bg-muted rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Personal
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar personal..."
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
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div className="h-5 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : filteredPersonal.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                No hay personal que coincida con tu búsqueda. 
                {searchTerm ? " Intenta con otros términos." : " Haz clic en 'Nuevo Personal' para comenzar."}
              </p>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence>
                {paginatedPersonal.map(person => (
                  <PersonalCard
                    key={person.id}
                    person={person}
                    onView={handleView}
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
              <PersonalTableView 
                data={paginatedPersonal}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paginación */}
        {filteredPersonal.length > 0 && totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={previousPage}
              disabled={!hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={!hasNextPage}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Modal para crear/editar personal */}
      <PersonalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPerson(null);
        }}
        onSave={handleSave}
        person={selectedPerson}
      />

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro de {personToDelete?.nombre}.
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

export default PersonalListing;
