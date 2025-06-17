// Servicio para el módulo de Auditorías - Migrado a API
import apiService from './apiService';

// Endpoints
const AUDITORIAS_ENDPOINT = '/api/auditorias';
const PUNTOS_ENDPOINT = '/api/auditoria-puntos';

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
    const response = await apiService.post(AUDITORIAS_ENDPOINT, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear auditoría:', error);
    throw error;
  }
}

// Actualizar una auditoría
export async function updateAuditoria(id, data) {
  try {
    const response = await apiService.put(`${AUDITORIAS_ENDPOINT}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar auditoría con ID ${id}:`, error);
    throw error;
  }
}

// Eliminar una auditoría
export async function deleteAuditoria(id) {
  try {
    // El backend se encargará de eliminar los puntos relacionados
    const response = await apiService.delete(`${AUDITORIAS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar auditoría con ID ${id}:`, error);
    throw error;
  }
}

// Obtener todos los puntos evaluados de una auditoría
export async function getPuntosByAuditoriaId(auditoriaId) {
  try {
    const response = await apiService.get(`${PUNTOS_ENDPOINT}/auditoria/${auditoriaId}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error al obtener puntos de la auditoría ${auditoriaId}:`, error);
    throw error;
  }
}

// Crear un nuevo punto evaluado
export async function createPunto(data) {
  try {
    const response = await apiService.post(PUNTOS_ENDPOINT, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear punto:', error);
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
  getPuntosByAuditoriaId,
  createPunto
};
