import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  FileText,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import ProcesoModal from './ProcesoModal';
import procesosService from '@/services/procesosService';

function ProcesosListing() {
  const { toast } = useToast();
  const [procesos, setProcesos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [procesoToDelete, setProcesoToDelete] = useState(null);
  const navigate = useNavigate();

  const loadProcesos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await procesosService.getProcesos();
      console.log('Datos de procesos cargados:', data);
      setProcesos(data || []);
    } catch (err) {
      console.error("Error al cargar procesos:", err);
      setError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProcesos();
  }, [loadProcesos]);

  const filteredProcesos = procesos.filter(proceso => 
    proceso.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    proceso.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (procesoData) => {
    try {
      if (selectedProceso) {
        await procesosService.updateProceso(selectedProceso.id, procesoData);
        toast({ title: 'Proceso actualizado con éxito' });
      } else {
        await procesosService.createProceso(procesoData);
        toast({ title: 'Proceso creado con éxito' });
      }
      setIsModalOpen(false);
      setSelectedProceso(null);
      await loadProcesos();
    } catch (error) {
      console.error("Error al guardar proceso:", error);
      
      if (error.response && error.response.status === 409) {
        toast({
          title: 'Error: Código Duplicado',
          description: 'Ya existe un proceso con ese código. Por favor, utiliza un código diferente.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error al guardar',
          description: error.message || 'Ocurrió un error inesperado.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEdit = (e, proceso) => {
    e.stopPropagation(); // Evitar que el clic se propague a la tarjeta
    setSelectedProceso(proceso);
    setIsModalOpen(true);
  };

  const confirmDelete = (proceso) => {
    setProcesoToDelete(proceso);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!procesoToDelete) return;
    try {
      await procesosService.deleteProceso(procesoToDelete.id);
      toast({ title: 'Proceso eliminado con éxito' });
      await loadProcesos();
    } catch (error) {
      toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' });
    } finally {
      setIsDeleteDialogOpen(false);
      setProcesoToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Procesos</h1>
            <p className="text-sm text-gray-500">Administra los procesos de la organización</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0 bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => {
              setSelectedProceso(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Nuevo Proceso
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Buscar procesos..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando procesos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar los datos</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={loadProcesos}>Reintentar</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {filteredProcesos.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 border rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-500">
                No se encontraron procesos. {searchTerm ? 'Intenta con otra búsqueda.' : "Haz clic en 'Nuevo Proceso' para comenzar."}
              </p>
            </div>
          ) : (
            filteredProcesos.map((proceso) => (
              <motion.div
                key={proceso.id}
                layoutId={`proceso-card-${proceso.id}`}
                onClick={() => navigate(`/procesos/${proceso.id}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between group transition-all duration-300 hover:shadow-lg hover:border-teal-500 cursor-pointer"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {proceso.codigo}
                    </span>
                    <span className="text-sm text-gray-500">
                      v{proceso.version}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 group-hover:text-teal-600 mt-2 transition-colors">
                    {proceso.nombre}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {proceso.descripcion || "Sin descripción"}
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    <span>Responsable: {proceso.responsable}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-2 flex justify-end items-center space-x-1 rounded-b-lg border-t">
                  <Button variant="ghost" size="icon" onClick={(e) => handleEdit(e, proceso)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600" 
                    onClick={(e) => { e.stopPropagation(); confirmDelete(proceso); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <ProcesoModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedProceso(null); }}
          onSave={handleSave}
          proceso={selectedProceso}
        />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription className="pt-2">
              ¿Estás seguro de que deseas eliminar el proceso "{procesoToDelete?.nombre}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProcesosListing;
