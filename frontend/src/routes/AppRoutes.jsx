import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Importación directa del componente principal
import MenuPrincipal from '@/components/menu/MenuPrincipal';

// Componente de carga para las importaciones lazy (si se necesitan en el futuro)
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* La ruta raíz ahora carga directamente el menú principal */}
        <Route 
          path="/*" 
          element={<MenuPrincipal />}
        />
      </Routes>
    </Suspense>
  );
}
