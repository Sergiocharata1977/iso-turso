import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const Modal = React.memo(({ isOpen, onClose, title, children, size = 'md' }) => {
  // Prevenir scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Memoizar el handler de cierre
  const handleClose = useCallback((e) => {
    e.stopPropagation();
    onClose();
  }, [onClose]);

  // Memoizar el handler de click en backdrop
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);
  
  if (!isOpen) return null;
  
  // Determinar el ancho del modal según el tamaño
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };
  
  const modalSize = sizeClasses[size] || sizeClasses.md;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full ${modalSize} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white focus:outline-none transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;
