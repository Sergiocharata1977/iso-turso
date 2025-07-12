import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './TopHeader';
import MenuPrincipal from '../menu/MenuPrincipal';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import useWindowSize from '@/hooks/useWindowSize';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const sidebarClass = cn(
    "fixed top-0 left-0 h-full z-40 bg-slate-800 transition-transform duration-300 ease-in-out",
    isSidebarOpen ? "translate-x-0" : "-translate-x-full",
    "w-64"
  );

  const mainContentClass = cn(
    "flex-1 flex flex-col transition-all duration-300 ease-in-out",
    { "md:ml-64": isSidebarOpen && !isMobile },
    { "ml-0": !isSidebarOpen || isMobile }
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className={sidebarClass}>
        <MenuPrincipal closeDrawer={isMobile ? () => setIsSidebarOpen(false) : undefined} isMobile={isMobile} />
      </aside>

      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      <div className={mainContentClass}>
        <TopHeader />
        
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {isMobile && (
         <Button
            onClick={toggleSidebar}
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg bg-background"
          >
            {isSidebarOpen ? <PanelLeftClose className="h-6 w-6" /> : <PanelLeftOpen className="h-6 w-6" />}
          </Button>
      )}
    </div>
  );
};

export default MainLayout; 