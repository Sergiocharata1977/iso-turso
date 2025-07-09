import { createApiClient } from './apiService';

const apiClient = createApiClient('/evaluaciones');

export const evaluacionesService = {
  getAll: async (organizationId) => {
    try {
      const response = await apiClient.get('', {
        params: { organization_id: organizationId }
      });
      return response;
    } catch (error) {
      console.error('Error en evaluacionesService.getAll:', error);
      throw error;
    }
  },

  getById: async (id, organizationId) => {
    try {
      const response = await apiClient.get(`/${id}`, {
        params: { organization_id: organizationId }
      });
      return response;
    } catch (error) {
      console.error(`Error en evaluacionesService.getById ${id}:`, error);
      throw error;
    }
  },

  create: async (evaluacionData) => {
    try {
      const {
        empleado_id,
        evaluador_id,
        fecha_evaluacion,
        periodo,
        resultados,
        comentarios,
        estado,
        organization_id
      } = evaluacionData;

      if (!organization_id) {
        throw new Error('Se requiere organization_id para crear una evaluación');
    }

      const response = await apiClient.post('', {
        empleado_id,
        evaluador_id,
        fecha_evaluacion,
        periodo,
        resultados,
        comentarios,
        estado,
        organization_id
      });

      return response.data;
    } catch (error) {
      console.error('Error en evaluacionesService.create:', error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  update: async (id, evaluacionData) => {
    try {
      const {
        empleado_id,
        evaluador_id,
        fecha_evaluacion,
        periodo,
        resultados,
        comentarios,
        estado,
        organization_id
      } = evaluacionData;

      if (!organization_id) {
        throw new Error('Se requiere organization_id para actualizar una evaluación');
    }

      const response = await apiClient.put(`/${id}`, {
        empleado_id,
        evaluador_id,
        fecha_evaluacion,
        periodo,
        resultados,
        comentarios,
        estado,
        organization_id
      });

      return response.data;
    } catch (error) {
      console.error(`Error en evaluacionesService.update ${id}:`, error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  delete: async (id, organizationId) => {
    try {
      const response = await apiClient.delete(`/${id}`, {
        params: { organization_id: organizationId }
      });
      return response;
    } catch (error) {
      console.error(`Error en evaluacionesService.delete ${id}:`, error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }
};
