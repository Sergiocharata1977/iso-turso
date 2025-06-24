import React, { useState, useEffect, useMemo, useId } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  Filter,
  Plus,
  Download,
  MoreHorizontal,
  Users,
  Phone,
  Mail,
  Building2,
  User,
} from "lucide-react";

import PersonalModal from "./PersonalModal";
import PersonalCard from "./PersonalCard";
import PersonalTableView from "./PersonalTableView";
import PersonalSingle from "./PersonalSingle";
import personalService from "@/services/personalService"; // Corrected import

function PersonalListing() {
  const { toast } = useToast();
  const [personal, setPersonal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState("");
  
  // Single view states
  const [showSingleView, setShowSingleView] = useState(false);
  const [selectedPersonForView, setSelectedPersonForView] = useState(null);

  // Modal and Dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersonForEdit, setSelectedPersonForEdit] = useState(null);
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
    const isUpdating = selectedPersonForEdit && selectedPersonForEdit.id;
    const originalPerson = { ...selectedPersonForEdit };

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
        description: `El registro de ${personData.nombres} ${personData.apellidos} ha sido ${isUpdating ? 'actualizado' : 'creado'}.`,
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
        setSelectedPersonForEdit(null);
    }
  };

  const handleAddNew = () => {
    setSelectedPersonForEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (person) => {
    setSelectedPersonForEdit(person);
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
        description: "El registro ha sido eliminado exitosamente.",
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

  // Si se está mostrando la vista individual, renderizar solo eso
  if (showSingleView && selectedPersonForView) {
    return (
      <PersonalSingle
        person={selectedPersonForView}
        onBack={() => setShowSingleView(false)}
        onEdit={(person) => {
          setSelectedPersonForEdit(person);
          setShowSingleView(false);
          setIsModalOpen(true);
        }}
        onDelete={(id) => {
          setShowSingleView(false);
          handleDelete(id);
        }}
      />
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    const filteredPersonal = personal.filter((person) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        person.nombres?.toLowerCase().includes(searchLower) ||
        person.apellidos?.toLowerCase().includes(searchLower) ||
        person.puesto?.toLowerCase().includes(searchLower) ||
        person.departamento?.toLowerCase().includes(searchLower) ||
        person.email?.toLowerCase().includes(searchLower)
      );
    });

    if (filteredPersonal.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron empleados</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "Intenta con otros términos de búsqueda."
              : "Crea un nuevo registro para empezar a gestionar tu personal."
            }
          </p>
          {!searchTerm && (
            <Button onClick={handleAddNew} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Personal
            </Button>
          )}
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonal.map((person) => (
            <Card key={person.id} className="border border-gray-200 hover:shadow-lg hover:border-teal-500 transition-all duration-300 cursor-pointer group" onClick={() => {
              setSelectedPersonForView(person);
              setShowSingleView(true);
            }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {person.imagen ? (
                        <img 
                          src={person.imagen} 
                          alt={`${person.nombres} ${person.apellidos}`}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <span className="text-sm">
                          {`${person.nombres?.charAt(0) || ''}${person.apellidos?.charAt(0) || ''}`}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                        {person.nombres} {person.apellidos}
                      </h3>
                      <p className="text-sm text-gray-600">{person.puesto || 'Sin puesto'}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(person);
                      }}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(person.id);
                        }}
                        className="text-red-600"
                      >
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{person.departamento || 'Sin departamento'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Supervisor: {person.supervisor || 'Sin supervisor'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{person.email || 'Sin email'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{person.telefono || 'Sin teléfono'}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    Activo
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Ingreso: {person.fecha_ingreso ? new Date(person.fecha_ingreso).toLocaleDateString() : 'No disponible'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <PersonalTableView
        personal={filteredPersonal}
        onView={handleEdit}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Principal */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Personal</h1>
              <p className="text-gray-600">Administra los empleados según ISO 9001</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button onClick={handleAddNew} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Personal
              </Button>
            </div>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar empleados, departamentos, códigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Tarjetas
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("list")}
              >
                Tabla
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>

      {/* Modales */}
      <PersonalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        person={selectedPersonForEdit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent aria-labelledby={alertDialogTitleId} aria-describedby={alertDialogDescriptionId}>
          <AlertDialogHeader>
            <AlertDialogTitle id={alertDialogTitleId}>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription id={alertDialogDescriptionId}>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro de{' '}
              <span className="font-semibold">{personToDelete?.nombres} {personToDelete?.apellidos}</span>.
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
