import React, { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";

import { useTheme } from "@/context/ThemeContext";
import TopHeader from "../layout/TopHeader";
import {
  ClipboardList,
  FileText,
  Users,
  BarChart2,
  Calendar,
  Bell,
  BookOpen,
  FileCheck,
  Settings,
  Building,
  Briefcase,
  Target,
  Activity,
  LineChart,
  UserCheck,
  ClipboardCheck,
  GraduationCap,
  MessageSquare,
  BarChart,
  ArrowUpCircle,
  Package,
  Bot,
  Sparkles,
  Menu as MenuIcon, // Renamed to avoid conflict
  X,
  ChevronDown,
  ChevronRight,
  Clipboard, // Added for Procesos
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const NavItem = ({ to, icon: Icon, children, onClick }) => {
  const { isDark } = useTheme();
  const baseClasses = "flex items-center w-full px-4 py-2 text-left rounded-md transition-colors text-sm";
  // Using slate for Navy/Teal theme
  const inactiveClasses = isDark ? "text-slate-200 hover:bg-slate-700/80 hover:text-white" : "text-gray-600 hover:bg-gray-200";
  const activeClasses = isDark ? "bg-teal-600 text-white font-semibold" : "bg-teal-500 text-white font-semibold";

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
      }
    >
      <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
      <span>{children}</span>
    </NavLink>
  );
};

const MenuPrincipal = () => {
  const { isDark } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Open both collapsible menus by default
  const [openMenus, setOpenMenus] = useState(['recursos-humanos', 'sistema-gestion']);

  const handleMenuToggle = (menuId, isOpen) => {
    setOpenMenus(prev => {
      const newOpenMenus = new Set(prev);
      if (isOpen) {
        newOpenMenus.add(menuId);
      } else {
        newOpenMenus.delete(menuId);
      }
      return Array.from(newOpenMenus);
    });
  };

  const closeDrawer = () => setDrawerOpen(false);

  const menuSections = [
    {
      title: 'Principal',
      items: [
        { id: 'tablero', label: 'Tablero Central', icon: BarChart2, to: '/tablero' },
        { id: 'calendario', label: 'Calendario', icon: Calendar, to: '/calendario' },
        { id: 'mejoras', label: 'Mejoras', icon: ArrowUpCircle, to: '/mejoras' },
        { id: 'auditorias', label: 'Auditorías', icon: ClipboardList, to: '/auditorias' },
      ]
    },
    {
      title: 'Recursos Humanos',
      id: 'recursos-humanos',
      collapsible: true,
      items: [
        { id: 'departamentos', label: 'Departamentos', icon: Building, to: '/departamentos' },
        { id: 'puestos', label: 'Puestos', icon: Briefcase, to: '/puestos' },
        { id: 'personal', label: 'Personal', icon: Users, to: '/personal' },
        { id: 'capacitaciones', label: 'Capacitaciones', icon: GraduationCap, to: '/capacitaciones' },
        { id: 'evaluaciones', label: 'Evaluaciones', icon: UserCheck, to: '/evaluaciones' },
      ]
    },
    {
      title: 'Sistema de Gestión',
      id: 'sistema-gestion',
      collapsible: true,
      items: [
        { id: 'procesos', label: 'Procesos', icon: Clipboard, to: '/procesos' },
        { id: 'documentos', label: 'Documentos', icon: FileText, to: '/documentos' },
        { id: 'normas', label: 'Puntos de Norma', icon: BookOpen, to: '/normas' },
        { id: 'objetivos', label: 'Objetivos', icon: Target, to: '/objetivos' },
        { id: 'indicadores', label: 'Indicadores', icon: LineChart, to: '/indicadores' },
        { id: 'mediciones', label: 'Mediciones', icon: Activity, to: '/mediciones' },
      ]
    },
    {
      title: 'Planificación y Desarrollo de Productos',
      items: [
        { id: 'productos', label: 'Productos', icon: Package, to: '/productos' },
      ]
    },
    {
      title: 'Satisfacción',
      items: [
        { id: 'tickets', label: 'Tickets', icon: MessageSquare, to: '/tickets' },
        { id: 'encuestas', label: 'Encuestas', icon: BarChart, to: '/encuestas' },
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
    <nav className="space-y-1 p-2">
      {menuSections.map(section => (
        <div key={section.id || section.title}>
          {section.collapsible ? (
            <Collapsible
              open={openMenus.includes(section.id)}
              onOpenChange={(isOpen) => handleMenuToggle(section.id, isOpen)}
            >
              <CollapsibleTrigger className="w-full flex justify-between items-center px-2 py-2 text-left rounded-md hover:bg-slate-800">
                <span className="text-xs font-semibold uppercase text-slate-200">{section.title}</span>
                <ChevronDown className={`h-4 w-4 text-slate-200 transition-transform ${openMenus.includes(section.id) ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-3 space-y-1 mt-1">
                {section.items.map(item => <NavItem key={item.id} to={item.to} icon={item.icon} onClick={closeDrawer}>{item.label}</NavItem>)}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <>
              <h3 className="px-2 pt-3 pb-1 text-xs font-semibold uppercase text-slate-200">{section.title}</h3>
              <div className="space-y-1">
                {section.items.map(item => <NavItem key={item.id} to={item.to} icon={item.icon} onClick={closeDrawer}>{item.label}</NavItem>)}
              </div>
            </>
          )}
        </div>
      ))}
      <div className="px-2 pt-4">
        <Link to="/iso-assistant" onClick={closeDrawer} className={`flex items-center w-full px-4 py-2 text-left rounded-md transition-colors text-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-l-2 border-blue-500`}>
          <Bot className="h-4 w-4 mr-3" />
          <span>Asistente ISO</span>
          <Sparkles className="h-3 w-3 ml-auto" />
        </Link>
      </div>
    </nav>
  );

  return (
    <div className={`h-screen flex ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
      {/* Sidebar - Menú lateral desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-800 text-white flex-shrink-0">
        <div className="p-4 flex items-center space-x-3 border-b border-slate-700">
            <div className="rounded-full bg-white text-teal-800 w-10 h-10 flex items-center justify-center font-bold">
              SGC
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">Los Señores del Agro</div>
              <div className="text-xs opacity-80">Sistema de Gestión de Calidad</div>
            </div>
        </div>
        <div className="overflow-y-auto flex-grow">
          {renderMenuContent()}
        </div>
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-800 text-white">
            <button
              className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white"
              onClick={closeDrawer}
            >
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
