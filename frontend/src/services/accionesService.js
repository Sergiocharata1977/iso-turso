import { createApiClient } from './apiService';

const apiClient = createApiClient('/acciones');

const accionesService = {
  // Obtener todas las acciones, opcionalmente filtradas por hallazgo_id
  getAllAcciones: async (hallazgo_id = null) => {
    try {
      const params = hallazgo_id ? { hallazgo_id } : {};
      const data = await apiClient.get('/', { params });
      console.log('🚀 DEBUG: Acciones obtenidas del API:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener las acciones de mejora:', error);
      throw error;
    }
  },

  // Crear una nueva acción de mejora
  createAccion: async (accionData) => {
    try {
      const data = await apiClient.post('/', accionData);
      console.log('✅ Acción de mejora creada:', data);
      return data;
    } catch (error) {
      console.error('Error al crear la acción de mejora:', error);
      throw error;
    }
  },

  // Actualizar una acción de mejora (ej: cambiar estado)
  updateAccion: async (id, updateData) => {
    try {
      const data = await apiClient.put(`/${id}`, updateData);
      console.log('✅ Acción de mejora actualizada:', data);
      return data;
    } catch (error) {
      console.error(`Error al actualizar la acción de mejora ${id}:`, error);
      throw error;
    }
  },

  // Obtener el detalle de una acción específica
  getAccionById: async (id) => {
    try {
      const data = await apiClient.get(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al obtener la acción de mejora ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una acción de mejora
  deleteAccion: async (id) => {
    try {
      const data = await apiClient.delete(`/${id}`);
      console.log('✅ Acción de mejora eliminada:', data);
      return data;
    } catch (error) {
      console.error(`Error al eliminar la acción de mejora ${id}:`, error);
      throw error;
    }
  }
};

export default accionesService;
