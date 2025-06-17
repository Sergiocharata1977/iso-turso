import apiService from './apiService';

/**
 * Servicio para gestionar capacitaciones a través de la API backend
 */
export const capacitacionesService = {
  /**
   * Obtiene todas las capacitaciones
   * @returns {Promise<Array>} Lista de capacitaciones
   */
  async getAll() {
    try {
      const response = await apiService.get('/api/capacitaciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener capacitaciones:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar las capacitaciones');
    }
  },

  /**
   * Obtiene una capacitación por su ID
   * @param {string|number} id - ID de la capacitación
   * @returns {Promise<Object>} Datos de la capacitación
   */
  async getById(id) {
    try {
      const response = await apiService.get(`/api/capacitaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener capacitación con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al cargar la capacitación');
    }
  },

  /**
   * Crea una nueva capacitación
   * @param {Object} capacitacion - Datos de la capacitación a crear
   * @returns {Promise<Object>} Capacitación creada
   */
  async create(capacitacion) {
    try {
      const response = await apiService.post('/api/capacitaciones', capacitacion);
      return response.data;
    } catch (error) {
      console.error('Error al crear capacitación:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la capacitación');
    }
  },

  /**
   * Actualiza una capacitación existente
   * @param {string|number} id - ID de la capacitación a actualizar
   * @param {Object} capacitacion - Datos actualizados de la capacitación
   * @returns {Promise<Object>} Capacitación actualizada
   */
  async update(id, capacitacion) {
    try {
      const response = await apiService.put(`/api/capacitaciones/${id}`, capacitacion);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar capacitación con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la capacitación');
    }
  },

  /**
   * Elimina una capacitación
   * @param {string|number} id - ID de la capacitación a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const response = await apiService.delete(`/api/capacitaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar capacitación con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la capacitación');
    }
  }
};

export default capacitacionesService;
