// Servicio para el módulo de Auditorías - Migrado a API
import { createApiClient } from './apiService.js';

// API Clients
const auditoriasApiClient = createApiClient('/auditorias');
const hallazgosApiClient = createApiClient('/hallazgos');

// Obtener todas las auditorías
export async function getAllAuditorias() {
  try {
    const data = await auditoriasApiClient.get('/');
    return data || [];
  } catch (error) {
    console.error('Error al obtener auditorías:', error);
    throw new Error(error.message || 'Error al cargar las auditorías');
  }
}

// Obtener una auditoría por ID
export async function getAuditoriaById(id) {
  try {
    const data = await auditoriasApiClient.get(`/${id}`);
    return data || null;
  } catch (error) {
    console.error(`Error al obtener auditoría con ID ${id}:`, error);
    throw new Error(error.message || `Error al cargar la auditoría con ID ${id}`);
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
    const dataResponse = await auditoriasApiClient.post('/', auditoriaData);
    return dataResponse;
  } catch (error) {
    console.error('Error al crear auditoría:', error);
    throw new Error(error.message || 'Error al crear la auditoría');
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
    const dataResponse = await auditoriasApiClient.put(`/${id}`, auditoriaData);
    return dataResponse;
  } catch (error) {
    console.error(`Error al actualizar auditoría con ID ${id}:`, error);
    throw new Error(error.message || `Error al actualizar la auditoría con ID ${id}`);
  }
}

// Eliminar una auditoría
export async function deleteAuditoria(id) {
  try {
    const dataResponse = await auditoriasApiClient.delete(`/${id}`);
    return dataResponse;
  } catch (error) {
    console.error(`Error al eliminar auditoría con ID ${id}:`, error);
    throw new Error(error.message || `Error al eliminar la auditoría con ID ${id}`);
  }
}

// Buscar auditorías por filtros
export async function searchAuditorias(filters) {
  try {
    const data = await auditoriasApiClient.get('/search', { params: filters });
    return data || [];
  } catch (error) {
    console.error('Error al buscar auditorías:', error);
    throw new Error(error.message || 'Error al buscar auditorías');
  }
}

// Obtener todos los hallazgos de una auditoría
export async function getHallazgosByAuditoriaId(auditoriaId) {
  try {
    const data = await hallazgosApiClient.get(`/auditoria/${auditoriaId}`);
    return data || [];
  } catch (error) {
    console.error(`Error al obtener hallazgos de la auditoría ${auditoriaId}:`, error);
    throw new Error(error.message || `Error al cargar los hallazgos de la auditoría ${auditoriaId}`);
  }
}

// Obtener un hallazgo por ID
export async function getHallazgoById(id) {
  try {
    const data = await hallazgosApiClient.get(`/${id}`);
    return data || null;
  } catch (error) {
    console.error(`Error al obtener hallazgo con ID ${id}:`, error);
    throw new Error(error.message || `Error al cargar el hallazgo con ID ${id}`);
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
    const dataResponse = await hallazgosApiClient.post('/', hallazgoData);
    return dataResponse;
  } catch (error) {
    console.error('Error al crear hallazgo:', error);
    throw new Error(error.message || 'Error al crear el hallazgo');
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
    const dataResponse = await hallazgosApiClient.put(`/${id}`, hallazgoData);
    return dataResponse;
  } catch (error) {
    console.error(`Error al actualizar hallazgo con ID ${id}:`, error);
    throw new Error(error.message || `Error al actualizar el hallazgo con ID ${id}`);
  }
}

// Eliminar un hallazgo
export async function deleteHallazgo(id) {
  try {
    const dataResponse = await hallazgosApiClient.delete(`/${id}`);
    return dataResponse;
  } catch (error) {
    console.error(`Error al eliminar hallazgo con ID ${id}:`, error);
    throw new Error(error.message || `Error al eliminar el hallazgo con ID ${id}`);
  }
}

// Obtener resumen de auditorías por estado
export async function getResumenAuditoriasPorEstado() {
  try {
    const data = await auditoriasApiClient.get('/resumen/estado');
    return data || [];
  } catch (error) {
    console.error('Error al obtener resumen de auditorías por estado:', error);
    throw new Error(error.message || 'Error al obtener el resumen de auditorías por estado');
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
