import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
// import { PuestoCardSkeleton, TableSkeleton, HeaderSkeleton } from "@/components/ui/skeleton";
import { 
  Upload, 
  Pencil, 
  Trash2, 
  LayoutGrid,
  List,
  Briefcase,
  Filter,
  Download,
  Plus
} from "lucide-react";
import PuestoModal from "./PuestoModal";
import PuestoSingle from "./PuestoSingle";
import PuestoCard from './PuestoCard';
import UnifiedHeader from "../common/UnifiedHeader";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { puestosService } from "@/services/puestosService";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      console.log('Cargando puestos para organization_id:', user.organization_id);
      const data = await puestosService.getAll(user.organization_id);
      console.log('Puestos recibidos:', data);
      setPuestos(Array.isArray(data) ? data : []);
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
        toast({ title: "Puesto eliminado", description: `El puesto ${puestoToDelete.nombre} ha sido eliminado.` });
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

  const handleExport = () => {
    toast({
      title: "Exportación",
      description: "Función de exportación en desarrollo",
    });
  };

  const filteredPuestos = puestos.filter((puesto) =>
    (puesto.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (puesto.codigo_puesto?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getStats = () => {
    const total = puestos.length;
    const activos = puestos.filter(p => p.estado?.toLowerCase() === 'activo').length;
    const inactivos = puestos.filter(p => p.estado?.toLowerCase() === 'inactivo').length;
    const conPersonal = 0; // Se podría calcular si hay relación con personal
    
    return { total, activos, inactivos, conPersonal };
  };

  if (showSingle && currentPuesto) {
    return (
      <PuestoSingle 
        puestoId={currentPuesto.id} 
        onBack={handleBackToList} 
        onEdit={handleEdit} 
      />
    );
  }

  const stats = getStats();

  const renderGridContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 h-18"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
    if (filteredPuestos.length === 0) {
      return (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontraron puestos.</p>
          <Button onClick={handleNew} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Crear primer puesto
          </Button>
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
            primaryColor="emerald"
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
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      );
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
                    <Briefcase className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">{puesto.nombre}</p>
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
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewDetails(puesto); }}>
                      <Briefcase className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(puesto); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(puesto.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
    <div className="p-6 space-y-6">
      <UnifiedHeader
        title="Gestión de Puestos"
        description="Administra los puestos de trabajo según ISO 9001"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNew={handleNew}
        onExport={handleExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        newButtonText="Nuevo Puesto"
        totalCount={puestos.length}
        lastUpdated="hoy"
        icon={Briefcase}
        primaryColor="emerald"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Briefcase className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <Briefcase className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactivos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Personal</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conPersonal}</div>
          </CardContent>
        </Card>
      </div>

      <motion.div layout className="mt-6">
        {viewMode === 'grid' ? renderGridContent() : renderListContent()}
      </motion.div>

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
              Esta acción no se puede deshacer. Se eliminará permanentemente el puesto {puestoToDelete?.nombre}.
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