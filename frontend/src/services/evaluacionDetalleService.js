import { createApiClient } from './apiService';

const apiClient = createApiClient();

// Obtener todos los detalles para una programación específica
export const getDetallesPorProgramacion = (programacionId) => {
  return apiClient.get(`/evaluacion-detalle/programacion/${programacionId}`);
};

// Crear un nuevo puntaje (detalle)
export const createDetalle = (detalleData) => {
  return apiClient.post('/evaluacion-detalle', detalleData);
};

// Obtener un detalle específico por su ID
export const getDetalleById = (id) => {
  return apiClient.get(`/evaluacion-detalle/${id}`);
};

// Actualizar un detalle
export const updateDetalle = (id, detalleData) => {
  return apiClient.put(`/evaluacion-detalle/${id}`, detalleData);
};

// Eliminar un detalle
export const deleteDetalle = (id) => {
  return apiClient.delete(`/evaluacion-detalle/${id}`);
};
