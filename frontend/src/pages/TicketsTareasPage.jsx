import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Componente para el modal de creación/edición
const TicketModal = ({ isOpen, onClose, ticket = null, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    area: '',
    prioridad: '',
    responsable: '',
    fecha_estimada: '',
    descripcion: ''
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        titulo: ticket.titulo || '',
        area: ticket.area || '',
        prioridad: ticket.prioridad || '',
        responsable: ticket.responsable || '',
        fecha_estimada: ticket.fecha_estimada ? ticket.fecha_estimada.split('T')[0] : '',
        descripcion: ticket.descripcion || ''
      });
    } else {
      setFormData({
        titulo: '',
        area: '',
        prioridad: '',
        responsable: '',
        fecha_estimada: '',
        descripcion: ''
      });
    }
  }, [ticket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.area || !formData.prioridad) {
      toast.error('Título, área y prioridad son obligatorios');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {ticket ? 'Editar Ticket' : 'Nuevo Ticket de Tarea Interna'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <Input
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              placeholder="Título de la tarea"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Área *</label>
              <Select value={formData.area} onValueChange={(value) => setFormData({...formData, area: value})}>
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

            <div>
              <label className="block text-sm font-medium mb-1">Prioridad *</label>
              <Select value={formData.prioridad} onValueChange={(value) => setFormData({...formData, prioridad: value})}>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Responsable</label>
              <Input
                value={formData.responsable}
                onChange={(e) => setFormData({...formData, responsable: e.target.value})}
                placeholder="Nombre del responsable"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fecha Estimada</label>
              <Input
                type="date"
                value={formData.fecha_estimada}
                onChange={(e) => setFormData({...formData, fecha_estimada: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Descripción detallada de la tarea"
              className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {ticket ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TicketsTareasPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [filters, setFilters] = useState({
    estado: '',
    prioridad: '',
    area: '',
    responsable: ''
  });

  // Cargar tickets
  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tickets-tareas');
      const data = await response.json();
      
      if (data.success) {
        setTickets(data.data);
      } else {
        toast.error('Error al cargar tickets');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Guardar ticket
  const handleSave = async (formData) => {
    try {
      const url = editingTicket 
        ? `/api/tickets-tareas/${editingTicket.id}`
        : '/api/tickets-tareas';
      
      const method = editingTicket ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingTicket ? 'Ticket actualizado' : 'Ticket creado');
        setModalOpen(false);
        setEditingTicket(null);
        loadTickets();
      } else {
        toast.error(data.message || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  // Eliminar ticket
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este ticket?')) return;

    try {
      const response = await fetch(`/api/tickets-tareas/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Ticket eliminado');
        loadTickets();
      } else {
        toast.error(data.message || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  // Filtrar tickets
  const filteredTickets = tickets.filter(ticket => {
    return (
      (!filters.estado || ticket.estado === filters.estado) &&
      (!filters.prioridad || ticket.prioridad === filters.prioridad) &&
      (!filters.area || ticket.area === filters.area) &&
      (!filters.responsable || ticket.responsable?.toLowerCase().includes(filters.responsable.toLowerCase()))
    );
  });

  // Obtener color del badge según prioridad
  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener color del badge según estado
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'bg-orange-100 text-orange-800';
      case 'En desarrollo': return 'bg-blue-100 text-blue-800';
      case 'Finalizada': return 'bg-green-100 text-green-800';
      case 'Cancelada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tickets de Tareas Internas</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Ticket
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <Select value={filters.estado} onValueChange={(value) => setFilters({...filters, estado: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En desarrollo">En desarrollo</SelectItem>
                  <SelectItem value="Finalizada">Finalizada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prioridad</label>
              <Select value={filters.prioridad} onValueChange={(value) => setFilters({...filters, prioridad: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Área</label>
              <Select value={filters.area} onValueChange={(value) => setFilters({...filters, area: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
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

            <div>
              <label className="block text-sm font-medium mb-1">Responsable</label>
              <Input
                value={filters.responsable}
                onChange={(e) => setFilters({...filters, responsable: e.target.value})}
                placeholder="Buscar por responsable"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tickets */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando tickets...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{ticket.titulo}</h3>
                      <Badge className={getPriorityColor(ticket.prioridad)}>
                        {ticket.prioridad}
                      </Badge>
                      <Badge className={getStatusColor(ticket.estado)}>
                        {ticket.estado}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {ticket.responsable || 'Sin asignar'}
                      </span>
                      {ticket.fecha_estimada && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(ticket.fecha_estimada).toLocaleDateString()}
                        </span>
                      )}
                      <span className="text-emerald-600 font-medium">{ticket.area}</span>
                    </div>

                    {ticket.descripcion && (
                      <p className="text-gray-700 text-sm mb-3">{ticket.descripcion}</p>
                    )}

                    <div className="text-xs text-gray-500">
                      Creado: {new Date(ticket.fecha_creacion).toLocaleDateString()}
                      {ticket.creador_nombre && ` por ${ticket.creador_nombre}`}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTicket(ticket);
                        setModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ticket.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTickets.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No se encontraron tickets</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Modal */}
      <TicketModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTicket(null);
        }}
        ticket={editingTicket}
        onSave={handleSave}
      />
    </div>
  );
};

export default TicketsTareasPage; 