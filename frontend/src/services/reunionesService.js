import { createApiClient } from './apiService';

// Creamos un cliente de API específico para las rutas de reuniones
const reunionesApiClient = createApiClient('/reuniones');

/**
 * Objeto del servicio para gestionar las reuniones.
 */
export const reunionesService = {
  /**
   * Obtiene todas las reuniones de la organización del usuario.
   * @returns {Promise<Array>} Lista de reuniones.
   */
  getAllReuniones() {
    return reunionesApiClient.get('/');
  },

  /**
   * Obtiene una reunión específica por su ID.
   * @param {string|number} id - ID de la reunión.
   * @returns {Promise<object>} Datos de la reunión.
   */
  getReunion(id) {
    return reunionesApiClient.get(`/${id}`);
  },

  /**
   * Obtiene una reunión completa con participantes y documentos.
   * @param {string|number} id - ID de la reunión.
   * @returns {Promise<object>} Datos completos de la reunión.
   */
  getReunionCompleta(id) {
    return reunionesApiClient.get(`/${id}/completa`);
  },

  /**
   * Obtiene los participantes de una reunión.
   * @param {string|number} id - ID de la reunión.
   * @returns {Promise<Array>} Lista de participantes.
   */
  getParticipantesByReunion(id) {
    return reunionesApiClient.get(`/${id}/participantes`);
  },

  /**
   * Obtiene los documentos de una reunión.
   * @param {string|number} id - ID de la reunión.
   * @returns {Promise<Array>} Lista de documentos.
   */
  getDocumentosByReunion(id) {
    return reunionesApiClient.get(`/${id}/documentos`);
  },

  /**
   * Crea una nueva reunión.
   * @param {object} reunionData - Datos de la reunión a crear.
   * @returns {Promise<object>} La reunión creada.
   */
  createReunion(reunionData) {
    return reunionesApiClient.post('/', reunionData);
  },

  /**
   * Actualiza una reunión existente.
   * @param {string|number} id - ID de la reunión a actualizar.
   * @param {object} reunionData - Datos actualizados de la reunión.
   * @returns {Promise<object>} La reunión actualizada.
   */
  updateReunion(id, reunionData) {
    return reunionesApiClient.put(`/${id}`, reunionData);
  },

  /**
   * Elimina una reunión.
   * @param {string|number} id - ID de la reunión a eliminar.
   * @returns {Promise<void>}
   */
  deleteReunion(id) {
    return reunionesApiClient.delete(`/${id}`);
  }
};
