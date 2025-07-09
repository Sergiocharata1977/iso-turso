abckend
import { createApiClient } from './apiService';

const evaluacionesGrupalesApiClient = createApiClient('/evaluaciones-grupales');

export const evaluacionesGrupalesService = {
  // Obtener todas las evaluaciones grupales
  async getAll(filters = {}, organizationId) {
    try {
      if (!organizationId) {
        throw new Error('Se requiere organization_id para obtener evaluaciones grupales');
      }

      console.log('[DEBUG] Servicio - Iniciando getAll con filtros:', filters);
      const params = new URLSearchParams();
      if (filters.estado) params.append('estado', filters.estado);
      params.append('organization_id', organizationId);
      
      const url = `?${params.toString()}`;
      console.log('[DEBUG] Servicio - URL completa:', url);
      const response = await evaluacionesGrupalesApiClient.get(url);
      console.log('[DEBUG] Servicio - Respuesta completa:', response);
      console.log('[DEBUG] Servicio - Tipo de respuesta:', typeof response);
      console.log('[DEBUG] Servicio - Es array respuesta?:', Array.isArray(response));
      
      // El backend devuelve directamente el array, no envuelto en un objeto .data
      const result = Array.isArray(response) ? response : [];
      console.log('[DEBUG] Servicio - Resultado final:', result);
      return result;
    } catch (error) {
      console.error('[ERROR] Servicio - Error al obtener evaluaciones grupales:', error);
      console.error('[ERROR] Servicio - Detalles del error:', error.response?.data);
      console.error('[ERROR] Servicio - Status del error:', error.response?.status);
      throw new Error('No se pudieron cargar las evaluaciones grupales');
    }
  },

  // Obtener evaluación grupal por ID con empleados
  async getById(id, organizationId) {
    try {
      if (!organizationId) {
        throw new Error('Se requiere organization_id para obtener una evaluación grupal');
      }

      const response = await evaluacionesGrupalesApiClient.get(`/${id}`, {
        params: { organization_id: organizationId }
      });
      return response;
    } catch (error) {
      console.error('Error al obtener evaluación grupal:', error);
      if (error.response?.status === 404) {
        throw new Error('Evaluación grupal no encontrada');
      }
      throw new Error('No se pudo cargar la evaluación grupal');
    }
  },

  // Crear nueva evaluación grupal
  async create(evaluacionData) {
    try {
      if (!evaluacionData.organization_id) {
        throw new Error('Se requiere organization_id para crear una evaluación grupal');
      }

      const response = await evaluacionesGrupalesApiClient.post('/', evaluacionData);
      return response;
    } catch (error) {
      console.error('Error al crear evaluación grupal:', error);
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.error || 'Datos inválidos');
      }
      throw new Error('No se pudo crear la evaluación grupal');
    }
  },

  // Actualizar evaluación grupal
  async update(id, evaluacionData) {
    try {
      if (!evaluacionData.organization_id) {
        throw new Error('Se requiere organization_id para actualizar una evaluación grupal');
      }

      const response = await evaluacionesGrupalesApiClient.put(`/${id}`, evaluacionData);
      return response;
    } catch (error) {
      console.error('Error al actualizar evaluación grupal:', error);
      if (error.response?.status === 404) {
        throw new Error('Evaluación grupal no encontrada');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.error || 'Datos inválidos');
      }
      throw new Error('No se pudo actualizar la evaluación grupal');
    }
  },

  // Eliminar evaluación grupal
  async delete(id, organizationId) {
    try {
      if (!organizationId) {
        throw new Error('Se requiere organization_id para eliminar una evaluación grupal');
      }

      await evaluacionesGrupalesApiClient.delete(`/${id}`, {
        params: { organization_id: organizationId }
      });
      return true;
    } catch (error) {
      console.error('Error al eliminar evaluación grupal:', error);
      if (error.response?.status === 404) {
        throw new Error('Evaluación grupal no encontrada');
      }
      throw new Error('No se pudo eliminar la evaluación grupal');
    }
  },

  // Obtener competencias estándar
  async getCompetenciasEstandar(organizationId) {
    try {
      if (!organizationId) {
        throw new Error('Se requiere organization_id para obtener competencias estándar');
      }

      const response = await evaluacionesGrupalesApiClient.get('/competencias/estandar', {
        params: { organization_id: organizationId }
      });
      return response;
    } catch (error) {
      console.error('Error al obtener competencias estándar:', error);
      throw new Error('No se pudieron cargar las competencias estándar');
    }
  }
};

export default evaluacionesGrupalesService;
