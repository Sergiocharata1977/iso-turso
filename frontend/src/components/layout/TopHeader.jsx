import React from 'react';
import ThemeToggle from "../theme/ThemeToggle";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function TopHeader({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-0 md:left-60 right-0 bg-white border-b border-slate-200 shadow-sm z-50 h-16">
      <div className="flex items-center justify-between w-full px-4 md:px-6 py-3">
        {/* Botón de menú hamburguesa para mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md hover:bg-slate-100 text-slate-600"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-bold text-lg text-slate-900">
            {user?.organization_name || "Los Señores del Agro"}
          </div>
        </div>
        
        {/* Buscador centrado */}
        <div className="hidden md:flex flex-1 justify-center max-w-md mx-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full px-4 py-2 rounded-md border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        {/* Menú de usuario y notificaciones a la derecha */}
        <div className="flex items-center gap-3">
          {/* Icono de notificaciones */}
          <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
            <Bell className="w-5 h-5" />
          </button>
          
          {/* Toggle de tema */}
          <ThemeToggle />
          
          {/* Avatar y popover de usuario */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block text-sm">
              <div className="font-medium text-slate-900">{user?.name || "Usuario"}</div>
              <div className="text-xs text-slate-500">{user?.role || "Usuario"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
