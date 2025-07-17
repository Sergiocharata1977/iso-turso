import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  FileText, 
  Code, 
  BookOpen, 
  Layers, 
  Menu, 
  X,
  ChevronRight,
  Home,
  Search
} from 'lucide-react';

const DocumentacionLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const menuItems = [
    {
      id: 'home',
      title: 'Inicio',
      icon: Home,
      path: '/documentacion'
    },
    {
      id: 'casos-uso',
      title: 'Casos de Uso',
      icon: FileText,
      path: '/documentacion/casos-uso',
      submenu: [
        { title: 'Gestión de Usuarios', path: '/documentacion/casos-uso/usuarios' },
        { title: 'Gestión de Departamentos', path: '/documentacion/casos-uso/departamentos' },
        { title: 'Gestión de Procesos', path: '/documentacion/casos-uso/procesos' },
        { title: 'Gestión de Auditorías', path: '/documentacion/casos-uso/auditorias' },
        { title: 'Gestión de Documentos', path: '/documentacion/casos-uso/documentos' }
      ]
    },
    {
      id: 'arquitectura',
      title: 'Arquitectura',
      icon: Layers,
      path: '/documentacion/arquitectura',
      submenu: [
        { title: 'Visión General', path: '/documentacion/arquitectura/vision-general' },
        { title: 'Frontend', path: '/documentacion/arquitectura/frontend' },
        { title: 'Backend', path: '/documentacion/arquitectura/backend' },
        { title: 'Base de Datos', path: '/documentacion/arquitectura/base-datos' },
        { title: 'Seguridad', path: '/documentacion/arquitectura/seguridad' }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      path: '/documentacion/api',
      submenu: [
        { title: 'Autenticación', path: '/documentacion/api/auth' },
        { title: 'Usuarios', path: '/documentacion/api/usuarios' },
        { title: 'Organizaciones', path: '/documentacion/api/organizaciones' },
        { title: 'Recursos', path: '/documentacion/api/recursos' },
        { title: 'Procesos', path: '/documentacion/api/procesos' }
      ]
    },
    {
      id: 'guias',
      title: 'Guías',
      icon: BookOpen,
      path: '/documentacion/guias',
      submenu: [
        { title: 'Instalación', path: '/documentacion/guias/instalacion' },
        { title: 'Configuración', path: '/documentacion/guias/configuracion' },
        { title: 'Despliegue', path: '/documentacion/guias/despliegue' },
        { title: 'Mantenimiento', path: '/documentacion/guias/mantenimiento' }
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-50 border-r border-gray-200 overflow-hidden`}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Documentación</h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1 hover:bg-gray-200 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav>
            {menuItems.map((item) => (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                  {item.submenu && (
                    <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${
                      isActive(item.path) ? 'rotate-90' : ''
                    }`} />
                  )}
                </button>

                {/* Submenu */}
                {item.submenu && isActive(item.path) && (
                  <div className="ml-8 mt-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.path}
                        onClick={() => handleNavigation(subItem.path)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                          location.pathname === subItem.path
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        {subItem.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`lg:hidden fixed top-4 ${sidebarOpen ? 'left-64' : 'left-4'} z-50 p-2 bg-white shadow-md rounded-lg transition-all duration-300`}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DocumentacionLayout;
