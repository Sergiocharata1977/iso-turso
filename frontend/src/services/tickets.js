// Servicio para gestionar tickets - Migrado a API Backend
import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/tickets');

export const ticketsService = {
  async getAll() {
    try {
      const response = await apiClient.get('');
      return response || [];
    } catch (error) {
      console.error('Error al obtener tickets:', error);
      throw new Error(`Error al obtener tickets: ${error.message}`);
    }
  },

  async create(ticket) {
    try {
      const response = await apiClient.post('', ticket);
      return response;
    } catch (error) {
      console.error('Error al crear ticket:', error);
      throw new Error(`Error al crear ticket: ${error.message}`);
    }
  },

  async update(id, ticket) {
    try {
      const response = await apiClient.put(`/${id}`, ticket);
      return response;
    } catch (error) {
      console.error(`Error al actualizar ticket con ID ${id}:`, error);
      throw new Error(`Error al actualizar ticket: ${error.message}`);
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar ticket con ID ${id}:`, error);
      throw new Error(`Error al eliminar ticket: ${error.message}`);
    }
  }
};
