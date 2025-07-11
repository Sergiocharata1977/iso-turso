import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// --- Componentes para las rutas (Lazy Loaded) ---

// Pages principales
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const CalendarPage = lazy(() => import('../pages/Calendar/CalendarPage'));
const ComunicacionesPage = lazy(() => import('../pages/ComunicacionesPage'));
const MedicionesPage = lazy(() => import('../pages/MedicionesPage'));
const ConfiguracionPage = lazy(() => import('../pages/ConfiguracionPage'));
const TratamientosPage = lazy(() => import('../pages/TratamientosPage'));
const VerificacionesPage = lazy(() => import('../pages/VerificacionesPage'));

// Pages existentes
const AccionesPage2 = lazy(() => import('../pages/Acciones/AccionesPage2'));
const AccionSingle = lazy(() => import('../components/acciones/AccionSingle'));
const HallazgosPage2 = lazy(() => import('../pages/Hallazgos/HallazgosPage2'));
const HallazgoSingle = lazy(() => import('../components/hallazgos/HallazgoSingle'));
const PlanificacionDireccionPage = lazy(() => import('../pages/PlanificacionDireccionPage'));
const LoginPage = lazy(() => import('../pages/Registroylogeo/LoginPage'));
const RegisterPage = lazy(() => import('../pages/Registroylogeo/RegisterPage'));
const UsersPage = lazy(() => import('../pages/UsersPage'));
const UsuariosSingle = lazy(() => import('../pages/UsuariosSingle'));

// Components (para usar como páginas)
const DocumentosListing = lazy(() => import('../components/documentos/DocumentosListing'));
const DocumentoSingle = lazy(() => import('../components/documentos/DocumentoSingle'));
const AuditoriasListing = lazy(() => import('../components/auditorias/AuditoriasListing'));
const DepartamentosListing = lazy(() => import('../components/departamentos/DepartamentosListing'));
const PuestosListing = lazy(() => import('../components/puestos/PuestosListing'));
const PersonalListing = lazy(() => import('../components/personal/PersonalListing'));
const PersonalSingle = lazy(() => import('../components/personal/PersonalSingle'));
const CapacitacionesListing = lazy(() => import('../components/capacitaciones/CapacitacionesListing'));
const EvaluacionesListing = lazy(() => import('../components/Evaluacionesdepersonal/EvaluacionesListing'));
const ProcesosListing = lazy(() => import('../components/procesos/ProcesosListing'));
const ProcesoSingle = lazy(() => import('../components/procesos/ProcesoSingle'));
const NormasList = lazy(() => import('../components/normas/NormasList'));
const NormaSingleView = lazy(() => import('../components/normas/NormaSingleView'));
const ObjetivosListing = lazy(() => import('../components/procesos/ObjetivosListing'));
const IndicadoresListing = lazy(() => import('../components/procesos/IndicadoresListing'));
const IndicadorSingle = lazy(() => import('../components/procesos/IndicadorSingle'));
const ProductosListing = lazy(() => import('../components/productos/ProductosListing'));
const TicketsListing = lazy(() => import('../components/tickets/TicketsListing'));
const EncuestasListing = lazy(() => import('../components/encuestas/EncuestasListing'));
const ResponderEncuesta = lazy(() => import('../components/encuestas/ResponderEncuesta'));
const TestComponent = lazy(() => import('../components/TestComponent'));
const TicketsTareasPage = lazy(() => import('../pages/TicketsTareasPage'));

// Componente de carga
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
  </div>
);

const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingFallback />;
  return isAuthenticated ? <Navigate to="/tablero" replace /> : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/encuestas/responder/:id" element={<ResponderEncuesta />} />

        {/* Redirección en la raíz */}
        <Route path="/" element={<RootRedirect />} />

        {/* Rutas Protegidas con Layout */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Páginas principales */}
          <Route path="tablero" element={<DashboardPage />} />
          <Route path="calendario" element={<CalendarPage />} />
          <Route path="comunicaciones" element={<ComunicacionesPage />} />
          <Route path="mediciones" element={<MedicionesPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
          <Route path="tratamientos" element={<TratamientosPage />} />
          <Route path="verificaciones" element={<VerificacionesPage />} />

          {/* Recursos Humanos */}
          <Route path="departamentos" element={<DepartamentosListing />} />
          <Route path="puestos" element={<PuestosListing />} />
          <Route path="personal" element={<PersonalListing />} />
          <Route path="personal/:id" element={<PersonalSingle />} />
          <Route path="capacitaciones" element={<CapacitacionesListing />} />
          <Route path="evaluaciones" element={<EvaluacionesListing />} />

          {/* Gestión de Calidad */}
          <Route path="auditorias" element={<AuditoriasListing />} />
          <Route path="procesos" element={<ProcesosListing />} />
          <Route path="procesos/:id" element={<ProcesoSingle />} />
          <Route path="documentos" element={<DocumentosListing />} />
          <Route path="documentos/:id" element={<DocumentoSingle />} />
          <Route path="normas" element={<NormasList />} />
          <Route path="normas/:id" element={<NormaSingleView />} />

          {/* Planificación y Mejora */}
          <Route path="objetivos" element={<ObjetivosListing />} />
          <Route path="indicadores" element={<IndicadoresListing />} />
          <Route path="indicadores/:id" element={<IndicadorSingle />} />
          <Route path="acciones" element={<AccionesPage2 />} />
          <Route path="acciones/:id" element={<AccionSingle />} />
          <Route path="hallazgos" element={<HallazgosPage2 />} />
          <Route path="hallazgos/:id" element={<HallazgoSingle />} />

          {/* Otros módulos */}
          <Route path="productos" element={<ProductosListing />} />
          <Route path="tickets" element={<TicketsListing />} />
          <Route path="encuestas" element={<EncuestasListing />} />
          
          {/* Mejoras y QA */}
          <Route path="tickets-tareas" element={<TicketsTareasPage />} />

          {/* Administración */}
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="usuarios-single" element={<UsuariosSingle />} />

          {/* Páginas adicionales */}
          <Route path="planificacion-revision" element={<PlanificacionDireccionPage />} />
          <Route path="test" element={<TestComponent />} />

          {/* Fallback para cualquier ruta no encontrada */}
          <Route path="*" element={<Navigate to="/tablero" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
