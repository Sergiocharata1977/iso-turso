import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, List, Edit, Trash2, Plus, Search, FileText, AlertCircle, Check, X, Eye, Download, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import Modal from '../common/Modal';
import normasService from '../../services/normasService';
import ApiErrorHandler from '../common/ApiErrorHandler';

const NormasList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [normas, setNormas] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [normaToDelete, setNormaToDelete] = useState(null);
  
  // Cargar datos usando useCallback para evitar recreaciones innecesarias
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    setLocalError(null);
    
    try {
      console.log('Cargando datos de normas...');
      const response = await normasService.getAllNormas();
      console.log('Datos de normas cargados:', response);
      
      if (response.success) {
        setNormas(Array.isArray(response) ? response : (response.data || []));
      } else {
        setLocalError(response.message || 'Error al cargar los datos');
        setNormas([]);
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Error al cargar los datos"
        });
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setLocalError('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
      setNormas([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar los datos. Por favor, intenta de nuevo más tarde."
      });
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoizar las normas filtradas para evitar recálculos innecesarios
  const filteredNormas = useMemo(() => {
    // Asegurar que normas es un array válido
    const validNormas = Array.isArray(normas) ? normas : [];
    
    if (!searchTerm.trim()) return validNormas;
    
    const searchLower = searchTerm.toLowerCase();
    return validNormas.filter(norma => 
      norma.codigo?.toLowerCase().includes(searchLower) ||
      norma.titulo?.toLowerCase().includes(searchLower) ||
      norma.descripcion?.toLowerCase().includes(searchLower) ||
      norma.observaciones?.toLowerCase().includes(searchLower)
    );
  }, [normas, searchTerm]);

  // Memoizar handlers para evitar recreaciones
  const handleViewSingle = useCallback((id) => {
    navigate(`/normas/${id}`);
  }, [navigate]);

  const handleEdit = useCallback((norma) => {
    console.log('Editando norma:', norma);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback((norma) => {
    setNormaToDelete(norma);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!normaToDelete) return;
    
    try {
      await normasService.deleteNorma(normaToDelete.id);
      setNormas(prev => prev.filter(n => n.id !== normaToDelete.id));
      toast({
        title: "Éxito",
        description: "Norma eliminada correctamente"
      });
    } catch (err) {
      console.error('Error al eliminar norma:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al eliminar la norma"
      });
    } finally {
      setDeleteDialogOpen(false);
      setNormaToDelete(null);
    }
  }, [normaToDelete, toast]);

  const handleExport = useCallback(() => {
    console.log('Exportando normas...');
    toast({
      title: "Exportación",
      description: "Funcionalidad de exportación en desarrollo"
    });
  }, [toast]);

  const handleNewNorma = useCallback(() => {
    setModalOpen(true);
  }, []);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    codigo: '',
    titulo: '',
    descripcion: '',
    observaciones: ''
  });
  
  // Estado para modo edición
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Manejar cambios en el formulario
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }, [formData]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const normaData = {
        codigo: formData.codigo,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        observaciones: formData.observaciones
      };
      
      if (editMode) {
        await normasService.updateNorma(currentId, normaData);
        toast({
          title: "Éxito",
          description: "Norma actualizada correctamente"
        });
      } else {
        await normasService.createNorma(normaData);
        toast({
          title: "Éxito",
          description: "Norma creada correctamente"
        });
      }
      
      await fetchData();
      setFormData({
        codigo: '',
        titulo: '',
        descripcion: '',
        observaciones: ''
      });
      setEditMode(false);
      setCurrentId(null);
      setIsSubmitting(false);
      setModalOpen(false);
    } catch (err) {
      console.error('Error al guardar datos:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al guardar la norma"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editMode, currentId, toast]);

  // Renderizar contenido según el modo de vista
  const renderContent = useMemo(() => {
    if (loadingData) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredNormas.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay normas</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No se encontraron normas que coincidan con tu búsqueda.' : 'Comienza creando una nueva norma.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={handleNewNorma} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Norma
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNormas.map(norma => (
            <Card 
              key={norma.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleViewSingle(norma.id)}
            >
              <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Badge variant="secondary" className="bg-white text-teal-600 mr-2">
                        {norma.codigo}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{norma.titulo}</h3>
                    <p className="text-sm opacity-90 mt-1">ISO 9001:2015</p>
                  </div>
                  <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(norma)}
                      className="h-8 w-8 p-0 hover:bg-teal-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(norma)}
                      className="h-8 w-8 p-0 hover:bg-teal-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewSingle(norma.id)}
                      className="h-8 w-8 p-0 hover:bg-teal-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{norma.descripcion}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Observaciones</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{norma.observaciones}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-4 w-4 mr-2" />
                  <span className="text-sm">Click para ver detalles</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // Vista de tabla (lista)
    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNormas.map(norma => (
                  <tr 
                    key={norma.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewSingle(norma.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">{norma.codigo}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{norma.titulo}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{norma.descripcion}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700 line-clamp-2">{norma.observaciones}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewSingle(norma.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(norma)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(norma)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }, [filteredNormas, handleViewSingle]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Header Principal */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Puntos de Norma</h1>
              <p className="text-gray-600">Administra los puntos de norma del sistema de gestión de calidad</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button onClick={handleNewNorma} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Punto de Norma
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
                  placeholder="Buscar puntos de norma..."
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
          {renderContent}
        </div>
      </div>

      {/* Modal para crear/editar */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? 'Editar Punto de Norma' : 'Nuevo Punto de Norma'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-2">Punto *</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
                required
                placeholder="Ej: ISO 14001"
              />
            </div>
            
            <div>
              <label className="block text-slate-400 mb-2">Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
                required
                placeholder="Título de la norma"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-2">Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
                rows="3"
                required
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-2">Punto de Control</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
                rows="2"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isSubmitting ? 'Guardando...' : (editMode ? 'Actualizar' : 'Guardar')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la norma{' '}
              <span className="font-semibold">{normaToDelete?.codigo} - {normaToDelete?.titulo}</span>.
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
};

export default NormasList;
