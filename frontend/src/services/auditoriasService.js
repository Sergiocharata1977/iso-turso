import { apiService } from './apiService.js';

// ===============================================
// SERVICIO DE AUDITORÍAS - SGC PRO
// ===============================================

export const auditoriasService = {
  // Obtener todas las auditorías
  async getAll() {
    try {
      const response = await apiService.get('/auditorias');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo auditorías:', error);
      throw error;
    }
  },

  // Obtener auditoría por ID
  async getById(id) {
    try {
      const response = await apiService.get(`/auditorias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo auditoría:', error);
      throw error;
    }
  },

  // Crear nueva auditoría
  async create(auditoriaData) {
    try {
      const response = await apiService.post('/auditorias', auditoriaData);
      return response.data;
    } catch (error) {
      console.error('Error creando auditoría:', error);
      throw error;
    }
  },

  // Actualizar auditoría
  async update(id, auditoriaData) {
    try {
      const response = await apiService.put(`/auditorias/${id}`, auditoriaData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando auditoría:', error);
      throw error;
    }
  },

  // Eliminar auditoría
  async delete(id) {
    try {
      const response = await apiService.delete(`/auditorias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando auditoría:', error);
      throw error;
    }
  },

  // Obtener aspectos de una auditoría
  async getAspectos(auditoriaId) {
    try {
      const response = await apiService.get(`/auditorias/${auditoriaId}/aspectos`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo aspectos:', error);
      throw error;
    }
  },

  // Agregar aspecto a auditoría
  async addAspecto(auditoriaId, aspectoData) {
    try {
      const response = await apiService.post(`/auditorias/${auditoriaId}/aspectos`, aspectoData);
      return response.data;
    } catch (error) {
      console.error('Error agregando aspecto:', error);
      throw error;
    }
  },

  // Actualizar aspecto
  async updateAspecto(aspectoId, aspectoData) {
    try {
      const response = await apiService.put(`/auditoria-aspectos/${aspectoId}`, aspectoData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando aspecto:', error);
      throw error;
    }
  },

  // Eliminar aspecto
  async deleteAspecto(aspectoId) {
    try {
      const response = await apiService.delete(`/auditoria-aspectos/${aspectoId}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando aspecto:', error);
      throw error;
    }
  },

  // Generar código de auditoría automático
  generateAuditCode() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `AUD-${year}-${random}`;
  },

  // Obtener estados disponibles
  getEstados() {
    return [
      { value: 'planificada', label: 'Planificada', color: 'status-planned' },
      { value: 'en_proceso', label: 'En Proceso', color: 'status-progress' },
      { value: 'completada', label: 'Completada', color: 'status-completed' },
      { value: 'cancelada', label: 'Cancelada', color: 'status-cancelled' }
    ];
  },

  // Obtener tipos de conformidad
  getConformidades() {
    return [
      { value: 'conforme', label: 'Conforme', color: 'conforme' },
      { value: 'no_conforme', label: 'No Conforme', color: 'no-conforme' },
      { value: 'observacion', label: 'Observación', color: 'observacion' }
    ];
  },

  // Obtener áreas disponibles
  getAreas() {
    return [
      'Producción',
      'Calidad',
      'Administración',
      'Ventas',
      'Compras',
      'Recursos Humanos',
      'Mantenimiento',
      'Logística',
      'Finanzas',
      'Tecnología'
    ];
  }
};

// Funciones de relaciones de auditorías
export const getRelaciones = async (auditoriaId) => {
  try {
    const response = await apiService.get(`/auditorias/${auditoriaId}/relaciones`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo relaciones:', error);
    throw error;
  }
};

export const addRelacion = async (auditoriaId, relacionData) => {
  try {
    const response = await apiService.post(`/auditorias/${auditoriaId}/relaciones`, relacionData);
    return response.data;
  } catch (error) {
    console.error('Error agregando relación:', error);
    throw error;
  }
};

export const deleteRelacion = async (relacionId) => {
  try {
    const response = await apiService.delete(`/auditorias/relaciones/${relacionId}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando relación:', error);
    throw error;
  }
};

export const getRegistrosRelacionables = async (tipo) => {
  try {
    const response = await apiService.get(`/auditorias/registros-relacionables/${tipo}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo registros relacionables:', error);
    throw error;
  }
};
