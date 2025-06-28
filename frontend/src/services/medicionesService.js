import { createService } from './serviceFactory';

const apiClient = createService('/mediciones');

const medicionesService = {
  getAll: () => {
    return apiClient.get();
  },

  getById: (id) => {
    return apiClient.get(`/${id}`);
  },

  getByIndicador: (indicadorId) => {
    // Esta sintaxis de query param funciona tanto para la API real como para el mock service actualizado.
    return apiClient.get(`?indicadorId=${indicadorId}`);
  },

  create: (medicionData) => {
    return apiClient.post('', medicionData);
  },

  update: (id, medicionData) => {
    return apiClient.put(`/${id}`, medicionData);
  },

  delete: (id) => {
    return apiClient.delete(`/${id}`);
  },
};

export default medicionesService;

