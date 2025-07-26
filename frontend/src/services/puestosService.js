import { createApiClient } from './apiService';

const apiClient = createApiClient('/puestos');

export const puestosService = {
  getAll: async (organizationId) => {
    try {
      const response = await apiClient.get('', {
        params: { organization_id: organizationId }
      });
      return response.data || response;
    } catch (error) {
      console.error('Error en puestosService.getAll:', error);
      throw error;
    }
  },

  getById: async (id, organizationId) => {
    try {
      const response = await apiClient.get(`/${id}`, {
        params: { organization_id: organizationId }
      });
      return response.data || response;
    } catch (error) {
      console.error(`Error en puestosService.getById ${id}:`, error);
      throw error;
    }
  },

  create: async (puestoData) => {
    try {
      const {
        nombre,
        descripcion,
        requisitos_experiencia,
        requisitos_formacion,
        organization_id
      } = puestoData;

      if (!organization_id) {
        throw new Error('Se requiere organization_id para crear un puesto');
      }

      const response = await apiClient.post('', {
        nombre,
        descripcion,
        requisitos_experiencia,
        requisitos_formacion,
        organization_id
      });

      return response.data;
    } catch (error) {
      console.error('Error en puestosService.create:', error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  update: async (id, puestoData) => {
    try {
      const {
        nombre,
        descripcion,
        requisitos_experiencia,
        requisitos_formacion,
        organization_id
      } = puestoData;

      if (!organization_id) {
        throw new Error('Se requiere organization_id para actualizar un puesto');
      }

      const response = await apiClient.put(`/${id}`, {
        nombre,
        descripcion,
        requisitos_experiencia,
        requisitos_formacion,
        organization_id
      });

      return response.data;
    } catch (error) {
      console.error(`Error en puestosService.update ${id}:`, error);
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
      return response.data || response;
    } catch (error) {
      console.error(`Error en puestosService.delete ${id}:`, error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }
};

// Export default para compatibilidad
export default puestosService;
