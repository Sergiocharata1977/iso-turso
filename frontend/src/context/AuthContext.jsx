import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          // Configurar el token en el apiService para futuras peticiones
          apiService.setAuthToken(token);
          
          // Opcional pero recomendado: Deberíamos tener un endpoint para verificar el token
          // y obtener los datos del usuario. Por ahora, decodificamos el token.
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Verificar si el token ha expirado
          if (payload.exp * 1000 < Date.now()) {
            throw new Error('Token expirado');
          }

          setUser({ id: payload.id, email: payload.email, role: payload.role });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token inválido o expirado:', error);
          // Limpiar estado si el token no es válido
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          apiService.setAuthToken(null);
        }
      } 
      setIsLoading(false);
    };

    validateToken();
  }, [token]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
    setIsAuthenticated(true);
    apiService.setAuthToken(response.token);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    apiService.setAuthToken(null);
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
