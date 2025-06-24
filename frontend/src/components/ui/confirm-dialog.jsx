import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from './button';

/**
 * Componente de diálogo de confirmación con estilo Navy/Teal
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Controla si el diálogo está abierto
 * @param {Function} props.onClose - Función para cerrar el diálogo
 * @param {Function} props.onConfirm - Función a ejecutar cuando se confirma la acción
 * @param {string} props.title - Título del diálogo
 * @param {string} props.message - Mensaje de confirmación
 * @param {string} props.confirmText - Texto del botón de confirmación
 * @param {string} props.cancelText - Texto del botón de cancelación
 * @param {boolean} props.isDestructive - Si la acción es destructiva (rojo)
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro que deseas realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${isDestructive ? 'text-red-500' : 'text-amber-500'}`} />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-slate-300">{message}</p>
        </div>
        
        <DialogFooter className="flex justify-end gap-3 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
          >
            {cancelText}
          </Button>
          <Button 
            type="button" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={isDestructive 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-teal-600 hover:bg-teal-700 text-white"
            }
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
