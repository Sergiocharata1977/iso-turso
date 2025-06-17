import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  ArrowUpCircle,
  Filter,
  LayoutGrid,
  List,
  BarChart2,
  ClipboardList,
  ClipboardCheck
} from "lucide-react";
import MejoraFormulario from "./MejoraFormulario";
import MejoraPlanificacionForm from "./MejoraPlanificacionForm";
import MejoraImplementacionForm from "./MejoraImplementacionForm";
import MejorasDashboard from "./MejorasDashboard";
import MejoraSingle from "./MejoraSingle";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { mejorasService } from '@/services/mejoras';

export default function MejorasListing() {
  const { toast } = useToast();
  
  // Estados
  const [mejoras, setMejoras] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid o list
  const [activeTab, setActiveTab] = useState("listado");
  const [selectedMejora, setSelectedMejora] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mejoraToDelete, setMejoraToDelete] = useState(null);
  const [formType, setFormType] = useState("registro"); // registro, planificacion, implementacion
  
  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  // Cargar datos desde la API backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await mejorasService.getAll();
      setMejoras(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar mejoras:", error);
      toast({ 
        title: "Error", 
        description: "No se pudieron cargar las mejoras", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar mejora (crear o actualizar)
  const handleSave = async (mejoraData) => {
    try {
      setIsLoading(true);
      let savedMejora;
      
      if (selectedMejora) {
        // Actualizar mejora existente
        savedMejora = await mejorasService.update(selectedMejora.id, mejoraData);
        
        toast({
          title: "Mejora actualizada",
          description: "Los datos de la mejora han sido actualizados exitosamente"
        });
      } else {
        // Crear nueva mejora
        savedMejora = await mejorasService.create(mejoraData);
        
        toast({
          title: "Mejora creada",
          description: "Se ha agregado una nueva mejora exitosamente"
        });
      }
      
      await loadData();
      setIsModalOpen(false);
      setSelectedMejora(null);
      setFormType("registro");
    } catch (error) {
      console.error("Error al guardar mejora:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la mejora",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Eliminar mejora
  const handleDelete = async () => {
    if (!mejoraToDelete) return;
    
    try {
      setIsLoading(true);
      await mejorasService.delete(mejoraToDelete.id);
      
      await loadData();
      setIsDeleteDialogOpen(false);
      setMejoraToDelete(null);
      
      toast({
        title: "Mejora eliminada",
        description: "La mejora ha sido eliminada exitosamente"
      });
    } catch (error) {
      console.error("Error al eliminar mejora:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la mejora",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const confirmDelete = (id) => {
    const mejora = mejoras.find(m => m.id === id);
    if (mejora) {
      setMejoraToDelete(mejora);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleUpdateEstado = async (mejoraId, nuevoEstado) => {
    try {
      const mejora = mejoras.find(m => m.id === mejoraId);
      if (!mejora) return;
      
      const estadosCompletados = [...(mejora.estadosCompletados || []), nuevoEstado];
      
      await mejorasService.update(mejoraId, {
        estado: nuevoEstado,
        estadosCompletados
      });
      
      await loadData();
      
      toast({
        title: "Estado actualizado",
        description: `El estado de la mejora ha sido actualizado a ${nuevoEstado}`
      });
      
      return true;
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast({
        title: "Error", 
        description: "Ocurrió un error al actualizar el estado de la mejora",
        variant: "destructive"
      });
      return false;
    }
  };

  const handlePlanificacionSave = (planificacionData) => {
    if (!selectedMejora) return;
    
    handleSave({
      ...selectedMejora,
      ...planificacionData,
      estado: "Planificacion",
      estadosCompletados: [...(selectedMejora.estadosCompletados || []), "Planificacion"]
    });
  };
  
  const handleImplementacionSave = (implementacionData) => {
    if (!selectedMejora) return;
    
    handleSave({
      ...selectedMejora,
      ...implementacionData,
      estado: "Implementacion",
      estadosCompletados: [...(selectedMejora.estadosCompletados || []), "Implementacion"]
    });
  };
  
  const handleViewMejora = (mejora) => {
    setSelectedMejora(mejora);
    setFormType("vista");
    setIsModalOpen(true);
  };
  
  const handleEditMejora = (mejora) => {
    setSelectedMejora(mejora);
    setFormType("registro");
    setIsModalOpen(true);
  };
  
  const handleNewMejora = () => {
    setSelectedMejora(null);
    setFormType("registro");
    setIsModalOpen(true);
  };
  
  // Filtrar mejoras según el texto de búsqueda
  const filteredMejoras = mejoras.filter(mejora =>
    mejora.titulo?.toLowerCase().includes(filterText.toLowerCase()) ||
    mejora.descripcion?.toLowerCase().includes(filterText.toLowerCase()) ||
    mejora.proceso?.toLowerCase().includes(filterText.toLowerCase())
  );
  
  // Renderizado de vista en grid
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMejoras.map((mejora) => (
        <div
          key={mejora.id}
          className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold truncate">
                {mejora.titulo}
              </h3>
              <div className="px-2 py-1 text-xs rounded-full text-white"
                style={{
                  backgroundColor:
                    mejora.estado === "Hallazgo"
                      ? "#f43f5e"
                      : mejora.estado === "Planificacion"
                      ? "#eab308"
                      : mejora.estado === "Implementacion"
                      ? "#22c55e"
                      : "#6366f1",
                }}>
                {mejora.estado}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {mejora.descripcion}
            </p>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proceso:</span>
                <span>{mejora.proceso}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Origen:</span>
                <span>{mejora.origen}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleViewMejora(mejora)}
                >
                  <ClipboardList className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditMejora(mejora)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => confirmDelete(mejora.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Renderizado de vista en lista
  const renderListView = () => (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 bg-muted/50 p-4 font-medium">
        <div className="col-span-4">Título</div>
        <div className="col-span-2">Proceso</div>
        <div className="col-span-2">Estado</div>
        <div className="col-span-2">Fecha</div>
        <div className="col-span-2 text-right">Acciones</div>
      </div>
      <div className="divide-y">
        {filteredMejoras.map((mejora) => (
          <div
            key={mejora.id}
            className="grid grid-cols-12 items-center p-4 hover:bg-muted/50 cursor-pointer"
            onClick={() => handleViewMejora(mejora)}
          >
            <div className="col-span-4 font-medium truncate">{mejora.titulo}</div>
            <div className="col-span-2 text-sm">{mejora.proceso}</div>
            <div className="col-span-2">
              <div
                className="px-2 py-1 text-xs rounded-full text-white inline-block"
                style={{
                  backgroundColor:
                    mejora.estado === "Hallazgo"
                      ? "#f43f5e"
                      : mejora.estado === "Planificacion"
                      ? "#eab308"
                      : mejora.estado === "Implementacion"
                      ? "#22c55e"
                      : "#6366f1",
                }}
              >
                {mejora.estado}
              </div>
            </div>
            <div className="col-span-2 text-sm">
              {mejora.fechaCreacion
                ? new Date(mejora.fechaCreacion).toLocaleDateString()
                : "N/A"}
            </div>
            <div className="col-span-2 flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditMejora(mejora);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(mejora.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizado del contenido según el tipo de formulario
  const renderModalContent = () => {
    if (formType === "registro") {
      return (
        <MejoraFormulario
          mejora={selectedMejora}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      );
    } else if (formType === "planificacion") {
      return (
        <MejoraPlanificacionForm
          mejora={selectedMejora}
          onSave={handlePlanificacionSave}
          onCancel={() => setIsModalOpen(false)}
        />
      );
    } else if (formType === "implementacion") {
      return (
        <MejoraImplementacionForm
          mejora={selectedMejora}
          onSave={handleImplementacionSave}
          onCancel={() => setIsModalOpen(false)}
        />
      );
    } else if (formType === "vista") {
      return (
        <MejoraSingle
          mejora={selectedMejora}
          onClose={() => setIsModalOpen(false)}
          onEdit={() => setFormType("registro")}
          onPlanificar={() => setFormType("planificacion")}
          onImplementar={() => setFormType("implementacion")}
          onUpdateEstado={handleUpdateEstado}
        />
      );
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Mejoras</h2>
            <p className="text-muted-foreground">
              Gestión de hallazgos y mejoras del sistema de calidad
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="listado" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Listado
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" /> Dashboard
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="listado" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar mejoras..."
                className="pl-8 pr-4 py-2 w-full rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? (
                <>
                  <List className="h-4 w-4" /> Lista
                </>
              ) : (
                <>
                  <LayoutGrid className="h-4 w-4" /> Grid
                </>
              )}
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filtrar
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Exportar
            </Button>
            
            <Button onClick={handleNewMejora} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nueva Mejora
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredMejoras.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-card">
              <p className="text-muted-foreground mb-4">
                No se encontraron mejoras. Crea una nueva para comenzar.
              </p>
              <Button onClick={handleNewMejora}>
                <Plus className="h-4 w-4 mr-2" /> Nueva Mejora
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            renderGridView()
          ) : (
            renderListView()
          )}
        </TabsContent>

        <TabsContent value="dashboard">
          <MejorasDashboard mejoras={mejoras} />
        </TabsContent>
      </Tabs>

      {/* Modal para registro, planificación, implementación o vista detallada */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formType === "registro" && selectedMejora
                ? "Editar Mejora"
                : formType === "registro"
                ? "Nueva Mejora"
                : formType === "planificacion"
                ? "Planificación de Acciones"
                : formType === "implementacion"
                ? "Implementación y Seguimiento"
                : "Detalle de Mejora"}
            </DialogTitle>
          </DialogHeader>
          {renderModalContent()}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar mejora?</DialogTitle>
          </DialogHeader>
          <p>
            ¿Está seguro que desea eliminar la mejora "{mejoraToDelete?.titulo}"? 
            Esta acción no se puede deshacer.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
