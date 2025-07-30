import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { direccionService } from './direccionService';
import { useErrorHandler } from '@/lib/errorHandler';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook personalizado para obtener la configuración de dirección usando React Query
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useDireccionConfig(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['direccion', 'configuracion'],
    queryFn: async () => {
      try {
        return await direccionService.getConfiguracion();
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

/**
 * Hook personalizado para actualizar la configuración de dirección usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useUpdateDireccionConfig(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      try {
        return await direccionService.updateConfiguracion(data);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data) => {
      // Actualizar el caché con los nuevos datos
      queryClient.setQueryData(['direccion', 'configuracion'], data);
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "La configuración se ha guardado correctamente.",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      // El error ya se maneja en mutationFn, pero podemos hacer logging adicional
      console.error('Error en mutación de configuración:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para obtener minutas usando React Query
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useMinutas(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['minutas'],
    queryFn: async () => {
      try {
        const minutasService = (await import('./minutasService')).default;
        return await minutasService.getAll();
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
}

/**
 * Hook personalizado para crear minutas usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useCreateMinuta(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      try {
        const minutasService = (await import('./minutasService')).default;
        return await minutasService.create(formData);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data) => {
      // Actualizar el caché de minutas
      queryClient.setQueryData(['minutas'], (oldData) => {
        if (!oldData) return [data.data];
        return [...oldData, data.data];
      });
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Minuta creada correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en creación de minuta:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para actualizar minutas usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useUpdateMinuta(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const minutasService = (await import('./minutasService')).default;
        return await minutasService.update(id, data);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Actualizar el caché de minutas
      queryClient.setQueryData(['minutas'], (oldData) => {
        if (!oldData) return [data.data];
        return oldData.map(minuta => 
          minuta.id === variables.id ? data.data : minuta
        );
      });
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Minuta actualizada correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en actualización de minuta:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para eliminar minutas usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useDeleteMinuta(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const minutasService = (await import('./minutasService')).default;
        return await minutasService.delete(id);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data, id) => {
      // Actualizar el caché de minutas
      queryClient.setQueryData(['minutas'], (oldData) => {
        if (!oldData) return [];
        return oldData.filter(minuta => minuta.id !== id);
      });
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Minuta eliminada correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en eliminación de minuta:', error);
    },
    ...options,
  });
} 