import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { getEstadoInfo, ESTADOS } from '@/lib/hallazgoEstados';
import { useToast } from '@/components/ui/use-toast';

// Components
import HallazgoModal from './HallazgoModal';
import HallazgoDetailModal from './HallazgoDetailModal';
import HallazgoCard from './HallazgoCard'; // Importar la nueva tarjeta
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Icons
import { PlusCircle, Search, FileText, Activity, CheckCircle } from 'lucide-react';

// Helper to get badge class based on Etapa
const getEtapaBadgeClass = (etapa) => {
  switch (etapa) {
    case 'Detección':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100/80 border-purple-200';
    case 'Tratamiento':
      return 'bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200';
    case 'Verificación':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper to get badge class based on Prioridad
const getPriorityBadgeClass = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'alta':
      return 'bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200';
    case 'media':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-yellow-200';
    case 'baja':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const DeteccionHallazgo = () => {
  const [hallazgos, setHallazgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentHallazgo, setCurrentHallazgo] = useState(null);
  const [hallazgoToView, setHallazgoToView] = useState(null);
  const [hallazgoToDelete, setHallazgoToDelete] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  const fetchHallazgos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hallazgos');
      if (!response.ok) {
        throw new Error('No se pudo obtener los hallazgos');
      }
      const data = await response.json();
      setHallazgos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHallazgos();
  }, [fetchHallazgos]);

  // --- Handlers ---
  const handleOpenModal = (hallazgo = null) => {
    setCurrentHallazgo(hallazgo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentHallazgo(null);
  };

  const handleOpenDetailModal = (hallazgo) => {
    setHallazgoToView(hallazgo);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setHallazgoToView(null);
  };

  const handleSaveHallazgo = async (formData) => {
    const isUpdating = !!currentHallazgo;
    const url = isUpdating ? `/api/hallazgos/${currentHallazgo.id}` : '/api/hallazgos';
    const method = isUpdating ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el hallazgo');
      }

      toast({
        title: 'Éxito',
        description: `Hallazgo ${isUpdating ? 'actualizado' : 'creado'} correctamente.`,
      });

      handleCloseModal();
      fetchHallazgos(); // Refresh data
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message,
      });
    }
  };

  const handleOpenAlert = (hallazgo) => {
    setHallazgoToDelete(hallazgo);
    setIsAlertOpen(true);
  };

  const handleDeleteHallazgo = async () => {
    if (!hallazgoToDelete) return;

    try {
      const response = await fetch(`/api/hallazgos/${hallazgoToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el hallazgo');
      }

      toast({
        title: 'Éxito',
        description: 'Hallazgo eliminado correctamente.',
      });

      fetchHallazgos(); // Refresh data
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message,
      });
    } finally {
      setIsAlertOpen(false);
      setHallazgoToDelete(null);
    }
  };

  // --- Memos for performance ---
  const stats = useMemo(() => {
    const total = hallazgos.length;
    const enDeteccion = hallazgos.filter(h => getEstadoInfo(h.estado)?.etapa === 'Detección').length;
    const enTratamiento = hallazgos.filter(h => getEstadoInfo(h.estado)?.etapa === 'Tratamiento').length;
    const enVerificacion = hallazgos.filter(h => getEstadoInfo(h.estado)?.etapa === 'Verificación').length;
    return { total, enDeteccion, enTratamiento, enVerificacion };
  }, [hallazgos]);

  const filteredHallazgos = useMemo(() => {
    if (!searchTerm) return hallazgos;
    return hallazgos.filter(h =>
      h.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.numeroHallazgo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.responsable.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [hallazgos, searchTerm]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando hallazgos...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Mejoras ISO 9001</h1>
          <p className="text-muted-foreground">Gestión de hallazgos y acciones correctivas.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Hallazgo
        </Button>
      </div>

      {/* --- Tarjetas de Estadísticas --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hallazgos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Detección</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enDeteccion}</div>
            <p className="text-xs text-muted-foreground">Requieren acción inmediata</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Tratamiento</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enTratamiento}</div>
            <p className="text-xs text-muted-foreground">Análisis y corrección</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Verificación</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enVerificacion}</div>
            <p className="text-xs text-muted-foreground">Validando eficacia</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Lista de Hallazgos --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold tracking-tight">Hallazgos Registrados</h2>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título, ID o responsable..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>

        {filteredHallazgos.length > 0 ? (
          <div className="space-y-4">
            {filteredHallazgos.map((hallazgo) => (
              <HallazgoCard 
                key={hallazgo.id} 
                hallazgo={hallazgo} 
                onClick={handleOpenDetailModal} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron resultados.</p>
          </div>
        )}
      </div>

      {/* --- Modals & Dialogs --- */}
      <HallazgoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveHallazgo}
        hallazgo={currentHallazgo}
      />

      <HallazgoDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        hallazgo={hallazgoToView}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el hallazgo y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteHallazgo}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeteccionHallazgo;
