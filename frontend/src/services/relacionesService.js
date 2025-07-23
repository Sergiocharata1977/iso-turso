import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/relaciones');

export const relacionesService = {
  // Obtener todas las relaciones
  getAll: async () => {
    try {
      console.log('🔄 [RelacionesService] Obteniendo todas las relaciones...');
      const response = await apiClient.get('');
      
      let relacionesData = [];
      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          relacionesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          relacionesData = response.data;
        }
      }
      
      console.log('✅ [RelacionesService] Relaciones obtenidas:', relacionesData.length);
      return relacionesData;
    } catch (error) {
      console.error('❌ [RelacionesService] Error al obtener relaciones:', error);
      return [];
    }
  },

  // Obtener relaciones por tipo de origen
  getByOrigenTipo: async (origenTipo) => {
    try {
      console.log(`🔄 [RelacionesService] Obteniendo relaciones de origen: ${origenTipo}`);
      const response = await apiClient.get(`/origen/${origenTipo}`);
      
      let relacionesData = [];
      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          relacionesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          relacionesData = response.data;
        }
      }
      
      console.log(`✅ [RelacionesService] Encontradas ${relacionesData.length} relaciones para ${origenTipo}`);
      return relacionesData;
    } catch (error) {
      console.error(`❌ [RelacionesService] Error al obtener relaciones de ${origenTipo}:`, error);
      return [];
    }
  },

  // Obtener relaciones por tipo de destino
  getByDestinoTipo: async (destinoTipo) => {
    try {
      console.log(`🔄 [RelacionesService] Obteniendo relaciones de destino: ${destinoTipo}`);
      const response = await apiClient.get(`/destino/${destinoTipo}`);
      
      let relacionesData = [];
      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          relacionesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          relacionesData = response.data;
        }
      }
      
      console.log(`✅ [RelacionesService] Encontradas ${relacionesData.length} relaciones para ${destinoTipo}`);
      return relacionesData;
    } catch (error) {
      console.error(`❌ [RelacionesService] Error al obtener relaciones de ${destinoTipo}:`, error);
      return [];
    }
  },

  // Obtener relaciones entre dos tipos específicos
  getRelacion: async (origenTipo, origenId, destinoTipo, destinoId) => {
    try {
      console.log(`🔄 [RelacionesService] Obteniendo relación: ${origenTipo}:${origenId} -> ${destinoTipo}:${destinoId}`);
      const response = await apiClient.get(`/relacion`, {
        params: { origenTipo, origenId, destinoTipo, destinoId }
      });
      
      let relacionData = null;
      if (response.data) {
        relacionData = response.data.data || response.data;
      }
      
      console.log('✅ [RelacionesService] Relación obtenida:', relacionData);
      return relacionData;
    } catch (error) {
      console.error('❌ [RelacionesService] Error al obtener relación:', error);
      return null;
    }
  },

  // Crear una nueva relación
  create: async (relacionData) => {
    try {
      console.log('🔄 [RelacionesService] Creando nueva relación:', relacionData);
      
      const {
        organization_id,
        origen_tipo,
        origen_id,
        destino_tipo,
        destino_id,
        descripcion,
        usuario_creador
      } = relacionData;

      if (!organization_id || !origen_tipo || !origen_id || !destino_tipo || !destino_id) {
        throw new Error('Faltan campos obligatorios para crear la relación');
      }

      const response = await apiClient.post('', {
        organization_id,
        origen_tipo,
        origen_id,
        destino_tipo,
        destino_id,
        descripcion,
        usuario_creador
      });

      console.log('✅ [RelacionesService] Relación creada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [RelacionesService] Error al crear relación:', error);
      throw error;
    }
  },

  // Actualizar una relación existente
  update: async (id, relacionData) => {
    try {
      console.log(`🔄 [RelacionesService] Actualizando relación ${id}:`, relacionData);
      const response = await apiClient.put(`/${id}`, relacionData);
      
      console.log('✅ [RelacionesService] Relación actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ [RelacionesService] Error al actualizar relación ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una relación
  delete: async (id) => {
    try {
      console.log(`🔄 [RelacionesService] Eliminando relación ${id}...`);
      const response = await apiClient.delete(`/${id}`);
      
      console.log('✅ [RelacionesService] Relación eliminada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`❌ [RelacionesService] Error al eliminar relación ${id}:`, error);
      throw error;
    }
  },

  // Obtener entidades relacionadas (ej: personal relacionado con evaluaciones)
  getEntidadesRelacionadas: async (origenTipo, origenId, destinoTipo) => {
    try {
      console.log(`🔄 [RelacionesService] Obteniendo ${destinoTipo} relacionados con ${origenTipo}:${origenId}`);
      const response = await apiClient.get(`/entidades-relacionadas`, {
        params: { origenTipo, origenId, destinoTipo }
      });
      
      let entidadesData = [];
      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          entidadesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          entidadesData = response.data;
        }
      }
      
      console.log(`✅ [RelacionesService] Encontradas ${entidadesData.length} entidades relacionadas`);
      return entidadesData;
    } catch (error) {
      console.error(`❌ [RelacionesService] Error al obtener entidades relacionadas:`, error);
      return [];
    }
  }
}; 