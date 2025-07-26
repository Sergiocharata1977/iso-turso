// Servicio para el módulo de Personal - Migrado a Backend API
import { createApiClient } from './apiService';

const personalApi = createApiClient('/personal');
const relacionesApi = createApiClient('/relaciones');

const personalService = {
  getAllPersonal: async () => {
    try {
      console.log('🔄 [PersonalService] Obteniendo lista de personal...');
      const response = await personalApi.get();
      console.log('📡 [PersonalService] Respuesta completa:', response);
      
      // Manejar diferentes formatos de respuesta del backend
      let personalData = [];
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          personalData = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          personalData = response.data.data;
        } else if (Array.isArray(response)) {
          personalData = response;
        }
      }
      
      console.log('✅ [PersonalService] Personal procesado:', personalData.length, 'registros');
      console.log('📋 [PersonalService] Primer registro:', personalData[0]);
      
      return personalData;
    } catch (error) {
      console.error('❌ [PersonalService] Error fetching personal:', error);
      console.error('❌ [PersonalService] Error details:', error.response?.data);
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

  // NUEVO: Obtener personal con relaciones usando relaciones_sgc
  getPersonalConRelaciones: async (personalId, organizationId) => {
    try {
      console.log('🔄 [PersonalService] Obteniendo personal con relaciones...');
      
      // Obtener datos del personal directamente
      const personalResponse = await personalApi.get(`/${personalId}`);
      const personalData = personalResponse.data || personalResponse;
      
      console.log('✅ [PersonalService] Datos básicos obtenidos:', personalData);
      
      // Por ahora, solo devolver los datos básicos sin relaciones
      // TODO: Implementar relaciones cuando el endpoint esté listo
      return {
        ...personalData,
        puestos_relacionados: [],
        departamentos_relacionados: [],
        puesto_actual: null,
        departamento_actual: null
      };
    } catch (error) {
      console.error('❌ [PersonalService] Error obteniendo personal con relaciones:', error);
      throw error;
    }
  },

  // NUEVO: Asignar puesto usando relaciones_sgc
  asignarPuesto: async (personalId, puestoId, organizationId, usuarioId) => {
    try {
      console.log('🔄 [PersonalService] Asignando puesto usando relaciones_sgc...');
      
      // Crear relación en tabla relaciones_sgc
      const response = await relacionesApi.post('', {
        organization_id: organizationId,
        origen_tipo: 'personal',
        origen_id: personalId,
        destino_tipo: 'puesto',
        destino_id: puestoId,
        descripcion: 'Asignación de puesto al personal',
        usuario_creador: usuarioId
      });
      
      console.log('✅ [PersonalService] Puesto asignado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ [PersonalService] Error asignando puesto:', error);
      throw error;
    }
  },

  // NUEVO: Asignar departamento usando relaciones_sgc
  asignarDepartamento: async (personalId, departamentoId, organizationId, usuarioId) => {
    try {
      console.log('🔄 [PersonalService] Asignando departamento usando relaciones_sgc...');
      
      // Crear relación en tabla relaciones_sgc
      const response = await relacionesApi.post('', {
        organization_id: organizationId,
        origen_tipo: 'personal',
        origen_id: personalId,
        destino_tipo: 'departamento',
        destino_id: departamentoId,
        descripcion: 'Asignación de departamento al personal',
        usuario_creador: usuarioId
      });
      
      console.log('✅ [PersonalService] Departamento asignado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ [PersonalService] Error asignando departamento:', error);
      throw error;
    }
  },

  // NUEVO: Obtener puestos disponibles para asignar
  getPuestosDisponibles: async (organizationId) => {
    try {
      const response = await createApiClient('/puestos').get('', {
        params: { organization_id: organizationId }
      });
      return response.data || response;
    } catch (error) {
      console.error('❌ [PersonalService] Error obteniendo puestos disponibles:', error);
      throw error;
    }
  },

  // NUEVO: Obtener departamentos disponibles para asignar
  getDepartamentosDisponibles: async (organizationId) => {
    try {
      const response = await createApiClient('/departamentos').get('', {
        params: { organization_id: organizationId }
      });
      return response.data || response;
    } catch (error) {
      console.error('❌ [PersonalService] Error obteniendo departamentos disponibles:', error);
      throw error;
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
