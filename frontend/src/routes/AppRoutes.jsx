import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute, { SuperAdminRoute } from "./ProtectedRoute";

// IMPORTACIÓN DIRECTA PARA DEPURACIÓN - TEMPORALMENTE DESHABILITADA
// import DocumentosListing from "../components/documentos/DocumentosListing";

// --- Componente de Carga ---
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-slate-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
  </div>
);

// --- Componentes Lazy Loaded ---

// Autenticación
const LoginPage = lazy(() => import("../pages/Registroylogeo/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Registroylogeo/RegisterPage"));

// Documentación
const DocumentacionLayout = lazy(() => import("../pages/Documentacion/DocumentacionLayout"));
const DocumentacionHome = lazy(() => import("../pages/Documentacion/DocumentacionHome"));
const CasosUsoPage = lazy(() => import("../pages/Documentacion/CasosUsoPage"));
const ManualUsuarioPage = lazy(() => import("../pages/Documentacion/funcional/ManualUsuarioPage"));
const SoportePage = lazy(() => import("../pages/Documentacion/funcional/SoportePage"));
const ArquitecturaPage = lazy(() => import("../pages/Documentacion/ArquitecturaPage"));
const BaseDatosPage = lazy(() => import("../pages/Documentacion/tecnica/BaseDatosPage"));
const DesarrolloPage = lazy(() => import("../pages/Documentacion/tecnica/DesarrolloPage"));
const AdministracionPage = lazy(() => import("../pages/Documentacion/tecnica/AdministracionPage"));
const ConfiguracionEntornos = lazy(() => import("../pages/Documentacion/ConfiguracionEntornos"));
const ApiDocsPage = lazy(() => import("../pages/Documentacion/ApiDocsPage"));
const GuiasPage = lazy(() => import("../pages/Documentacion/GuiasPage"));

// Páginas Principales (desde pages)
// const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage")); // COMENTADO PARA PRUEBAS
const CalendarPage = lazy(() => import("../pages/Calendar/CalendarPage"));
const ComunicacionesPage = lazy(() => import("../pages/ComunicacionesPage"));
const MedicionesPage = lazy(() => import("../pages/MedicionesPage"));
const ConfiguracionPage = lazy(() => import("../pages/ConfiguracionPage"));
const PlanificacionDireccionPage = lazy(() => import("../pages/PlanificacionDireccionPage"));
const PlanificacionEstrategicaPage = lazy(() => import("../pages/PlanificacionEstrategicaPage"));
const RevisionDireccionPage = lazy(() => import("../pages/RevisionDireccionPage"));
const ObjetivosMetasPage = lazy(() => import("../pages/ObjetivosMetasPage"));
const MinutasPage = lazy(() => import("../pages/MinutasPage"));
const TratamientosPage = lazy(() => import("../pages/TratamientosPage"));
const VerificacionesPage = lazy(() => import("../pages/VerificacionesPage"));

// Gestión de Usuarios (desde pages)
const UsersPage = lazy(() => import("../pages/UsersPage"));
const UsuariosSingle = lazy(() => import("../pages/UsuariosSingle"));

// Administración
const SuperAdminPage = lazy(() => import("../pages/Admin/SuperAdminPage"));
const OrganizationAdminPage = lazy(() => import("../pages/Admin/OrganizationAdminPage"));

// Componentes usados como páginas (desde components)
const DepartamentosPage = lazy(() => import("../components/departamentos/DepartamentosListing"));
const PuestosPage = lazy(() => import("../components/puestos/PuestosListing"));
const PersonalPage = lazy(() => import("../components/personal/PersonalListing"));
const PersonalSingle = lazy(() => import("../components/personal/PersonalSingle"));
const ProcesosPage = lazy(() => import("../components/procesos/ProcesosListing"));
const ProcesoSingle = lazy(() => import("../components/procesos/ProcesoSingle"));
const DocumentosPage = lazy(() => import("../components/documentos/DocumentosListing"));
const DocumentoSingle = lazy(() => import("../components/documentos/DocumentoSingle"));
const NormasPage = lazy(() => import("../components/normas/NormasList"));
const NormaSingleView = lazy(() => import("../components/normas/NormaSingleView"));
const ObjetivosCalidadPage = lazy(() => import("../components/procesos/ObjetivosListing"));
const IndicadoresPage = lazy(() => import("../components/procesos/IndicadoresListing"));
const IndicadorSingle = lazy(() => import("../components/procesos/IndicadorSingle"));
const CapacitacionesPage = lazy(() => import('../components/capacitaciones/CapacitacionesListing'));
const ProductosPage = lazy(() => import("../components/productos/ProductosListing"));
const EncuestasPage = lazy(() => import("../components/encuestas/EncuestasListing"));
const ResponderEncuesta = lazy(() => import("../components/encuestas/ResponderEncuesta"));
const TicketsPage = lazy(() => import("../components/tickets/TicketsListing"));
const AuditoriasPage = lazy(() => import("../pages/Auditorias/AuditoriasPage"));
const AuditoriaSinglePage = lazy(() => import("../pages/Auditorias/AuditoriaSinglePage"));
const AuditoriaFormPage = lazy(() => import("../pages/Auditorias/AuditoriaFormPage"));

// Páginas de Mejora
const HallazgosPage = lazy(() => import("../pages/Hallazgos/HallazgosPage2"));
const HallazgoSingle = lazy(() => import('../components/hallazgos/HallazgoSingle'));
const AccionesPage = lazy(() => import("../pages/Acciones/AccionesPage2"));
const AccionSingle = lazy(() => import('../components/acciones/AccionSingle'));

// Componente de prueba
const TestSimpleComponent = lazy(() => import("../components/TestSimpleComponent"));

// Planes y Suscripciones
const PlanesPage = lazy(() => import("../components/planes/PlanesListing"));

// Programaciones de Evaluación de Competencias (Temporalmente deshabilitado)
// const EvalcompeProgramacionListing = lazy(() => import('../components/competencias/EvalcompeProgramacionListing'));
// const EvalcompeProgramacionSingle = lazy(() => import('../components/competencias/EvalcompeProgramacionSingle'));

// Competencias
const CompetenciasListing = lazy(() => import('../pages/Competencias/CompetenciasListing'));
const CompetenciaSingle = lazy(() => import('../pages/Competencias/CompetenciaSingle'));
const SGCHierarchyPage = lazy(() => import('../components/sgc/SGCHierarchyView'));

// Evaluaciones de Competencias Individuales
const EvaluacionesDashboard = lazy(() => import('../pages/EvaluacionCompetencias/EvaluacionesDashboardSimple'));
const EvaluacionesIndividualesList = lazy(() => import('../pages/EvaluacionCompetencias/EvaluacionesIndividualesList'));
const EvaluacionesIndividualesPage = lazy(() => import('../pages/EvaluacionCompetencias/EvaluacionesIndividualesPage'));

// Evaluaciones de Programas (Temporalmente deshabilitado)
// const ProgramacionCompetenciasList = lazy(() => import('../pages/Evaluaciones-programas/ProgramacionCompetenciasList'));
// const ProgramacionCompetenciasModal = lazy(() => import('../pages/Evaluaciones-programas/ProgramacionCompetenciasModal'));


// Base de Datos y Esquemas
const DatabaseSchemaPage = lazy(() => import("../pages/DatabaseSchemaPage"));

// Política de Calidad
const PoliticaCalidadPage = lazy(() => import("../pages/PoliticaCalidadPage"));


const AppRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  console.log('🛣️ AppRoutes - Renderizando, isAuthenticated:', isAuthenticated);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/encuestas/responder/:id" element={<ResponderEncuesta />} />

        {/* Redirección en la raíz */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/documentacion" replace /> : <Navigate to="/login" replace />} />
        
        {/* Rutas Protegidas */}
        <Route 
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  {/* Dashboard - COMENTADO PARA PRUEBAS */}
                  {/* <Route path="tablero" element={<DashboardPage />} /> */}
                  
                  {/* Páginas principales */}
                  <Route path="calendario" element={<CalendarPage />} />
                  <Route path="comunicaciones" element={<ComunicacionesPage />} />
                  <Route path="mediciones" element={<MedicionesPage />} />
                  <Route path="configuracion" element={<ConfiguracionPage />} />
                  <Route path="planificacion-revision" element={<PlanificacionDireccionPage />} />
                  <Route path="tratamientos" element={<TratamientosPage />} />
                  <Route path="verificaciones" element={<VerificacionesPage />} />
                  
                  {/* Planificación y Revisión */}
                  <Route path="planificacion-estrategica" element={<PlanificacionEstrategicaPage />} />
                  <Route path="revision-direccion" element={<RevisionDireccionPage />} />
                  <Route path="objetivos-metas" element={<ObjetivosMetasPage />} />
                  <Route path="minutas" element={<MinutasPage />} />
                  
                  {/* Recursos Humanos */}
                  <Route path="departamentos" element={<DepartamentosPage />} />
                  <Route path="puestos" element={<PuestosPage />} />
                  <Route path="personal/:id" element={<PersonalSingle />} />
                  <Route path="personal" element={<PersonalPage />} />
                  <Route path="capacitaciones" element={<CapacitacionesPage />} />
                  
                  {/* Sistema de Gestión */}
                  <Route path="auditorias" element={<AuditoriasPage />} />
                  <Route path="auditorias/nueva" element={<AuditoriaFormPage />} />
                  <Route path="auditorias/:id" element={<AuditoriaSinglePage />} />
                  <Route path="auditorias/:id/editar" element={<AuditoriaFormPage />} />
                  <Route path="procesos" element={<ProcesosPage />} />
                  <Route path="procesos/:id" element={<ProcesoSingle />} />
                  <Route path="politica-calidad" element={<PoliticaCalidadPage />} />
                  <Route path="documentos" element={<DocumentosPage />} />
                  <Route path="documentos/:id" element={<DocumentoSingle />} />
                  <Route path="normas" element={<NormasPage />} />
                  <Route path="normas/:id" element={<NormaSingleView />} />
                  <Route path="objetivos-calidad" element={<ObjetivosCalidadPage />} />
                  <Route path="indicadores" element={<IndicadoresPage />} />
                  <Route path="indicadores/:id" element={<IndicadorSingle />} />
                  
                  {/* Mejora */}
                  <Route path="hallazgos" element={<HallazgosPage />} />
                  <Route path="hallazgos/:id" element={<HallazgoSingle />} />
                  <Route path="acciones" element={<AccionesPage />} />
                  <Route path="acciones/:id" element={<AccionSingle />} />
                  
                  {/* Otros */}
                  <Route path="productos" element={<ProductosPage />} />
                  <Route path="tickets" element={<TicketsPage />} />
                  <Route path="encuestas" element={<EncuestasPage />} />
                  {/* Rutas de Evaluación de Competencias (Temporalmente deshabilitado) */}
                  {/* <Route path="evalcompe-programacion" element={<EvalcompeProgramacionListing />} /> */}
                  {/* <Route path="evalcompe-programacion/:id" element={<EvalcompeProgramacionSingle />} /> */}
                  <Route path="competencias" element={<CompetenciasListing />} />
                  <Route path="competencias/:id" element={<CompetenciaSingle />} />
                  
                  {/* Evaluaciones de Competencias Individuales */}
                  <Route path="evaluaciones-individuales" element={<EvaluacionesIndividualesPage />} />
                  <Route path="evaluaciones-individuales-list" element={<EvaluacionesIndividualesList />} />
                  <Route path="evaluaciones-dashboard" element={<EvaluacionesDashboard />} />
                  
                  {/* Evaluaciones de Programas (Temporalmente deshabilitado) */}
                  {/* <Route path="evaluacion-competencias" element={<ProgramacionCompetenciasList />} /> */}
                  {/* <Route path="evaluacion-competencias-modal" element={<ProgramacionCompetenciasModal />} /> */}
                  
                  {/* Administración */}
                  <Route path="usuarios" element={<UsersPage />} />
                  <Route path="usuarios-single" element={<UsuariosSingle />} />
                  <Route path="admin/super" element={<SuperAdminPage />} />
                  <Route path="admin/organization" element={<OrganizationAdminPage />} />

                  {/* Documentación */}
                  <Route path="documentacion" element={<DocumentacionLayout />}>
                    <Route index element={<DocumentacionHome />} />
                    <Route path="casos-uso" element={<CasosUsoPage />} />
                    <Route path="manual-usuario" element={<ManualUsuarioPage />} />
                    <Route path="soporte" element={<SoportePage />} />
                    <Route path="arquitectura" element={
                      <SuperAdminRoute>
                        <ArquitecturaPage />
                      </SuperAdminRoute>
                    } />
                    <Route path="base-datos" element={
                      <SuperAdminRoute>
                        <BaseDatosPage />
                      </SuperAdminRoute>
                    } />
                    <Route path="desarrollo" element={
                      <SuperAdminRoute>
                        <DesarrolloPage />
                      </SuperAdminRoute>
                    } />
                    <Route path="administracion" element={
                      <SuperAdminRoute>
                        <AdministracionPage />
                      </SuperAdminRoute>
                    } />
                    <Route path="configuracion-entornos" element={
                      <SuperAdminRoute>
                        <ConfiguracionEntornos />
                      </SuperAdminRoute>
                    } />
                    <Route path="api" element={
                      <SuperAdminRoute>
                        <ApiDocsPage />
                      </SuperAdminRoute>
                    } />
                    <Route path="guias" element={
                      <SuperAdminRoute>
                        <GuiasPage />
                      </SuperAdminRoute>
                    } />
                  </Route>

                  {/* Base de Datos y Esquemas */}
                  <Route path="database-schema" element={
                    <SuperAdminRoute>
                      <DatabaseSchemaPage />
                    </SuperAdminRoute>
                  } />

                  {/* Prueba de renderizado */}
                  <Route path="test-simple" element={<TestSimpleComponent />} />

                  {/* Planes y Suscripciones */}
                  <Route path="planes" element={<PlanesPage />} />

                  {/* Jerarquía SGC */}
                  <Route path="sgc-hierarchy" element={<SGCHierarchyPage />} />

                  {/* Redirección por defecto dentro del layout */}
                  <Route path="/" element={<Navigate to="/personal" replace />} />
                  <Route path="*" element={<Navigate to="/personal" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
