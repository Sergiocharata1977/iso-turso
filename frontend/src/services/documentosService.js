// Servicio para el módulo de Documentos - Migrado a Backend API
import { createApiClient } from './apiService.js';

const documentosApiClient = createApiClient('/documentos');
const categoriasApiClient = createApiClient('/categorias-documentos');

// Obtener todos los documentos
export async function getAllDocumentos() {
  try {
    return await documentosApiClient.get('/');
  } catch (error) {
    throw new Error(`Error al obtener los documentos: ${error.message}`);
  }
}

// Obtener un documento por ID
export async function getDocumentoById(id) {
  try {
    return await documentosApiClient.get(`/${id}`);
  } catch (error) {
    throw new Error(`Error al obtener el documento ${id}: ${error.message}`);
  }
}

// Crear un nuevo documento
export async function createDocumento(data) {
  try {
    return await documentosApiClient.post('/', data);
  } catch (error) {
    throw new Error(`Error al crear el documento: ${error.message}`);
  }
}

// Actualizar un documento
export async function updateDocumento(id, data) {
  try {
    return await documentosApiClient.put(`/${id}`, data);
  } catch (error) {
    throw new Error(`Error al actualizar el documento ${id}: ${error.message}`);
  }
}

// Eliminar un documento
export async function deleteDocumento(id) {
  try {
    return await documentosApiClient.delete(`/${id}`);
  } catch (error) {
    throw new Error(`Error al eliminar el documento ${id}: ${error.message}`);
  }
}

// Buscar documentos por estado
export async function getDocumentosByEstado(estado) {
  try {
    const documentos = await getAllDocumentos(); // Utiliza la versión refactorizada
    return documentos.filter(doc => doc.estado === estado);
  } catch (error) {
    console.error('Error al obtener documentos por estado:', error);
    throw error;
  }
}

// Buscar documentos por proceso
export async function getDocumentosByProceso(procesoId) {
  try {
    const documentos = await getAllDocumentos(); // Utiliza la versión refactorizada
    return documentos.filter(doc => doc.proceso_id === procesoId);
  } catch (error) {
    console.error('Error al obtener documentos por proceso:', error);
    throw error;
  }
}

// Buscar documentos por autor
export async function getDocumentosByAutor(autor) {
  try {
    const documentos = await getAllDocumentos(); // Utiliza la versión refactorizada
    return documentos.filter(doc => doc.autor && doc.autor.toLowerCase().includes(autor.toLowerCase()));
  } catch (error) {
    console.error('Error al obtener documentos por autor:', error);
    throw error;
  }
}

// Buscar documentos por término
export async function searchDocumentos(term) {
  try {
    const documentos = await getAllDocumentos(); // Utiliza la versión refactorizada
    return documentos.filter(doc => 
      doc.titulo.toLowerCase().includes(term.toLowerCase()) || 
      (doc.descripcion && doc.descripcion.toLowerCase().includes(term.toLowerCase())) ||
      (doc.codigo && doc.codigo.toLowerCase().includes(term.toLowerCase()))
    );
  } catch (error) {
    console.error('Error al buscar documentos:', error);
    throw error;
  }
}

// Obtener todas las categorías de documentos
export async function getAllCategorias() {
  try {
    return await categoriasApiClient.get('/');
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
}

export default {
  getAllDocumentos,
  getDocumentoById,
  createDocumento,
  updateDocumento,
  deleteDocumento,
  getDocumentosByEstado,
  getDocumentosByProceso,
  getDocumentosByAutor,
  searchDocumentos,
  getAllCategorias
};
