import apiService from './apiService';

const minutasService = {
  // Obtener todas las minutas
  async getAll() {
    return await apiService.get('/minutas');
  },

  // Obtener una minuta por ID
  async getById(id) {
    return await apiService.get(`/minutas/${id}`);
  },

  // Crear nueva minuta
  async create(minutaData) {
    return await apiService.post('/minutas', minutaData);
  },

  // Actualizar minuta
  async update(id, minutaData) {
    return await apiService.put(`/minutas/${id}`, minutaData);
  },

  // Eliminar minuta
  async delete(id) {
    return await apiService.delete(`/minutas/${id}`);
  },

  // Obtener documentos de una minuta
  async getDocumentos(minutaId) {
    return await apiService.get(`/minutas/${minutaId}/documentos`);
  },

  // Adjuntar documento a minuta
  async attachDocument(minutaId, documentData) {
    return await apiService.post(`/minutas/${minutaId}/documentos`, documentData);
  },

  // Eliminar documento de minuta
  async removeDocument(minutaId, documentId) {
    return await apiService.delete(`/minutas/${minutaId}/documentos/${documentId}`);
  },

  // Obtener historial de cambios de una minuta
  async getHistorial(minutaId) {
    return await apiService.get(`/minutas/${minutaId}/historial`);
  },

  // Descargar minuta como PDF
  async downloadPDF(id) {
    return await apiService.get(`/minutas/${id}/pdf`, {
      responseType: 'blob',
    });
  },

  // Buscar minutas
  async search(query) {
    return await apiService.get(`/minutas/search?q=${encodeURIComponent(query)}`);
  },

  // Obtener estadísticas de minutas
  async getStats() {
    return await apiService.get('/minutas/stats');
  },

  // Marcar minuta como leída
  async markAsRead(id) {
    return await apiService.post(`/minutas/${id}/read`);
  },

  // Obtener minutas por responsable
  async getByResponsable(responsable) {
    return await apiService.get(`/minutas/responsable/${encodeURIComponent(responsable)}`);
  },

  // Obtener minutas recientes
  async getRecent(limit = 10) {
    return await apiService.get(`/minutas/recent?limit=${limit}`);
  },

  // Duplicar minuta
  async duplicate(id) {
    return await apiService.post(`/minutas/${id}/duplicate`);
  },

  // Exportar minutas
  async export(format = 'excel') {
    return await apiService.get(`/minutas/export?format=${format}`, {
      responseType: 'blob',
    });
  }
};

export default minutasService;
