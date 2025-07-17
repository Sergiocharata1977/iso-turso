import { createApiClient } from './apiService';

const relacionesApi = createApiClient('/relaciones');

// Listar relaciones por filtros (origen/destino)
export const getRelaciones = ({ origen_tipo, origen_id, destino_tipo, destino_id }) => {
  const params = new URLSearchParams();
  if (origen_tipo) params.append('origen_tipo', origen_tipo);
  if (origen_id) params.append('origen_id', origen_id);
  if (destino_tipo) params.append('destino_tipo', destino_tipo);
  if (destino_id) params.append('destino_id', destino_id);
  return relacionesApi.get(`?${params.toString()}`);
};

// Crear una nueva relación
export const createRelacion = ({ origen_tipo, origen_id, destino_tipo, destino_id, descripcion }) => {
  return relacionesApi.post('', { origen_tipo, origen_id, destino_tipo, destino_id, descripcion });
};

// Eliminar una relación por ID
export const deleteRelacion = (id) => {
  return relacionesApi.delete(`/${id}`);
};

const relacionesService = {
  getRelaciones,
  createRelacion,
  deleteRelacion,
};

export default relacionesService; 