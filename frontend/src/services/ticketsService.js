// Servicio para el módulo de Tickets - Backend API
import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/tickets');

// Obtener todos los tickets
export async function getAllTickets() {
  try {
    return await apiClient.get('');
  } catch (error) {
    // console.error('Error al obtener tickets:', error);
    throw new Error(error.message || 'Error al obtener los tickets');
  }
}

// Obtener un ticket por ID
export async function getTicketById(id) {
  try {
    return await apiClient.get(`/${id}`);
  } catch (error) {
    // console.error(`Error al obtener ticket con ID ${id}:`, error);
    throw new Error(error.message || `Error al obtener el ticket ${id}`);
  }
}

// Crear un nuevo ticket
export async function createTicket(data) {
  try {
    return await apiClient.post('', data);
  } catch (error) {
    // console.error('Error al crear ticket:', error);
    throw new Error(error.message || 'Error al crear el ticket');
  }
}

// Actualizar un ticket
export async function updateTicket(id, data) {
  try {
    return await apiClient.put(`/${id}`, data);
  } catch (error) {
    // console.error(`Error al actualizar ticket con ID ${id}:`, error);
    throw new Error(error.message || `Error al actualizar el ticket ${id}`);
  }
}

// Eliminar un ticket
export async function deleteTicket(id) {
  try {
    return await apiClient.delete(`/${id}`);
  } catch (error) {
    // console.error(`Error al eliminar ticket con ID ${id}:`, error);
    throw new Error(error.message || `Error al eliminar el ticket ${id}`);
  }
}

// Buscar tickets por estado
export async function getTicketsByEstado(estado) {
  try {
    return await apiClient.get(`/estado/${estado}`);
  } catch (error) {
    console.error('Error al obtener tickets por estado:', error);
    throw new Error(error.message || 'Error al obtener tickets por estado');
  }
}

// Buscar tickets por departamento
export async function getTicketsByDepartamento(departamentoId) {
  try {
    const tickets = await getAllTickets();
    return tickets.filter(ticket => ticket.departamento_id === departamentoId);
  } catch (error) {
    console.error('Error al obtener tickets por departamento:', error);
    throw new Error(error.message || 'Error al obtener tickets por departamento');
  }
}

// Buscar tickets por solicitante
export async function getTicketsBySolicitante(solicitanteId) {
  try {
    const tickets = await getAllTickets();
    return tickets.filter(ticket => ticket.solicitante_id === solicitanteId);
  } catch (error) {
    console.error('Error al obtener tickets por solicitante:', error);
    throw new Error(error.message || 'Error al obtener tickets por solicitante');
  }
}

// Buscar tickets por asignado
export async function getTicketsByAsignado(asignadoId) {
  try {
    const tickets = await getAllTickets();
    return tickets.filter(ticket => ticket.asignado_a === asignadoId);
  } catch (error) {
    console.error('Error al obtener tickets por asignado:', error);
    throw new Error(error.message || 'Error al obtener tickets por asignado');
  }
}

// Añadir comentario a un ticket
export async function addComentario(ticketId, comentarioData) {
  try {
    return await apiClient.post(`/${ticketId}/comentario`, comentarioData);
  } catch (error) {
    console.error(`Error al añadir comentario al ticket ${ticketId}:`, error);
    throw new Error(error.message || `Error al añadir comentario al ticket ${ticketId}`);
  }
}

// Buscar tickets por término
export async function searchTickets(term) {
  try {
    const tickets = await getAllTickets();
    return tickets.filter(ticket => 
      ticket.titulo.toLowerCase().includes(term.toLowerCase()) || 
      (ticket.descripcion && ticket.descripcion.toLowerCase().includes(term.toLowerCase())) ||
      (ticket.solicitante_nombre && ticket.solicitante_nombre.toLowerCase().includes(term.toLowerCase())) ||
      (ticket.departamento_nombre && ticket.departamento_nombre.toLowerCase().includes(term.toLowerCase()))
    );
  } catch (error) {
    console.error('Error al buscar tickets:', error);
    throw new Error(error.message || 'Error al buscar tickets');
  }
}

export default {
  getAll: getAllTickets,
  getById: getTicketById,
  create: createTicket,
  update: updateTicket,
  delete: deleteTicket,
  getTicketsByEstado,
  getTicketsByDepartamento,
  getTicketsBySolicitante,
  getTicketsByAsignado,
  addComentario,
  searchTickets
};
