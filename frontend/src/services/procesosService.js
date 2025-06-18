// Servicio para el módulo de Procesos
import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/procesos');

const procesosService = {
  getAll: () => apiClient.get(''),
  getById: (id) => apiClient.get(`/${id}`),
  create: (data) => apiClient.post('', data),
  update: (id, data) => apiClient.put(`/${id}`, data),
  delete: (id) => apiClient.delete(`/${id}`)
};

export default procesosService;
