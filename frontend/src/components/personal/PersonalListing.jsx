import React, { useState, useEffect, useMemo, useId } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  LayoutGrid,
  List,
  Search,
  Plus,
  FileDown,
  Users,
} from "lucide-react";

import PersonalModal from "./PersonalModal";
import PersonalCard from "./PersonalCard";
import PersonalTableView from "./PersonalTableView";
import personalService from "@/services/personalService"; // Corrected import

function PersonalListing() {
  const { toast } = useToast();
  const [personal, setPersonal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState("");

  // Modal and Dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  
  // Accessibility IDs
  const alertDialogTitleId = useId();
  const alertDialogDescriptionId = useId();

  useEffect(() => {
    loadPersonal();
  }, []);

  const loadPersonal = async () => {
    setIsLoading(true);
    try {
      const data = await personalService.getAllPersonal();
      setPersonal(data || []);
    } catch (error) {
      console.error("[PersonalListing] Error loading personal:", error);
      toast({
        title: "Error al cargar personal",
        description: "No se pudo obtener la lista de personal. Intente de nuevo.",
        variant: "destructive",
      });
      setPersonal([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (personData) => {
    const isUpdating = selectedPerson && selectedPerson.id;
    const originalPerson = { ...selectedPerson };

    // Optimistic UI update
    setIsModalOpen(false);
    if (isUpdating) {
      setPersonal(personal.map(p => p.id === personData.id ? personData : p));
    } 

    try {
      if (isUpdating) {
        await personalService.updatePersonal(personData.id, personData);
      } else {
        await personalService.createPersonal(personData);
        // We need to reload to get the new ID from the backend
        await loadPersonal(); 
      }
      toast({
        title: `Éxito`,
        description: `El registro de ${personData.nombre} ha sido ${isUpdating ? 'actualizado' : 'creado'}.`,
      });
    } catch (error) {
      console.error("[PersonalListing] Error saving person:", error);
      toast({
        title: "Error al guardar",
        description: `No se pudo guardar el registro.`,
        variant: "destructive",
      });
      // Revert optimistic update on error
      if(isUpdating) {
        setPersonal(personal.map(p => p.id === originalPerson.id ? originalPerson : p));
      }
    } finally {
        setSelectedPerson(null);
    }
  };

  const handleAddNew = () => {
    setSelectedPerson(null);
    setIsModalOpen(true);
  };

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const person = personal.find((p) => p.id === id);
    if (person) {
      setPersonToDelete(person);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!personToDelete) return;
    const personId = personToDelete.id;
    const originalPersonal = [...personal];

    // Optimistic UI update
    setPersonal(personal.filter(p => p.id !== personId));
    setDeleteDialogOpen(false);

    try {
      await personalService.deletePersonal(personId);
      toast({
        title: "Registro eliminado",
        description: `Se eliminó el registro de ${personToDelete.nombre}.`,
      });
    } catch (error) {
      console.error("[PersonalListing] Error deleting person:", error);
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el registro.",
        variant: "destructive",
      });
      // Revert optimistic update
      setPersonal(originalPersonal);
    } finally {
      setPersonToDelete(null);
    }
  };

  const filteredPersonal = useMemo(() => {
    if (!searchTerm) return personal;
    return personal.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.puesto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.departamento?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [personal, searchTerm]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredPersonal.length === 0) {
      return (
        <div className="text-center py-16">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No se encontraron registros</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchTerm
              ? "Intenta con otros términos de búsqueda."
              : "Crea un nuevo registro para empezar a gestionar tu personal."
            }
          </p>
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPersonal.map((person) => (
            <PersonalCard
              key={person.id}
              person={person}
              onView={handleEdit} // Reusing edit modal for viewing details
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      );
    }

    return (
      <PersonalTableView
        personal={filteredPersonal}
        onView={handleEdit} // Reusing edit modal for viewing details
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Personal</h1>
          <p className="text-muted-foreground">
            Administra los perfiles de los empleados de la organización.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="icon" onClick={() => {}} disabled>
            <FileDown className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Personal
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Buscar por nombre, puesto..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-2">
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                <List className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                <LayoutGrid className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {/* Content */}
      <main>{renderContent()}</main>

      {/* Modals and Dialogs */}
      <PersonalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        person={selectedPerson}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent aria-labelledby={alertDialogTitleId} aria-describedby={alertDialogDescriptionId}>
          <AlertDialogHeader>
            <AlertDialogTitle id={alertDialogTitleId}>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription id={alertDialogDescriptionId}>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro de{' '}
              <span className="font-semibold">{personToDelete?.nombre}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PersonalListing;
