import { createApiClient } from './apiService.js';

/**
 * Servicio para gestionar usuarios a través de la API backend
 */
const apiClient = createApiClient('/usuarios');

/**
 * Servicio para gestionar usuarios a través de la API backend
 */
export const usuariosService = {
  /**
   * Obtiene todos los usuarios
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAll() {
    try {
      const data = await apiClient.get('/');
      return data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error(error.message || 'Error al cargar los usuarios');
    }
  },

  /**
   * Obtiene un usuario por su ID
   * @param {string|number} id - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  async getById(id) {
    try {
      const data = await apiClient.get(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw new Error(error.message || 'Error al cargar el usuario');
    }
  },

  /**
   * Crea un nuevo usuario
   * @param {Object} usuario - Datos del usuario a crear
   * @returns {Promise<Object>} Usuario creado
   */
  async create(usuario) {
    try {
      const data = await apiClient.post('/', usuario);
      return data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new Error(error.message || 'Error al crear el usuario');
    }
  },

  /**
   * Actualiza un usuario existente
   * @param {string|number} id - ID del usuario a actualizar
   * @param {Object} usuario - Datos actualizados del usuario
   * @returns {Promise<Object>} Usuario actualizado
   */
  async update(id, usuario) {
    try {
      const data = await apiClient.put(`/${id}`, usuario);
      return data;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw new Error(error.message || 'Error al actualizar el usuario');
    }
  },

  /**
   * Elimina un usuario
   * @param {string|number} id - ID del usuario a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const data = await apiClient.delete(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw new Error(error.message || 'Error al eliminar el usuario');
    }
  },

  /**
   * Autentica un usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Datos del usuario autenticado
   */
  async login(username, password) {
    try {
      const data = await apiClient.post('/login', { username, password });
      return data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  },

  /**
   * Obtiene usuarios por rol
   * @param {string} rol - Rol de usuarios a buscar
   * @returns {Promise<Array>} Lista de usuarios filtrados por rol
   */
  async getByRol(rol) {
    try {
      const allUsuarios = await this.getAll();
      return allUsuarios.filter(usuario => usuario.rol === rol);
    } catch (error) {
      console.error(`Error al obtener usuarios con rol ${rol}:`, error);
      throw new Error(error.message || 'Error al filtrar usuarios por rol');
    }
  }
};

export default usuariosService;
