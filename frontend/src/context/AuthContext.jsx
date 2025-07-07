import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';
import { userService } from '../services/userService';
import usePermissionsStore from '../store/permissionsStore';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { setUserPermissions, clearPermissions } = usePermissionsStore();
  
  console.log('🔐 AuthContext - Estado inicial:', { token: !!token, isAuthenticated, user: !!user });

  useEffect(() => {
    const validateToken = async () => {
      console.log('🔍 AuthContext - Validando token:', { token: !!token });
      
      if (token) {
        try {
          // Configurar el token en el apiService para futuras peticiones
          apiService.setAuthToken(token);
          
          // Intentar obtener datos del usuario desde localStorage primero
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            console.log('✅ AuthContext - Usuario desde localStorage:', userData);
            setUser(userData);
            setIsAuthenticated(true);
            
            // Configurar permisos simplificados
            setUserPermissions(
              userData.role,
              userData.organization_plan || 'basic',
              userData.max_users || 10,
              userData.organization_id,
              userData.organization_name
            );
          } else {
            // Si no hay usuario en localStorage, intentar obtenerlo del backend
            console.log('🔍 AuthContext - Obteniendo perfil del backend...');
            const profile = await userService.getProfile();
            setUser(profile.user);
            setIsAuthenticated(true);
            
            // Configurar permisos simplificados
            setUserPermissions(
              profile.user.role,
              profile.user.organization_plan || 'basic',
              profile.user.max_users || 10,
              profile.user.organization_id,
              profile.user.organization_name
            );
          }
        } catch (error) {
          console.error('❌ AuthContext - Token inválido o expirado:', error);
          // Limpiar estado si el token no es válido
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          apiService.setAuthToken(null);
          clearPermissions();
        }
      } else {
        console.log('❌ AuthContext - No hay token');
        clearPermissions();
      }
      setIsLoading(false);
    };

    validateToken();
  }, [token, setUserPermissions, clearPermissions]);

  const login = async (credentials) => {
    console.log('🔐 AuthContext - Iniciando login...');
    const response = await authService.login(credentials);
    console.log('📝 AuthContext - Respuesta de login:', response);
    
    // CORRECCIÓN: El backend envía los datos directamente en response, no en response.data
    const { accessToken, refreshToken, user } = response;
    
    console.log('💾 AuthContext - Guardando tokens y usuario...');
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    setToken(accessToken);
    setUser(user);
    setIsAuthenticated(true);
    apiService.setAuthToken(accessToken);
    
    // Configurar permisos simplificados
    setUserPermissions(
      user.role,
      user.organization_plan || 'basic',
      user.max_users || 10,
      user.organization_id,
      user.organization_name
    );
    
    console.log('✅ AuthContext - Login completado, estado actualizado');
    return response;
  };

  const logout = () => {
    console.log('🚀 AuthContext - Cerrando sesión...');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    apiService.setAuthToken(null);
    clearPermissions();
    // Redirigir al login
    window.location.href = '/login';
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
