import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from '@/lib/errorHandler';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook personalizado para obtener todos los usuarios usando React Query
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useUsuarios(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      try {
        const { usuariosService } = await import('./usuariosService');
        return await usuariosService.getAll();
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
 * Hook personalizado para obtener un usuario específico usando React Query
 * @param {string|number} id - ID del usuario
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useUsuario(id, options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['usuarios', id],
    queryFn: async () => {
      try {
        const { usuariosService } = await import('./usuariosService');
        return await usuariosService.getById(id);
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
 * Hook personalizado para crear usuarios usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useCreateUsuario(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      try {
        const { usuariosService } = await import('./usuariosService');
        return await usuariosService.create(formData);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data) => {
      // Actualizar el caché de usuarios
      queryClient.setQueryData(['usuarios'], (oldData) => {
        if (!oldData) return [data.data];
        return [...oldData, data.data];
      });
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Usuario creado correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en creación de usuario:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para actualizar usuarios usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useUpdateUsuario(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const { usuariosService } = await import('./usuariosService');
        return await usuariosService.update(id, data);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Actualizar el caché de usuarios
      queryClient.setQueryData(['usuarios'], (oldData) => {
        if (!oldData) return [data.data];
        return oldData.map(usuario => 
          usuario.id === variables.id ? data.data : usuario
        );
      });
      
      // Actualizar también la query individual del usuario
      queryClient.setQueryData(['usuarios', variables.id], data.data);
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Usuario actualizado correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en actualización de usuario:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para eliminar usuarios usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useDeleteUsuario(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const { usuariosService } = await import('./usuariosService');
        return await usuariosService.delete(id);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data, id) => {
      // Actualizar el caché de usuarios
      queryClient.setQueryData(['usuarios'], (oldData) => {
        if (!oldData) return [];
        return oldData.filter(usuario => usuario.id !== id);
      });
      
      // Eliminar también la query individual del usuario
      queryClient.removeQueries(['usuarios', id]);
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en eliminación de usuario:', error);
    },
    ...options,
  });
}

/**
 * Hook personalizado para buscar usuarios usando React Query
 * @param {string} searchTerm - Término de búsqueda
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function useSearchUsuarios(searchTerm, options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['usuarios', 'search', searchTerm],
    queryFn: async () => {
      try {
        const { usuariosService } = await import('./usuariosService');
        return await usuariosService.search(searchTerm);
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

/**
 * Hook personalizado para obtener el perfil del usuario actual usando React Query
 * @param {Object} options - Opciones para la query
 * @returns {Object} Resultado de la query con datos, loading, error, etc.
 */
export function usePerfilUsuario(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);

  return useQuery({
    queryKey: ['usuarios', 'perfil'],
    queryFn: async () => {
      try {
        const { usuariosService } = await import('./usuariosService');
        return await usuariosService.getPerfil();
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
 * Hook personalizado para actualizar el perfil del usuario usando React Query
 * @param {Object} options - Opciones para la mutación
 * @returns {Object} Resultado de la mutación con mutate, isLoading, error, etc.
 */
export function useUpdatePerfilUsuario(options = {}) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler(toast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      try {
        const { usuariosService } = await import('./usuariosService');
        return await usuariosService.updatePerfil(data);
      } catch (error) {
        handleError(error, { silent: true });
        throw error;
      }
    },
    onSuccess: (data) => {
      // Actualizar el caché del perfil
      queryClient.setQueryData(['usuarios', 'perfil'], data.data);
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      console.error('Error en actualización de perfil:', error);
    },
    ...options,
  });
} 