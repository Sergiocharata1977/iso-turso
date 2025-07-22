import { createApiClient } from './apiService';

// Usar baseRoute como cadena vacía para evitar undefined en la URL
const apiClient = createApiClient('');

export const getProgramaciones = () => {
  return apiClient.get('/evaluacion-programacion');
};

export const createProgramacion = (programacionData) => {
  return apiClient.post('/evaluacion-programacion', programacionData);
};

export const getProgramacionById = (id) => {
  return apiClient.get(`/evaluacion-programacion/${id}`);
};

export const updateProgramacion = (id, programacionData) => {
  return apiClient.put(`/evaluacion-programacion/${id}`, programacionData);
};

export const deleteProgramacion = (id) => {
  return apiClient.delete(`/evaluacion-programacion/${id}`);
};
