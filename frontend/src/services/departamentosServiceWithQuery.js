import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from '@/lib/errorHandler';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook personalizado para obtener todos los departamentos usando React Query
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useDepartamentos(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['departamentos'],
    queryFn: async () => {
      try {
        const { departamentosService } = await import('./departamentosService');
        return await departamentosService.getAll();
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
 * Hook personalizado para obtener un departamento específico usando React Query
 * @param {string|number} id - ID del departamento
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useDepartamento(id, options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['departamentos', id],
    queryFn: async () => {
      try {
        const { departamentosService } = await import('./departamentosService');
        return await departamentosService.getById(id);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    enabled: !!id, // Solo ejecutar si hay un ID
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
}

/**
 * Hook personalizado para crear departamentos usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useCreateDepartamento(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      try {
        const { departamentosService } = await import('./departamentosService');
        return await departamentosService.create(formData);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data) => {
      // Actualizar el caché de departamentos
      queryClient.setQueryData(['departamentos'], (oldData) => {
        if (!oldData) return [data.data];
        return [...oldData, data.data];
      });
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Departamento creado correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en creación de departamento:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para actualizar departamentos usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useUpdateDepartamento(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const { departamentosService } = await import('./departamentosService');
        return await departamentosService.update(id, data);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Actualizar el caché de departamentos
      queryClient.setQueryData(['departamentos'], (oldData) => {
        if (!oldData) return [data.data];
        return oldData.map(departamento => 
          departamento.id === variables.id ? data.data : departamento
        );
      });
      
      // Actualizar también la query individual del departamento
      queryClient.setQueryData(['departamentos', variables.id], data.data);
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Departamento actualizado correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en actualización de departamento:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para eliminar departamentos usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useDeleteDepartamento(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const { departamentosService } = await import('./departamentosService');
        return await departamentosService.delete(id);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data, id) => {
      // Actualizar el caché de departamentos
      queryClient.setQueryData(['departamentos'], (oldData) => {
        if (!oldData) return [];
        return oldData.filter(departamento => departamento.id !== id);
      });
      
      // Eliminar también la query individual del departamento
      queryClient.removeQueries(['departamentos', id]);
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Departamento eliminado correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en eliminación de departamento:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para buscar departamentos usando React Query
 * @param {string} searchTerm - Término de búsqueda
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useSearchDepartamentos(searchTerm, options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['departamentos', 'search', searchTerm],
    queryFn: async () => {
      try {
        const { departamentosService } = await import('./departamentosService');
        return await departamentosService.search(searchTerm);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    enabled: !!searchTerm && searchTerm.length > 0, // Solo ejecutar si hay término de búsqueda
    staleTime: 1 * 60 * 1000, // 1 minuto para búsquedas
    gcTime: 2 * 60 * 1000, // 2 minutos
    ...options,
  });
} 