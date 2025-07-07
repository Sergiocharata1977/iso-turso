import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MenuPrincipal from '../menu/MenuPrincipal';
import { Menu } from 'lucide-react';
import { cn } from '../../lib/utils';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white shadow-md h-full fixed left-0 top-0 z-30">
        <MenuPrincipal />
      </aside>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar para mobile */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <MenuPrincipal 
          closeDrawer={() => setSidebarOpen(false)} 
          isMobile={true}
        />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64 min-h-screen">
        {/* Header móvil */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Sistema de Gestión de Calidad
          </h1>
        </div>

        {/* Área de contenido */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 