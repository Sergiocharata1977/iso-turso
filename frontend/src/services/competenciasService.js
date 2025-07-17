import apiService from './apiService';

const competenciasService = {
  getAll: async (organization_id) => {
    try {
      if (!organization_id) {
        throw new Error('Se requiere organization_id para obtener competencias');
      }
      const url = '/competencias';
      console.log('[CompetenciasService] Solicitando competencias para organization_id:', organization_id, 'URL:', url);
      const response = await apiService.get(url, {
        params: { organization_id }
      });
      console.log('[CompetenciasService] Respuesta cruda recibida:', response);
      // Defensive: aceptar array directo o { data: array }
      let competencias = response;
      if (Array.isArray(response)) {
        // OK
      } else if (response && Array.isArray(response.data)) {
        competencias = response.data;
      } else {
        console.warn('[CompetenciasService] La respuesta no es un array ni tiene .data:', response);
        competencias = [];
      }
      if (Array.isArray(competencias)) {
        console.log(`[CompetenciasService] Total de competencias recibidas: ${competencias.length}`);
        if (competencias.length > 0) {
          console.log('[CompetenciasService] Estructura de la primera competencia:', competencias[0]);
        }
      }
      return competencias;
    } catch (error) {
      console.error('[CompetenciasService] Error al obtener competencias:', error);
      throw new Error('No se pudieron cargar las competencias');
    }
  },
  create: (data) => apiService.post('/competencias', data),
  update: (id, data) => apiService.put(`/competencias/${id}`, data),
  delete: (id) => apiService.delete(`/competencias/${id}`),
};

export default competenciasService; 