import apiService from './apiService';

/**
 * Servicio para gestionar departamentos a través de la API backend
 */
export const departamentosService = {
  /**
   * Obtiene todos los departamentos
   * @returns {Promise<Array>} Lista de departamentos
   */
  async getAll() {
    try {
      const response = await apiService.get('/departamentos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener departamentos:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar los departamentos');
    }
  },

  /**
   * Obtiene un departamento por su ID
   * @param {string|number} id - ID del departamento
   * @returns {Promise<Object>} Datos del departamento
   */
  async getById(id) {
    try {
      const response = await apiService.get(`/departamentos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener departamento con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al cargar el departamento');
    }
  },

  /**
   * Crea un nuevo departamento
   * @param {Object} departamento - Datos del departamento a crear
   * @returns {Promise<Object>} Departamento creado
   */
  async create(departamento) {
    try {
      const response = await apiService.post('/departamentos', departamento);
      return response.data;
    } catch (error) {
      console.error('Error al crear departamento:', error);
      throw new Error(error.response?.data?.message || 'Error al crear el departamento');
    }
  },

  /**
   * Actualiza un departamento existente
   * @param {string|number} id - ID del departamento a actualizar
   * @param {Object} departamento - Datos actualizados del departamento
   * @returns {Promise<Object>} Departamento actualizado
   */
  async update(id, departamento) {
    try {
      const response = await apiService.put(`/departamentos/${id}`, departamento);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar departamento con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar el departamento');
    }
  },

  /**
   * Elimina un departamento
   * @param {string|number} id - ID del departamento a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const response = await apiService.delete(`/departamentos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar departamento con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el departamento');
    }
  }
};

// Exportación por defecto para compatibilidad con imports existentes
export default departamentosService;
