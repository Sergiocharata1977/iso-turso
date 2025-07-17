import { apiService } from './apiService';

const BASE_URL = '/procesos';

/**
 * Servicio para gestionar las operaciones CRUD de procesos
 */
const procesosService = {
  /**
   * Obtiene todos los procesos
   * @returns {Promise<Array>} Lista de procesos
   */
  // Alias para mantener compatibilidad con componentes antiguos
  getAllProcesos: async () => {
    return await apiService.get(BASE_URL);
  },

  getProcesos: async () => {
    return await apiService.get(BASE_URL);
  },

  // Métodos con nombres cortos para nuevo ProcesosListing
  getAll: async () => {
    return await apiService.get(BASE_URL);
  },

  /**
   * Obtiene un proceso por su ID
   * @param {string} id - ID del proceso
   * @returns {Promise<Object>} Proceso encontrado
   */
  getProcesoById: async (id) => {
    return await apiService.get(`${BASE_URL}/${id}`);
  },

  /**
   * Crea un nuevo proceso
   * @param {Object} procesoData - Datos del proceso a crear
   * @returns {Promise<Object>} Proceso creado
   */
  createProceso: async (procesoData) => {
    return await apiService.post(BASE_URL, procesoData);
  },

  /**
   * Actualiza un proceso existente
   * @param {string} id - ID del proceso a actualizar
   * @param {Object} procesoData - Nuevos datos del proceso
   * @returns {Promise<Object>} Proceso actualizado
   */
  updateProceso: (id, data) => apiService.put(`${BASE_URL}/${id}`, data),

  /**
   * Elimina un proceso
   * @param {string} id - ID del proceso a eliminar
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  deleteProceso: async (id) => {
    return await apiService.delete(`${BASE_URL}/${id}`);
  },

  // Métodos con nombres cortos para nuevo ProcesosListing
  create: async (procesoData) => {
    return await apiService.post(BASE_URL, procesoData);
  },

  update: async (id, procesoData) => {
    return await apiService.put(`${BASE_URL}/${id}`, procesoData);
  },

  delete: async (id) => {
    return await apiService.delete(`${BASE_URL}/${id}`);
  }
};

export default procesosService;
