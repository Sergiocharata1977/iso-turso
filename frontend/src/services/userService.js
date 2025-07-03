import { apiService } from './apiService';

const ENDPOINT = '/usuarios';

export const userService = {
  getUsers: () => apiService.get(ENDPOINT),
  getUser: (id) => apiService.get(`${ENDPOINT}/${id}`),
  createUser: (data) => apiService.post(ENDPOINT, data),
  updateUser: (id, data) => apiService.put(`${ENDPOINT}/${id}`, data),
  deleteUser: (id) => apiService.delete(`${ENDPOINT}/${id}`),
};
