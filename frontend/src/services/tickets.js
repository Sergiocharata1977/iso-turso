// Servicio para gestionar tickets - Migrado a API Backend
import apiService from './apiService.js';

const ENDPOINT = '/api/tickets';

export const ticketsService = {
  async getAll() {
    try {
      const response = await apiService.get(ENDPOINT);
      return response || [];
    } catch (error) {
      console.error('Error al obtener tickets:', error);
      throw new Error(`Error al obtener tickets: ${error.message}`);
    }
  },

  async create(ticket) {
    try {
      const response = await apiService.post(ENDPOINT, ticket);
      return response;
    } catch (error) {
      console.error('Error al crear ticket:', error);
      throw new Error(`Error al crear ticket: ${error.message}`);
    }
  },

  async update(id, ticket) {
    try {
      const response = await apiService.put(`${ENDPOINT}/${id}`, ticket);
      return response;
    } catch (error) {
      console.error(`Error al actualizar ticket con ID ${id}:`, error);
      throw new Error(`Error al actualizar ticket: ${error.message}`);
    }
  },

  async delete(id) {
    try {
      const response = await apiService.delete(`${ENDPOINT}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar ticket con ID ${id}:`, error);
      throw new Error(`Error al eliminar ticket: ${error.message}`);
    }
  }
};
