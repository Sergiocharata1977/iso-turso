import React from 'react';
import ThemeToggle from "../theme/ThemeToggle";

export default function TopHeader() {
  return (
    <div className="fixed top-0 left-0 md:left-64 right-0 bg-green-600/10 backdrop-blur-sm z-50 border-b h-12 border-slate-700">
      <div className="flex justify-between items-center px-2 sm:px-4 py-1 sm:py-2 min-h-[48px]">
        {/* Contenedor vacío para mantener el espacio a la izquierda si es necesario */}
        <div></div>
        
        {/* ThemeToggle a la derecha */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
