import { createApiClient } from './apiService.js';

const evalcompeApiClient = createApiClient('/evaluacion-programacion');

export const evalcompeProgramacionService = {
  // Crear una nueva programación de evaluación grupal
  createProgramacion: async (data) => {
    try {
      const response = await evalcompeApiClient.post('', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear programación:', error);
      throw error;
    }
  },

  // Obtener todas las programaciones
  getAll: async () => {
    try {
      console.log('🔄 [EvalcompeProgramacionService] Obteniendo todas las programaciones...');
      
      // Volver a usar el cliente API configurado que maneja la autenticación correctamente
      const response = await evalcompeApiClient.get('');
      
      console.log('📋 [EvalcompeProgramacionService] Respuesta completa:', response);
      console.log('📋 [EvalcompeProgramacionService] response.data:', response.data);
      console.log('📋 [EvalcompeProgramacionService] response.status:', response.status);
      
      // El backend devuelve directamente el array de programaciones
      const programaciones = Array.isArray(response.data) ? response.data : [];
      
      console.log('✅ [EvalcompeProgramacionService] Programaciones procesadas:', programaciones.length);
      console.log('📋 [EvalcompeProgramacionService] Datos finales:', programaciones);
      
      return programaciones;
    } catch (error) {
      console.error('❌ [EvalcompeProgramacionService] Error al obtener programaciones:', error);
      console.error('📋 [EvalcompeProgramacionService] Detalles del error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Obtener una programación específica por ID
  getById: async (id) => {
    try {
      console.log(`🔄 [EvalcompeProgramacionService] Obteniendo programación ${id}...`);
      const response = await evalcompeApiClient.get(`/${id}`);
      
      let programacionData = null;
      if (response.data) {
        programacionData = response.data.data || response.data;
      }
      
      console.log('✅ [EvalcompeProgramacionService] Programación obtenida:', programacionData);
      return programacionData;
    } catch (error) {
      console.error(`❌ [EvalcompeProgramacionService] Error al obtener programación ${id}:`, error);
      throw error;
    }
  },

  // Obtener una programación específica con su matriz de evaluación
  getSingle: async (id) => {
    try {
      const response = await evalcompeApiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener programación ${id}:`, error);
      throw error;
    }
  },

  // Actualizar un detalle de evaluación (calificación de una competencia para una persona)
  updateDetalle: async (detalleId, data) => {
    try {
      const response = await evalcompeApiClient.put(`/detalle/${detalleId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar detalle ${detalleId}:`, error);
      throw error;
    }
  },

  // Alias para create (compatibilidad)
  create: async (data) => {
    try {
      console.log('🔄 [EvalcompeProgramacionService] Creando programación:', data);
      const response = await evalcompeApiClient.post('', data);
      
      let result = null;
      if (response.data) {
        result = response.data.data || response.data;
      }
      
      console.log('✅ [EvalcompeProgramacionService] Programación creada:', result);
      return result;
    } catch (error) {
      console.error('❌ [EvalcompeProgramacionService] Error al crear programación:', error);
      throw error;
    }
  },

  // Actualizar programación
  update: async (id, data) => {
    try {
      console.log(`🔄 [EvalcompeProgramacionService] Actualizando programación ${id}:`, data);
      const response = await evalcompeApiClient.put(`/${id}`, data);
      
      let result = null;
      if (response.data) {
        result = response.data.data || response.data;
      }
      
      console.log('✅ [EvalcompeProgramacionService] Programación actualizada:', result);
      return result;
    } catch (error) {
      console.error(`❌ [EvalcompeProgramacionService] Error al actualizar programación ${id}:`, error);
      throw error;
    }
  },

  // Eliminar programación
  delete: async (id) => {
    try {
      console.log(`🔄 [EvalcompeProgramacionService] Eliminando programación ${id}...`);
      const response = await evalcompeApiClient.delete(`/${id}`);
      
      console.log('✅ [EvalcompeProgramacionService] Programación eliminada');
      return response.data;
    } catch (error) {
      console.error(`❌ [EvalcompeProgramacionService] Error al eliminar programación ${id}:`, error);
      throw error;
    }
  }
};
