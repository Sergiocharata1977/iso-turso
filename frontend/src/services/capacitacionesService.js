import { createApiClient } from './apiService';

// Crear cliente API específico para capacitaciones
const apiClient = createApiClient('/capacitaciones');

export const capacitacionesService = {
  // Obtener todas las capacitaciones
  async getAll() {
    console.log('📋 Obteniendo todas las capacitaciones...');
    try {
      const response = await apiClient.get('/');
      console.log(`✅ ${response.length} capacitaciones obtenidas`);
      return response;
    } catch (error) {
      console.error('❌ Error al obtener capacitaciones:', error);
      throw new Error('Error al cargar las capacitaciones');
    }
  },

  // Obtener capacitación por ID
  async getById(id) {
    console.log(`🔍 Obteniendo capacitación ID: ${id}`);
    try {
      const response = await apiClient.get(`/${id}`);
      console.log(`✅ Capacitación obtenida: ${response.titulo}`);
      return response;
    } catch (error) {
      console.error(`❌ Error al obtener capacitación ID ${id}:`, error);
      throw new Error('Error al cargar la capacitación');
    }
  },

  // Crear nueva capacitación
  async create(capacitacion) {
    console.log('➕ Creando capacitación:', capacitacion);
    try {
      const response = await apiClient.post('/', capacitacion);
      console.log(`✅ Capacitación creada: ${response.titulo}`);
      return response;
    } catch (error) {
      console.error('❌ Error al crear capacitación:', error);
      throw new Error('Error al crear la capacitación');
    }
  },

  // Actualizar capacitación
  async update(id, capacitacion) {
    console.log(`✏️ Actualizando capacitación ID: ${id}`, capacitacion);
    try {
      const response = await apiClient.put(`/${id}`, capacitacion);
      console.log(`✅ Capacitación actualizada: ${response.titulo}`);
      return response;
    } catch (error) {
      console.error(`❌ Error al actualizar capacitación ID ${id}:`, error);
      throw new Error('Error al actualizar la capacitación');
    }
  },

  // Eliminar capacitación
  async delete(id) {
    console.log(`🗑️ Eliminando capacitación ID: ${id}`);
    try {
      const response = await apiClient.delete(`/${id}`);
      console.log(`✅ Capacitación eliminada`);
      return response;
    } catch (error) {
      console.error(`❌ Error al eliminar capacitación ID ${id}:`, error);
      throw new Error('Error al eliminar la capacitación');
    }
  }
};
