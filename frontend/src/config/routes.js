// Configuración centralizada de rutas
export const ROUTES = {
  // Rutas públicas
  WEB: {
    HOME: '/web',
    FEATURES: '/web/caracteristicas',
    CONTACT: '/web/contacto'
  },
  
  // Rutas de la aplicación
  APP: {
    // Autenticación
    LOGIN: '/app/login',
    REGISTER: '/app/register',
    
    // Dashboard y páginas principales
    DASHBOARD: '/app/tablero',
    CALENDAR: '/app/calendario',
    COMMUNICATIONS: '/app/comunicaciones',
    MEASUREMENTS: '/app/mediciones',
    CONFIGURATION: '/app/configuracion',
    
    // Planificación y Revisión
    PLANNING_DIRECTION: '/app/planificacion-revision',
    STRATEGIC_PLANNING: '/app/planificacion-estrategica',
    DIRECTION_REVIEW: '/app/revision-direccion',
    OBJECTIVES_GOALS: '/app/objetivos-metas',
    TREATMENTS: '/app/tratamientos',
    VERIFICATIONS: '/app/verificaciones',
    
    // Recursos Humanos
    DEPARTMENTS: '/app/departamentos',
    POSITIONS: '/app/puestos',
    PERSONNEL: '/app/personal',
    TRAININGS: '/app/capacitaciones',
    COMPETENCIES: '/app/competencias',
    EVALUATIONS: '/app/evalcompe-programacion',
    
    // Sistema de Gestión
    AUDITS: '/app/auditorias',
    PROCESSES: '/app/procesos',
    DOCUMENTS: '/app/documentos',
    STANDARDS: '/app/normas',
    QUALITY_OBJECTIVES: '/app/objetivos-calidad',
    INDICATORS: '/app/indicadores',
    PRODUCTS: '/app/productos',
    
    // Mejora
    FINDINGS: '/app/hallazgos',
    ACTIONS: '/app/acciones',
    
    // Otros
    TICKETS: '/app/tickets',
    SURVEYS: '/app/encuestas',
    USERS: '/app/usuarios',
    
    // Administración
    SUPER_ADMIN: '/app/admin/super',
    ORG_ADMIN: '/app/admin/organization',
    
    // Documentación
    DOCUMENTATION: '/app/documentacion',
    
    // Base de datos
    DATABASE_SCHEMA: '/app/database-schema',
    
    // Pruebas
    TEST: '/app/test-simple'
  }
};

// Función helper para construir rutas dinámicas
export const buildRoute = (baseRoute, params = {}) => {
  let route = baseRoute;
  Object.entries(params).forEach(([key, value]) => {
    route = route.replace(`:${key}`, value);
  });
  return route;
};

// Función helper para verificar si una ruta es pública
export const isPublicRoute = (pathname) => {
  return pathname.startsWith('/web') || 
         pathname === '/app/login' || 
         pathname === '/app/register';
};

// Función helper para obtener la ruta por defecto según autenticación
export const getDefaultRoute = (isAuthenticated) => {
  return isAuthenticated ? ROUTES.APP.DEPARTMENTS : ROUTES.WEB.HOME;
}; 