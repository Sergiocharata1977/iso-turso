import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import objetivosCalidadService from '@/services/objetivosCalidadService';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Target,
  LayoutGrid,
  Table as TableIcon,
  ArrowLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
import ObjetivoModal from './ObjetivoModal';
import ObjetivoSingle from './ObjetivoSingle';

function ObjetivosListing({ procesoId, procesoNombre, onBack }) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [objetivos, setObjetivos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("cards"); // "cards" o "table"
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [objetivoToDelete, setObjetivoToDelete] = useState(null);
  const [view, setView] = useState('listing'); // 'listing' o 'single'
  const [currentObjetivo, setCurrentObjetivo] = useState(null);

  useEffect(() => {
    loadObjetivos();
  }, [procesoId]);

  const loadObjetivos = async () => {
    setIsLoading(true);
    try {
      let fetchedObjetivos = await objetivosCalidadService.getAll();
      if (procesoId) {
        fetchedObjetivos = fetchedObjetivos.filter(obj => obj.proceso_id === procesoId);
      }
      setObjetivos(fetchedObjetivos);
    } catch (error) {
      console.error("Error al cargar objetivos desde la API:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los objetivos. " + (error.message || ""),
        variant: "destructive",
      });
      setObjetivos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (objetivoData) => {
    try {
      setIsLoading(true);
      if (selectedObjetivo && selectedObjetivo.id) {
        await objetivosCalidadService.update(selectedObjetivo.id, objetivoData);
        toast({ title: "Objetivo actualizado", description: "Los datos del objetivo han sido actualizados exitosamente" });
      } else {
        await objetivosCalidadService.create(objetivoData);
        toast({ title: "Objetivo creado", description: "Se ha agregado un nuevo objetivo exitosamente" });
      }
      await loadObjetivos();
      setIsModalOpen(false);
      setSelectedObjetivo(null);
    } catch (error) {
      console.error("Error al guardar objetivo:", error);
      toast({ title: "Error", description: "Ocurrió un error al guardar el objetivo: " + (error.message || ""), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (objetivo) => {
    setSelectedObjetivo(objetivo);
    setIsModalOpen(true);
  };

  const handleView = (objetivo) => {
    setCurrentObjetivo(objetivo);
    setView('single');
  };

  const handleBackToListing = () => {
    setView('listing');
    setCurrentObjetivo(null);
  };

  const confirmDelete = (objetivo) => {
    setObjetivoToDelete(objetivo);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!objetivoToDelete) return;
    try {
      setIsLoading(true);
      await objetivosCalidadService.delete(objetivoToDelete.id);
      toast({
        title: "Objetivo eliminado",
        description: `El objetivo "${objetivoToDelete.codigo}" ha sido eliminado.`,
      });
      await loadObjetivos();
    } catch (error) {
      console.error("Error al eliminar objetivo:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el objetivo. " + (error.message || ""),
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setObjetivoToDelete(null);
      setIsLoading(false);
    }
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'en progreso': return 'bg-blue-100 text-blue-800';
      case 'completado': return 'bg-green-100 text-green-800';
      case 'activo': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredObjetivos = objetivos.filter(objetivo =>
    (objetivo.codigo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (objetivo.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (view === 'single') {
    return (
      <ObjetivoSingle
        objetivo={currentObjetivo}
        onBack={handleBackToListing}
        onEdit={handleEdit}
        onDelete={() => confirmDelete(currentObjetivo)}
      />
    );
  }

  return (
    <div className="p-4 bg-gray-50/50 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        {
          procesoId ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Objetivos de Calidad</h1>
                <p className="text-sm text-gray-500">Proceso: {procesoNombre}</p>
              </div>
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-gray-800">Objetivos de Calidad</h1>
          )
        }
        <div className="flex items-center gap-2">
          <Button onClick={() => { setSelectedObjetivo(null); setIsModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Objetivo
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por código o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Vista:</span>
            <Button variant={viewMode === 'cards' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('cards')}>
              <LayoutGrid className="h-4 w-4 mr-2" />
              Tarjetas
            </Button>
            <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('table')}>
              <TableIcon className="h-4 w-4 mr-2" />
              Tabla
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center"><p>Cargando objetivos...</p></div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredObjetivos.map((objetivo) => (
              <Card key={objetivo.id} onClick={() => handleView(objetivo)} className="cursor-pointer h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">{objetivo.codigo}</span>
                    <Badge className={getStatusColor(objetivo.estado)}>{objetivo.estado || "No definido"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <p className="font-semibold mb-2">{objetivo.descripcion}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Meta:</strong> {objetivo.meta || "-"}</p>
                    <p><strong>Responsable:</strong> {objetivo.responsable || "-"}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-2 bg-gray-50 border-t flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(objetivo); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); confirmDelete(objetivo); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left p-4">Código</th>
                  <th className="text-left p-4">Descripción</th>
                  <th className="text-left p-4">Responsable</th>
                  <th className="text-left p-4">Meta</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredObjetivos.map((objetivo) => (
                  <tr key={objetivo.id} onClick={() => handleView(objetivo)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-teal-500" />
                        <span className="font-medium">{objetivo.codigo}</span>
                      </div>
                    </td>
                    <td className="p-4"><p className="text-sm line-clamp-2">{objetivo.descripcion}</p></td>
                    <td className="p-4">{objetivo.responsable || "-"}</td>
                    <td className="p-4"><p className="text-sm line-clamp-1">{objetivo.meta || "-"}</p></td>
                    <td className="p-4"><Badge className={getStatusColor(objetivo.estado)}>{objetivo.estado || "No definido"}</Badge></td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(objetivo); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); confirmDelete(objetivo); }}><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filteredObjetivos.length === 0 && !isLoading && (
          <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
            <Target className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No se encontraron objetivos. Haz clic en "Nuevo Objetivo" para comenzar.</p>
          </div>
        )}
      </div>

      <ObjetivoModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedObjetivo(null); }}
        onSave={handleSave}
        objetivo={selectedObjetivo}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar objetivo?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. El objetivo será eliminado permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ObjetivosListing;
