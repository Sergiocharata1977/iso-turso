import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Muestra un estado de carga mientras se valida el token
    // para evitar un parpadeo a la página de login.
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login, guardando la ubicación
    // a la que intentaba acceder para poder redirigirlo de vuelta después del login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderiza el componente hijo (la página protegida).
  return children;
};

export default ProtectedRoute;
