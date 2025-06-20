// Servicio base para llamadas HTTP al backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

// Función auxiliar para obtener headers de autenticación
const getAuthHeaders = () => {
  try {
    // Obtener el token desde el objeto usuario en localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      if (userData?.token) {
        return { 'Authorization': `Bearer ${userData.token}` };
      }
    }
    return {};
  } catch (error) {
    console.error('Error al obtener el token de autenticación:', error);
    return {};
  }
};

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),  // Incluir automáticamente el token de autenticación
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`[API] ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Intenta obtener un mensaje de error del cuerpo JSON si está disponible
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          // El cuerpo del error no era JSON o estaba vacío
        }
        // Usar errorData.message si existe (más común para errores estructurados), sino errorData.error, o un mensaje genérico
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Si el estado es 204 (No Content), no hay cuerpo para parsear
      if (response.status === 204) {
        console.log(`[API] Response: Status 204 (No Content)`);
        return null; // O podrías devolver un objeto como { success: true } o undefined
      }

      // Para otros estados OK (ej. 200, 201), parsear el JSON
      const data = await response.json();
      console.log(`[API] Response:`, data);
      return data;
    } catch (error) {
      console.error(`[API] Error in ${config.method || 'GET'} ${url}:`, error.message); // Mostrar error.message para claridad
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const masterApiService = new ApiService();

export const createApiClient = (baseRoute) => {
  if (!baseRoute.startsWith('/')) {
    throw new Error('baseRoute must start with a slash (/)');
  }
  return {
    get: (specificEndpoint = '') => masterApiService.get(`${baseRoute}${specificEndpoint}`),
    post: (specificEndpoint = '', data) => masterApiService.post(`${baseRoute}${specificEndpoint}`, data),
    put: (specificEndpoint = '', data) => masterApiService.put(`${baseRoute}${specificEndpoint}`, data),
    delete: (specificEndpoint = '') => masterApiService.delete(`${baseRoute}${specificEndpoint}`),
  };
};

