// Servicio para gestionar usuarios - Migrado a API Backend
import apiService from './apiService.js';

const ENDPOINT = '/api/usuarios';

// Exportar el servicio de usuarios
export const usuariosService = {
  async getAll() {
    try {
      const response = await apiService.get(ENDPOINT);
      return response;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  },

  async create(usuario) {
    try {
      const response = await apiService.post(ENDPOINT, usuario);
      return response;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  },

  async update(id, updates) {
    try {
      const response = await apiService.put(`${ENDPOINT}/${id}`, updates);
      return response;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  },

  async delete(id) {
    try {
      const response = await apiService.delete(`${ENDPOINT}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }
};
