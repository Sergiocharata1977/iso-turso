import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  ChevronDown,
  ChevronRight,
  X,
  Users,
  Briefcase,
  GraduationCap,
  ClipboardCheck,
  ClipboardList,
  FileText,
  BarChart3,
  Bell,
  TrendingUp,
  Calendar,
  Settings,
  Award,
  User,
  ListChecks,
  Activity,
  Target,
  Package,
  Database,
  Star
} from 'lucide-react';
import useAuthStore from '@/store/authStore';

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [expandedSections, setExpandedSections] = useState(['recursos-humanos']);
  const [expandedSubmenus, setExpandedSubmenus] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleSubmenu = (submenu) => {
    setExpandedSubmenus((prev) => ({ ...prev, [submenu]: !prev[submenu] }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  // Colores para los módulos
  const getColorClasses = (color, isActive = false) => {
    const colors = {
      emerald: {
        bg: isActive ? 'bg-emerald-700' : 'hover:bg-emerald-800',
        text: isActive ? 'text-white' : 'text-slate-200',
        icon: isActive ? 'text-white' : 'text-emerald-400',
        border: isActive ? 'border-l-4 border-emerald-500' : ''
      },
      blue: {
        bg: isActive ? 'bg-blue-700' : 'hover:bg-blue-800',
        text: isActive ? 'text-white' : 'text-slate-200',
        icon: isActive ? 'text-white' : 'text-blue-400',
        border: isActive ? 'border-l-4 border-blue-500' : ''
      },
      purple: {
        bg: isActive ? 'bg-purple-700' : 'hover:bg-purple-800',
        text: isActive ? 'text-white' : 'text-slate-200',
        icon: isActive ? 'text-white' : 'text-purple-400',
        border: isActive ? 'border-l-4 border-purple-500' : ''
      },
      orange: {
        bg: isActive ? 'bg-orange-700' : 'hover:bg-orange-800',
        text: isActive ? 'text-white' : 'text-slate-200',
        icon: isActive ? 'text-white' : 'text-orange-400',
        border: isActive ? 'border-l-4 border-orange-500' : ''
      }
    };
    return colors[color] || colors.emerald;
  };

  // Definir departmentModules antes del return
  const departmentModules = [
    {
      id: 'planificacion-revision',
      name: 'Planificación y Revisión',
      icon: Target,
      color: 'orange',
      items: [
        { name: 'Calendario', path: '/app/calendario', icon: Calendar },
        { name: 'Planificación Estratégica', path: '/app/planificacion-estrategica', icon: Target },
        { name: 'Política de Calidad', path: '/app/politica-calidad', icon: Target },
        { name: 'Revisión por la Dirección', path: '/app/revision-direccion', icon: BarChart3 },
        { name: 'Minutas', path: '/app/minutas', icon: FileText },
        { name: 'Objetivos y Metas', path: '/app/objetivos-metas', icon: TrendingUp },
      ]
    },
    {
      id: 'auditorias',
      name: 'Auditorías',
      icon: BarChart3,
      color: 'blue',
      items: [
        { name: 'Auditorías Internas', path: '/app/auditorias', icon: BarChart3 },
        { name: 'Productos', path: '/app/productos', icon: Package },
      ]
    },
    {
      id: 'recursos-humanos',
      name: 'Recursos Humanos',
      icon: Users,
      color: 'emerald',
      items: [
        {
          type: 'submenu',
          name: 'Organización',
          icon: Building,
          id: 'organizacion',
          items: [
            { name: 'Departamentos', path: '/app/departamentos', icon: Building },
            { name: 'Puestos', path: '/app/puestos', icon: Briefcase },
            { name: 'Personal', path: '/app/personal', icon: User },
          ]
        },
        {
          type: 'submenu',
          name: 'Desarrollo',
          icon: GraduationCap,
          id: 'desarrollo',
          items: [
            { name: 'Capacitaciones', path: '/app/capacitaciones', icon: GraduationCap },
            { name: 'Competencias', path: '/app/competencias', icon: ClipboardList },
            { name: 'Evaluaciones Individuales', path: '/app/evaluaciones-individuales', icon: User },
            // { name: 'Eval. de Competencias', path: '/app/evaluacion-competencias', icon: Star },
          ]
        },
        { name: 'Documentos', path: '/app/documentos', icon: FileText },
        { name: 'Puntos de la Norma', path: '/app/normas', icon: ListChecks },
      ]
    },
    {
      id: 'procesos',
      name: 'Procesos',
      icon: ClipboardCheck,
      color: 'blue',
      items: [
        { name: 'Procesos', path: '/app/procesos', icon: ClipboardCheck },
        { name: 'Objetivos de calidad', path: '/app/objetivos-calidad', icon: Briefcase },
        { name: 'Indicadores de calidad', path: '/app/indicadores', icon: GraduationCap },
        { name: 'Mediciones', path: '/app/mediciones', icon: Users },
      ]
    },
    {
      id: 'mejora',
      name: 'Mejora',
      icon: GraduationCap,
      color: 'purple',
      items: [
        { name: 'Hallazgos', path: '/app/hallazgos', icon: ClipboardCheck },
        { name: 'Acciones', path: '/app/acciones', icon: Briefcase },
      ]
    },
    {
      id: 'administracion',
      name: 'Administración',
      icon: Settings,
      color: 'orange',
      items: [
        { 
          name: 'Super Administrador', 
          path: '/app/admin/super', 
          icon: Settings, 
          role: 'super_admin',
          show: () => user?.role === 'super_admin'
        },
        { 
          name: 'Admin de Organización', 
          path: '/app/admin/organization', 
          icon: Building, 
          role: 'admin',
          show: () => ['admin', 'super_admin'].includes(user?.role)
        },
        { name: 'Usuarios', path: '/app/usuarios', icon: Users },
        { 
          name: 'Esquema de BD', 
          path: '/app/database-schema', 
          icon: Database,
          role: 'super_admin',
          show: () => user?.role === 'super_admin'
        },
      ]
    },
  ];

  return (
    <motion.div
      initial={{ x: -304 }}
      animate={{ x: 0 }}
      className="h-full w-76 bg-slate-800 text-white flex flex-col shadow-lg"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white">SGC Pro</div>
            <div className="text-xs text-slate-400">Sistema de Gestión ISO 9001</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="absolute left-3 top-2.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 space-y-2">
          {departmentModules.map((module) => {
            const isExpanded = expandedSections.includes(module.id);
            const isActive = location.pathname.startsWith(module.items[0]?.path || '');

            return (
              <div key={module.id} className="space-y-1">
                <button
                  onClick={() => toggleSection(module.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${getColorClasses(module.color, isActive).bg} ${getColorClasses(module.color, isActive).text} ${getColorClasses(module.color, isActive).border}`}
                >
                  <div className="flex items-center space-x-3">
                    <module.icon className={`w-4 h-4 ${getColorClasses(module.color, isActive).icon}`} />
                    <span>{module.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-slate-600 text-slate-200">
                      {module.items.length}
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-6 space-y-1"
                    >
                      {module.items.map((item, index) => {
                        if (item.type === 'submenu') {
                          const isSubmenuExpanded = expandedSubmenus[item.id];
                          return (
                            <div key={item.id} className="space-y-1">
                              <button
                                onClick={() => toggleSubmenu(item.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-700 text-slate-300`}
                              >
                                <div className="flex items-center space-x-3">
                                  <item.icon className="w-4 h-4 text-slate-400" />
                                  <span>{item.name}</span>
                                </div>
                                {isSubmenuExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>

                              <AnimatePresence>
                                {isSubmenuExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="ml-6 space-y-1"
                                  >
                                    {item.items.map((subItem) => {
                                      const isSubItemActive = location.pathname === subItem.path;
                                      return (
                                        <button
                                          key={subItem.path}
                                          onClick={() => handleNavigation(subItem.path)}
                                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            isSubItemActive
                                              ? 'bg-emerald-700 text-white border-l-4 border-emerald-500'
                                              : 'hover:bg-slate-700 text-slate-300'
                                          }`}
                                        >
                                          <subItem.icon className="w-4 h-4" />
                                          <span>{subItem.name}</span>
                                        </button>
                                      );
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        }

                        const isItemActive = location.pathname === item.path;
                        const shouldShow = item.show ? item.show() : true;

                        if (!shouldShow) return null;

                        return (
                          <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isItemActive
                                ? 'bg-emerald-700 text-white border-l-4 border-emerald-500'
                                : 'hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 text-center">
          © 2024 SGC Pro v3.0.0
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
