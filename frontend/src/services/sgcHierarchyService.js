import { createService } from './serviceFactory';

const apiClient = createService('/sgc');

const sgcHierarchyService = {
  /**
   * Obtiene la jerarquía completa SGC
   * @returns {Promise<Object>} Jerarquía completa con procesos, objetivos, indicadores y mediciones
   */
  getHierarchy() {
    return apiClient.get('/hierarchy');
  },

  /**
   * Obtiene la jerarquía de un proceso específico
   * @param {string} procesoId - ID del proceso
   * @returns {Promise<Object>} Jerarquía del proceso con sus objetivos, indicadores y mediciones
   */
  getProcesoHierarchy(procesoId) {
    return apiClient.get(`/procesos/${procesoId}/hierarchy`);
  },

  /**
   * Obtiene estadísticas de la jerarquía
   * @returns {Promise<Object>} Estadísticas de la jerarquía SGC
   */
  async getStats() {
    try {
      const hierarchy = await this.getHierarchy();
      return {
        totalProcesos: hierarchy.data?.procesos?.length || 0,
        totalObjetivos: hierarchy.stats?.totalObjetivos || 0,
        totalIndicadores: hierarchy.stats?.totalIndicadores || 0,
        totalMediciones: hierarchy.stats?.totalMediciones || 0
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas SGC:', error);
      return {
        totalProcesos: 0,
        totalObjetivos: 0,
        totalIndicadores: 0,
        totalMediciones: 0
      };
    }
  }
};

export default sgcHierarchyService; 