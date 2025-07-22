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
      
      login: async (email, password) => {
        set({ isLoading: true });
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('Credenciales inválidas');
          }

          const data = await response.json();
          
          // El backend devuelve los datos en data.data
          const { user, organization, tokens } = data.data;
          
          set({
            user: {
              ...user,
              organization_id: organization.id
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false
          });

          // Guardar token en localStorage para compatibilidad
          localStorage.setItem('token', tokens.accessToken);
          
          return true;
        } catch (error) {
          console.error('Error en login:', error);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Error en el registro');
          }

          // El backend devuelve los datos en data.data
          const { user, organization, tokens } = data.data;
          
          set({
            user: {
              ...user,
              organization_id: organization.id
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false
          });

          // Guardar token en localStorage para compatibilidad
          localStorage.setItem('token', tokens.accessToken);
          
          return true;
        } catch (error) {
          console.error('Error en registro:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
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
          console.error('🔑 No hay refresh token disponible');
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

          console.log('🔑 Token refrescado exitosamente');
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

      // Función para obtener el token actual (versión simplificada y más robusta)
      getValidToken: async () => {
        const { accessToken, refreshToken, refreshAccessToken } = get();
        
        console.log('🔑 getValidToken - Estado:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          tokenLength: accessToken ? accessToken.length : 0
        });
        
        if (!accessToken) {
          console.error('🔑 No hay access token disponible');
          return null;
        }

        // Verificar si el token está cerca de expirar
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const now = Date.now() / 1000;
          
          console.log('🔑 Token info:', {
            expires: new Date(payload.exp * 1000).toISOString(),
            now: new Date(now * 1000).toISOString(),
            timeLeft: Math.floor((payload.exp - now) / 60) + ' minutes'
          });
          
          // Si el token expira en menos de 5 minutos, intentar refrescarlo
          if (payload.exp - now < 300) {
            console.log('🔑 Token cerca de expirar, refrescando...');
            const newToken = await refreshAccessToken();
            return newToken || accessToken; // Usar el token original si el refresh falla
          }
        } catch (error) {
          console.error('🔑 Error parsing token (usando token original):', error);
          // Si no se puede parsear el token, usar el que tenemos
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