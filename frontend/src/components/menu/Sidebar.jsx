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
  Target
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
        { name: 'Planificación Estratégica', path: '/planificacion-estrategica', icon: Target },
        { name: 'Revisión por la Dirección', path: '/revision-direccion', icon: BarChart3 },
        { name: 'Objetivos y Metas', path: '/objetivos-metas', icon: TrendingUp },
      ]
    },
    {
      id: 'auditorias',
      name: 'Auditorías',
      icon: BarChart3,
      color: 'blue',
      items: [
        { name: 'Auditorías Internas', path: '/auditorias', icon: BarChart3 },
        { name: 'Programa de Auditorías', path: '/programa-auditorias', icon: Calendar },
        { name: 'Hallazgos de Auditoría', path: '/hallazgos-auditoria', icon: ClipboardCheck },
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
            { name: 'Departamentos', path: '/departamentos', icon: Building },
            { name: 'Puestos', path: '/puestos', icon: Briefcase },
            { name: 'Personal', path: '/personal', icon: User },
          ]
        },
        {
          type: 'submenu',
          name: 'Desarrollo',
          icon: GraduationCap,
          id: 'desarrollo',
          items: [
            { name: 'Capacitaciones', path: '/capacitaciones', icon: GraduationCap },
            { name: 'Competencias', path: '/competencias', icon: Award },
            { name: 'Eval. de Competencias', path: '/evalcompe-programacion', icon: ClipboardCheck },
          ]
        },
        { name: 'Documentos', path: '/documentos', icon: FileText },
        { name: 'Puntos de la Norma', path: '/normas', icon: ListChecks },
      ]
    },
    {
      id: 'procesos',
      name: 'Procesos',
      icon: ClipboardCheck,
      color: 'blue',
      items: [
        { name: 'Procesos', path: '/procesos', icon: ClipboardCheck },
        { name: 'Objetivos de calidad', path: '/objetivos-calidad', icon: Briefcase },
        { name: 'Indicadores de calidad', path: '/indicadores-calidad', icon: GraduationCap },
        { name: 'Mediciones', path: '/mediciones', icon: Users },
      ]
    },
    {
      id: 'mejora',
      name: 'Mejora',
      icon: GraduationCap,
      color: 'purple',
      items: [
        { name: 'Hallazgos', path: '/hallazgos', icon: ClipboardCheck },
        { name: 'Acciones', path: '/acciones', icon: Briefcase },
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
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">SGC Pro</h1>
            <p className="text-sm text-slate-400">Sistema de Gestión ISO 9001</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {departmentModules.map((department) => {
            const isExpanded = expandedSections.includes(department.id);
            const hasActiveItem = Array.isArray(department.items) && department.items.some(item => location.pathname === item.path);
            const colorClasses = getColorClasses(department.color, hasActiveItem);

            return (
              <div key={department.id} className="space-y-1">
                {/* Department Header */}
                <Button
                  variant="ghost"
                  onClick={() => toggleSection(department.id)}
                  className={`
                    w-full justify-between p-3 h-auto rounded-lg
                    ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}
                    transition-all duration-200
                  `}
                >
                  <div className="flex items-center gap-3">
                    <department.icon className={`h-5 w-5 ${colorClasses.icon}`} />
                    <span className="font-medium">{department.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {Array.isArray(department.items) && department.items.length > 0 && (
                      <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                        {department.items.length}
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </Button>

                {/* Department Items */}
                <AnimatePresence>
                  {isExpanded && Array.isArray(department.items) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 space-y-1 border-l-2 border-slate-700 pl-4">
                        {department.items.map((item) => {
                          const isActive = location.pathname === item.path;
                          const itemColorClasses = getColorClasses(department.color, isActive);

                          if (item.type === 'submenu') {
                            const isSubmenuExpanded = expandedSubmenus[item.id];
                            return (
                              <div key={item.id} className="space-y-1">
                                <Button
                                  variant="ghost"
                                  onClick={() => toggleSubmenu(item.id)}
                                  className={`
                                    w-full justify-start p-2 h-auto text-sm rounded-lg
                                    ${itemColorClasses.bg} ${itemColorClasses.text} ${itemColorClasses.border}
                                    transition-all duration-200
                                  `}
                                >
                                  <item.icon className={`h-4 w-4 mr-3 ${itemColorClasses.icon}`} />
                                  {item.name}
                                  {isSubmenuExpanded ? (
                                    <ChevronDown className="h-4 w-4 ml-auto" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 ml-auto" />
                                  )}
                                </Button>
                                <AnimatePresence>
                                  {isSubmenuExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="ml-4 space-y-1 border-l-2 border-slate-700 pl-4">
                                        {item.items.map((subItem) => {
                                          const subItemIsActive = location.pathname === subItem.path;
                                          const subItemColorClasses = getColorClasses(department.color, subItemIsActive);
                                          return (
                                            <Button
                                              key={subItem.path}
                                              variant="ghost"
                                              onClick={() => handleNavigation(subItem.path)}
                                              className={`
                                                w-full justify-start p-2 h-auto text-sm rounded-lg
                                                ${subItemColorClasses.bg} ${subItemColorClasses.text} ${subItemColorClasses.border}
                                                transition-all duration-200
                                              `}
                                            >
                                              <subItem.icon className={`h-4 w-4 mr-3 ${subItemColorClasses.icon}`} />
                                              {subItem.name}
                                            </Button>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          } else {
                            return (
                              <Button
                                key={item.path}
                                variant="ghost"
                                onClick={() => handleNavigation(item.path)}
                                className={`
                                  w-full justify-start p-2 h-auto text-sm rounded-lg
                                  ${itemColorClasses.bg} ${itemColorClasses.text} ${itemColorClasses.border}
                                  transition-all duration-200
                                `}
                              >
                                <item.icon className={`h-4 w-4 mr-3 ${itemColorClasses.icon}`} />
                                {item.name}
                              </Button>
                            );
                          }
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Acceso directo a Documentación */}
      <div className="px-4 pb-4">
        <Button
          variant={location.pathname === '/documentacion' ? 'secondary' : 'ghost'}
          onClick={() => handleNavigation('/documentacion')}
          className={`w-full flex items-center gap-3 p-3 h-auto rounded-lg mb-2 ${location.pathname === '/documentacion' ? 'bg-emerald-700 text-white' : ''}`}
        >
          <FileText className="h-5 w-5" />
          <span className="font-medium">Documentación</span>
        </Button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-center">
          <p className="text-xs text-slate-400">
            © 2024 SGC Pro
          </p>
          <p className="text-xs text-slate-500">
            v3.0.0
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
