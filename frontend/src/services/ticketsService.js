// Servicio para el módulo de Tickets - Backend API
import apiService from './apiService.js';

const ENDPOINT = '/tickets';

// Obtener todos los tickets
export async function getAllTickets() {
  try {
    return await apiService.get(ENDPOINT);
  } catch (error) {
    // console.error('Error al obtener tickets:', error);
    throw new Error(`Error al obtener los tickets: ${error.message}`);
  }
}

// Obtener un ticket por ID
export async function getTicketById(id) {
  try {
    return await apiService.get(`${ENDPOINT}/${id}`);
  } catch (error) {
    // console.error(`Error al obtener ticket con ID ${id}:`, error);
    throw new Error(`Error al obtener el ticket ${id}: ${error.message}`);
  }
}

// Crear un nuevo ticket
export async function createTicket(data) {
  try {
    return await apiService.post(ENDPOINT, data);
  } catch (error) {
    // console.error('Error al crear ticket:', error);
    throw new Error(`Error al crear el ticket: ${error.message}`);
  }
}

// Actualizar un ticket
export async function updateTicket(id, data) {
  try {
    return await apiService.put(`${ENDPOINT}/${id}`, data);
  } catch (error) {
    // console.error(`Error al actualizar ticket con ID ${id}:`, error);
    throw new Error(`Error al actualizar el ticket ${id}: ${error.message}`);
  }
}

// Eliminar un ticket
export async function deleteTicket(id) {
  try {
    return await apiService.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    // console.error(`Error al eliminar ticket con ID ${id}:`, error);
    throw new Error(`Error al eliminar el ticket ${id}: ${error.message}`);
  }
}

// Buscar tickets por estado
export async function getTicketsByEstado(estado) {
  try {
    return await apiService.get(`${ENDPOINT}/estado/${estado}`);
  } catch (error) {
    console.error('Error al obtener tickets por estado:', error);
    throw error;
  }
}

// Buscar tickets por departamento
export async function getTicketsByDepartamento(departamentoId) {
  try {
    const tickets = await getAllTickets();
    return tickets.filter(ticket => ticket.departamento_id === departamentoId);
  } catch (error) {
    console.error('Error al obtener tickets por departamento:', error);
    throw error;
  }
}

// Buscar tickets por solicitante
export async function getTicketsBySolicitante(solicitanteId) {
  try {
    const tickets = await getAllTickets();
    return tickets.filter(ticket => ticket.solicitante_id === solicitanteId);
  } catch (error) {
    console.error('Error al obtener tickets por solicitante:', error);
    throw error;
  }
}

// Buscar tickets por asignado
export async function getTicketsByAsignado(asignadoId) {
  try {
    const tickets = await getAllTickets();
    return tickets.filter(ticket => ticket.asignado_a === asignadoId);
  } catch (error) {
    console.error('Error al obtener tickets por asignado:', error);
    throw error;
  }
}

// Añadir comentario a un ticket
export async function addComentario(ticketId, comentarioData) {
  try {
    return await apiService.post(`${ENDPOINT}/${ticketId}/comentario`, comentarioData);
  } catch (error) {
    console.error(`Error al añadir comentario al ticket ${ticketId}:`, error);
    throw error;
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
    throw error;
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
