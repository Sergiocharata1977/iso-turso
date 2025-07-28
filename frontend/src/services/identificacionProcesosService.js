import { apiService } from './apiService';

const BASE_URL = '/identificacion-procesos';

/**
 * Servicio para gestionar la identificación de procesos
 * Maneja un solo registro por organización con los 4 campos principales
 */
const identificacionProcesosService = {
  /**
   * Obtener la identificación de procesos de la organización
   * @returns {Promise<Object>} Datos de identificación de procesos
   */
  get: async () => {
    return await apiService.get(BASE_URL);
  },

  /**
   * Actualizar la identificación de procesos (crea si no existe)
   * @param {Object} data - Datos a actualizar
   * @param {string} data.politica_calidad - Política de calidad
   * @param {string} data.alcance - Alcance
   * @param {string} data.mapa_procesos - Mapa de procesos
   * @param {string} data.organigrama - Organigrama
   * @returns {Promise<Object>} Datos actualizados
   */
  update: async (data) => {
    return await apiService.put(BASE_URL, data);
  },

  /**
   * Limpiar todos los campos de identificación de procesos
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  clear: async () => {
    return await apiService.delete(BASE_URL);
  },

  /**
   * Obtener datos con manejo de errores mejorado
   * @returns {Promise<Object>} Datos o null si hay error
   */
  getSafe: async () => {
    try {
      const response = await apiService.get(BASE_URL);
      return response.data || response;
    } catch (error) {
      console.error('Error al obtener identificación de procesos:', error);
      return null;
    }
  },

  /**
   * Actualizar datos con manejo de errores mejorado
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object|null>} Datos actualizados o null si hay error
   */
  updateSafe: async (data) => {
    try {
      const response = await apiService.put(BASE_URL, data);
      return response.data || response;
    } catch (error) {
      console.error('Error al actualizar identificación de procesos:', error);
      throw error;
    }
  }
};

export default identificacionProcesosService; 