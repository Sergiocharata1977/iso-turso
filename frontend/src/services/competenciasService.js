import { createApiClient } from './apiService.js';

const competenciasApi = createApiClient('/competencias');

export const competenciasService = {
  // Obtener todas las competencias
  getAll: async () => {
    try {
      console.log('🔄 Iniciando petición a /api/competencias...');
      const response = await competenciasApi.get('');
      
      console.log('📡 Respuesta completa del backend:', response);
      console.log('📊 Datos en response.data:', response.data);
      
      // Manejar diferentes formatos de respuesta del backend
      let competenciasData = [];
      
      if (response.data) {
        // Si la respuesta tiene estructura { success: true, data: [...] }
        if (response.data.data && Array.isArray(response.data.data)) {
          competenciasData = response.data.data;
        }
        // Si la respuesta es directamente un array
        else if (Array.isArray(response.data)) {
          competenciasData = response.data;
        }
        // Si la respuesta tiene otra estructura
        else if (response.data.competencias && Array.isArray(response.data.competencias)) {
          competenciasData = response.data.competencias;
        }
      }
      
      console.log('✅ Competencias procesadas:', competenciasData);
      console.log('📈 Cantidad de competencias:', competenciasData.length);
      
      return competenciasData;
    } catch (error) {
      console.error('❌ Error al obtener competencias:', error);
      console.error('🔍 Detalles del error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // En caso de error, devolver array vacío para evitar crashes
      return [];
    }
  },

  // Obtener una competencia por ID
  getById: async (id) => {
    try {
      const response = await competenciasApi.get(`/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error al obtener competencia ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva competencia
  create: async (data) => {
    try {
      const response = await competenciasApi.post('', data);
      return response.data || response;
    } catch (error) {
      console.error('Error al crear competencia:', error);
      throw error;
    }
  },

  // Actualizar una competencia existente
  update: async (id, data) => {
    try {
      const response = await competenciasApi.put(`/${id}`, data);
      return response.data || response;
    } catch (error) {
      console.error(`Error al actualizar competencia ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una competencia
  delete: async (id) => {
    try {
      const response = await competenciasApi.delete(`/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error al eliminar competencia ${id}:`, error);
      throw error;
    }
  }
};
