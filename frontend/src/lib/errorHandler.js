/**
 * Sistema de manejo de errores centralizado
 * Proporciona funciones estandarizadas para manejar errores en toda la aplicación
 */

// Tipos de errores comunes
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  VALIDATION: 'VALIDATION',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
};

// Mapeo de códigos de estado HTTP a tipos de error
const HTTP_STATUS_TO_ERROR_TYPE = {
  400: ERROR_TYPES.VALIDATION,
  401: ERROR_TYPES.AUTHENTICATION,
  403: ERROR_TYPES.AUTHORIZATION,
  404: ERROR_TYPES.VALIDATION,
  422: ERROR_TYPES.VALIDATION,
  500: ERROR_TYPES.SERVER,
  502: ERROR_TYPES.NETWORK,
  503: ERROR_TYPES.SERVER,
  504: ERROR_TYPES.NETWORK
};

/**
 * Clasifica un error basado en su tipo
 * @param {Error} error - El error a clasificar
 * @returns {string} El tipo de error
 */
export function classifyError(error) {
  // Si es un error de axios con respuesta
  if (error.response) {
    const status = error.response.status;
    return HTTP_STATUS_TO_ERROR_TYPE[status] || ERROR_TYPES.SERVER;
  }
  
  // Si es un error de red
  if (error.request) {
    return ERROR_TYPES.NETWORK;
  }
  
  // Si es un error de timeout
  if (error.code === 'ECONNABORTED') {
    return ERROR_TYPES.NETWORK;
  }
  
  return ERROR_TYPES.UNKNOWN;
}

/**
 * Extrae el mensaje de error de manera consistente
 * @param {Error} error - El error del cual extraer el mensaje
 * @returns {string} El mensaje de error
 */
export function extractErrorMessage(error) {
  // Si es un error de axios con respuesta
  if (error.response?.data) {
    return error.response.data.message || 
           error.response.data.error || 
           error.response.data.detail ||
           'Error en el servidor';
  }
  
  // Si es un error de red
  if (error.request) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
  }
  
  // Si es un error de timeout
  if (error.code === 'ECONNABORTED') {
    return 'La petición ha expirado. Por favor, inténtalo de nuevo.';
  }
  
  // Si es un error personalizado
  if (error.message) {
    return error.message;
  }
  
  return 'Ha ocurrido un error inesperado.';
}

/**
 * Obtiene el título del error basado en su tipo
 * @param {string} errorType - El tipo de error
 * @returns {string} El título del error
 */
export function getErrorTitle(errorType) {
  const titles = {
    [ERROR_TYPES.NETWORK]: 'Error de Conexión',
    [ERROR_TYPES.AUTHENTICATION]: 'Error de Autenticación',
    [ERROR_TYPES.AUTHORIZATION]: 'Error de Autorización',
    [ERROR_TYPES.VALIDATION]: 'Error de Validación',
    [ERROR_TYPES.SERVER]: 'Error del Servidor',
    [ERROR_TYPES.UNKNOWN]: 'Error Inesperado'
  };
  
  return titles[errorType] || titles[ERROR_TYPES.UNKNOWN];
}

/**
 * Maneja un error de manera centralizada
 * @param {Error} error - El error a manejar
 * @param {Function} toast - Función de toast para mostrar notificaciones
 * @param {Object} options - Opciones adicionales
 * @returns {Object} Información del error procesado
 */
export function handleError(error, toast, options = {}) {
  const errorType = classifyError(error);
  const message = extractErrorMessage(error);
  const title = getErrorTitle(errorType);
  
  // Log del error para debugging
  console.error(`[${errorType}] ${title}:`, error);
  
  // Mostrar toast si se proporciona la función
  if (toast && !options.silent) {
    toast({
      title,
      description: message,
      variant: "destructive",
      duration: options.duration || 5000
    });
  }
  
  // Retornar información del error para uso adicional
  return {
    type: errorType,
    title,
    message,
    originalError: error
  };
}

/**
 * Wrapper para funciones async que maneja errores automáticamente
 * @param {Function} asyncFn - La función async a ejecutar
 * @param {Function} toast - Función de toast
 * @param {Object} options - Opciones adicionales
 * @returns {Function} Función envuelta que maneja errores
 */
export function withErrorHandling(asyncFn, toast, options = {}) {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      return handleError(error, toast, options);
    }
  };
}

/**
 * Hook personalizado para manejo de errores en componentes
 * @param {Function} toast - Función de toast del componente
 * @returns {Object} Funciones de manejo de errores
 */
export function useErrorHandler(toast) {
  return {
    handleError: (error, options = {}) => handleError(error, toast, options),
    withErrorHandling: (asyncFn, options = {}) => withErrorHandling(asyncFn, toast, options)
  };
} 