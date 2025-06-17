import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

/**
 * Componente para manejar errores de API de manera consistente
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del error
 * @param {string} props.message - Mensaje de error
 * @param {Function} props.onRetry - Función a ejecutar al hacer clic en reintentar
 * @param {boolean} props.isLoading - Indica si está cargando durante el reintento
 * @returns {JSX.Element} Componente de error
 */
const ApiErrorHandler = ({ 
  title = "Error de conexión", 
  message = "No se pudo conectar con el servidor. Por favor, verifica que el backend esté en ejecución.", 
  onRetry,
  isLoading = false
}) => {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      
      {onRetry && (
        <Button 
          onClick={onRetry} 
          disabled={isLoading}
          variant="outline"
          className="mt-2"
        >
          {isLoading ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Cargando...
            </>
          ) : (
            'Reintentar'
          )}
        </Button>
      )}
    </div>
  );
};

export default ApiErrorHandler;
