import apiService from './apiService';

const documentosService = {
  // Subir documento
  async uploadDocument(file, tipo = 'minuta') {
    const formData = new FormData();
    formData.append('documento', file);
    formData.append('tipo', tipo);
    
    return await apiService.post('/documentos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Obtener documentos por tipo
  async getDocumentosByTipo(tipo) {
    return await apiService.get(`/documentos/tipo/${tipo}`);
  },

  // Eliminar documento
  async deleteDocumento(id) {
    return await apiService.delete(`/documentos/${id}`);
  },

  // Descargar documento
  async downloadDocumento(id) {
    return await apiService.get(`/documentos/${id}/download`, {
      responseType: 'blob',
    });
  },
};

export default documentosService;

