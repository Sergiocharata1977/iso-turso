import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Target,
  List,
  Grid3X3,
  BarChart3
} from 'lucide-react';
import { auditoriasService } from '../../services/auditoriasService.js';
import { departamentosService } from '../../services/departamentos.js';
import { Button } from '../ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';
import { useNavigate } from 'react-router-dom';
import AuditoriaModal from './AuditoriaModal.jsx';

// ===============================================
// COMPONENTE DE LISTADO DE AUDITORÍAS - SGC PRO
// ===============================================

const AuditoriasListing = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'grid', 'list'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuditoria, setEditingAuditoria] = useState(null);
  const navigate = useNavigate();

  // Estados de auditoría
  const estados = auditoriasService.getEstados();

  const estadoConfigs = {
    planificada: { colorClasses: 'bg-blue-100 dark:bg-blue-900/40', label: 'Planificada' },
    en_proceso: { colorClasses: 'bg-orange-100 dark:bg-orange-900/40', label: 'En Proceso' },
    completada: { colorClasses: 'bg-green-100 dark:bg-green-900/40', label: 'Completada' },
    cancelada: { colorClasses: 'bg-red-100 dark:bg-red-900/40', label: 'Cancelada' },
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar auditorías y departamentos en paralelo
      const [auditoriasRes, departamentosRes] = await Promise.all([
        auditoriasService.getAll(),
        departamentosService.getAll()
      ]);

      setAuditorias(auditoriasRes.data || []);
      
      // Procesar departamentos
      let departamentosData = [];
      if (departamentosRes?.data) {
        departamentosData = departamentosRes.data;
      } else if (Array.isArray(departamentosRes)) {
        departamentosData = departamentosRes;
      } else if (departamentosRes?.success && departamentosRes?.data) {
        departamentosData = departamentosRes.data;
      }
      
      setDepartamentos(departamentosData);
      
      console.log('📊 Datos cargados:', {
        auditorias: auditoriasRes.data?.length || 0,
        departamentos: departamentosData.length
      });
      
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener nombres de departamentos desde áreas
  const getAreaNames = (areas) => {
    if (!areas) return 'Sin área';
    
    try {
      // Si es string, intentar parsear como JSON
      const areasArray = typeof areas === 'string' ? JSON.parse(areas) : areas;
      
      if (areasArray.includes('todos')) {
        return 'Todos los departamentos';
      }
      
      const areaNames = areasArray
        .map(areaId => {
          const depto = departamentos.find(d => d.id?.toString() === areaId?.toString());
          return depto?.nombre || `Departamento ${areaId}`;
        })
        .filter(name => name);
      
      return areaNames.length > 0 ? areaNames.join(', ') : 'Sin área';
    } catch (error) {
      console.error('Error parseando áreas:', error);
      return areas; // Devolver el valor original si no se puede parsear
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta auditoría?')) {
      try {
        await auditoriasService.delete(id);
        await loadData(); // Reload data after deletion
      } catch (err) {
        console.error('Error eliminando auditoría:', err);
        alert('Error al eliminar la auditoría');
      }
    }
  };

  const handleOpenModal = (auditoria = null) => {
    setEditingAuditoria(auditoria);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAuditoria(null);
  };

  const handleSaveAuditoria = async (formData) => {
    try {
      if (editingAuditoria) {
        await auditoriasService.update(editingAuditoria.id, formData);
      } else {
        await auditoriasService.create(formData);
      }
      await loadData(); // Reload data after saving
      handleCloseModal();
    } catch (error) {
      console.error('Error guardando auditoría:', error);
      throw error;
    }
  };

  const getAuditoriasByEstado = (estado) => {
    return auditorias.filter(audit => audit.estado === estado);
  };

  const getEstadoConfig = (estado) => {
    return estados.find(e => e.value === estado) || estados[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  // Componente de tarjeta de auditoría
  const AuditoriaCard = ({ auditoria }) => {
    const estadoConfig = getEstadoConfig(auditoria.estado);
    
    return (
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-sgc-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-sgc-800 mb-1">
                {auditoria.codigo}
              </CardTitle>
              <Badge 
                className={`text-xs font-medium px-2 py-1 ${
                  estadoConfig.value === 'planificada' ? 'bg-blue-100 text-blue-700' :
                  estadoConfig.value === 'en_proceso' ? 'bg-yellow-100 text-yellow-700' :
                  estadoConfig.value === 'completada' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}
              >
                {estadoConfig.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-sgc-700">
              <Target className="w-4 h-4 mr-2 text-sgc-500" />
              <span className="font-medium">Área:</span>
              <span className="ml-1">{getAreaNames(auditoria.area)}</span>
            </div>
            
            <div className="flex items-center text-sm text-sgc-700">
              <User className="w-4 h-4 mr-2 text-sgc-500" />
              <span className="font-medium">Responsable:</span>
              <span className="ml-1">{auditoria.responsable_nombre || 'No asignado'}</span>
            </div>
            
            <div className="flex items-center text-sm text-sgc-700">
              <Calendar className="w-4 h-4 mr-2 text-sgc-500" />
              <span className="font-medium">Fecha:</span>
              <span className="ml-1">{formatDate(auditoria.fecha_programada)}</span>
            </div>
            
            {auditoria.objetivos && (
              <p className="text-sm text-sgc-600 mt-3 line-clamp-2">
                {auditoria.objetivos}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-sgc-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/auditorias/${auditoria.id}`)}
              className="text-sgc-600 hover:text-sgc-700 hover:bg-sgc-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/auditorias/${auditoria.id}/editar`)}
              className="text-sgc-600 hover:text-sgc-700 hover:bg-sgc-50"
            >
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(auditoria.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Vista Kanban
  const KanbanView = () => (
    <div className="flex-grow overflow-x-auto pb-4">
      <div className="flex gap-4" style={{ minWidth: `${Object.keys(estadoConfigs).length * 320}px` }}>
        {Object.entries(estadoConfigs).map(([estadoKey, config]) => (
          <div key={estadoKey} className={`flex flex-col w-80 flex-shrink-0 rounded-lg ${config.colorClasses}`}>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                {config.label}
                <span className="ml-2 text-sm font-normal bg-black/10 dark:bg-white/10 rounded-full px-2 py-0.5">
                  {getAuditoriasByEstado(estadoKey).length}
                </span>
              </h3>
            </div>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-black/5 dark:bg-black/10">
              {getAuditoriasByEstado(estadoKey).length > 0 ? (
                getAuditoriasByEstado(estadoKey).map(auditoria => (
                  <AuditoriaCard key={auditoria.id} auditoria={auditoria} />
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  No hay auditorías en este estado
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Vista Grid
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {auditorias.map((auditoria) => (
        <AuditoriaCard key={auditoria.id} auditoria={auditoria} />
      ))}
      
      {auditorias.length === 0 && (
        <div className="col-span-full text-center py-12 text-sgc-500">
          No hay auditorías registradas
        </div>
      )}
    </div>
  );

  // Vista Lista
  const ListView = () => (
    <div className="space-y-4">
      {auditorias.map((auditoria) => (
        <Card key={auditoria.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold text-sgc-800">
                    {auditoria.codigo}
                  </h3>
                  <p className="text-sgc-600">{auditoria.titulo}</p>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-sgc-700">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {getAreaNames(auditoria.area)}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {auditoria.responsable_nombre || 'No asignado'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(auditoria.fecha_programada)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge 
                  className={`${
                    getEstadoConfig(auditoria.estado).value === 'planificada' ? 'bg-blue-100 text-blue-700' :
                    getEstadoConfig(auditoria.estado).value === 'en_proceso' ? 'bg-yellow-100 text-yellow-700' :
                    getEstadoConfig(auditoria.estado).value === 'completada' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}
                >
                  {getEstadoConfig(auditoria.estado).label}
                </Badge>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/auditorias/${auditoria.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(auditoria)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(auditoria.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {auditorias.length === 0 && (
        <div className="text-center py-12 text-sgc-500">
          No hay auditorías registradas
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-sgc-600">Cargando auditorías...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sgc-800">
            Sistema de Administración de Auditorías ISO 9001
          </h1>
          <p className="text-sgc-600 mt-1">
            Gestiona y controla todas las auditorías del sistema de calidad
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Controles de vista */}
          <div className="flex items-center bg-white rounded-lg border border-sgc-200 p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-sgc-600 text-white' : 'text-sgc-600'}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-sgc-600 text-white' : 'text-sgc-600'}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className={viewMode === 'kanban' ? 'bg-sgc-600 text-white' : 'text-sgc-600'}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Botón Nueva Auditoría */}
          <Button
            onClick={() => handleOpenModal()}
            className="bg-sgc-600 hover:bg-sgc-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Auditoría</span>
          </Button>
        </div>
      </div>

      {/* Contenido según vista */}
      <div className="flex flex-col flex-grow">
        {viewMode === 'kanban' && <KanbanView />}
        {viewMode === 'grid' && <GridView />}
        {viewMode === 'list' && <ListView />}
      </div>

      <AuditoriaModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAuditoria}
        auditoria={editingAuditoria}
      />
    </div>
  );
};

export default AuditoriasListing;
