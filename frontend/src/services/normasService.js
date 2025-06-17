// Servicio para el módulo de Normas - Backend API
import apiService from './apiService.js';

const ENDPOINT = '/normas';

// Obtener todas las normas
export async function getAllNormas() {
  try {
    return await apiService.get(ENDPOINT);
  } catch (error) {
    // console.error('Error al obtener normas:', error);
    throw new Error(`Error al obtener las normas: ${error.message}`);
  }
}

// Obtener una norma por ID
export async function getNormaById(id) {
  try {
    return await apiService.get(`${ENDPOINT}/${id}`);
  } catch (error) {
    // console.error(`Error al obtener norma con ID ${id}:`, error);
    throw new Error(`Error al obtener la norma ${id}: ${error.message}`);
  }
}

// Crear una nueva norma
export async function createNorma(data) {
  try {
    return await apiService.post(ENDPOINT, data);
  } catch (error) {
    // console.error('Error al crear norma:', error);
    throw new Error(`Error al crear la norma: ${error.message}`);
  }
}

// Actualizar una norma
export async function updateNorma(id, data) {
  try {
    return await apiService.put(`${ENDPOINT}/${id}`, data);
  } catch (error) {
    // console.error(`Error al actualizar norma con ID ${id}:`, error);
    throw new Error(`Error al actualizar la norma ${id}: ${error.message}`);
  }
}

// Eliminar una norma
export async function deleteNorma(id) {
  try {
    return await apiService.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    // console.error(`Error al eliminar norma con ID ${id}:`, error);
    throw new Error(`Error al eliminar la norma ${id}: ${error.message}`);
  }
}

// Buscar normas por estado
export async function getNormasByEstado(estado) {
  try {
    const normas = await getAllNormas();
    return normas.filter(norma => norma.estado === estado);
  } catch (error) {
    console.error('Error al obtener normas por estado:', error);
    throw error;
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
    throw error;
  }
}

// Buscar normas por código
export async function getNormaByCodigo(codigo) {
  try {
    const normas = await getAllNormas();
    return normas.find(norma => norma.codigo === codigo);
  } catch (error) {
    console.error('Error al obtener norma por código:', error);
    throw error;
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
    throw error;
  }
}

// Obtener normas activas
export async function getNormasActivas() {
  try {
    return await getNormasByEstado('activo');
  } catch (error) {
    console.error('Error al obtener normas activas:', error);
    throw error;
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
