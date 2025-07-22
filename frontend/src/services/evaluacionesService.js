import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/evaluaciones');

export const evaluacionesService = {
  // Obtener todas las evaluaciones individuales
  getAll: async () => {
    try {
      console.log('🔄 [EvaluacionesService] Obteniendo todas las evaluaciones...');
      const response = await apiClient.get('');
      
      console.log('📡 [EvaluacionesService] Respuesta del backend:', response);
      
      // Manejar diferentes formatos de respuesta
      let evaluacionesData = [];
      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          evaluacionesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          evaluacionesData = response.data;
        }
      }
      
      console.log('✅ [EvaluacionesService] Evaluaciones procesadas:', evaluacionesData.length);
      return evaluacionesData;
    } catch (error) {
      console.error('❌ [EvaluacionesService] Error al obtener evaluaciones:', error);
      return [];
    }
  },

  // Obtener una evaluación específica por ID
  getById: async (id) => {
    try {
      console.log(`🔄 [EvaluacionesService] Obteniendo evaluación ${id}...`);
      const response = await apiClient.get(`/${id}`);
      
      let evaluacionData = null;
      if (response.data) {
        evaluacionData = response.data.data || response.data;
      }
      
      console.log('✅ [EvaluacionesService] Evaluación obtenida:', evaluacionData);
      return evaluacionData;
    } catch (error) {
      console.error(`❌ [EvaluacionesService] Error al obtener evaluación ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva evaluación individual con control completo
  create: async (evaluacionData) => {
    try {
      console.log('🔄 [EvaluacionesService] Creando nueva evaluación:', evaluacionData);
      
      const {
        empleado_id,
        fecha_evaluacion,
        observaciones,
        competencias // Array de { competencia_id, puntaje }
      } = evaluacionData;

      if (!empleado_id || !fecha_evaluacion || !competencias) {
        throw new Error('Faltan campos obligatorios: empleado_id, fecha_evaluacion, competencias');
      }

      const response = await apiClient.post('', {
        empleado_id,
        fecha_evaluacion,
        observaciones,
        competencias
      });

      console.log('✅ [EvaluacionesService] Evaluación creada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [EvaluacionesService] Error al crear evaluación:', error);
      throw error;
    }
  },

  // Actualizar una evaluación existente
  update: async (id, evaluacionData) => {
    try {
      console.log(`🔄 [EvaluacionesService] Actualizando evaluación ${id}:`, evaluacionData);
      const response = await apiClient.put(`/${id}`, evaluacionData);
      
      console.log('✅ [EvaluacionesService] Evaluación actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ [EvaluacionesService] Error al actualizar evaluación ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una evaluación
  deleteEvaluacion: async (id) => {
    try {
      console.log(`🔄 [EvaluacionesService] Eliminando evaluación ${id}...`);
      const response = await apiClient.delete(`/${id}`);
      
      console.log('✅ [EvaluacionesService] Evaluación eliminada exitosamente');
      return response.data;
    } catch (error) {
      console.error(`❌ [EvaluacionesService] Error al eliminar evaluación ${id}:`, error);
      throw error;
    }
  },

  // Obtener estadísticas de evaluaciones
  getEstadisticas: async () => {
    try {
      console.log('🔄 [EvaluacionesService] Obteniendo estadísticas...');
      const response = await apiClient.get('/estadisticas');
      
      let estadisticasData = null;
      if (response.data) {
        estadisticasData = response.data.data || response.data;
      }
      
      console.log('✅ [EvaluacionesService] Estadísticas obtenidas:', estadisticasData);
      return estadisticasData;
    } catch (error) {
      console.error('❌ [EvaluacionesService] Error al obtener estadísticas:', error);
      throw error;
    }
  },

  // Obtener evaluaciones por empleado (para control de evaluaciones 1 a 1)
  getByEmpleado: async (empleadoId) => {
    try {
      console.log(`🔄 [EvaluacionesService] Obteniendo evaluaciones del empleado ${empleadoId}...`);
      const response = await apiClient.get('', {
        params: { empleado_id: empleadoId }
      });
      
      let evaluacionesData = [];
      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          evaluacionesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          evaluacionesData = response.data;
        }
      }
      
      console.log(`✅ [EvaluacionesService] Encontradas ${evaluacionesData.length} evaluaciones para empleado ${empleadoId}`);
      return evaluacionesData;
    } catch (error) {
      console.error(`❌ [EvaluacionesService] Error al obtener evaluaciones del empleado ${empleadoId}:`, error);
      return [];
    }
  }
};
