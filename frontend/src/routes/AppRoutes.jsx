import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout Principal
import MenuPrincipal from '@/components/menu/MenuPrincipal';

// --- Componentes para las rutas (Lazy Loaded) ---
const DocumentosListing = lazy(() => import('@/components/documentos/DocumentosListing'));
const DocumentoSingle = lazy(() => import('@/components/documentos/DocumentoSingle'));
// Módulo de Mejoras (Nuevos componentes)
const DeteccionHallazgo = lazy(() => import('@/components/mejoras/DeteccionHallazgo'));
const HallazgoDetail = lazy(() => import('@/components/mejoras/HallazgoDetail'));
const TratamientoHallazgo = lazy(() => import('@/components/mejoras/TratamientoHallazgo'));
const VerificacionEficacia = lazy(() => import('@/components/mejoras/VerificacionEficacia'));
const MejorasPage = lazy(() => import('@/pages/MejorasPage'));
const AuditoriasListing = lazy(() => import('@/components/auditorias/AuditoriasListing'));
const DepartamentosListing = lazy(() => import('@/components/rrhh/DepartamentosListing'));
const PuestosListing = lazy(() => import('@/components/rrhh/PuestosListing'));
const PersonalListing = lazy(() => import('@/components/personal/PersonalListing'));
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

// Componente de carga
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-slate-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<MenuPrincipal />}>
          {/* Ruta por defecto, redirige a normas */}
          <Route index element={<Navigate to="/normas" replace />} />

          {/* Rutas del Menú */}
          {/* Módulo de Mejoras */}
          <Route path="mejoras/deteccion" element={<DeteccionHallazgo />} />
          <Route path="mejoras/hallazgos/:id" element={<HallazgoDetail />} />
          <Route path="mejoras/tratamiento" element={<TratamientoHallazgo />} />
                    <Route path="mejoras/verificacion" element={<VerificacionEficacia />} />
          <Route path="mejoras/board" element={<MejorasPage />} />
          <Route path="mejoras" element={<MejorasPage />} />
          <Route path="auditorias" element={<AuditoriasListing />} />
          
          {/* RRHH */}
          <Route path="departamentos" element={<DepartamentosListing />} />
          <Route path="puestos" element={<PuestosListing />} />
          <Route path="personal" element={<PersonalListing />} />
          <Route path="capacitaciones" element={<CapacitacionesListing />} />
          <Route path="evaluaciones" element={<EvaluacionesListing />} />

          {/* Sistema de Gestión */}
          <Route path="procesos" element={<ProcesosListing />} />
          <Route path="procesos/:id" element={<ProcesoSingle />} />
          <Route path="documentos" element={<DocumentosListing />} />
          <Route path="documentos/:id" element={<DocumentoSingle />} />
          <Route path="normas" element={<NormasList />} />
          <Route path="normas/:id" element={<NormaSingleView />} />
          <Route path="objetivos" element={<ObjetivosListing />} />
                    <Route path="indicadores" element={<IndicadoresListing />} />
          <Route path="indicadores/:id" element={<IndicadorSingle />} />
          <Route path="indicadores/:id/mediciones" element={<MedicionesListing />} />

          {/* Otros */}
          <Route path="productos" element={<ProductosListing />} />
          <Route path="tickets" element={<TicketsListing />} />
          <Route path="encuestas" element={<EncuestasListing />} />

          {/* Ruta para cualquier otra URL no encontrada dentro del layout */}
          <Route path="*" element={<Navigate to="/normas" replace />} />
        </Route>

        {/* Rutas sin el layout principal */}
        <Route path="/encuestas/responder/:id" element={<ResponderEncuesta />} />

      </Routes>
    </Suspense>
  );
}
