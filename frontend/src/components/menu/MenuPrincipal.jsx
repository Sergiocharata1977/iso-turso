import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

// Icons
import {
  BarChart2, Calendar, ClipboardList, ArrowUpCircle,
  Settings,
  Bot, Sparkles,
  ChevronDown,
  Users, FileText, BookOpen, Clipboard, Target, LineChart, Activity,
  Package, MessageSquare, BarChart, UserCheck, Building2, Briefcase,
  GraduationCap, ClipboardCheck, Workflow, GitBranch, ShieldCheck, ThumbsUp, Ticket, ListFilter
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// NavLink for top-level items (not used in collapsible structure but good for reuse)
const NavItem = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200",
        isActive
          ? "bg-emerald-600 text-white font-medium"
          : "text-slate-300 hover:bg-slate-700 hover:text-white"
      )
    }
  >
    <Icon className="w-4 h-4" />
    <span>{children}</span>
  </NavLink>
);

// NavLink for sub-items inside collapsible menus
const SubNavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-2.5 pl-3 pr-2 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200",
        isActive
          ? "text-emerald-400 font-medium"
          : "text-slate-400 hover:text-slate-100"
      )
    }
  >
    {({ isActive }) => (
      <>
        <div className={cn("w-1 h-1 rounded-full", isActive ? "bg-emerald-400" : "bg-slate-500")} />
        <span>{children}</span>
      </>
    )}
  </NavLink>
);

const MenuPrincipal = ({ closeDrawer, isMobile }) => {
  const { isDark } = useTheme();
  // Open all menus by default
  const [openMenus, setOpenMenus] = useState([
    'recursos-humanos', 
    'gestion-procesos', 
    'mejoras', 
    'sistema-gestion', 
    'atencion-cliente', 
    'administracion'
  ]);

  const handleMenuToggle = (menuId) => {
    setOpenMenus(prev =>
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const handleNavClick = () => {
    if (isMobile && closeDrawer) {
      closeDrawer();
    }
  };

  const menuSections = [
    {
      title: 'Principal',
      isCollapsible: false,
      items: [
        { id: 'tablero', label: 'Tablero Central', icon: BarChart2, to: '/tablero' },
        { id: 'planificacion-revision', label: 'Planificación y Revisión', icon: ArrowUpCircle, to: '/planificacion-revision' },
        { id: 'calendario', label: 'Calendario', icon: Calendar, to: '/calendario' },
        { id: 'auditorias', label: 'Auditorías', icon: ClipboardList, to: '/auditorias' },
      ]
    },
    {
      id: 'recursos-humanos',
      title: 'Recursos Humanos',
      isCollapsible: true,
      items: [
        { id: 'departamentos', label: 'Departamentos', to: '/departamentos' },
        { id: 'puestos', label: 'Puestos', to: '/puestos' },
        { id: 'personal', label: 'Personal', to: '/personal' },
        { id: 'capacitaciones', label: 'Capacitaciones', to: '/capacitaciones' },
        { id: 'evaluaciones', label: 'Evaluaciones', to: '/evaluaciones' },
      ]
    },
    {
      id: 'gestion-procesos',
      title: 'Gestión de Procesos',
      isCollapsible: true,
      items: [
        { id: 'procesos', label: 'Procesos', to: '/procesos' },
        { id: 'objetivos', label: 'Objetivos de Calidad', to: '/objetivos' },
        { id: 'indicadores', label: 'Indicadores', to: '/indicadores' },
        { id: 'mediciones', label: 'Mediciones', to: '/mediciones' },
      ]
    },
    {
      id: 'mejoras',
      title: 'Mejoras',
      isCollapsible: true,
      items: [
        { id: 'hallazgos', label: 'Hallazgos', to: '/hallazgos' },
        { id: 'acciones', label: 'Acciones', to: '/acciones' },
      ]
    },
    {
      id: 'sistema-gestion',
      title: 'Sistema de Gestión',
      isCollapsible: true,
      items: [
        { id: 'normas', label: 'Puntos de Norma', to: '/normas' },
        { id: 'documentos', label: 'Documentos', to: '/documentos' },
        { id: 'productos', label: 'Productos y Servicios', to: '/productos' },
      ]
    },
    {
      id: 'atencion-cliente',
      title: 'Atención al Cliente',
      isCollapsible: true,
      items: [
        { id: 'encuestas', label: 'Encuestas', to: '/encuestas' },
        { id: 'tickets', label: 'Tickets de Soporte', to: '/tickets' },
        { id: 'feedback', label: 'Feedback Clientes', to: '/feedback' },
      ]
    },
    {
      id: 'administracion',
      title: 'Administración',
      isCollapsible: true,
      items: [
        { id: 'usuarios', label: 'Gestión de Usuarios', to: '/usuarios' },
        { id: 'configuracion', label: 'Configuración General', to: '/configuracion' },
      ]
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-800 text-white">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold text-sm">
            SGC
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Los Señores del Agro</h1>
            <p className="text-xs text-slate-400">Sistema de Gestión de Calidad</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuSections.map((section, index) => (
          <div key={section.id || section.title}>
            {index > 0 && <div className="h-px bg-slate-700/50 mx-2 my-2"></div>}
            {section.isCollapsible ? (
              <Collapsible open={openMenus.includes(section.id)} onOpenChange={() => handleMenuToggle(section.id)}>
                <CollapsibleTrigger className="w-full flex justify-between items-center px-3 py-2 text-left rounded-md transition-colors duration-200 text-slate-300 hover:bg-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                  <span className="text-sm font-semibold uppercase tracking-wider">{section.title}</span>
                  <ChevronDown className={cn('h-4 w-4 transition-transform', openMenus.includes(section.id) && 'rotate-180')} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 mt-1 space-y-1">
                  {section.items.map(item => (
                    <SubNavItem key={item.id} to={item.to} onClick={handleNavClick}>{item.label}</SubNavItem>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <div className="space-y-1">
                <h2 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{section.title}</h2>
                {section.items.map(item => <NavItem key={item.id} to={item.to} icon={item.icon} onClick={handleNavClick}>{item.label}</NavItem>)}
              </div>
            )}
          </div>
        ))}
        {/* ISO Assistant Button */}
        <div className="px-2 pt-4">
          <Link to="/iso-assistant" onClick={handleNavClick} className={`flex items-center w-full px-4 py-2 text-left rounded-md transition-colors text-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}>
            <Bot className="h-4 w-4 mr-3" />
            <span>Asistente ISO</span>
            <Sparkles className="h-3 w-3 ml-auto text-blue-400" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MenuPrincipal; 