import { createApiClient } from './apiService';

const apiClient = createApiClient('/audit');

const auditService = {
  /**
   * Obtiene los logs de auditoría de la organización.
   * @param {object} params - Parámetros de paginación y filtro.
   * @param {number} params.page - Número de página.
   * @param {number} params.limit - Límite de resultados por página.
   * @param {string} params.action - Filtrar por acción (opcional).
   * @param {string} params.resourceType - Filtrar por tipo de recurso (opcional).
   * @returns {Promise<object>} - Una promesa que resuelve a un objeto con los logs y la paginación.
   */
  getAuditLogs: async (params = {}) => {
    try {
      const response = await apiClient.get('/logs', { params });
      return response;
    } catch (error) {
      console.error('Error al obtener los logs de auditoría:', error);
      throw error;
    }
  }
};

export default auditService; 