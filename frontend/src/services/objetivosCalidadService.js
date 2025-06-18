// Servicio para el módulo de Objetivos de Calidad
import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/objetivos-calidad');

const objetivosCalidadService = {
  getAll: () => apiClient.get(''),
  getById: (id) => apiClient.get(`/${id}`),
  create: (data) => apiClient.post('', data),
  update: (id, data) => apiClient.put(`/${id}`, data),
  delete: (id) => apiClient.delete(`/${id}`)
};

export default objetivosCalidadService;
