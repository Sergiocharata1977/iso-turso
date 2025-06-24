import { createApiClient } from './apiService';

// El apiClient es para operaciones JSON estándar (GET, DELETE)
const apiClient = createApiClient('/documentos');

// El baseURL se necesita para las llamadas fetch directas (subir/descargar archivos)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const documentosService = {
  // 1. Obtener todos los documentos (solo metadatos) - Usa apiClient
  getDocumentos: async () => {
    try {
      const data = await apiClient.get();
      return data; // El apiClient ya devuelve el JSON, no response.data
    } catch (error) {
      console.error('Error en getDocumentos:', error);
      throw error;
    }
  },

  // NUEVO: Obtener un solo documento por ID
  getDocumento: async (id) => {
    try {
      const data = await apiClient.get(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error en getDocumento para el id ${id}:`, error);
      throw error;
    }
  },

  // 2. Descargar el archivo de un documento - Usa fetch directo para manejar 'blob'
  downloadDocumento: async (id, filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documentos/${id}/download`);
      if (!response.ok) {
        throw new Error(`Error al descargar el archivo: ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error en downloadDocumento para el id ${id}:`, error);
      throw error;
    }
  },

  // 3. Crear un nuevo documento - Usa fetch directo para 'multipart/form-data'
  createDocumento: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documentos`, {
        method: 'POST',
        body: formData, // Con FormData, el navegador pone el Content-Type correcto
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el documento');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en createDocumento:', error);
      throw error;
    }
  },

  // 4. Actualizar un documento existente - Usa fetch directo para 'multipart/form-data'
  updateDocumento: async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documentos/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el documento');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en updateDocumento para el id ${id}:`, error);
      throw error;
    }
  },

  // 5. Eliminar un documento - Usa apiClient
  deleteDocumento: async (id) => {
    try {
      const data = await apiClient.delete(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error en deleteDocumento para el id ${id}:`, error);
      throw error;
    }
  },
};

export default documentosService;

