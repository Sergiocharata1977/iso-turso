// Servicio para el módulo de Auditorías - Migrado a API
import { createApiClient } from './apiService.js';

// API Clients
const auditoriasApiClient = createApiClient('/auditorias');
const puntosApiClient = createApiClient('/auditoria-puntos');

// Obtener todas las auditorías
export async function getAllAuditorias() {
  try {
    const data = await auditoriasApiClient.get('');
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
    const responseData = await auditoriasApiClient.post('', data);
    return responseData;
  } catch (error) {
    console.error('Error al crear auditoría:', error);
    throw new Error(error.message || 'Error al crear la auditoría');
  }
}

// Actualizar una auditoría
export async function updateAuditoria(id, data) {
  try {
    const responseData = await auditoriasApiClient.put(`/${id}`, data);
    return responseData;
  } catch (error) {
    console.error(`Error al actualizar auditoría con ID ${id}:`, error);
    throw new Error(error.message || `Error al actualizar la auditoría con ID ${id}`);
  }
}

// Eliminar una auditoría
export async function deleteAuditoria(id) {
  try {
    // El backend se encargará de eliminar los puntos relacionados
    const responseData = await auditoriasApiClient.delete(`/${id}`);
    return responseData;
  } catch (error) {
    console.error(`Error al eliminar auditoría con ID ${id}:`, error);
    throw new Error(error.message || `Error al eliminar la auditoría con ID ${id}`);
  }
}

// Obtener todos los puntos evaluados de una auditoría
export async function getPuntosByAuditoriaId(auditoriaId) {
  try {
    const data = await puntosApiClient.get(`/auditoria/${auditoriaId}`);
    return data || [];
  } catch (error) {
    console.error(`Error al obtener puntos de la auditoría ${auditoriaId}:`, error);
    throw new Error(error.message || `Error al cargar los puntos de la auditoría ${auditoriaId}`);
  }
}

// Crear un nuevo punto evaluado
export async function createPunto(data) {
  try {
    const responseData = await puntosApiClient.post('/', data);
    return responseData;
  } catch (error) {
    console.error('Error al crear punto:', error);
    throw new Error(error.message || 'Error al crear el punto de auditoría');
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
