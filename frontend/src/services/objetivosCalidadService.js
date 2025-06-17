// Servicio para el módulo de Objetivos de Calidad
import apiService from './apiService.js';

const ENDPOINT = '/objetivos_calidad';

const objetivosCalidadService = {
  getAll: () => apiService.get(ENDPOINT),
  getById: (id) => apiService.get(`${ENDPOINT}/${id}`),
  create: (data) => apiService.post(ENDPOINT, data),
  update: (id, data) => apiService.put(`${ENDPOINT}/${id}`, data),
  delete: (id) => apiService.delete(`${ENDPOINT}/${id}`)
};

export default objetivosCalidadService;
