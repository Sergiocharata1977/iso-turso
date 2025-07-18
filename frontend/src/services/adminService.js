import { apiService } from './apiService';

export const adminService = {
  // ===== SUPER ADMIN FUNCTIONS =====
  getAllOrganizations: async () => {
    return apiService.get('/admin/organizations');
  },
  getOrganizationById: async (id) => {
    return apiService.get(`/admin/organizations/${id}`);
  },
  createOrganization: async (data) => {
    return apiService.post('/admin/organizations', data);
  },
  updateOrganization: async (id, data) => {
    return apiService.put(`/admin/organizations/${id}`, data);
  },
  deleteOrganization: async (id) => {
    return apiService.delete(`/admin/organizations/${id}`);
  },

  // Gestión Global de Usuarios (Solo Super Admin)
  getAllUsers: async () => {
    return apiService.get('/admin/users');
  },
  createUser: async (data) => {
    return apiService.post('/admin/users', data);
  },
  updateUser: async (id, data) => {
    return apiService.put(`/admin/users/${id}`, data);
  },
  deleteUser: async (id) => {
    return apiService.delete(`/admin/users/${id}`);
  },

  // ===== ADMIN DE ORGANIZACIÓN FUNCTIONS =====
  getOrganizationUsers: async (organizationId) => {
    return apiService.get(`/admin/organization/${organizationId}/users`);
  },
  createOrganizationUser: async (organizationId, data) => {
    return apiService.post(`/admin/organization/${organizationId}/users`, data);
  },
  updateOrganizationUser: async (organizationId, userId, data) => {
    return apiService.put(`/admin/organization/${organizationId}/users/${userId}`, data);
  },
  deleteOrganizationUser: async (organizationId, userId) => {
    return apiService.delete(`/admin/organization/${organizationId}/users/${userId}`);
  },

  // Gestión de Features
  getOrganizationFeatures: async (organizationId) => {
    return apiService.get(`/admin/organization/${organizationId}/features`);
  },
  updateOrganizationFeatures: async (organizationId, data) => {
    return apiService.put(`/admin/organization/${organizationId}/features`, data);
  }
}; 