// Servicio para el módulo de Personal - Migrado a Backend API
import { createApiClient } from './apiService';

const personalApi = createApiClient('/personal');

const personalService = {
  getAllPersonal: async () => {
    try {
      const response = await personalApi.get();
      // El backend devuelve { success: true, data: [...] }
      return response.data || response;
    } catch (error) {
      console.error('Error fetching personal:', error);
      throw new Error('No se pudo obtener la lista de personal');
    }
  },

  getPersonalById: async (id) => {
    if (!id) {
      throw new Error('ID de personal no válido');
    }
    try {
      const response = await personalApi.get(`/${id}`);
      // El backend devuelve { success: true, data: {...} }
      return response.data || response;
    } catch (error) {
      console.error(`Error fetching personal with id ${id}:`, error);
      throw new Error('No se pudo obtener el detalle del personal');
    }
  },

  createPersonal: async (personalData) => {
    try {
      const response = await personalApi.post('', personalData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating personal:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('No se pudo crear el registro de personal');
    }
  },

  updatePersonal: async (id, personalData) => {
    if (!id) {
      throw new Error('ID de personal no válido');
    }
    try {
      const response = await personalApi.put(`/${id}`, personalData);
      return response.data || response;
    } catch (error) {
      console.error(`Error updating personal with id ${id}:`, error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('No se pudo actualizar el registro de personal');
    }
  },

  deletePersonal: async (id) => {
    if (!id) {
      throw new Error('ID de personal no válido');
    }
    try {
      const response = await personalApi.delete(`/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error deleting personal with id ${id}:`, error);
      throw new Error('No se pudo eliminar el registro de personal');
    }
  },

  validatePersonalData: (data) => {
    const errors = {};
    
    if (!data.nombres?.trim()) {
      errors.nombres = 'Los nombres son requeridos';
    }
    
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email no válido';
    }
    
    if (!data.documento_identidad?.trim()) {
      errors.documento_identidad = 'El documento de identidad es requerido';
    }
    
    if (!data.numero_legajo?.trim()) {
      errors.numero_legajo = 'El número de legajo es requerido';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export { personalService };
