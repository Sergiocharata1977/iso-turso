import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/productos');

const productosService = {
  getProductos: () => apiClient.get('/'),
  
  getProducto: (id) => apiClient.get(`/${id}`),

  createProducto: (producto) => apiClient.post('/', producto),

  updateProducto: (id, producto) => apiClient.put(`/${id}`, producto),

  deleteProducto: (id) => apiClient.delete(`/${id}`),
  
  getHistorial: (id) => apiClient.get(`/${id}/historial`),
};

export default productosService;
