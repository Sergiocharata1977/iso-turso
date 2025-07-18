import { apiService } from './apiService';

const productosService = {
  // Obtener todos los productos de la organización
  getProductos: async () => {
    try {
      const response = await apiService.get('/productos');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getProductos:', error);
      throw error;
    }
  },

  // Obtener un producto específico
  getProducto: async (id) => {
    try {
      const response = await apiService.get(`/productos/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getProducto:', error);
      throw error;
    }
  },

  // Crear un nuevo producto
  createProducto: async (productoData) => {
    try {
      const response = await apiService.post('/productos', productoData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en createProducto:', error);
      throw error;
    }
  },

  // Actualizar un producto existente
  updateProducto: async (id, productoData) => {
    try {
      const response = await apiService.put(`/productos/${id}`, productoData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en updateProducto:', error);
      throw error;
    }
  },

  // Eliminar un producto
  deleteProducto: async (id) => {
    try {
      const response = await apiService.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en deleteProducto:', error);
      throw error;
    }
  },

  // Obtener historial de cambios de un producto
  getHistorial: async (id) => {
    try {
      const response = await apiService.get(`/productos/${id}/historial`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getHistorial:', error);
      throw error;
    }
  },

  // Obtener productos por estado
  getProductosPorEstado: async (estado) => {
    try {
      const response = await apiService.get(`/productos?estado=${estado}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getProductosPorEstado:', error);
      throw error;
    }
  },

  // Obtener productos por tipo
  getProductosPorTipo: async (tipo) => {
    try {
      const response = await apiService.get(`/productos?tipo=${tipo}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getProductosPorTipo:', error);
      throw error;
    }
  },

  // Obtener productos por categoría
  getProductosPorCategoria: async (categoria) => {
    try {
      const response = await apiService.get(`/productos?categoria=${categoria}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getProductosPorCategoria:', error);
      throw error;
    }
  },

  // Buscar productos
  buscarProductos: async (termino) => {
    try {
      const response = await apiService.get(`/productos?search=${termino}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en buscarProductos:', error);
      throw error;
    }
  },

  // Obtener estadísticas de productos
  getEstadisticas: async () => {
    try {
      const response = await apiService.get('/productos/estadisticas');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getEstadisticas:', error);
      throw error;
    }
  },

  // Exportar productos
  exportarProductos: async (formato = 'excel') => {
    try {
      const response = await apiService.get(`/productos/exportar?formato=${formato}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error en exportarProductos:', error);
      throw error;
    }
  }
};

export default productosService;
