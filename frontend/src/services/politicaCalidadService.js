import { apiService } from './apiService';

const BASE_URL = '/politica-calidad';

/**
 * Servicio para gestionar las operaciones ABM de políticas de calidad
 */
const politicaCalidadService = {
  /**
   * Obtiene todas las políticas de calidad
   * @returns {Promise<Array>} Lista de políticas de calidad
   */
  getAll: async () => {
    return await apiService.get(BASE_URL);
  },

  /**
   * Obtiene una política de calidad por su ID
   * @param {string} id - ID de la política de calidad
   * @returns {Promise<Object>} Política de calidad encontrada
   */
  getById: async (id) => {
    return await apiService.get(`${BASE_URL}/${id}`);
  },

  /**
   * Crea una nueva política de calidad (ALTA)
   * @param {Object} politicaData - Datos de la política de calidad a crear
   * @returns {Promise<Object>} Política de calidad creada
   */
  create: async (politicaData) => {
    return await apiService.post(BASE_URL, politicaData);
  },

  /**
   * Actualiza una política de calidad existente (MODIFICACIÓN)
   * @param {string} id - ID de la política de calidad a actualizar
   * @param {Object} politicaData - Nuevos datos de la política de calidad
   * @returns {Promise<Object>} Política de calidad actualizada
   */
  update: async (id, politicaData) => {
    return await apiService.put(`${BASE_URL}/${id}`, politicaData);
  },

  /**
   * Elimina una política de calidad (BAJA)
   * @param {string} id - ID de la política de calidad a eliminar
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  delete: async (id) => {
    return await apiService.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Busca políticas de calidad por término
   * @param {string} term - Término de búsqueda
   * @returns {Promise<Array>} Lista de políticas de calidad que coinciden
   */
  search: async (term) => {
    return await apiService.get(`${BASE_URL}/search/${term}`);
  },

  /**
   * Obtiene datos con manejo de errores mejorado
   * @returns {Promise<Array>} Lista de políticas de calidad o array vacío si hay error
   */
  getAllSafe: async () => {
    try {
      const response = await apiService.get(BASE_URL);
      return response.data || response;
    } catch (error) {
      console.error('Error al obtener políticas de calidad:', error);
      return [];
    }
  },

  /**
   * Crea una política de calidad con manejo de errores mejorado
   * @param {Object} politicaData - Datos de la política de calidad
   * @returns {Promise<Object|null>} Política de calidad creada o null si hay error
   */
  createSafe: async (politicaData) => {
    try {
      const response = await apiService.post(BASE_URL, politicaData);
      return response.data || response;
    } catch (error) {
      console.error('Error al crear política de calidad:', error);
      throw error;
    }
  },

  /**
   * Actualiza una política de calidad con manejo de errores mejorado
   * @param {string} id - ID de la política de calidad
   * @param {Object} politicaData - Datos a actualizar
   * @returns {Promise<Object|null>} Política de calidad actualizada o null si hay error
   */
  updateSafe: async (id, politicaData) => {
    try {
      const response = await apiService.put(`${BASE_URL}/${id}`, politicaData);
      return response.data || response;
    } catch (error) {
      console.error('Error al actualizar política de calidad:', error);
      throw error;
    }
  },

  /**
   * Elimina una política de calidad con manejo de errores mejorado
   * @param {string} id - ID de la política de calidad
   * @returns {Promise<Object|null>} Respuesta de confirmación o null si hay error
   */
  deleteSafe: async (id) => {
    try {
      const response = await apiService.delete(`${BASE_URL}/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error al eliminar política de calidad:', error);
      throw error;
    }
  }
};

export default politicaCalidadService; 