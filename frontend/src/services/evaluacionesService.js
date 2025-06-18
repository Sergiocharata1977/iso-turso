import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/evaluaciones');

/**
 * Servicio para gestionar evaluaciones de personal a través de la API backend
 */
export const evaluacionesService = {
  /**
   * Obtiene todas las evaluaciones
   * @returns {Promise<Array>} Lista de evaluaciones
   */
  async getAll() {
    try {
      const response = await apiClient.get('');
      return response;
    } catch (error) {
      console.error('Error al obtener evaluaciones:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar las evaluaciones');
    }
  },

  /**
   * Obtiene una evaluación por su ID
   * @param {string|number} id - ID de la evaluación
   * @returns {Promise<Object>} Datos de la evaluación
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener evaluación con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al cargar la evaluación');
    }
  },

  /**
   * Crea una nueva evaluación
   * @param {Object} evaluacion - Datos de la evaluación a crear
   * @returns {Promise<Object>} Evaluación creada
   */
  async create(evaluacion) {
    try {
      const response = await apiClient.post('', evaluacion);
      return response;
    } catch (error) {
      console.error('Error al crear evaluación:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la evaluación');
    }
  },

  /**
   * Actualiza una evaluación existente
   * @param {string|number} id - ID de la evaluación a actualizar
   * @param {Object} evaluacion - Datos actualizados de la evaluación
   * @returns {Promise<Object>} Evaluación actualizada
   */
  async update(id, evaluacion) {
    try {
      const response = await apiClient.put(`/${id}`, evaluacion);
      return response;
    } catch (error) {
      console.error(`Error al actualizar evaluación con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la evaluación');
    }
  },

  /**
   * Elimina una evaluación
   * @param {string|number} id - ID de la evaluación a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al eliminar evaluación con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la evaluación');
    }
  },

  /**
   * Obtiene todas las evaluaciones de un empleado específico
   * @param {string|number} personalId - ID del empleado
   * @returns {Promise<Array>} Lista de evaluaciones del empleado
   */
  async getByPersonalId(personalId) {
    try {
      const response = await apiClient.get(`/?personal_id=${personalId}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener evaluaciones del empleado ${personalId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al cargar las evaluaciones del empleado');
    }
  }
};

export default evaluacionesService;
