import { createApiClient } from './apiService';

const apiClient = createApiClient('/puestos');

export const puestosService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('');
      return response;
    } catch (error) {
      console.error('Error en puestosService.getAll:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response;
    } catch (error) {
      console.error(`Error en puestosService.getById ${id}:`, error);
      throw error;
    }
  },

  create: async (puestoData) => {
    try {
      // Asegurarse de que los campos numéricos que pueden ser string vacíos se envíen como null si es necesario
      // o que el backend los maneje adecuadamente.
      // Por ejemplo, si reporta_a_puesto_id es "", el backend podría necesitarlo como null.
      const dataToSend = {
        titulo_puesto: puestoData.titulo_puesto,
        codigo_puesto: puestoData.codigo_puesto,
        departamento_id: puestoData.departamento_id ? parseInt(puestoData.departamento_id, 10) : null,
        reporta_a_puesto_id: puestoData.reporta_a_puesto_id ? parseInt(puestoData.reporta_a_puesto_id, 10) : null,
        proposito_general: puestoData.proposito_general,
        principales_responsabilidades: puestoData.principales_responsabilidades,
        requisitos: puestoData.requisitos,
        formacion_requerida: puestoData.formacion_requerida,
        experiencia_requerida: puestoData.experiencia_requerida,
        competencias_necesarias: puestoData.competencias_necesarias,
        nivel: puestoData.nivel,
        estado_puesto: puestoData.estado_puesto,
      };
      const response = await apiClient.post('', dataToSend);
      return response;
    } catch (error) {
      console.error('Error en puestosService.create:', error);
      // Si el error tiene una respuesta del backend, la pasamos para un manejo más específico
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  update: async (id, puestoData) => {
    try {
      const dataToSend = {
        titulo_puesto: puestoData.titulo_puesto,
        codigo_puesto: puestoData.codigo_puesto,
        departamento_id: puestoData.departamento_id ? parseInt(puestoData.departamento_id, 10) : null,
        reporta_a_puesto_id: puestoData.reporta_a_puesto_id ? parseInt(puestoData.reporta_a_puesto_id, 10) : null,
        proposito_general: puestoData.proposito_general,
        principales_responsabilidades: puestoData.principales_responsabilidades,
        requisitos: puestoData.requisitos,
        formacion_requerida: puestoData.formacion_requerida,
        experiencia_requerida: puestoData.experiencia_requerida,
        competencias_necesarias: puestoData.competencias_necesarias,
        nivel: puestoData.nivel,
        estado_puesto: puestoData.estado_puesto,
      };
      const response = await apiClient.put(`/${id}`, dataToSend);
      return response;
    } catch (error) {
      console.error(`Error en puestosService.update ${id}:`, error);
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response;
    } catch (error) {
      console.error(`Error en puestosService.delete ${id}:`, error);
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw error;
    }
  },
};
