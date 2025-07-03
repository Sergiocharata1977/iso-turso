import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout y Protección
import MenuPrincipal from '@/components/menu/MenuPrincipal';
import ProtectedRoute from './ProtectedRoute';

// --- Componentes para las rutas (Lazy Loaded) ---

// Pages
const AccionesPage2 = lazy(() => import('@/pages/AccionesPage2'));
const AccionSinglePage = lazy(() => import('@/pages/AccionSinglePage'));
const HallazgosPage2 = lazy(() => import('@/pages/HallazgosPage2'));
const HallazgoSinglePage = lazy(() => import('@/pages/HallazgoSinglePage'));
const PlanificacionDireccionPage = lazy(() => import('@/pages/PlanificacionDireccionPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const ComunicacionesPage = lazy(() => import('@/pages/ComunicacionesPage'));
// const AccionesPage = lazy(() => import('@/pages/AccionesPage'));
// const HallazgosPage = lazy(() => import('@/pages/HallazgosPage'));

// Components
const DocumentosListing = lazy(() => import('@/components/documentos/DocumentosListing'));
const DocumentoSingle = lazy(() => import('@/components/documentos/DocumentoSingle'));
const AuditoriasListing = lazy(() => import('@/components/auditorias/AuditoriasListing'));
const DepartamentosListing = lazy(() => import('@/components/rrhh/DepartamentosListing'));
const PuestosListing = lazy(() => import('@/components/rrhh/PuestosListing'));
const PersonalListing = lazy(() => import('@/components/personal/PersonalListing'));
const PersonalSingle = lazy(() => import('@/components/personal/PersonalSingle'));
const CapacitacionesListing = lazy(() => import('@/components/rrhh/CapacitacionesListing'));
const EvaluacionesListing = lazy(() => import('@/components/rrhh/EvaluacionesListing'));
const ProcesosListing = lazy(() => import('@/components/procesos/ProcesosListing'));
const ProcesoSingle = lazy(() => import('@/components/procesos/ProcesoSingle'));
const NormasList = lazy(() => import('@/components/normas/NormasList'));
const NormaSingleView = lazy(() => import('@/components/normas/NormaSingleView'));
const ObjetivosListing = lazy(() => import('@/components/procesos/ObjetivosListing'));
const IndicadoresListing = lazy(() => import('@/components/procesos/IndicadoresListing'));
const IndicadorSingle = lazy(() => import('@/components/procesos/IndicadorSingle'));
const MedicionesListing = lazy(() => import('@/components/procesos/MedicionesListing'));
const ProductosListing = lazy(() => import('@/components/productos/ProductosListing'));
const TicketsListing = lazy(() => import('@/components/tickets/TicketsListing'));
const EncuestasListing = lazy(() => import('@/components/encuestas/EncuestasListing'));
const ResponderEncuesta = lazy(() => import('@/components/encuestas/ResponderEncuesta'));
const UsuariosPage = lazy(() => import('@/pages/UsuariosPage'));

// Componente de carga
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-slate-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
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

        {/* Rutas Protegidas */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <MenuPrincipal />
            </ProtectedRoute>
          }
        >
          {/* El index ahora es el tablero, que puede ser cualquier componente */}
          <Route path="tablero" element={<Navigate to="/normas" replace />} />
          <Route path="calendario" element={<CalendarPage />} />
          <Route path="comunicaciones" element={<ComunicacionesPage />} />
          
          {/* Mismas rutas de antes, pero ahora anidadas bajo la ruta protegida */}
          <Route path="acciones" element={<AccionesPage2 />} />
          <Route path="acciones/:id" element={<AccionSinglePage />} />
          <Route path="hallazgos" element={<HallazgosPage2 />} />
          <Route path="hallazgos/:id" element={<HallazgoSinglePage />} />
          <Route path="auditorias" element={<AuditoriasListing />} />
          <Route path="departamentos" element={<DepartamentosListing />} />
          <Route path="puestos" element={<PuestosListing />} />
          <Route path="personal" element={<PersonalListing />} />
          <Route path="personal/:id" element={<PersonalSingle />} />
          <Route path="capacitaciones" element={<CapacitacionesListing />} />
          <Route path="evaluaciones" element={<EvaluacionesListing />} />
          <Route path="procesos" element={<ProcesosListing />} />
          <Route path="procesos/:id" element={<ProcesoSingle />} />
          <Route path="documentos" element={<DocumentosListing />} />
          <Route path="documentos/:id" element={<DocumentoSingle />} />
          <Route path="planificacion-revision" element={<PlanificacionDireccionPage />} />
          <Route path="normas" element={<NormasList />} />
          <Route path="normas/:id" element={<NormaSingleView />} />
          <Route path="objetivos" element={<ObjetivosListing />} />
          <Route path="indicadores" element={<IndicadoresListing />} />
          <Route path="indicadores/:id" element={<IndicadorSingle />} />
          <Route path="indicadores/:id/mediciones" element={<MedicionesListing />} />
          <Route path="productos" element={<ProductosListing />} />
          <Route path="tickets" element={<TicketsListing />} />
          <Route path="encuestas" element={<EncuestasListing />} />
          <Route path="usuarios" element={<UsuariosPage />} />

          {/* Fallback para cualquier ruta no encontrada dentro del layout protegido */}
          <Route path="*" element={<Navigate to="/tablero" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
