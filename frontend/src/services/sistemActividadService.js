import apiService from './apiService';

const sistemActividadService = {
  getAll: async (params = {}) => {
    return apiService.get('/actividad', { params });
  },
  getById: async (id) => {
    return apiService.get(`/actividad/${id}`);
  }
};

export default sistemActividadService; 