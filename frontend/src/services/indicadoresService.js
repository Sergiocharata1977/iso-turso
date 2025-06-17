import apiService from './apiService';

/**
 * Servicio para gestionar indicadores a través de la API backend
 */
export const indicadoresService = {
  /**
   * Obtiene todos los indicadores
   * @returns {Promise<Array>} Lista de indicadores
   */
  async getAll() {
    try {
      const response = await apiService.get('/api/indicadores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener indicadores:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar los indicadores');
    }
  },

  /**
   * Obtiene un indicador por su ID
   * @param {string|number} id - ID del indicador
   * @returns {Promise<Object>} Datos del indicador
   */
  async getById(id) {
    try {
      const response = await apiService.get(`/api/indicadores/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener indicador con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al cargar el indicador');
    }
  },

  /**
   * Crea un nuevo indicador
   * @param {Object} indicador - Datos del indicador a crear
   * @returns {Promise<Object>} Indicador creado
   */
  async create(indicador) {
    try {
      const response = await apiService.post('/api/indicadores', indicador);
      return response.data;
    } catch (error) {
      console.error('Error al crear indicador:', error);
      throw new Error(error.response?.data?.message || 'Error al crear el indicador');
    }
  },

  /**
   * Actualiza un indicador existente
   * @param {string|number} id - ID del indicador a actualizar
   * @param {Object} indicador - Datos actualizados del indicador
   * @returns {Promise<Object>} Indicador actualizado
   */
  async update(id, indicador) {
    try {
      const response = await apiService.put(`/api/indicadores/${id}`, indicador);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar indicador con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar el indicador');
    }
  },

  /**
   * Elimina un indicador
   * @param {string|number} id - ID del indicador a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const response = await apiService.delete(`/api/indicadores/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar indicador con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el indicador');
    }
  }
};

export default indicadoresService;
