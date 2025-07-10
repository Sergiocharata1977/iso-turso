# 📁 ESTRUCTURA ESTÁNDAR DE ARCHIVOS - ISOFlow3

**Fecha:** 25 de Diciembre de 2024  
**Versión:** 1.1  
**Estado:** ✅ Implementado y Limpiado

## 🎯 PRINCIPIOS DE ORGANIZACIÓN

### **Regla Principal: Todo por Módulos**
- Cada módulo de negocio tiene su propia carpeta en `/components/`
- Todos los archivos relacionados van en la misma carpeta
- No mezclar pages y components para la misma funcionalidad

### **Nomenclatura Estándar**
```
[Modulo]Listing.jsx     # Lista principal con grid/tabla
[Modulo]Single.jsx      # Vista detallada individual
[Modulo]Card.jsx        # Tarjeta para mostrar en grids
[Modulo]Modal.jsx       # Modal de creación/edición
[Modulo]TableView.jsx   # Vista específica de tabla
```

## 📂 ESTRUCTURA COMPLETA

### **Components por Módulo**
```
frontend/src/components/
├── personal/
│   ├── PersonalListing.jsx      # ✅ Lista principal
│   ├── PersonalSingle.jsx       # ✅ Vista detallada
│   ├── PersonalCard.jsx         # ✅ Tarjeta individual
│   ├── PersonalModal.jsx        # ✅ Modal CRUD
│   ├── PersonalTableView.jsx    # ✅ Vista tabla
│   └── forms/                   # ✅ Formularios específicos
│       ├── FormacionModal.jsx
│       ├── ExperienciaModal.jsx
│       └── HabilidadesModal.jsx
│
├── hallazgos/
│   ├── HallazgosListing.jsx     # 🔄 Usar HallazgosPage2 temporalmente
│   ├── HallazgoSingle.jsx       # ✅ Migrado desde pages/
│   ├── HallazgoCard.jsx         # ✅ Existente
│   ├── HallazgoModal.jsx        # ✅ Existente
│   └── forms/                   # ✅ Formularios específicos
│       ├── FormAnalisisAccion.jsx
│       ├── FormEjecucionAI.jsx
│       └── FormPlanificacionAI.jsx
│
├── acciones/
│   ├── AccionesListing.jsx      # 🔄 Usar AccionesPage2 temporalmente
│   ├── AccionSingle.jsx         # ✅ Migrado desde pages/
│   ├── AccionCard.jsx           # ✅ Existente
│   ├── AccionModal.jsx          # ✅ Existente
│   └── forms/                   # ✅ Formularios específicos
│       ├── EjecucionAccionForm.jsx
│       ├── PlanificacionAccionForm.jsx
│       └── VerificacionAccionForm.jsx
│
├── procesos/
│   ├── ProcesosListing.jsx      # ✅ Existente
│   ├── ProcesoSingle.jsx        # ✅ Existente
│   ├── IndicadoresListing.jsx   # ✅ Existente
│   ├── IndicadorSingle.jsx      # ✅ Existente
│   └── ObjetivosListing.jsx     # ✅ Existente
│
├── documentos/
│   ├── DocumentosListing.jsx    # ✅ Existente
│   ├── DocumentoSingle.jsx      # ✅ Existente
│   └── DocumentoModal.jsx       # ✅ Existente
│
├── normas/
│   ├── NormasList.jsx           # ✅ Existente
│   ├── NormaSingleView.jsx      # ✅ Existente
│   └── NormaSingle.jsx          # ✅ Existente
│
├── auditorias/
│   ├── AuditoriasListing.jsx    # ✅ Existente
│   ├── AuditoriaModal.jsx       # ✅ Existente
│   └── AuditoriaSingle.jsx      # ✅ Existente
│
├── capacitaciones/
│   ├── CapacitacionesListing.jsx # ✅ Existente
│   ├── CapacitacionSingle.jsx    # ✅ Existente
│   └── CapacitacionModal.jsx     # ✅ Existente
│
├── departamentos/
│   ├── DepartamentosListing.jsx  # ✅ Existente
│   ├── DepartamentoModal.jsx     # ✅ Existente
│   └── DepartamentoSingle.jsx    # ✅ Existente
│
├── puestos/
│   ├── PuestosListing.jsx        # ✅ Existente
│   ├── PuestoModal.jsx           # ✅ Existente
│   ├── PuestoCard.jsx            # ✅ Existente
│   └── PuestoSingle.jsx          # ✅ Existente
│
├── productos/
│   ├── ProductosListing.jsx      # ✅ Existente
│   ├── ProductoModal.jsx         # ✅ Existente
│   └── ProductoSingle.jsx        # ✅ Existente
│
├── tickets/
│   ├── TicketsListing.jsx        # ✅ Existente
│   ├── TicketModal.jsx           # ✅ Existente
│   └── TicketSingle.jsx          # ✅ Existente
│
├── encuestas/
│   ├── EncuestasListing.jsx      # ✅ Existente
│   ├── EncuestaModal.jsx         # ✅ Existente
│   └── ResponderEncuesta.jsx     # ✅ Existente
│
└── Evaluacionesdepersonal/
    ├── EvaluacionesListing.jsx   # ✅ Existente
    ├── EvaluacionGrupalModal.jsx # ✅ Existente
    └── EvaluacionGrupalSingle.jsx # ✅ Existente
```

### **Pages solo para páginas principales**
```
frontend/src/pages/
├── Dashboard/
│   └── DashboardPage.jsx         # ✅ Dashboard principal
├── Calendar/
│   └── CalendarPage.jsx          # ✅ Calendario
├── Registroylogeo/
│   ├── LoginPage.jsx             # ✅ Login
│   └── RegisterPage.jsx          # ✅ Registro
├── Acciones/
│   └── AccionesPage2.jsx         # 🔄 Temporal hasta migrar
├── Hallazgos/
│   └── HallazgosPage2.jsx        # 🔄 Temporal hasta migrar
├── ConfiguracionPage.jsx         # ✅ Configuración
├── MedicionesPage.jsx            # ✅ Mediciones
├── TratamientosPage.jsx          # ✅ Tratamientos
├── VerificacionesPage.jsx        # ✅ Verificaciones
├── ComunicacionesPage.jsx        # ✅ Comunicaciones
├── UsersPage.jsx                 # ✅ Gestión usuarios
├── UsuariosSingle.jsx            # ✅ Vista usuario
├── PlanificacionDireccionPage.jsx # ✅ Planificación
├── TicketsTareasPage.jsx         # ✅ Tickets y tareas
├── UserManagementPage.jsx        # ⚠️ Revisar si es duplicado
└── NormasPage.jsx                # ⚠️ Revisar si migrar
```

## 🔄 RUTAS CORREGIDAS

### **Rutas Actualizadas**
```jsx
// AppRoutes.jsx - CORREGIDO
import LoginPage from '../pages/Registroylogeo/LoginPage';
import RegisterPage from '../pages/Registroylogeo/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import CalendarPage from '../pages/Calendar/CalendarPage';
import AccionesPage2 from '../pages/Acciones/AccionesPage2';
import HallazgosPage2 from '../pages/Hallazgos/HallazgosPage2';

// Singles desde components
import PersonalSingle from '../components/personal/PersonalSingle';
import AccionSingle from '../components/acciones/AccionSingle';
import HallazgoSingle from '../components/hallazgos/HallazgoSingle';
```

## 📋 ESTADO DE MIGRACIÓN

### **✅ Completado**
- [x] **Singles migrados**: Personal, Acciones, Hallazgos
- [x] **Rutas corregidas**: Todas las rutas apuntan a archivos existentes
- [x] **Archivos eliminados**: PersonalSinglePage.jsx, AccionSinglePage.jsx, HallazgoSinglePage.jsx
- [x] **Imports corregidos**: NoticiasPage eliminado, rutas de carpetas corregidas
- [x] **Estructura limpia**: Pages organizadas en subcarpetas lógicas

### **🔄 En Progreso**
- [ ] **AccionesPage2**: Migrar a /components/acciones/AccionesListing.jsx
- [ ] **HallazgosPage2**: Migrar a /components/hallazgos/HallazgosListing.jsx
- [ ] **Formularios**: Organizar en subcarpetas /forms/

### **⚠️ Pendiente Revisión**
- [ ] **UserManagementPage.jsx**: Verificar si es duplicado de UsersPage.jsx
- [ ] **NormasPage.jsx**: Evaluar si migrar a components (ya existe NormasList.jsx)
- [ ] **UsuariosSingle.jsx**: Evaluar si mover a components/usuarios/

## 🎯 PRÓXIMOS PASOS

### **Fase 1: Migración de Listings Restantes**
1. Mover AccionesPage2.jsx → /components/acciones/AccionesListing.jsx
2. Mover HallazgosPage2.jsx → /components/hallazgos/HallazgosListing.jsx
3. Actualizar rutas en AppRoutes.jsx
4. Eliminar archivos obsoletos

### **Fase 2: Limpieza Final**
1. Revisar archivos duplicados (UserManagementPage vs UsersPage)
2. Evaluar UsuariosSingle.jsx para mover a components
3. Verificar NormasPage.jsx vs NormasList.jsx
4. Limpiar imports no utilizados

### **Fase 3: Organización de Formularios**
1. Crear subcarpetas /forms/ donde sea necesario
2. Mover formularios específicos a sus módulos
3. Actualizar imports

## 🚨 ERRORES CORREGIDOS

### **✅ Resueltos**
- ❌ **NoticiasPage no existe**: Eliminado import y ruta
- ❌ **Rutas incorrectas**: Corregidas para usar subcarpetas
- ❌ **Singles en pages**: Migrados a components
- ❌ **Imports rotos**: Actualizados todos los paths

### **Comandos de Verificación**
```bash
# Verificar que no hay imports rotos
grep -r "import.*pages" frontend/src/routes/

# Verificar Singles en components
find frontend/src/components -name "*Single.jsx" | sort

# Verificar estructura de pages
find frontend/src/pages -name "*.jsx" | sort
```

## 🔧 HERRAMIENTAS Y RECURSOS

### **Documentación Actualizada**
- ✅ `ESTRUCTURA_ARCHIVOS.md` - Esta guía (actualizada)
- ✅ `PROXIMOS_PASOS.md` - Roadmap de próximas mejoras
- ✅ `estadoactual.md` - Estado general del proyecto

### **Estructura de Carpetas Registroylogeo**
```
frontend/src/pages/Registroylogeo/
├── LoginPage.jsx        # ✅ Página de login
└── RegisterPage.jsx     # ✅ Página de registro
```

## 🎉 LOGROS ALCANZADOS

### **Antes de la Limpieza**
- ❌ Error NoticiasPage no encontrado
- ❌ Rutas apuntando a archivos inexistentes
- ❌ Singles mezclados entre pages y components
- ❌ Imports rotos y archivos obsoletos

### **Después de la Limpieza**
- ✅ Todas las rutas funcionan correctamente
- ✅ Estructura consistente y organizada
- ✅ Singles todos en components
- ✅ Pages organizadas en subcarpetas lógicas
- ✅ Imports corregidos y actualizados
- ✅ Archivos obsoletos eliminados

---

**Última actualización:** 25/12/2024  
**Responsable:** Sistema de Gestión de Calidad ISO 9001  
**Próxima revisión:** Al completar migración de listings restantes 