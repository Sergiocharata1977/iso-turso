import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { usePaginationWithFilters } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
// import { DepartamentoCardSkeleton, TableSkeleton, HeaderSkeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  Building,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  Filter,
  MoreHorizontal,
  Users,
  MapPin
} from "lucide-react";
import DepartamentoModal from "./DepartamentoModal";
import DepartamentoSingle from "./DepartamentoSingle";
import UnifiedHeader from "../common/UnifiedHeader";
import UnifiedCard from "../common/UnifiedCard";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { departamentosService } from "@/services/departamentos";
import { useDepartamentos } from "@/hooks/useDepartamentos";
import { Input } from "@/components/ui/input";

function DepartamentosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDepts, setExpandedDepts] = useState([]);
  const [showSingle, setShowSingle] = useState(false);
  const [currentDepartamento, setCurrentDepartamento] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departamentoToDelete, setDepartamentoToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [departamentos, setDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Paginación con filtros
  const {
    data: paginatedDepartamentos,
    paginationInfo,
    searchTerm: paginationSearchTerm,
    updateSearchTerm,
    goToPage,
    changeItemsPerPage,
  } = usePaginationWithFilters(departamentos, {
    itemsPerPage: 10,
    searchTerm: searchTerm,
  });

  useEffect(() => {
    loadDepartamentos();
  }, []);

  const loadDepartamentos = async () => {
    try {
      setIsLoading(true);
      
      const data = await departamentosService.getAll();
      
      if (data && data.length > 0) {
        setDepartamentos(data);
      } else {
        toast({
          title: "Información",
          description: "No se encontraron departamentos registrados",
          variant: "default"
        });
        setDepartamentos([]);
      }
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los departamentos",
        variant: "destructive"
      });
      setDepartamentos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDepartamento = (id) => {
    setExpandedDepts(prev => {
      if (prev.includes(id)) {
        return prev.filter(deptId => deptId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSave = async (departamentoData) => {
    try {
      const departamentoToSave = { ...departamentoData };
      
      if (selectedDepartamento) {
        await departamentosService.update(selectedDepartamento._id || selectedDepartamento.id, departamentoToSave);
        toast({
          title: "Departamento actualizado",
          description: "Los datos del departamento han sido actualizados exitosamente"
        });
      } else {
        await departamentosService.create(departamentoToSave);
        toast({
          title: "Departamento creado",
          description: "Se ha agregado un nuevo departamento exitosamente"
        });
      }
      
      await loadDepartamentos();
      setIsModalOpen(false);
      setSelectedDepartamento(null);
    } catch (error) {
      console.error("Error al guardar departamento:", error);
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al guardar el departamento",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (id) => {
    setDepartamentoToDelete(departamentos.find(d => d.id === id));
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!departamentoToDelete) return;
      
      const tieneSubdepartamentos = departamentos.some(d => d.departamentoPadreId === departamentoToDelete.id);
      
      if (tieneSubdepartamentos) {
        toast({
          title: "No se puede eliminar",
          description: "Este departamento tiene subdepartamentos asociados. Elimine primero los subdepartamentos.",
          variant: "destructive"
        });
        setDeleteDialogOpen(false);
        return;
      }
      
      await departamentosService.delete(departamentoToDelete._id || departamentoToDelete.id);
      await loadDepartamentos();
      
      toast({
        title: "Departamento eliminado",
        description: "El departamento ha sido eliminado exitosamente"
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al eliminar el departamento",
        variant: "destructive"
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleEdit = (departamento) => {
    setSelectedDepartamento(departamento);
    setIsModalOpen(true);
  };

  const handleViewDepartamento = (departamento) => {
    setCurrentDepartamento(departamento);
    setShowSingle(true);
  };

  const handleNew = () => {
    setSelectedDepartamento(null);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    toast({
      title: "Exportación",
      description: "Función de exportación en desarrollo",
    });
  };

  // Usar datos paginados en lugar de filtrados manualmente
  const mainDepartamentos = paginatedDepartamentos.filter(d => !d.departamentoPadreId);

  // Función para obtener subdepartamentos
  const getSubdepartamentos = (parentId) => {
    return paginatedDepartamentos.filter(d => d.departamentoPadreId === parentId);
  };

  if (showSingle) {
    return (
      <DepartamentoSingle 
        departamento={currentDepartamento} 
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={() => handleDelete(currentDepartamento.id)}
      />
    );
  }

  const renderGridView = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 h-16"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex gap-1">
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (mainDepartamentos.length === 0) {
      return (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontraron departamentos.</p>
          <Button onClick={handleNew} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Crear primer departamento
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mainDepartamentos.map((departamento) => {
          const subdepartamentos = getSubdepartamentos(departamento.id);
          const fields = [
            ...(departamento.responsable ? [{ 
              icon: Users, 
              label: "Responsable", 
              value: departamento.responsable 
            }] : []),
            ...(departamento.ubicacion ? [{ 
              icon: MapPin, 
              label: "Ubicación", 
              value: departamento.ubicacion 
            }] : []),
            ...(subdepartamentos.length > 0 ? [{ 
              icon: Building, 
              label: "Subdepartamentos", 
              value: `${subdepartamentos.length} subdepartamentos` 
            }] : [])
          ];

          return (
            <UnifiedCard
              key={departamento.id}
              title={departamento.nombre}
              subtitle={departamento.codigo}
              description={departamento.descripcion}
              responsible={departamento.responsable}
              fields={fields}
              icon={Building}
              primaryColor="emerald"
              onView={() => handleViewDepartamento(departamento)}
              onEdit={() => handleEdit(departamento)}
              onDelete={() => handleDelete(departamento.id)}
            />
          );
        })}
      </div>
    );
  };

  const renderListView = () => {
    const renderDepartamento = (departamento, level = 0) => {
      const isExpanded = expandedDepts.includes(departamento.id);
      const hasChildren = departamentos.some(d => d.departamentoPadreId === departamento.id);
      const childDepartamentos = departamentos.filter(d => d.departamentoPadreId === departamento.id);

      return (
        <React.Fragment key={departamento.id}>
          <div 
            className={`flex items-center p-4 ${level > 0 ? 'bg-gray-50 dark:bg-slate-800/20' : ''} hover:bg-gray-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors`}
            onClick={() => handleViewDepartamento(departamento)}
          >
            <div style={{ paddingLeft: `${level * 2}rem` }} className="flex-1 flex items-center">
              {hasChildren ? (
                <button onClick={(e) => { e.stopPropagation(); toggleDepartamento(departamento.id); }} className="mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : (
                <div className="mr-2 p-1 w-6 h-6"></div>
              )}
              <Building className="h-5 w-5 text-emerald-600 mr-3" />
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">{departamento.nombre}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{departamento.codigo}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(departamento); }}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(departamento.id); }} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div>
              {childDepartamentos.map(child => renderDepartamento(child, level + 1))}
            </div>
          )}
        </React.Fragment>
      );
    };

    if (isLoading) {
      return <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>;
    }

    return (
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {mainDepartamentos.map(departamento => renderDepartamento(departamento))}
        </div>
        
        {/* Paginación */}
        {!isLoading && paginationInfo.totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={paginationInfo.currentPage}
              totalPages={paginationInfo.totalPages}
              totalItems={paginationInfo.totalItems}
              itemsPerPage={paginationInfo.itemsPerPage}
              startItem={paginationInfo.startItem}
              endItem={paginationInfo.endItem}
              onPageChange={goToPage}
              onItemsPerPageChange={changeItemsPerPage}
              showInfo={true}
              showItemsPerPage={true}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <UnifiedHeader
        title="Gestión de Departamentos"
        description="Administra los departamentos organizacionales según ISO 9001"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNew={handleNew}
        onExport={handleExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        newButtonText="Nuevo Departamento"
        totalCount={departamentos.length}
        lastUpdated="hoy"
        icon={Building}
        primaryColor="emerald"
      />

      {viewMode === 'grid' ? renderGridView() : renderListView()}

      <DepartamentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        departamento={selectedDepartamento}
        onSave={handleSave}
        departamentos={departamentos}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El departamento será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DepartamentosListing;
