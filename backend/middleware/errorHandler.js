// backend/middleware/errorHandler.js

/**
 * Middleware de manejo de errores global.
 * Captura los errores y envía una respuesta JSON estandarizada.
 */
const errorHandler = (err, req, res, next) => {
  console.error('--------------------------------------------------');
  console.error('Ha ocurrido un error no controlado:');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Ruta:', req.path);
  console.error('Método:', req.method);
  console.error('Cuerpo de la petición:', req.body); // Cuidado con datos sensibles en producción
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('--------------------------------------------------');

  // Determinar el código de estado
  // Si el error tiene un statusCode, usarlo, de lo contrario, 500 por defecto.
  const statusCode = err.statusCode || 500;

  // Determinar el mensaje de error
  // Si es un error 500 y no queremos exponer detalles, enviamos un mensaje genérico.
  const message = statusCode === 500 && process.env.NODE_ENV === 'production' 
    ? 'Ocurrió un error interno en el servidor.' 
    : err.message || 'Ocurrió un error desconocido.';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Opcionalmente, en desarrollo, podríamos incluir el stack del error
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
