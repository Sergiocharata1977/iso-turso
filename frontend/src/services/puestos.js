// Servicio para gestionar puestos - Migrado a API Backend
import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/puestos');

export const puestosService = {
  async getAll() {
    try {
      const response = await apiClient.get('');
      return response || [];
    } catch (error) {
      console.error('Error al obtener puestos:', error);
      throw new Error(`Error al obtener puestos: ${error.message}`);
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener puesto con ID ${id}:`, error);
      throw new Error(`Error al obtener puesto: ${error.message}`);
    }
  },

  async create(puesto) {
    const { departamentoId, ...rest } = puesto;
    const payload = { ...rest, departamento_id: departamentoId };
    try {
      const response = await apiClient.post('', payload);
      return response;
    } catch (error) {
      console.error('Error al crear puesto:', error);
      throw new Error(`Error al crear puesto: ${error.message}`);
    }
  },

  async update(id, puesto) {
    const { departamentoId, ...rest } = puesto;
    const payload = { ...rest, departamento_id: departamentoId };
    try {
      const response = await apiClient.put(`/${id}`, payload);
      return response;
    } catch (error) {
      console.error(`Error al actualizar puesto con ID ${id}:`, error);
      throw new Error(`Error al actualizar puesto: ${error.message}`);
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar puesto con ID ${id}:`, error);
      throw new Error(`Error al eliminar puesto: ${error.message}`);
    }
  }
};

// Exportación por defecto para compatibilidad con imports existentes
export default puestosService;
