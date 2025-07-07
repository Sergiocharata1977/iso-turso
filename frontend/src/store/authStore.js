import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Acciones
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      login: (userData, accessToken, refreshToken) => set({
        user: userData,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false
      }),
      
      logout: async () => {
        const { refreshToken } = get();
        
        // Intentar revocar el refresh token en el servidor
        if (refreshToken) {
          try {
            await fetch('/api/auth/logout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            });
          } catch (error) {
            console.error('Error al hacer logout:', error);
          }
        }

        // Limpiar localStorage
        localStorage.removeItem('token');
        
        // Resetear estado
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false
        });
        
        // Redirigir al login
        window.location.href = '/login';
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          get().logout();
          return null;
        }

        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            throw new Error('Failed to refresh token');
          }

          const data = await response.json();
          
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user
          });

          return data.accessToken;
        } catch (error) {
          console.error('Error refreshing token:', error);
          get().logout();
          return null;
        }
      },
      
      updateUser: (updatedData) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedData } : null
      })),
      
      // Getters
      hasRole: (requiredRole) => {
        const { user } = get();
        if (!user) return false;
        
        const roleHierarchy = {
          'super_admin': 4,
          'admin': 3,
          'manager': 2,
          'employee': 1
        };
        
        const userLevel = roleHierarchy[user.role] || 0;
        const requiredLevel = roleHierarchy[requiredRole] || 0;
        
        return userLevel >= requiredLevel;
      },
      
      isAdmin: () => get().hasRole('admin'),
      isManager: () => get().hasRole('manager'),
      
      getOrganizationId: () => {
        const { user } = get();
        return user?.organization_id || null;
      },
      
      getUserRole: () => {
        const { user } = get();
        return user?.role || null;
      },

      // Función para obtener el token actual (con refresh automático si es necesario)
      getValidToken: async () => {
        const { accessToken, refreshAccessToken } = get();
        
        if (!accessToken) {
          return null;
        }

        // Verificar si el token está cerca de expirar (opcional)
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const now = Date.now() / 1000;
          
          // Si el token expira en menos de 5 minutos, refrescarlo
          if (payload.exp - now < 300) {
            return await refreshAccessToken();
          }
        } catch (error) {
          console.error('Error parsing token:', error);
        }

        return accessToken;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore; 