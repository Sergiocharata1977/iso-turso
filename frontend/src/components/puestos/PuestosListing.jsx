import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Upload, 
  Pencil, 
  Trash2, 
  LayoutGrid,
  List,
  Briefcase,
  Filter
} from "lucide-react";
import PuestoModal from "./PuestoModal";
import PuestoSingle from "./PuestoSingle";
import PuestoCard from './PuestoCard';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { puestosService } from "@/services/puestosService";
import ListingHeader from "../common/ListingHeader";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

function PuestosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [puestoToDelete, setPuestoToDelete] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSingle, setShowSingle] = useState(false);
  const [currentPuesto, setCurrentPuesto] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadPuestos();
  }, []);

  const loadPuestos = async () => {
    try {
      setIsLoading(true);
      const data = await puestosService.getAll(user.organization_id);
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
      if (selectedPuesto) {
        await puestosService.update(selectedPuesto.id, {
          ...puestoData,
          organization_id: user.organization_id
        });
        toast({ title: "Puesto actualizado", description: "Los datos del puesto han sido actualizados." });
      } else {
        await puestosService.create({
          ...puestoData,
          organization_id: user.organization_id
        });
        toast({ title: "Puesto creado", description: "Se ha agregado un nuevo puesto." });
      }
      await loadPuestos();
      setIsModalOpen(false);
      setSelectedPuesto(null);
    } catch (error) {
      toast({ title: "Error", description: error.message || "Ocurrió un error", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (puesto) => {
    setSelectedPuesto(puesto);
    setIsModalOpen(true);
    setShowSingle(false);
  };

  const handleViewDetails = (puesto) => {
    setCurrentPuesto(puesto);
    setShowSingle(true);
  };

  const handleBackToList = () => {
    setShowSingle(false);
    setCurrentPuesto(null);
    loadPuestos();
  };

  const handleDelete = (id) => {
    const puesto = puestos.find(p => p.id === id);
    setPuestoToDelete(puesto);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (puestoToDelete) {
      try {
        await puestosService.delete(puestoToDelete.id, user.organization_id);
        toast({ title: "Puesto eliminado", description: `El puesto ${puestoToDelete.titulo_puesto} ha sido eliminado.` });
        setPuestos(prev => prev.filter(p => p.id !== puestoToDelete.id));
        if (currentPuesto && currentPuesto.id === puestoToDelete.id) {
          setShowSingle(false);
          setCurrentPuesto(null);
        }
      } catch (error) {
        toast({ title: "Error al eliminar", description: "No se pudo eliminar el puesto.", variant: "destructive" });
      } finally {
        setDeleteDialogOpen(false);
        setPuestoToDelete(null);
      }
    }
  };

  const handleNew = () => {
    setSelectedPuesto(null);
    setIsModalOpen(true);
    setShowSingle(false);
  };

  const filteredPuestos = puestos.filter((puesto) =>
    (puesto.titulo_puesto?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (puesto.codigo_puesto?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const renderGridContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <PuestoCard.Skeleton theme="light" key={i} />)}
        </div>
      );
    }
    if (filteredPuestos.length === 0) {
      return (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontraron puestos.</p>
        </div>
      );
    }
    return (
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPuestos.map((puesto) => (
          <PuestoCard 
            key={puesto.id} 
            puesto={puesto} 
            theme="light"
            onEdit={() => handleEdit(puesto)}
            onDelete={() => handleDelete(puesto.id)}
            onViewDetails={() => handleViewDetails(puesto)}
          />
        ))}
      </motion.div>
    );
  };

  const renderListContent = () => {
     if (isLoading) {
      return <p>Cargando...</p>;
    }
    return (
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th scope="col" className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Puesto</th>
              <th scope="col" className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
              <th scope="col" className="relative p-4"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredPuestos.map((puesto) => (
              <motion.tr 
                key={puesto.id} 
                layout
                onClick={() => handleViewDetails(puesto)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
              >
                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{puesto.titulo_puesto}</p>
                      <p className="text-sm text-muted-foreground">{puesto.codigo_puesto}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${puesto.estado === "activo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {puesto.estado}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(puesto); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(puesto.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredPuestos.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No hay puestos que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {showSingle && currentPuesto ? (
        <PuestoSingle 
          puestoId={currentPuesto.id} 
          onBack={handleBackToList} 
          onEdit={handleEdit} 
        />
      ) : (
        <>
          <ListingHeader
            title="Gestión de Puestos"
            subtitle="Administra los puestos de trabajo según ISO 9001."
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onAddNew={handleNew}
            addNewLabel="Nuevo Puesto"
          >
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <div className="flex items-center space-x-1 border border-gray-200 dark:border-slate-700 rounded-lg p-1">
              <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
                <List className="h-5 w-5" />
              </Button>
            </div>
          </ListingHeader>

          <motion.div layout className="mt-6">
            {viewMode === 'grid' ? renderGridContent() : renderListContent()}
          </motion.div>
        </>
      )}

      <PuestoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        puesto={selectedPuesto}
        isSaving={isSaving}
        organizacionId={user?.organization_id}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el puesto {puestoToDelete?.titulo_puesto}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PuestosListing; 