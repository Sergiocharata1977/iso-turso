import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/mediciones');

/**
 * Servicio para gestionar mediciones de indicadores a través de la API backend
 */
export const medicionesService = {
  /**
   * Obtiene todas las mediciones
   * @returns {Promise<Array>} Lista de mediciones
   */
  async getAll() {
    try {
      const response = await apiClient.get('');
      return response;
    } catch (error) {
      console.error('Error al obtener mediciones:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar las mediciones');
    }
  },

  /**
   * Obtiene una medición por su ID
   * @param {string|number} id - ID de la medición
   * @returns {Promise<Object>} Datos de la medición
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener medición con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al cargar la medición');
    }
  },

  /**
   * Crea una nueva medición
   * @param {Object} medicion - Datos de la medición a crear
   * @returns {Promise<Object>} Medición creada
   */
  async create(medicion) {
    try {
      const response = await apiClient.post('', medicion);
      return response;
    } catch (error) {
      console.error('Error al crear medición:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la medición');
    }
  },

  /**
   * Actualiza una medición existente
   * @param {string|number} id - ID de la medición a actualizar
   * @param {Object} medicion - Datos actualizados de la medición
   * @returns {Promise<Object>} Medición actualizada
   */
  async update(id, medicion) {
    try {
      const response = await apiClient.put(`/${id}`, medicion);
      return response;
    } catch (error) {
      console.error(`Error al actualizar medición con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la medición');
    }
  },

  /**
   * Elimina una medición
   * @param {string|number} id - ID de la medición a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar medición con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la medición');
    }
  },

  /**
   * Obtiene mediciones por indicador
   * @param {string|number} indicadorId - ID del indicador
   * @returns {Promise<Array>} Lista de mediciones del indicador
   */
  async getByIndicador(indicadorId) {
    try {
      // El backend ahora filtra en GET /?indicador_id=INDICADOR_ID
      const response = await apiClient.get(`/?indicador_id=${indicadorId}`);
      return response; // Esto debería ser un array de mediciones directamente
    } catch (error) {
      console.error(`Error al obtener mediciones del indicador ${indicadorId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al filtrar mediciones por indicador');
    }
  },

  /**
   * Obtiene mediciones por periodo (año/mes)
   * @param {number} año - Año de las mediciones
   * @param {number} mes - Mes de las mediciones (opcional)
   * @returns {Promise<Array>} Lista de mediciones filtradas por periodo
   */
  async getByPeriodo(año, mes = null) {
    try {
      // TODO: Consider implementing backend filtering for performance if not already done.
      // For now, this uses the corrected getAll which hits the proper endpoint.
      const allMediciones = await apiClient.get(''); // Usa apiClient directamente 
      return allMediciones.filter(medicion => {
        const fecha = new Date(medicion.fecha);
        return fecha.getFullYear() === año && 
               (mes === null || fecha.getMonth() + 1 === mes);
      });
    } catch (error) {
      console.error(`Error al obtener mediciones del periodo ${año}/${mes}:`, error);
      throw new Error(error.response?.data?.message || 'Error al filtrar mediciones por periodo');
    }
  }
};

export default medicionesService;
