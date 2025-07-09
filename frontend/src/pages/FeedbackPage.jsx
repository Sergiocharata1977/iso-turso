import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, User, MessageSquare, Bot, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Componente para el modal de creación/edición
const FeedbackModal = ({ isOpen, onClose, feedback = null, onSave }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    cliente: '',
    descripcion: '',
    prioridad_sugerida: '',
    area_sugerida: ''
  });

  useEffect(() => {
    if (feedback) {
      setFormData({
        tipo: feedback.tipo || '',
        cliente: feedback.cliente || '',
        descripcion: feedback.descripcion || '',
        prioridad_sugerida: feedback.prioridad_sugerida || '',
        area_sugerida: feedback.area_sugerida || ''
      });
    } else {
      setFormData({
        tipo: '',
        cliente: '',
        descripcion: '',
        prioridad_sugerida: '',
        area_sugerida: ''
      });
    }
  }, [feedback]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tipo || !formData.cliente || !formData.descripcion) {
      toast.error('Tipo, cliente y descripción son obligatorios');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {feedback ? 'Editar Feedback' : 'Nuevo Feedback de Cliente'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo *</label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mejora sugerida">Mejora sugerida</SelectItem>
                  <SelectItem value="Problema técnico">Problema técnico</SelectItem>
                  <SelectItem value="Pedido funcional">Pedido funcional</SelectItem>
                  <SelectItem value="Queja">Queja</SelectItem>
                  <SelectItem value="Felicitación">Felicitación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cliente *</label>
              <Input
                value={formData.cliente}
                onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                placeholder="Nombre del cliente"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción *</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Descripción detallada del feedback"
              className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prioridad Sugerida</label>
              <Select value={formData.prioridad_sugerida} onValueChange={(value) => setFormData({...formData, prioridad_sugerida: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Área Sugerida</label>
              <Select value={formData.area_sugerida} onValueChange={(value) => setFormData({...formData, area_sugerida: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UI">UI</SelectItem>
                  <SelectItem value="Seguridad">Seguridad</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Gestión de usuarios">Gestión de usuarios</SelectItem>
                  <SelectItem value="Base de datos">Base de datos</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Documentación">Documentación</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {feedback ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [filters, setFilters] = useState({
    tipo: '',
    estado: '',
    cliente: ''
  });

  // Cargar feedback
  const loadFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/feedback');
      const data = await response.json();
      
      if (data.success) {
        setFeedback(data.data);
      } else {
        toast.error('Error al cargar feedback');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  // Guardar feedback
  const handleSave = async (formData) => {
    try {
      const url = editingFeedback 
        ? `/api/feedback/${editingFeedback.id}`
        : '/api/feedback';
      
      const method = editingFeedback ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingFeedback ? 'Feedback actualizado' : 'Feedback creado');
        setModalOpen(false);
        setEditingFeedback(null);
        loadFeedback();
      } else {
        toast.error(data.message || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  // Eliminar feedback
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este feedback?')) return;

    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Feedback eliminado');
        loadFeedback();
      } else {
        toast.error(data.message || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  // Clasificar automáticamente
  const handleClasificarAutomaticamente = async (id) => {
    try {
      const response = await fetch(`/api/feedback/${id}/clasificar`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Feedback clasificado automáticamente');
        loadFeedback();
      } else {
        toast.error(data.message || 'Error al clasificar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  // Convertir en tarea
  const handleConvertirEnTarea = async (id) => {
    try {
      const response = await fetch(`/api/feedback/${id}/convertir-tarea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: `Tarea generada desde feedback`,
          responsable: '',
          fecha_estimada: ''
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Feedback convertido en tarea interna');
        loadFeedback();
      } else {
        toast.error(data.message || 'Error al convertir');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  // Filtrar feedback
  const filteredFeedback = feedback.filter(item => {
    return (
      (!filters.tipo || item.tipo === filters.tipo) &&
      (!filters.estado || item.estado === filters.estado) &&
      (!filters.cliente || item.cliente.toLowerCase().includes(filters.cliente.toLowerCase()))
    );
  });

  // Obtener color del badge según tipo
  const getTypeColor = (tipo) => {
    switch (tipo) {
      case 'Mejora sugerida': return 'bg-blue-100 text-blue-800';
      case 'Problema técnico': return 'bg-red-100 text-red-800';
      case 'Pedido funcional': return 'bg-green-100 text-green-800';
      case 'Queja': return 'bg-orange-100 text-orange-800';
      case 'Felicitación': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener color del badge según estado
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Nuevo': return 'bg-orange-100 text-orange-800';
      case 'Procesado': return 'bg-blue-100 text-blue-800';
      case 'Vinculado': return 'bg-green-100 text-green-800';
      case 'Cerrado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feedback de Clientes</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Feedback
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Mejora sugerida">Mejora sugerida</SelectItem>
                  <SelectItem value="Problema técnico">Problema técnico</SelectItem>
                  <SelectItem value="Pedido funcional">Pedido funcional</SelectItem>
                  <SelectItem value="Queja">Queja</SelectItem>
                  <SelectItem value="Felicitación">Felicitación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <Select value={filters.estado} onValueChange={(value) => setFilters({...filters, estado: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Nuevo">Nuevo</SelectItem>
                  <SelectItem value="Procesado">Procesado</SelectItem>
                  <SelectItem value="Vinculado">Vinculado</SelectItem>
                  <SelectItem value="Cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cliente</label>
              <Input
                value={filters.cliente}
                onChange={(e) => setFilters({...filters, cliente: e.target.value})}
                placeholder="Buscar por cliente"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de feedback */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando feedback...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFeedback.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{item.cliente}</h3>
                      <Badge className={getTypeColor(item.tipo)}>
                        {item.tipo}
                      </Badge>
                      <Badge className={getStatusColor(item.estado)}>
                        {item.estado}
                      </Badge>
                      {item.prioridad_sugerida && (
                        <Badge variant="outline">
                          {item.prioridad_sugerida}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-3">{item.descripcion}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.fecha).toLocaleDateString()}
                      </span>
                      {item.area_sugerida && (
                        <span className="text-emerald-600 font-medium">{item.area_sugerida}</span>
                      )}
                      {item.tarea_vinculada_titulo && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <LinkIcon className="w-4 h-4" />
                          Vinculado a tarea
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {item.estado === 'Nuevo' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClasificarAutomaticamente(item.id)}
                        className="text-blue-600"
                      >
                        <Bot className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {item.estado === 'Procesado' && !item.vinculo_tarea && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConvertirEnTarea(item.id)}
                        className="text-green-600"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingFeedback(item);
                        setModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredFeedback.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No se encontró feedback</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Modal */}
      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingFeedback(null);
        }}
        feedback={editingFeedback}
        onSave={handleSave}
      />
    </div>
  );
};

export default FeedbackPage; 