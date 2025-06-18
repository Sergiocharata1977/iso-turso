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
      const response = await apiService.get('/indicadores_gestion');
      return response;
    } catch (error) {
      console.error('Error al obtener indicadores:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar los indicadores');
    }
  },

  /**
   * Obtiene todos los indicadores para un objetivo específico
   * @param {string|number} objetivoId - ID del objetivo
   * @returns {Promise<Array>} Lista de indicadores para el objetivo
   */
  async getByObjetivo(objetivoId) {
    try {
      const response = await apiService.get(`/indicadores_gestion?objetivo_id=${objetivoId}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener indicadores para el objetivo ${objetivoId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al cargar los indicadores para el objetivo');
    }
  },

  /**
   * Obtiene un indicador por su ID
   * @param {string|number} id - ID del indicador
   * @returns {Promise<Object>} Datos del indicador
   */
  async getById(id) {
    try {
      const response = await apiService.get(`/indicadores_gestion/${id}`);
      return response;
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
      const response = await apiService.post('/indicadores_gestion', indicador);
      return response;
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
      const response = await apiService.put(`/indicadores_gestion/${id}`, indicador);
      return response;
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
      const response = await apiService.delete(`/indicadores_gestion/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar indicador con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el indicador');
    }
  }
};

export default indicadoresService;
