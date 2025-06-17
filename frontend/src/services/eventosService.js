// Servicio para el módulo de Eventos - Migrado a API Backend
import apiService from './apiService.js';

const ENDPOINT = '/api/eventos';

export const eventosService = {
  // Obtener todos los eventos
  async getEventos() {
    try {
      const response = await apiService.get(ENDPOINT);
      return response || [];
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw new Error(`Error al obtener eventos: ${error.message}`);
    }
  },

  // Crear un nuevo evento
  async createEvento(data) {
    try {
      const response = await apiService.post(ENDPOINT, data);
      return response;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw new Error(`Error al crear evento: ${error.message}`);
    }
  },

  // Actualizar un evento existente
  async updateEvento(id, data) {
    try {
      const response = await apiService.put(`${ENDPOINT}/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error al actualizar evento con ID ${id}:`, error);
      throw new Error(`Error al actualizar evento: ${error.message}`);
    }
  },

  // Eliminar un evento
  async deleteEvento(id) {
    try {
      const response = await apiService.delete(`${ENDPOINT}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar evento con ID ${id}:`, error);
      throw new Error(`Error al eliminar evento: ${error.message}`);
    }
  },

  // Obtener eventos por tipo
  async getEventosPorTipo(tipo) {
    try {
      const response = await apiService.get(`${ENDPOINT}/tipo/${tipo}`);
      return response || [];
    } catch (error) {
      console.error('Error al obtener eventos por tipo:', error);
      throw new Error(`Error al obtener eventos por tipo: ${error.message}`);
    }
  },

  // Obtener eventos por mejora
  async getEventosPorMejora(mejora_id) {
    try {
      const response = await apiService.get(`${ENDPOINT}/mejora/${mejora_id}`);
      return response || [];
    } catch (error) {
      console.error('Error al obtener eventos por mejora:', error);
      throw new Error(`Error al obtener eventos por mejora: ${error.message}`);
    }
  }
};
