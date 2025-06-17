// Servicio para gestionar puestos - Migrado a API Backend
import apiService from './apiService.js';

const ENDPOINT = '/puestos';

export const puestosService = {
  async getAll() {
    try {
      const response = await apiService.get(ENDPOINT);
      return response || [];
    } catch (error) {
      console.error('Error al obtener puestos:', error);
      throw new Error(`Error al obtener puestos: ${error.message}`);
    }
  },

  async getById(id) {
    try {
      const response = await apiService.get(`${ENDPOINT}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener puesto con ID ${id}:`, error);
      throw new Error(`Error al obtener puesto: ${error.message}`);
    }
  },

  async create(puesto) {
    try {
      const response = await apiService.post(ENDPOINT, puesto);
      return response;
    } catch (error) {
      console.error('Error al crear puesto:', error);
      throw new Error(`Error al crear puesto: ${error.message}`);
    }
  },

  async update(id, puesto) {
    try {
      const response = await apiService.put(`${ENDPOINT}/${id}`, puesto);
      return response;
    } catch (error) {
      console.error(`Error al actualizar puesto con ID ${id}:`, error);
      throw new Error(`Error al actualizar puesto: ${error.message}`);
    }
  },

  async delete(id) {
    try {
      const response = await apiService.delete(`${ENDPOINT}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar puesto con ID ${id}:`, error);
      throw new Error(`Error al eliminar puesto: ${error.message}`);
    }
  }
};

// Exportación por defecto para compatibilidad con imports existentes
export default puestosService;
