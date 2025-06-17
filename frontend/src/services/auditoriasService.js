// Servicio para el módulo de Auditorías - Migrado a API
import apiService from './apiService';

// Endpoints
const AUDITORIAS_ENDPOINT = '/api/auditorias';
const HALLAZGOS_ENDPOINT = '/api/hallazgos';

// Obtener todas las auditorías
export async function getAllAuditorias() {
  try {
    const response = await apiService.get(AUDITORIAS_ENDPOINT);
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener auditorías:', error);
    throw error;
  }
}

// Obtener una auditoría por ID
export async function getAuditoriaById(id) {
  try {
    const response = await apiService.get(`${AUDITORIAS_ENDPOINT}/${id}`);
    return response.data || null;
  } catch (error) {
    console.error(`Error al obtener auditoría con ID ${id}:`, error);
    throw error;
  }
}

// Crear una nueva auditoría
export async function createAuditoria(data) {
  try {
    // Asegurarse de que se incluya la fecha de creación
    const auditoriaData = {
      ...data,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
    const response = await apiService.post(AUDITORIAS_ENDPOINT, auditoriaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear auditoría:', error);
    throw error;
  }
}

// Actualizar una auditoría
export async function updateAuditoria(id, data) {
  try {
    // Incluir fecha de actualización
    const auditoriaData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    const response = await apiService.put(`${AUDITORIAS_ENDPOINT}/${id}`, auditoriaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar auditoría con ID ${id}:`, error);
    throw error;
  }
}

// Eliminar una auditoría
export async function deleteAuditoria(id) {
  try {
    const response = await apiService.delete(`${AUDITORIAS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar auditoría con ID ${id}:`, error);
    throw error;
  }
}

// Buscar auditorías por filtros
export async function searchAuditorias(filters) {
  try {
    const response = await apiService.get(`${AUDITORIAS_ENDPOINT}/search`, { params: filters });
    return response.data || [];
  } catch (error) {
    console.error('Error al buscar auditorías:', error);
    throw error;
  }
}

// Obtener todos los hallazgos de una auditoría
export async function getHallazgosByAuditoriaId(auditoriaId) {
  try {
    const response = await apiService.get(`${HALLAZGOS_ENDPOINT}/auditoria/${auditoriaId}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error al obtener hallazgos de la auditoría ${auditoriaId}:`, error);
    throw error;
  }
}

// Obtener un hallazgo por ID
export async function getHallazgoById(id) {
  try {
    const response = await apiService.get(`${HALLAZGOS_ENDPOINT}/${id}`);
    return response.data || null;
  } catch (error) {
    console.error(`Error al obtener hallazgo con ID ${id}:`, error);
    throw error;
  }
}

// Crear un nuevo hallazgo
export async function createHallazgo(data) {
  try {
    // Asegurarse de que se incluya la fecha de creación
    const hallazgoData = {
      ...data,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
    const response = await apiService.post(HALLAZGOS_ENDPOINT, hallazgoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear hallazgo:', error);
    throw error;
  }
}

// Actualizar un hallazgo
export async function updateHallazgo(id, data) {
  try {
    // Incluir fecha de actualización
    const hallazgoData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    const response = await apiService.put(`${HALLAZGOS_ENDPOINT}/${id}`, hallazgoData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar hallazgo con ID ${id}:`, error);
    throw error;
  }
}

// Eliminar un hallazgo
export async function deleteHallazgo(id) {
  try {
    const response = await apiService.delete(`${HALLAZGOS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar hallazgo con ID ${id}:`, error);
    throw error;
  }
}

// Obtener resumen de auditorías por estado
export async function getResumenAuditoriasPorEstado() {
  try {
    const response = await apiService.get(`${AUDITORIAS_ENDPOINT}/resumen/estado`);
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener resumen de auditorías por estado:', error);
    throw error;
  }
}

// Exportar todas las funciones
export default {
  getAllAuditorias,
  getAuditoriaById,
  createAuditoria,
  updateAuditoria,
  deleteAuditoria,
  searchAuditorias,
  getHallazgosByAuditoriaId,
  getHallazgoById,
  createHallazgo,
  updateHallazgo,
  deleteHallazgo,
  getResumenAuditoriasPorEstado
};
