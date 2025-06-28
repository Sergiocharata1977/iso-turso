import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  FileDown,
  PlusCircle,
  Search,
  List,
  LayoutGrid,
  AlertCircle,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ClipboardList,
  PlayCircle,
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import encuestasService from '@/services/encuestasService';
import EncuestaModal from './EncuestaModal';

const EncuestasListing = () => {
  const { toast } = useToast();
  const [encuestas, setEncuestas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEncuesta, setSelectedEncuesta] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [encuestaToDelete, setEncuestaToDelete] = useState(null);
  const navigate = useNavigate();

  const loadEncuestas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await encuestasService.getAll();
      setEncuestas(data || []);
    } catch (err) {
      console.error("Error al cargar encuestas:", err);
      setError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEncuestas();
  }, [loadEncuestas]);

  const handleCreate = () => {
    setSelectedEncuesta(null);
    setIsModalOpen(true);
  };

  const handleEdit = (encuesta) => {
    setSelectedEncuesta(encuesta);
    setIsModalOpen(true);
  };

    const handleSave = async (encuestaData) => {
    const payload = {
      ...encuestaData,
      creador: 'Admin', // TODO: Reemplazar con el usuario autenticado
      // El backend espera las preguntas como un string JSON
      preguntas: JSON.stringify(encuestaData.preguntas || []),
    };


    try {
      if (payload.id) {
        await encuestasService.update(payload.id, payload);
        toast({ title: 'Encuesta actualizada con éxito' });
      } else {
        await encuestasService.create(payload);
        toast({ title: 'Encuesta creada con éxito' });
      }
      setIsModalOpen(false);
      setSelectedEncuesta(null);
      loadEncuestas();
    } catch (err) {
      toast({
        title: 'Error al guardar',
        description: err.message || 'No se pudo guardar la encuesta.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = (encuesta) => {
    setEncuestaToDelete(encuesta);
    setDeleteDialogOpen(true);
  };

    const confirmDelete = async () => {
    if (!encuestaToDelete) return;
    try {
      await encuestasService.delete(encuestaToDelete.id);
      toast({ title: 'Encuesta eliminada con éxito' });
      setDeleteDialogOpen(false);
      setEncuestaToDelete(null);
      loadEncuestas();
    } catch (err) {
      toast({
        title: 'Error al eliminar',
        description: err.message || 'No se pudo eliminar la encuesta.',
        variant: 'destructive',
      });
    }
  };
  
    const getStatusBadge = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activa':
        return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Activa</Badge>;
      case 'borrador':
        return <Badge variant="warning"><Pencil className="h-3 w-3 mr-1" />Borrador</Badge>;
      case 'cerrada':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cerrada</Badge>;
      case 'archivada':
        return <Badge variant="info"><Clock className="h-3 w-3 mr-1" />Archivada</Badge>;
      default:
        return <Badge variant="secondary">{estado || 'Desconocido'}</Badge>;
    }
  };

  const filteredEncuestas = encuestas.filter(
    (encuesta) =>
      encuesta.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encuesta.creador?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderGridView = () => (
    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredEncuestas.map((encuesta) => (
        <motion.div key={encuesta.id} layout>
          <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-base font-semibold truncate">{encuesta.titulo}</CardTitle>
              {getStatusBadge(encuesta.estado)}
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500 line-clamp-2">{encuesta.descripcion || 'Sin descripción.'}</p>
            </CardContent>
            <CardFooter className="flex justify-end items-center pt-4 mt-auto border-t gap-1">
                <Button variant="ghost" size="icon" title="Responder Encuesta" onClick={() => navigate(`/encuestas/responder/${encuesta.id}`)}>
                  <PlayCircle className="h-4 w-4 text-emerald-600" />
                </Button>
                <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEdit(encuesta)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" title="Eliminar" onClick={() => handleDelete(encuesta)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderTableView = () => (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Título</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Creador</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Fecha Creación</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEncuestas.map((encuesta) => (
              <tr key={encuesta.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-800">{encuesta.titulo}</td>
                <td className="px-4 py-2 text-gray-600">{encuesta.creador}</td>
                <td className="px-4 py-2">{getStatusBadge(encuesta.estado)}</td>
                <td className="px-4 py-2 text-gray-600">{new Date(encuesta.fechaCreacion).toLocaleDateString()}</td>
                                  <td className="px-4 py-2 text-right">
                    <Button variant="ghost" size="icon" title="Responder Encuesta" onClick={() => navigate(`/encuestas/responder/${encuesta.id}`)}>
                      <PlayCircle className="h-4 w-4 text-emerald-600" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEdit(encuesta)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Eliminar" onClick={() => handleDelete(encuesta)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /></div>;
    if (error) return <div className="text-center py-12"><AlertCircle className="mx-auto h-12 w-12 text-red-500" /><p className="mt-4 text-red-600 font-semibold">Error al cargar los datos</p><p className="text-sm text-gray-500">{error}</p><Button onClick={loadEncuestas} className="mt-4">Reintentar</Button></div>;
    if (filteredEncuestas.length === 0) return <div className="text-center py-12"><ClipboardList className="mx-auto h-12 w-12 text-gray-400" /><p className="mt-4 text-gray-500">No se encontraron encuestas.</p></div>;
    return viewMode === 'grid' ? renderGridView() : renderTableView();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Encuestas</h1>
            <p className="text-sm text-gray-500">Crea, gestiona y analiza las encuestas de satisfacción.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex items-center space-x-2"><FileDown className="h-4 w-4" /><span>Exportar</span></Button>
            <Button size="sm" className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700" onClick={handleCreate}><PlusCircle className="h-4 w-4" /><span>Nueva Encuesta</span></Button>
          </div>
        </div>
      </header>

      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar por título o creador..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}><LayoutGrid className="h-4 w-4" /></Button>
            <Button variant={viewMode === 'table' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('table')}><List className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <main className="flex-1 p-4 overflow-auto">
        {renderContent()}
      </main>

      {isModalOpen && (
        <EncuestaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          encuesta={selectedEncuesta}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la encuesta "{encuestaToDelete?.titulo}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EncuestasListing;
