import { createApiClient } from './apiService';

// Creamos un cliente de API específico para las rutas de 'dirección'
const direccionApiClient = createApiClient('/direccion');

/**
 * Objeto del servicio para gestionar la configuración de la dirección.
 */
export const direccionService = {
  /**
   * Obtiene la configuración de la dirección desde el backend.
   * @returns {Promise<object>} La configuración de la dirección.
   */
  getConfiguracion() {
    return direccionApiClient.get('/configuracion');
  },

  /**
   * Actualiza la configuración de la dirección en el backend.
   * @param {object} data - Un objeto con los campos a actualizar (ej. { politica_calidad: 'nuevo texto' }).
   * @returns {Promise<object>} La configuración actualizada.
   */
  updateConfiguracion(data) {
    return direccionApiClient.put('/configuracion', data);
  },
};
