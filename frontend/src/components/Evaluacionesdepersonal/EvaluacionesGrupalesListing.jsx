import React, { useState, useEffect, useContext } from 'react';
import { Search, Plus, FileText, Users, Calendar, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import ConfirmDialog from '../ui/confirm-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { evaluacionesGrupalesService } from '../../services/evaluacionesGrupales';
import EvaluacionGrupalModal from './EvaluacionGrupalModal';
import EvaluacionGrupalSingle from './EvaluacionGrupalSingle';
import { AuthContext } from '../../context/AuthContext';

const EvaluacionesGrupalesListing = () => {
  const { organizationId } = useContext(AuthContext);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [filteredEvaluaciones, setFilteredEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'single'
  const [selectedEvaluacionId, setSelectedEvaluacionId] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [evaluacionToDelete, setEvaluacionToDelete] = useState(null);

  useEffect(() => {
    if (organizationId) {
    loadEvaluaciones();
    }
  }, [organizationId]);

  useEffect(() => {
    filterEvaluaciones();
  }, [evaluaciones, searchTerm, selectedEstado]);

  const loadEvaluaciones = async () => {
    try {
      setLoading(true);
      console.log('🔍 [DEBUG] Iniciando carga de evaluaciones grupales...');
      const data = await evaluacionesGrupalesService.getAll({}, organizationId);
      console.log('🔍 [DEBUG] Datos recibidos del servicio:', data);
      console.log('🔍 [DEBUG] Tipo de datos:', typeof data);
      console.log('🔍 [DEBUG] Es array?:', Array.isArray(data));
      console.log('🔍 [DEBUG] Longitud:', data?.length);
      setEvaluaciones(data);
      console.log('🔍 [DEBUG] Estado evaluaciones actualizado con:', data);
    } catch (error) {
      console.error('❌ [ERROR] Error al cargar evaluaciones grupales:', error);
      toast.error('Error al cargar evaluaciones grupales');
    } finally {
      setLoading(false);
    }
  };

  const filterEvaluaciones = () => {
    let filtered = evaluaciones;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(evaluacion =>
        evaluacion.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluacion.proceso_capacitacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluacion.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (selectedEstado !== 'all') {
      filtered = filtered.filter(evaluacion => evaluacion.estado === selectedEstado);
    }

    setFilteredEvaluaciones(filtered);
  };

  const handleCreate = () => {
    setSelectedEvaluacion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (evaluacion) => {
    setSelectedEvaluacion(evaluacion);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setEvaluacionToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!evaluacionToDelete) return;
    
    try {
      await evaluacionesGrupalesService.delete(evaluacionToDelete, organizationId);
      toast.success('Evaluación grupal eliminada exitosamente');
      loadEvaluaciones();
    } catch (error) {
      toast.error('Error al eliminar la evaluación grupal');
      console.error('Error:', error);
    } finally {
      setEvaluacionToDelete(null);
    }
  };

  const handleModalSave = async (data) => {
    try {
      const evaluacionData = {
        ...data,
        organization_id: organizationId
      };

      if (selectedEvaluacion) {
        await evaluacionesGrupalesService.update(selectedEvaluacion.id, evaluacionData);
        toast.success('Evaluación grupal actualizada exitosamente');
      } else {
        await evaluacionesGrupalesService.create(evaluacionData);
        toast.success('Evaluación grupal creada exitosamente');
      }
      setIsModalOpen(false);
      loadEvaluaciones();
    } catch (error) {
      toast.error(error.message || 'Error al guardar la evaluación grupal');
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      planificada: { color: 'bg-blue-100 text-blue-800', label: 'Planificada' },
      en_progreso: { color: 'bg-yellow-100 text-yellow-800', label: 'En Progreso' },
      completada: { color: 'bg-green-100 text-green-800', label: 'Completada' },
      cancelada: { color: 'bg-red-100 text-red-800', label: 'Cancelada' }
    };
    const badge = badges[estado] || badges.planificada;
    return <Badge className={badge.color}>{badge.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Principal */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Evaluaciones Grupales</h1>
              <p className="text-gray-600">Administra las evaluaciones grupales según ISO 9001</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Evaluación Grupal
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
                  placeholder="Buscar evaluaciones grupales, títulos, estados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="planificada">Planificada</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="default" 
                size="sm"
              >
                Tarjetas
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Grid de Evaluaciones */}
          {currentView === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvaluaciones.map((evaluacion) => (
                <Card key={evaluacion.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-teal-500">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-800 mb-2">
                          {evaluacion.titulo}
                        </CardTitle>
                        {getEstadoBadge(evaluacion.estado)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Información básica */}
                    <div className="space-y-2 text-sm">
                      {evaluacion.proceso_capacitacion && (
                        <div className="flex items-center text-gray-600">
                          <FileText className="h-4 w-4 mr-2" />
                          <span>{evaluacion.proceso_capacitacion}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(evaluacion.fecha_evaluacion)}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{evaluacion.total_empleados || 0} empleados</span>
                      </div>
                    </div>

                    {/* Descripción */}
                    {evaluacion.descripcion && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {evaluacion.descripcion}
                      </p>
                    )}

                    {/* Acciones */}
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEvaluacionId(evaluacion.id);
                          setCurrentView('single');
                        }}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(evaluacion)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(evaluacion.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {currentView === 'single' && (
            <EvaluacionGrupalSingle 
              evaluacionId={selectedEvaluacionId} 
              onBack={() => setCurrentView('list')} 
            />
          )}

          {/* Estado vacío */}
          {!loading && filteredEvaluaciones.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay evaluaciones grupales
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedEstado !== 'all' 
                  ? 'No se encontraron evaluaciones con los filtros aplicados.'
                  : 'Comienza creando tu primera evaluación grupal.'
                }
              </p>
              {(!searchTerm && selectedEstado === 'all') && (
                <Button onClick={handleCreate} className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Evaluación Grupal
                </Button>
              )}
            </div>
          )}

          {/* Modal */}
          <EvaluacionGrupalModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleModalSave}
            evaluacion={selectedEvaluacion}
          />
          
          {/* Diálogo de confirmación para eliminar */}
          <ConfirmDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDelete}
            title="Eliminar evaluación grupal"
            message="¿Estás seguro de que deseas eliminar esta evaluación grupal? Esta acción no se puede deshacer."
            confirmText="Eliminar"
            cancelText="Cancelar"
            isDestructive={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EvaluacionesGrupalesListing;
