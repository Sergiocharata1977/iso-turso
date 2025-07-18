import { createApiClient } from './apiService';
import useAuthStore from '../store/authStore';

// El apiClient es para operaciones JSON estándar (GET, DELETE)
const apiClient = createApiClient('/documentos');

// El baseURL se necesita para las llamadas fetch directas (subir/descargar archivos)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Función helper para obtener headers con autorización
const getAuthHeaders = async () => {
  const { getValidToken } = useAuthStore.getState();
  const token = await getValidToken();
  
  console.log('🔑 Token obtenido:', token ? 'Token válido' : 'Token NO válido');
  
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

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
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/documentos/${id}/download`, {
        headers
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al descargar el archivo: ${errorText}`);
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

  // NUEVO: Visualizar PDF en pantalla sin descargar
  viewDocumento: async (id) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/documentos/${id}/download`, {
        headers
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al cargar el documento: ${errorText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Abrir en nueva ventana/tab para visualización
      window.open(url, '_blank');
      
      // Limpiar URL después de un tiempo
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 10000);
      
      return url;
    } catch (error) {
      console.error(`Error en viewDocumento para el id ${id}:`, error);
      throw error;
    }
  },

  // NUEVO: Obtener URL de visualización para embed
  getViewUrl: async (id) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/documentos/${id}/download`, {
        headers
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al cargar el documento: ${errorText}`);
      }
      
      const blob = await response.blob();
      return window.URL.createObjectURL(blob);
    } catch (error) {
      console.error(`Error en getViewUrl para el id ${id}:`, error);
      throw error;
    }
  },

  // 3. Crear un nuevo documento - Corregido para evitar el error de "body stream already read"
  createDocumento: async (formData) => {
    try {
      const headers = await getAuthHeaders();
      
      console.log('🔑 Headers enviados:', headers);
      console.log('📤 Enviando POST a:', `${API_BASE_URL}/documentos`);
      
      const response = await fetch(`${API_BASE_URL}/documentos`, {
        method: 'POST',
        headers, // No incluir Content-Type para FormData
        body: formData,
      });
      
      console.log('📥 Respuesta recibida:', response.status, response.statusText);
      
      // Manejar la respuesta de error sin leer el cuerpo múltiples veces
      if (!response.ok) {
        let errorMessage = 'Error al crear el documento';
        
        try {
          // Intentar leer como JSON primero
          const responseText = await response.text();
          console.log('📝 Texto de respuesta:', responseText);
          
          // Si el texto parece JSON, parsearlo
          if (responseText.startsWith('{') && responseText.endsWith('}')) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
          } else {
            errorMessage = responseText || errorMessage;
          }
        } catch (parseError) {
          console.error('Error al parsear respuesta de error:', parseError);
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      // Solo leer el JSON si la respuesta es exitosa
      const result = await response.json();
      console.log('✅ Documento creado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error en createDocumento:', error);
      throw error;
    }
  },

  // 4. Actualizar un documento existente - Corregido para evitar el error de "body stream already read"
  updateDocumento: async (id, formData) => {
    try {
      const headers = await getAuthHeaders();
      
      console.log('🔑 Headers enviados:', headers);
      console.log('📤 Enviando PUT a:', `${API_BASE_URL}/documentos/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/documentos/${id}`, {
        method: 'PUT',
        headers, // No incluir Content-Type para FormData
        body: formData,
      });
      
      console.log('📥 Respuesta recibida:', response.status, response.statusText);
      
      // Manejar la respuesta de error sin leer el cuerpo múltiples veces
      if (!response.ok) {
        let errorMessage = 'Error al actualizar el documento';
        
        try {
          // Intentar leer como texto primero
          const responseText = await response.text();
          console.log('📝 Texto de respuesta:', responseText);
          
          // Si el texto parece JSON, parsearlo
          if (responseText.startsWith('{') && responseText.endsWith('}')) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
          } else {
            errorMessage = responseText || errorMessage;
          }
        } catch (parseError) {
          console.error('Error al parsear respuesta de error:', parseError);
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      // Solo leer el JSON si la respuesta es exitosa
      const result = await response.json();
      console.log('✅ Documento actualizado exitosamente:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error en updateDocumento para el id ${id}:`, error);
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

export { documentosService };

