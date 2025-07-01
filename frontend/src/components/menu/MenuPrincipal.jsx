import React, { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import TopHeader from "../layout/TopHeader";
import { cn } from "@/lib/utils";

// Icons
import {
  BarChart2, Calendar, ClipboardList, ArrowUpCircle, // For Principal
  Settings, // For Admin
  Bot, Sparkles, // For Assistant
  Menu as MenuIcon, X, ChevronDown,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// NavLink for top-level items
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

const MenuPrincipal = () => {
  const { isDark } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState(['recursos-humanos', 'sistema-gestion']);

  const handleMenuToggle = (menuId) => {
    setOpenMenus(prev => 
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const closeDrawer = () => setDrawerOpen(false);

  const menuSections = [
    {
      title: 'Principal',
      items: [
        { id: 'tablero', label: 'Tablero Central', icon: BarChart2, to: '/tablero' },
        { id: 'calendario', label: 'Calendario', icon: Calendar, to: '/calendario' },
        { id: 'auditorias', label: 'Auditorías', icon: ClipboardList, to: '/auditorias' },
        
      ]
    },
    {
      title: 'Recursos Humanos',
      id: 'recursos-humanos',
      collapsible: true,
      items: [
        { id: 'departamentos', label: 'Departamentos', to: '/departamentos' },
        { id: 'puestos', label: 'Puestos', to: '/puestos' },
        { id: 'personal', label: 'Personal', to: '/personal' },
        { id: 'capacitaciones', label: 'Capacitaciones', to: '/capacitaciones' },
        { id: 'evaluaciones', label: 'Evaluaciones', to: '/evaluaciones' },
      ]
    },
    {
      title: 'Mejoras',
      id: 'mejoras',
      collapsible: true,
      items: [
        { id: 'hallazgos', label: 'Hallazgos', to: '/hallazgos' },
        { id: 'acciones', label: 'Acciones', to: '/acciones' },
      ]
    },
    {
      title: 'Sistema de Gestión',
      id: 'sistema-gestion',
      collapsible: true,
      items: [
        { id: 'procesos', label: 'Procesos', to: '/procesos' },
        { id: 'documentos', label: 'Documentos', to: '/documentos' },
        { id: 'normas', label: 'Puntos de Norma', to: '/normas' },
        { id: 'objetivos', label: 'Objetivos', to: '/objetivos' },
        { id: 'indicadores', label: 'Indicadores', to: '/indicadores' },
        { id: 'comunicaciones', label: 'Comunicaciones', to: '/comunicaciones' },
        { id: 'encuestas', label: 'Encuestas', to: '/encuestas' },
      ]
    },
    {
      title: 'Administración',
      items: [
        { id: 'configuracion', label: 'Configuración', icon: Settings, to: '/configuracion' },
      ]
    },
  ];

  const renderMenuContent = () => (
    <nav className="p-2 space-y-1">
      {menuSections.map((section, index) => (
        <div key={section.id || section.title}>
          {index > 0 && <div className="h-px bg-slate-700/50 mx-2 my-2"></div>}
          {section.collapsible ? (
            <Collapsible open={openMenus.includes(section.id)} onOpenChange={() => handleMenuToggle(section.id)}>
              <CollapsibleTrigger className="w-full flex justify-between items-center px-3 py-2 text-left rounded-md transition-colors duration-200 text-slate-300 hover:bg-slate-700 hover:text-white">
                <span className="text-sm font-semibold uppercase tracking-wider">{section.title}</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', openMenus.includes(section.id) && 'rotate-180')} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 mt-1 space-y-1">
                {section.items.map(item => <SubNavItem key={item.id} to={item.to} onClick={closeDrawer}>{item.label}</SubNavItem>)}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="space-y-1">
              {section.items.map(item => <NavItem key={item.id} to={item.to} icon={item.icon} onClick={closeDrawer}>{item.label}</NavItem>)}
            </div>
          )}
        </div>
      ))}
      <div className="px-2 pt-4">
        <Link to="/iso-assistant" onClick={closeDrawer} className={`flex items-center w-full px-4 py-2 text-left rounded-md transition-colors text-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-300`}>
          <Bot className="h-4 w-4 mr-3" />
          <span>Asistente ISO</span>
          <Sparkles className="h-3 w-3 ml-auto text-blue-400" />
        </Link>
      </div>
    </nav>
  );

  return (
    <div className={`h-screen flex ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-slate-800 text-white flex-shrink-0">
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
        <div className="overflow-y-auto flex-grow">
          {renderMenuContent()}
        </div>
      </aside>

      <div className={`fixed inset-0 z-40 flex md:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-800 text-white">
          <button className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white" onClick={closeDrawer}>
            <X className="h-6 w-6" />
          </button>
          <div className="overflow-y-auto pt-8">
            {renderMenuContent()}
          </div>
        </div>
        <div className="flex-shrink-0 w-14" onClick={closeDrawer}></div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setDrawerOpen(true)} />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 mt-16 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MenuPrincipal;
