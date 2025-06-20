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
  Building,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List
} from "lucide-react";
import DepartamentoModal from "./DepartamentoModal";
import DepartamentoSingle from "./DepartamentoSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { departamentosService } from "@/services/departamentos";
import { useDepartamentos } from "@/hooks/useDepartamentos";

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
  const [viewMode, setViewMode] = useState("list");
  const [departamentos, setDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDepartamentos();
  }, []);

  const loadDepartamentos = async () => {
    try {
      setIsLoading(true);
      
      // Cargar departamentos desde la API
      const data = await departamentosService.getAll();
      
      // Si hay datos, procesarlos y actualizar el estado
      if (data && data.length > 0) {
        setDepartamentos(data);
      } else {
        // Si no hay datos en la API, mostrar mensaje
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
      // Preparar los datos del departamento
      const departamentoToSave = { ...departamentoData };
      
      // Si es una actualización
      if (selectedDepartamento) {
        // Actualizar departamento existente usando el servicio API
        await departamentosService.update(selectedDepartamento._id || selectedDepartamento.id, departamentoToSave);
        toast({
          title: "Departamento actualizado",
          description: "Los datos del departamento han sido actualizados exitosamente"
        });
      } else {
        // Crear nuevo departamento usando el servicio API
        await departamentosService.create(departamentoToSave);
        toast({
          title: "Departamento creado",
          description: "Se ha agregado un nuevo departamento exitosamente"
        });
      }
      
      // Recargar la lista de departamentos
      await loadDepartamentos();
      
      // Cerrar el modal y limpiar la selección
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
      
      // Verificar si tiene subdepartamentos
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
      
      // Eliminar departamento usando el servicio API
      await departamentosService.delete(departamentoToDelete._id || departamentoToDelete.id);
      
      // Recargar la lista de departamentos
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

  const renderDepartamento = (departamento, level = 0) => {
    const isExpanded = expandedDepts.includes(departamento.id);
    const hasChildren = departamentos.some(d => d.departamentoPadreId === departamento.id);
    const childDepartamentos = departamentos.filter(d => d.departamentoPadreId === departamento.id);
    
    return (
      <div key={departamento.id} className="border-b border-gray-200 last:border-b-0">
        <div 
          className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${level > 0 ? 'pl-' + (level * 8 + 4) + 'px' : ''}`}
          onClick={() => handleViewDepartamento(departamento)}
        >
          <div className="flex items-center">
            {hasChildren && (
              <button
                className="mr-2 p-1 rounded-full hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDepartamento(departamento.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6" />}
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{departamento.nombre}</h3>
                <p className="text-sm text-muted-foreground">
                  {departamento.responsable}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(departamento);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(departamento.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDepartamento(departamento);
              }}
            >
              <span className="mr-1">Ver detalles</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isExpanded && childDepartamentos.length > 0 && (
          <div className="border-t border-gray-100">
            {childDepartamentos.map(child => renderDepartamento(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderDepartamentoGrid = (departamento) => {
    return (
      <motion.div
        key={departamento.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
        onClick={() => handleViewDepartamento(departamento)}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{departamento.nombre}</h3>
              <p className="text-xs text-muted-foreground">
                {departamento.responsable}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {departamento.descripcion}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm flex items-center">
              <Building className="h-4 w-4 mr-1 text-muted-foreground" />
              {departamento.departamentoPadreId ? 
                departamentos.find(d => d.id === departamento.departamentoPadreId)?.nombre || "Sin departamento padre" : 
                "Departamento principal"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm flex items-center">
              {departamento.personal?.length || 0} miembros
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
            >
              <span className="mr-1">Ver detalles</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="bg-muted/50 px-6 py-3 flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(departamento);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(departamento.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  };

  const filteredDepartamentos = departamentos.filter(departamento =>
    departamento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    departamento.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rootDepartamentos = filteredDepartamentos.filter(d => !d.departamentoPadreId);

  if (showSingle) {
    // Enriquecer el departamento con información adicional
    const departamentoCompleto = { ...currentDepartamento };
    
    // Agregar subdepartamentos
    departamentoCompleto.subdepartamentos = departamentos
      .filter(d => d.departamentoPadreId === currentDepartamento.id)
      .map(d => ({ id: d.id, nombre: d.nombre }));
    
    // Agregar nombre del departamento padre si existe
    if (departamentoCompleto.departamentoPadreId) {
      const departamentoPadre = departamentos.find(d => d.id === departamentoCompleto.departamentoPadreId);
      if (departamentoPadre) {
        departamentoCompleto.departamentoPadreNombre = departamentoPadre.nombre;
      }
    }
    
    return (
      <DepartamentoSingle
        departamento={departamentoCompleto}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Reestructurado */}
      <div className="space-y-4"> {/* Contenedor principal para la cabecera, con espaciado vertical */}
        {/* Fila 1: Título y Acciones Principales */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl font-bold">Departamentos</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => { /* Lógica de Exportar - la original era onClick={() => {}} */ }}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={() => {
                setSelectedDepartamento(null);
                setIsModalOpen(true);
              }}>
              <Plus className="mr-2 h-4 w-4" /> 
              Nuevo Departamento
            </Button>
          </div>
        </div>

        {/* Fila 2: Herramientas de Visualización y Búsqueda */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2"> {/* Contenedor para Selector de Vista */}
            <div className="bg-background border border-input rounded-md p-1 flex items-center">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0 rounded-sm"
                aria-label="Vista de cuadrícula"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0 rounded-sm"
                aria-label="Vista de lista"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative flex-1 w-full sm:w-auto"> {/* Búsqueda, ocupa espacio flexible */}
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar departamentos..."
              className="pl-8 pr-3 py-2 h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Lista de departamentos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rootDepartamentos.map(departamento => renderDepartamentoGrid(departamento))}
            {rootDepartamentos.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay departamentos registrados. Haz clic en "Nuevo Departamento" para comenzar.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {rootDepartamentos.map(departamento => renderDepartamento(departamento))}
            {rootDepartamentos.length === 0 && (
              <div className="text-center py-12">
                <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay departamentos registrados. Haz clic en "Nuevo Departamento" para comenzar.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <DepartamentoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDepartamento(null);
        }}
        onSave={handleSave}
        departamento={selectedDepartamento}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el departamento {departamentoToDelete?.nombre}.
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

export default DepartamentosListing;
