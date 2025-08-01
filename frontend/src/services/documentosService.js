import apiService from './apiService';

const documentosService = {
  // Obtener todos los documentos
  async getDocumentos() {
    try {
      console.log('📄 Obteniendo todos los documentos...');
      const response = await apiService.get('/documentos');
      console.log(`✅ ${response.length} documentos obtenidos`);
      return response;
    } catch (error) {
      console.error('❌ Error al obtener documentos:', error);
      throw new Error('Error al cargar los documentos');
    }
  },

  // Obtener documento por ID
  async getDocumentoById(id) {
    try {
      const response = await apiService.get(`/documentos/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener documento ${id}:`, error);
      throw error;
    }
  },

  // Crear nuevo documento
  async createDocumento(data) {
    try {
      const response = await apiService.post('/documentos', data);
      return response;
    } catch (error) {
      console.error('Error al crear documento:', error);
      throw error;
    }
  },

  // Actualizar documento
  async updateDocumento(id, data) {
    try {
      const response = await apiService.put(`/documentos/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error al actualizar documento ${id}:`, error);
      throw error;
    }
  },

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

