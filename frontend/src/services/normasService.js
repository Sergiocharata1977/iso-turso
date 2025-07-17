// Servicio para el módulo de Normas - Backend API
import apiService from './apiService';

class NormasService {
  constructor() {
    this.baseUrl = '/normas';
  }

  async getAll() {
    try {
      console.log('🔓 Obteniendo TODAS las normas sin restricciones...');
      const response = await apiService.get(this.baseUrl);
      
      console.log('✅ Respuesta del servidor:', response);
      
      // Manejar tanto el formato antiguo como el nuevo
      const data = response.data || response;
      const normas = Array.isArray(data) ? data : (data.data || []);
      
      console.log(`✅ ${normas.length} normas cargadas`);
      return {
        success: true,
        data: normas,
        total: normas.length,
        message: `${normas.length} normas encontradas`
      };
  } catch (error) {
      console.error('❌ Error obteniendo normas:', error);
      return {
        success: false,
        data: [],
        total: 0,
        message: 'Error al obtener normas: ' + error.message
      };
  }
}

  // Alias para compatibilidad con frontend existente
  async getAllNormas() {
    return await this.getAll();
  }

  async getById(id) {
    try {
      console.log(`🔓 Obteniendo norma ${id}...`);
      const response = await apiService.get(`${this.baseUrl}/${id}`);
      
      console.log('✅ Respuesta del servidor:', response);
      return {
        success: true,
        data: response.data || response
      };
  } catch (error) {
      console.error(`❌ Error obteniendo norma ${id}:`, error);
      return {
        success: false,
        data: null,
        message: 'Error al obtener norma: ' + error.message
      };
  }
}

  async create(normaData) {
    try {
      console.log('🔓 Creando nueva norma:', normaData);
      const response = await apiService.post(this.baseUrl, normaData);
      
      console.log('✅ Norma creada:', response);
      return {
        success: true,
        data: response.data || response,
        message: 'Norma creada exitosamente'
      };
  } catch (error) {
      console.error('❌ Error creando norma:', error);
      return {
        success: false,
        data: null,
        message: 'Error al crear norma: ' + error.message
      };
  }
}

  async update(id, normaData) {
    try {
      console.log(`🔓 Actualizando norma ${id}:`, normaData);
      const response = await apiService.put(`${this.baseUrl}/${id}`, normaData);
      
      console.log('✅ Norma actualizada:', response);
      return {
        success: true,
        data: response.data || response,
        message: 'Norma actualizada exitosamente'
      };
  } catch (error) {
      console.error(`❌ Error actualizando norma ${id}:`, error);
      return {
        success: false,
        data: null,
        message: 'Error al actualizar norma: ' + error.message
      };
    }
  }

  async delete(id) {
  try {
      console.log(`🔓 Eliminando norma ${id}...`);
      const response = await apiService.delete(`${this.baseUrl}/${id}`);
      
      console.log('✅ Norma eliminada:', response);
      return {
        success: true,
        message: 'Norma eliminada exitosamente'
      };
  } catch (error) {
      console.error(`❌ Error eliminando norma ${id}:`, error);
      return {
        success: false,
        message: 'Error al eliminar norma: ' + error.message
      };
  }
}

  // Función para verificar el estado del servicio
  async checkService() {
  try {
      console.log('🔍 Verificando servicio de normas...');
      const response = await this.getAll();
      console.log('✅ Servicio de normas funcionando:', response);
      return response;
  } catch (error) {
      console.error('❌ Servicio de normas no disponible:', error);
      return {
        success: false,
        data: [],
        message: 'Servicio no disponible: ' + error.message
      };
    }
  }

  // Métodos alias para compatibilidad con el frontend
  async createNorma(normaData) {
    return await this.create(normaData);
  }

  async updateNorma(id, normaData) {
    return await this.update(id, normaData);
  }

  async deleteNorma(id) {
    return await this.delete(id);
  }

  async getNormaById(id) {
    return await this.getById(id);
  }
}

export default new NormasService();
