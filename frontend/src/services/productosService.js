import { createApiClient } from './apiService.js';

/**
 * Servicio para gestionar productos a través de la API backend
 */
const apiClient = createApiClient('/productos');

/**
 * Servicio para gestionar productos a través de la API backend
 */
export const productosService = {
  /**
   * Obtiene todos los productos
   * @returns {Promise<Array>} Lista de productos
   */
  async getAll() {
    try {
      const data = await apiClient.get('/');
      return data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw new Error(error.message || 'Error al cargar los productos');
    }
  },

  /**
   * Obtiene un producto por su ID
   * @param {string|number} id - ID del producto
   * @returns {Promise<Object>} Datos del producto
   */
  async getById(id) {
    try {
      const data = await apiClient.get(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al obtener producto con ID ${id}:`, error);
      throw new Error(error.message || 'Error al cargar el producto');
    }
  },

  /**
   * Crea un nuevo producto
   * @param {Object} producto - Datos del producto a crear
   * @returns {Promise<Object>} Producto creado
   */
  async create(producto) {
    try {
      const data = await apiClient.post('/', producto);
      return data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw new Error(error.message || 'Error al crear el producto');
    }
  },

  /**
   * Actualiza un producto existente
   * @param {string|number} id - ID del producto a actualizar
   * @param {Object} producto - Datos actualizados del producto
   * @returns {Promise<Object>} Producto actualizado
   */
  async update(id, producto) {
    try {
      const data = await apiClient.put(`/${id}`, producto);
      return data;
    } catch (error) {
      console.error(`Error al actualizar producto con ID ${id}:`, error);
      throw new Error(error.message || 'Error al actualizar el producto');
    }
  },

  /**
   * Elimina un producto
   * @param {string|number} id - ID del producto a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const data = await apiClient.delete(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al eliminar producto con ID ${id}:`, error);
      throw new Error(error.message || 'Error al eliminar el producto');
    }
  },

  /**
   * Obtiene productos por categoría
   * @param {string} categoria - Categoría de productos a buscar
   * @returns {Promise<Array>} Lista de productos filtrados por categoría
   */
  async getByCategoria(categoria) {
    try {
      const allProductos = await this.getAll();
      return allProductos.filter(producto => producto.categoria === categoria);
    } catch (error) {
      console.error(`Error al obtener productos de la categoría ${categoria}:`, error);
      throw new Error(error.message || 'Error al filtrar productos por categoría');
    }
  }
};

export default productosService;
