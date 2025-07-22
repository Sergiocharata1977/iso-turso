import apiService from './apiService';

const BASE_URL = '/usuarios';

export const usuariosService = {
  // Obtener todos los usuarios
  async getAll() {
    try {
      const response = await apiService.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  // Obtener usuario específico por ID
  async getById(id) {
    try {
      const response = await apiService.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  // Crear nuevo usuario
  async create(data) {
    try {
      const response = await apiService.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  },

  // Actualizar usuario
  async update(id, data) {
    try {
      const response = await apiService.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  },

  // Eliminar usuario
  async delete(id) {
    try {
      const response = await apiService.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },

  // Obtener usuarios por organización
  async getByOrganization(organizationId) {
    try {
      const response = await apiService.get(`${BASE_URL}/organization/${organizationId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios por organización:', error);
      throw error;
    }
  }
};

export default usuariosService; 