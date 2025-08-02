// src/services/serviceFactory.js

import { createApiClient } from './apiService';
import { createMockApiClient } from './mockApiService';

// Lee la variable de entorno. Si no está definida, usará la API real por defecto.
const API_MODE = import.meta.env.VITE_API_MODE || 'real'; // Cambiado a 'real' por defecto

/**
 * Crea un cliente de servicio (real o mock) basado en la configuración del entorno.
 * Esta es la única función que los servicios específicos (como indicadoresService) deben usar.
 * @param {string} baseRoute - La ruta base para el recurso (ej. '/indicadores').
 * @returns {object} Un cliente de API con métodos get, post, put, delete.
 */
export const createService = (baseRoute) => {
  if (API_MODE === 'mock') {
    console.log(`[ServiceFactory] Creando servicio MOCK para: ${baseRoute}`);
    return createMockApiClient(baseRoute);
  }
  
  console.log(`[ServiceFactory] Creando servicio REAL para: ${baseRoute}`);
  return createApiClient(baseRoute);
};
