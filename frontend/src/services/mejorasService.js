import { createApiClient } from './apiService.js';

/**
 * Servicio para gestionar mejoras a través de la API backend
 */
const apiClient = createApiClient('/mejoras');

/**
 * Servicio para gestionar mejoras a través de la API backend
 */
export const mejorasService = {
  /**
   * Obtiene todas las mejoras
   * @returns {Promise<Array>} Lista de mejoras
   */
  async getAll() {
    try {
      const data = await apiClient.get('/');
      return data;
    } catch (error) {
      console.error('Error al obtener mejoras:', error);
      throw new Error(error.message || 'Error al cargar las mejoras');
    }
  },

  /**
   * Obtiene una mejora por su ID
   * @param {string|number} id - ID de la mejora
   * @returns {Promise<Object>} Datos de la mejora
   */
  async getById(id) {
    try {
      const data = await apiClient.get(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al obtener mejora con ID ${id}:`, error);
      throw new Error(error.message || 'Error al cargar la mejora');
    }
  },

  /**
   * Crea una nueva mejora
   * @param {Object} mejora - Datos de la mejora a crear
   * @returns {Promise<Object>} Mejora creada
   */
  async create(mejora) {
    try {
      const data = await apiClient.post('/', mejora);
      return data;
    } catch (error) {
      console.error('Error al crear mejora:', error);
      throw new Error(error.message || 'Error al crear la mejora');
    }
  },

  /**
   * Actualiza una mejora existente
   * @param {string|number} id - ID de la mejora a actualizar
   * @param {Object} mejora - Datos actualizados de la mejora
   * @returns {Promise<Object>} Mejora actualizada
   */
  async update(id, mejora) {
    try {
      const data = await apiClient.put(`/${id}`, mejora);
      return data;
    } catch (error) {
      console.error(`Error al actualizar mejora con ID ${id}:`, error);
      throw new Error(error.message || 'Error al actualizar la mejora');
    }
  },

  /**
   * Elimina una mejora
   * @param {string|number} id - ID de la mejora a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const data = await apiClient.delete(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al eliminar mejora con ID ${id}:`, error);
      throw new Error(error.message || 'Error al eliminar la mejora');
    }
  },

  /**
   * Obtiene mejoras por estado
   * @param {string} estado - Estado de las mejoras a buscar
   * @returns {Promise<Array>} Lista de mejoras filtradas por estado
   */
  async getByEstado(estado) {
    try {
      const allMejoras = await this.getAll();
      return allMejoras.filter(mejora => mejora.estado === estado);
    } catch (error) {
      console.error(`Error al obtener mejoras con estado ${estado}:`, error);
      throw new Error(error.message || 'Error al filtrar mejoras por estado');
    }
  },

  /**
   * Obtiene mejoras por prioridad
   * @param {string} prioridad - Prioridad de las mejoras a buscar
   * @returns {Promise<Array>} Lista de mejoras filtradas por prioridad
   */
  async getByPrioridad(prioridad) {
    try {
      const allMejoras = await this.getAll();
      return allMejoras.filter(mejora => mejora.prioridad === prioridad);
    } catch (error) {
      console.error(`Error al obtener mejoras con prioridad ${prioridad}:`, error);
      throw new Error(error.message || 'Error al filtrar mejoras por prioridad');
    }
  },

  /**
   * Obtiene mejoras por proceso
   * @param {string|number} procesoId - ID del proceso
   * @returns {Promise<Array>} Lista de mejoras filtradas por proceso
   */
  async getByProceso(procesoId) {
    try {
      const allMejoras = await this.getAll();
      return allMejoras.filter(mejora => mejora.proceso_id === procesoId);
    } catch (error) {
      console.error(`Error al obtener mejoras del proceso ${procesoId}:`, error);
      throw new Error(error.message || 'Error al filtrar mejoras por proceso');
    }
  }
};

export default mejorasService;
