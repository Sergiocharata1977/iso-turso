// Servicio para el módulo de Normas - Backend API
import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/normas');

// Obtener todas las normas
export async function getAllNormas() {
  try {
    return await apiClient.get('');
  } catch (error) {
    // console.error('Error al obtener normas:', error);
    throw new Error(error.message || 'Error al obtener las normas');
  }
}

// Obtener una norma por ID
export async function getNormaById(id) {
  try {
    return await apiClient.get(`/${id}`);
  } catch (error) {
    // console.error(`Error al obtener norma con ID ${id}:`, error);
    throw new Error(error.message || `Error al obtener la norma ${id}`);
  }
}

// Crear una nueva norma
export async function createNorma(data) {
  try {
    return await apiClient.post('', data);
  } catch (error) {
    // console.error('Error al crear norma:', error);
    throw new Error(error.message || 'Error al crear la norma');
  }
}

// Actualizar una norma
export async function updateNorma(id, data) {
  try {
    return await apiClient.put(`/${id}`, data);
  } catch (error) {
    // console.error(`Error al actualizar norma con ID ${id}:`, error);
    throw new Error(error.message || `Error al actualizar la norma ${id}`);
  }
}

// Eliminar una norma
export async function deleteNorma(id) {
  try {
    return await apiClient.delete(`/${id}`);
  } catch (error) {
    // console.error(`Error al eliminar norma con ID ${id}:`, error);
    throw new Error(error.message || `Error al eliminar la norma ${id}`);
  }
}

// Buscar normas por estado
export async function getNormasByEstado(estado) {
  try {
    const normas = await getAllNormas();
    return normas.filter(norma => norma.estado === estado);
  } catch (error) {
    console.error('Error al obtener normas por estado:', error);
    throw new Error(error.message || 'Error al obtener normas por estado');
  }
}

// Buscar normas por responsable
export async function getNormasByResponsable(responsable) {
  try {
    const normas = await getAllNormas();
    return normas.filter(norma => 
      norma.responsable && norma.responsable.toLowerCase().includes(responsable.toLowerCase())
    );
  } catch (error) {
    console.error('Error al obtener normas por responsable:', error);
    throw new Error(error.message || 'Error al obtener normas por responsable');
  }
}

// Buscar normas por código
export async function getNormaByCodigo(codigo) {
  try {
    const normas = await getAllNormas();
    return normas.find(norma => norma.codigo === codigo);
  } catch (error) {
    console.error('Error al obtener norma por código:', error);
    throw new Error(error.message || 'Error al obtener norma por código');
  }
}

// Buscar normas por término
export async function searchNormas(term) {
  try {
    const normas = await getAllNormas();
    return normas.filter(norma => 
      norma.titulo.toLowerCase().includes(term.toLowerCase()) || 
      (norma.descripcion && norma.descripcion.toLowerCase().includes(term.toLowerCase())) ||
      (norma.codigo && norma.codigo.toLowerCase().includes(term.toLowerCase())) ||
      (norma.responsable && norma.responsable.toLowerCase().includes(term.toLowerCase()))
    );
  } catch (error) {
    console.error('Error al buscar normas:', error);
    throw new Error(error.message || 'Error al buscar normas');
  }
}

// Obtener normas activas
export async function getNormasActivas() {
  try {
    return await getNormasByEstado('activo');
  } catch (error) {
    console.error('Error al obtener normas activas:', error);
    throw new Error(error.message || 'Error al obtener normas activas');
  }
}

export default {
  getAllNormas,
  getNormaById,
  createNorma,
  updateNorma,
  deleteNorma,
  getNormasByEstado,
  getNormasByResponsable,
  getNormaByCodigo,
  searchNormas,
  getNormasActivas
};
