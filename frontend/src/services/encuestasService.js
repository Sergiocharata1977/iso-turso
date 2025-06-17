import apiService from './apiService';

/**
 * Servicio para gestionar encuestas a través de la API backend
 */
export const encuestasService = {
  /**
   * Obtiene todas las encuestas
   * @returns {Promise<Array>} Lista de encuestas
   */
  async getAll() {
    try {
      const response = await apiService.get('/api/encuestas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener encuestas:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar las encuestas');
    }
  },

  /**
   * Obtiene una encuesta por su ID
   * @param {string|number} id - ID de la encuesta
   * @returns {Promise<Object>} Datos de la encuesta
   */
  async getById(id) {
    try {
      const response = await apiService.get(`/api/encuestas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener encuesta con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al cargar la encuesta');
    }
  },

  /**
   * Crea una nueva encuesta
   * @param {Object} encuesta - Datos de la encuesta a crear
   * @returns {Promise<Object>} Encuesta creada
   */
  async create(encuesta) {
    try {
      const response = await apiService.post('/api/encuestas', encuesta);
      return response.data;
    } catch (error) {
      console.error('Error al crear encuesta:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la encuesta');
    }
  },

  /**
   * Actualiza una encuesta existente
   * @param {string|number} id - ID de la encuesta a actualizar
   * @param {Object} encuesta - Datos actualizados de la encuesta
   * @returns {Promise<Object>} Encuesta actualizada
   */
  async update(id, encuesta) {
    try {
      const response = await apiService.put(`/api/encuestas/${id}`, encuesta);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar encuesta con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la encuesta');
    }
  },

  /**
   * Elimina una encuesta
   * @param {string|number} id - ID de la encuesta a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const response = await apiService.delete(`/api/encuestas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar encuesta con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la encuesta');
    }
  },

  /**
   * Envía respuestas a una encuesta
   * @param {string|number} id - ID de la encuesta
   * @param {Object} respuestas - Objeto con las respuestas a la encuesta
   * @returns {Promise<Object>} Resultado del envío de respuestas
   */
  async enviarRespuestas(id, respuestas) {
    try {
      const response = await apiService.post(`/api/encuestas/${id}/respuestas`, respuestas);
      return response.data;
    } catch (error) {
      console.error(`Error al enviar respuestas a la encuesta ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al enviar las respuestas');
    }
  },

  /**
   * Obtiene encuestas por tipo
   * @param {string} tipo - Tipo de encuestas a buscar
   * @returns {Promise<Array>} Lista de encuestas filtradas por tipo
   */
  async getByTipo(tipo) {
    try {
      const allEncuestas = await this.getAll();
      return allEncuestas.filter(encuesta => encuesta.tipo === tipo);
    } catch (error) {
      console.error(`Error al obtener encuestas del tipo ${tipo}:`, error);
      throw new Error(error.response?.data?.message || 'Error al filtrar encuestas por tipo');
    }
  }
};

export default encuestasService;
