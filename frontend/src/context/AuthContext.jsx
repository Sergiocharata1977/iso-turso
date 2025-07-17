import React, { createContext, useContext } from 'react';
import useAuthStore from '@/store/authStore';

/**
 * Este archivo sirve como capa de compatibilidad después de la migración a Zustand.
 * Implementa un `useAuth` que delega en `useAuthStore` para que el código legado
 * que sigue importando `useAuth` continúe funcionando sin modificar todos los
 * componentes. No provee un contexto real; simplemente expone los valores que
 * muchos componentes esperan (`user`, `logout`, etc.).
 */

// Creamos un contexto vacío únicamente para mantener la API previa. No se usa
// realmente, pero evita errores si alguien intenta renderizar <AuthProvider>.
const DummyContext = createContext({});

export const AuthProvider = ({ children }) => (
  <DummyContext.Provider value={{}}>{children}</DummyContext.Provider>
);

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.accessToken);
  const hasRole = useAuthStore((state) => state.hasRole);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isManager = useAuthStore((state) => state.isManager);

  return {
    user,
    logout,
    isAuthenticated,
    token,
    hasRole,
    isAdmin,
    isManager,
  };
};

// Exportación por defecto para compatibilidad (algunos imports hacían
// `import { useAuth } from '@/context/AuthContext'` y otros
// `import AuthContext from ...`).
export default {
  useAuth,
  AuthProvider,
}; 