import axios from 'axios';
import useAuthStore from '../store/authStore';

// Servicio base para llamadas HTTP al backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
apiClient.interceptors.request.use(
  async (config) => {
    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si es un error 401 y no hemos intentado refrescar el token aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const { refreshAccessToken, logout } = useAuthStore.getState();
      
      try {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error al refrescar token:', refreshError);
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  // Métodos HTTP básicos
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),

  // Método para configurar token manualmente (para compatibilidad)
  setAuthToken: (token) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  },

  // Método para hacer peticiones con manejo de errores
  request: async (config) => {
    try {
      const response = await apiClient(config);
      return response.data;
    } catch (error) {
      // Manejar errores de red
      if (error.code === 'ECONNABORTED') {
        throw new Error('La petición ha expirado. Por favor, inténtalo de nuevo.');
      }
      
      // Manejar errores HTTP
      if (error.response) {
        const message = error.response.data?.message || error.response.data?.error || 'Error en el servidor';
        throw new Error(message);
      }
      
      // Manejar errores de red
      if (error.request) {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      }
      
      throw error;
    }
  },

  // Métodos específicos para diferentes tipos de peticiones
  fetchData: async (endpoint) => {
    return apiService.request({ method: 'GET', url: endpoint });
  },

  postData: async (endpoint, data) => {
    return apiService.request({ method: 'POST', url: endpoint, data });
  },

  putData: async (endpoint, data) => {
    return apiService.request({ method: 'PUT', url: endpoint, data });
  },

  deleteData: async (endpoint) => {
    return apiService.request({ method: 'DELETE', url: endpoint });
  },

  // Método para subir archivos
  uploadFile: async (endpoint, formData, onUploadProgress) => {
    return apiService.request({
      method: 'POST',
      url: endpoint,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  // Método para descargar archivos
  downloadFile: async (endpoint, filename) => {
    try {
      const response = await apiClient.get(endpoint, {
        responseType: 'blob',
      });
      
      // Crear URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response;
    } catch (error) {
      throw new Error('Error al descargar el archivo');
    }
  }
};

// Función para crear cliente API específico para cada servicio - CORREGIDA
export const createApiClient = (baseRoute) => {
  const buildUrl = (endpoint) => `${baseRoute}${endpoint}`;

  return {
    get: async (endpoint = '', config = {}) => {
      const response = await apiService.get(buildUrl(endpoint), config);
      return response.data;
    },
    post: async (endpoint = '', data, config = {}) => {
      const response = await apiService.post(buildUrl(endpoint), data, config);
      return response.data;
    },
    put: async (endpoint = '', data, config = {}) => {
      const response = await apiService.put(buildUrl(endpoint), data, config);
      return response.data;
    },
    delete: async (endpoint = '', config = {}) => {
      const response = await apiService.delete(buildUrl(endpoint), config);
      return response.data;
    },
    patch: async (endpoint = '', data, config = {}) => {
      const response = await apiService.patch(buildUrl(endpoint), data, config);
      return response.data;
    },
  };
};

export default apiService;
