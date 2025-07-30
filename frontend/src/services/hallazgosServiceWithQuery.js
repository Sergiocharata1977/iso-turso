import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from '@/lib/errorHandler';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook personalizado para obtener todos los hallazgos usando React Query
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useHallazgos(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['hallazgos'],
    queryFn: async () => {
      try {
        const { hallazgosService } = await import('./hallazgosService');
        return await hallazgosService.getAll();
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minuto (hallazgos cambian frecuentemente)
    gcTime: 3 * 60 * 1000, // 3 minutos
    ...options,
  });
}

/**
 * Hook personalizado para obtener un hallazgo específico usando React Query
 * @param {string|number} id - ID del hallazgo
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useHallazgo(id, options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['hallazgos', id],
    queryFn: async () => {
      try {
        const { hallazgosService } = await import('./hallazgosService');
        return await hallazgosService.getById(id);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    enabled: !!id, // Solo ejecutar si hay un ID
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
}

/**
 * Hook personalizado para obtener hallazgos por estado usando React Query
 * @param {string} estado - Estado de los hallazgos a filtrar
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useHallazgosByEstado(estado, options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['hallazgos', 'estado', estado],
    queryFn: async () => {
      try {
        const { hallazgosService } = await import('./hallazgosService');
        return await hallazgosService.getByEstado(estado);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    enabled: !!estado, // Solo ejecutar si hay un estado
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 3 * 60 * 1000, // 3 minutos
    ...options,
  });
}

/**
 * Hook personalizado para crear hallazgos usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useCreateHallazgo(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      try {
        const { hallazgosService } = await import('./hallazgosService');
        return await hallazgosService.create(formData);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data) => {
      // Actualizar el caché de hallazgos
      queryClient.setQueryData(['hallazgos'], (oldData) => {
        if (!oldData) return [data.data];
        return [...oldData, data.data];
      });
      
      // Invalidar queries por estado para refrescar
      queryClient.invalidateQueries(['hallazgos', 'estado']);
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Hallazgo creado correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en creación de hallazgo:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para actualizar hallazgos usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useUpdateHallazgo(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const { hallazgosService } = await import('./hallazgosService');
        return await hallazgosService.update(id, data);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Actualizar el caché de hallazgos
      queryClient.setQueryData(['hallazgos'], (oldData) => {
        if (!oldData) return [data.data];
        return oldData.map(hallazgo => 
          hallazgo.id === variables.id ? data.data : hallazgo
        );
      });
      
      // Actualizar también la query individual del hallazgo
      queryClient.setQueryData(['hallazgos', variables.id], data.data);
      
      // Invalidar queries por estado para refrescar
      queryClient.invalidateQueries(['hallazgos', 'estado']);
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Hallazgo actualizado correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en actualización de hallazgo:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para eliminar hallazgos usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useDeleteHallazgo(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const { hallazgosService } = await import('./hallazgosService');
        return await hallazgosService.delete(id);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data, id) => {
      // Actualizar el caché de hallazgos
      queryClient.setQueryData(['hallazgos'], (oldData) => {
        if (!oldData) return [];
        return oldData.filter(hallazgo => hallazgo.id !== id);
      });
      
      // Eliminar también la query individual del hallazgo
      queryClient.removeQueries(['hallazgos', id]);
      
      // Invalidar queries por estado para refrescar
      queryClient.invalidateQueries(['hallazgos', 'estado']);
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Hallazgo eliminado correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en eliminación de hallazgo:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para cambiar el estado de un hallazgo usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useChangeHallazgoEstado(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, nuevoEstado }) => {
      try {
        const { hallazgosService } = await import('./hallazgosService');
        return await hallazgosService.changeEstado(id, nuevoEstado);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Actualizar el caché de hallazgos
      queryClient.setQueryData(['hallazgos'], (oldData) => {
        if (!oldData) return [data.data];
        return oldData.map(hallazgo => 
          hallazgo.id === variables.id ? data.data : hallazgo
        );
      });
      
      // Actualizar también la query individual del hallazgo
      queryClient.setQueryData(['hallazgos', variables.id], data.data);
      
      // Invalidar queries por estado para refrescar
      queryClient.invalidateQueries(['hallazgos', 'estado']);
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: `Estado del hallazgo cambiado a ${variables.nuevoEstado}`,
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en cambio de estado del hallazgo:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para buscar hallazgos usando React Query
 * @param {string} searchTerm - Término de búsqueda
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useSearchHallazgos(searchTerm, options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['hallazgos', 'search', searchTerm],
    queryFn: async () => {
      try {
        const { hallazgosService } = await import('./hallazgosService');
        return await hallazgosService.search(searchTerm);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    enabled: !!searchTerm && searchTerm.length > 0, // Solo ejecutar si hay término de búsqueda
    staleTime: 30 * 1000, // 30 segundos para búsquedas
    gcTime: 1 * 60 * 1000, // 1 minuto
    ...options,
  });
}

/**
 * Hook personalizado para obtener estadísticas de hallazgos usando React Query
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useHallazgosStats(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['hallazgos', 'stats'],
    queryFn: async () => {
      try {
        const { hallazgosService } = await import('./hallazgosService');
        return await hallazgosService.getStats();
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
} 