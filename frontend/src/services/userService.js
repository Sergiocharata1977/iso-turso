import { apiService } from './apiService';

const ENDPOINT = '/users';

export const userService = {
  // Obtener todos los usuarios de la organización
  getUsers: () => apiService.get(ENDPOINT),
  
  // Obtener perfil del usuario actual
  getProfile: () => apiService.get(`${ENDPOINT}/profile`),
  
  // Crear nuevo usuario (solo admin)
  createUser: (data) => apiService.post(ENDPOINT, data),
  
  // Actualizar usuario (solo admin)
  updateUser: (id, data) => apiService.put(`${ENDPOINT}/${id}`, data),
  
  // Desactivar usuario (solo admin)
  deleteUser: (id) => apiService.delete(`${ENDPOINT}/${id}`),
};
