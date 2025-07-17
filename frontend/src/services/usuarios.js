// Servicio para gestionar usuarios - Sistema Multi-Tenant
import apiService from './apiService.js';

const ENDPOINT = '/api/users'; // Endpoint correcto del backend

// Exportar el servicio de usuarios
export const usuariosService = {
  /**
   * Obtiene todos los usuarios de la organización actual
   * @returns {Promise<Object>} Lista de usuarios con metadata
   */
  async getAll() {
    try {
      const response = await apiService.get(ENDPOINT);
      return response;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  },

  /**
   * Obtiene un usuario por su ID
   * @param {string|number} id - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  async getById(id) {
    try {
      const response = await apiService.get(`${ENDPOINT}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  },

  /**
   * Crea un nuevo usuario en la organización actual
   * @param {Object} usuario - Datos del usuario a crear
   * @returns {Promise<Object>} Usuario creado
   */
  async create(usuario) {
    try {
      const response = await apiService.post(ENDPOINT, usuario);
      return response;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  },

  /**
   * Actualiza un usuario existente
   * @param {string|number} id - ID del usuario a actualizar
   * @param {Object} updates - Datos actualizados del usuario
   * @returns {Promise<Object>} Usuario actualizado
   */
  async update(id, updates) {
    try {
      const response = await apiService.put(`${ENDPOINT}/${id}`, updates);
      return response;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  },

  /**
   * Elimina un usuario
   * @param {string|number} id - ID del usuario a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const response = await apiService.delete(`${ENDPOINT}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  },

  /**
   * Obtiene el perfil del usuario actual
   * @returns {Promise<Object>} Perfil del usuario
   */
  async getProfile() {
    try {
      const response = await apiService.get(`${ENDPOINT}/profile`);
      return response;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw new Error(`Error al obtener perfil: ${error.message}`);
    }
  }
};
