import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/hallazgos');

export const hallazgosService = {
  /**
   * Obtiene todos los hallazgos.
   * @returns {Promise<Array>} Lista de hallazgos.
   */
  async getAllHallazgos() {
    try {
      const data = await apiClient.get('/');
      // Validación defensiva
      const safeData = Array.isArray(data) ? data : [];
      console.log('🚀 DEBUG: Hallazgos obtenidos del API:', safeData);
      console.log('🚀 DEBUG: Cantidad de hallazgos del API:', safeData?.length);
      
      // Inspeccionar estructura de los primeros 3 hallazgos
      console.log('🔍 DEBUG: Estructura de los primeros 3 hallazgos:');
      safeData?.slice(0, 3).forEach((h, i) => {
        console.log(`   Hallazgo ${i+1}:`, {
          id: h.id,
          numeroHallazgo: h.numeroHallazgo,
          titulo: h.titulo,
          estado: h.estado,
          hasId: !!h.id,
          hasEstado: !!h.estado,
          allKeys: Object.keys(h)
        });
      });
      
      return safeData;
    } catch (error) {
      console.error('Error al obtener los hallazgos:', error);
      throw new Error(error.message || 'Error al cargar los hallazgos');
    }
  },

  /**
   * Obtiene un hallazgo por su ID.
   * @param {string} id - ID del hallazgo.
   * @returns {Promise<Object>} Datos del hallazgo.
   */
  async getHallazgoById(id) {
    try {
      const data = await apiClient.get(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al obtener el hallazgo con ID ${id}:`, error);
      throw new Error(error.message || 'Error al cargar el hallazgo');
    }
  },

  /**
   * Crea un nuevo hallazgo.
   * @param {Object} hallazgoData - Datos del hallazgo a crear.
   * @returns {Promise<Object>} El hallazgo creado.
   */
  async createHallazgo(hallazgoData) {
    try {
      const data = await apiClient.post('/', hallazgoData);
      return data;
    } catch (error) {
      console.error('Error al crear el hallazgo:', error);
      throw new Error(error.message || 'Error al crear el hallazgo');
    }
  },

  /**
   * Actualiza un hallazgo existente.
   * @param {string} id - ID del hallazgo a actualizar.
   * @param {Object} hallazgoData - Datos actualizados del hallazgo.
   * @returns {Promise<Object>} El hallazgo actualizado.
   */
  async updateHallazgo(id, hallazgoData) {
    try {
      const data = await apiClient.put(`/${id}`, hallazgoData);
      return data;
    } catch (error) {
      console.error(`Error al actualizar el hallazgo con ID ${id}:`, error);
      throw new Error(error.message || 'Error al actualizar el hallazgo');
    }
  },

  /**
   * Elimina un hallazgo.
   * @param {string} id - ID del hallazgo a eliminar.
   * @returns {Promise<void>}
   */
  async deleteHallazgo(id) {
    try {
      await apiClient.delete(`/${id}`);
    } catch (error) {
      console.error(`Error al eliminar el hallazgo con ID ${id}:`, error);
      throw new Error(error.message || 'Error al eliminar el hallazgo');
    }
  },

  /**
   * Actualiza el estado de un hallazgo.
   * @param {string} id - ID del hallazgo a actualizar.
   * @param {string} estado - Nuevo estado del hallazgo.
   * @returns {Promise<void>}
   */
  async updateHallazgoEstado(id, estado) {
    try {
      const response = await apiClient.put(`/mejoras/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el estado del hallazgo con ID ${id}:`, error);
      throw new Error(error.message || 'Error al actualizar el estado del hallazgo');
    }
  },

  /**
   * Actualiza el orden de los hallazgos.
   * @param {Array<string>} orderedIds - Lista de IDs ordenados.
   * @returns {Promise<Object>} La respuesta del servidor.
   */
  async updateHallazgosOrder(orderedIds) {
    try {
      const response = await apiClient.put('/mejoras/orden', { orderedIds });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el orden de los hallazgos:', error);
      throw new Error(error.message || 'Error al actualizar el orden de los hallazgos');
    }
  },
};

export default hallazgosService;
