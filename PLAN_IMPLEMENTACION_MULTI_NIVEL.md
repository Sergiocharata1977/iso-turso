# Plan de Implementación - Sistema Multi-Nivel de Organizaciones y Usuarios

## 🎯 OBJETIVO

Implementar el sistema multi-nivel de organizaciones y usuarios según la arquitectura definida en `ADMINISTRACION_ORGANIZACION_USUARIOS.md`.

---

## 📋 FASES DE IMPLEMENTACIÓN

### **FASE 1: MODIFICACIÓN DE LA BASE DE DATOS** ⚙️

**Objetivo:** Adaptar la estructura de la base de datos para soportar niveles de organización y roles mejorados.

#### 1.1 Modificar Tabla `organizations`
- **Agregar columna `plan`:** `VARCHAR(20) DEFAULT 'basic'` (valores: `'basic'`, `'premium'`)
- **Agregar columna `max_users`:** `INTEGER DEFAULT 10` (límite de usuarios según plan)
- **Agregar columna `created_at`:** `DATETIME DEFAULT CURRENT_TIMESTAMP`
- **Agregar columna `updated_at`:** `DATETIME DEFAULT CURRENT_TIMESTAMP`

#### 1.2 Modificar Tabla `usuarios`
- **Verificar columna `role`:** Asegurar que soporte valores: `'super_admin'`, `'admin'`, `'manager'`, `'employee'`
- **Agregar índices:** Para optimizar consultas por `organization_id` y `role`

#### 1.3 Crear Tabla `organization_features`
- **Propósito:** Controlar qué módulos están habilitados por organización
- **Estructura:**
  ```sql
  CREATE TABLE organization_features (
    id INTEGER PRIMARY KEY,
    organization_id INTEGER,
    feature_name VARCHAR(100),
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );
  ```

#### 1.4 Crear Script de Migración
- **Archivo:** `backend/scripts/migrate-to-multi-level.js`
- **Función:** Aplicar todos los cambios de BD de forma segura
- **Incluir:** Backup de datos existentes antes de migrar

---

### **FASE 2: ACTUALIZACIÓN DEL BACKEND** 🔧

**Objetivo:** Adaptar la API para manejar niveles de organización y nuevos roles.

#### 2.1 Actualizar Controlador de Autenticación (`authController.js`)
- **Login Response:** Incluir `plan` de la organización en la respuesta
- **Register:** Permitir especificar plan al crear organización
- **Token JWT:** Incluir `plan` y `role` en el payload del token

#### 2.2 Crear Middleware de Permisos (`permissionsMiddleware.js`)
- **Función:** Verificar plan de organización y rol de usuario
- **Validaciones:**
  - Acceso a módulos según plan (`basic` vs `premium`)
  - Acciones permitidas según rol (`admin`, `manager`, `employee`)
  - Límites de usuarios por organización

#### 2.3 Actualizar Controladores Existentes
- **Aplicar middleware de permisos** a todas las rutas protegidas
- **Filtrar datos** según el plan de la organización
- **Controlar acceso CRUD** según el rol del usuario

#### 2.4 Crear Controlador de Super-Admin (`superAdminController.js`)
- **Gestión de Organizaciones:** CRUD completo
- **Cambio de Planes:** Upgrade/downgrade de organizaciones
- **Estadísticas:** Monitoreo de la plataforma

---

### **FASE 3: ACTUALIZACIÓN DEL FRONTEND** 🎨

**Objetivo:** Adaptar la interfaz para mostrar funcionalidades según plan y rol.

#### 3.1 Actualizar `authStore.js`
- **Estado:** Agregar `organizationPlan` al estado
- **Getters:** Nuevas funciones para verificar plan y permisos
- **Login:** Guardar plan de organización en el estado

#### 3.2 Crear `permissionsStore.js`
- **Función:** Centralizar lógica de permisos
- **Métodos:**
  - `canAccessModule(moduleName)` - Verificar acceso según plan
  - `canPerformAction(action, moduleName)` - Verificar acción según rol
  - `getUserLimits()` - Obtener límites según plan

#### 3.3 Actualizar `MenuPrincipal.jsx`
- **Filtrado dinámico:** Mostrar/ocultar módulos según plan de organización
- **Indicadores visuales:** Mostrar plan actual y límites
- **Badges:** Identificar funcionalidades premium

#### 3.4 Crear Componentes Nuevos
- **`PlanBadge.jsx`:** Mostrar plan actual (Básico/Premium)
- **`UpgradeAlert.jsx`:** Alertas para upgrade cuando se alcancen límites
- **`SuperAdminPanel.jsx`:** Panel de administración de organizaciones

---

### **FASE 4: SCRIPTS Y DATOS DE PRUEBA** 📊

**Objetivo:** Crear herramientas para gestionar y probar el nuevo sistema.

#### 4.1 Script de Migración de Datos
- **Archivo:** `backend/scripts/migrate-existing-data.js`
- **Función:** Migrar datos actuales al nuevo modelo
- **Asignar plan `basic`** a organizaciones existentes

#### 4.2 Script de Creación de Datos Demo
- **Archivo:** `backend/scripts/create-multi-level-demo.js`
- **Crear:**
  - 1 Super-Admin
  - 2 Organizaciones (1 Básica, 1 Premium)
  - Usuarios de prueba con todos los roles

#### 4.3 Script de Verificación
- **Archivo:** `backend/scripts/verify-multi-level.js`
- **Verificar:**
  - Permisos funcionando correctamente
  - Límites de usuarios por plan
  - Acceso a módulos según plan

---

### **FASE 5: TESTING Y VALIDACIÓN** ✅

**Objetivo:** Asegurar que el sistema funciona correctamente en todos los escenarios.

#### 5.1 Pruebas de Permisos
- **Plan Básico:** Verificar limitaciones de módulos y usuarios
- **Plan Premium:** Verificar acceso completo
- **Roles:** Verificar permisos CRUD según cada rol

#### 5.2 Pruebas de Interfaz
- **Menú dinámico:** Verificar que se muestren/oculten módulos correctamente
- **Indicadores visuales:** Verificar badges y alertas de plan
- **Responsividad:** Verificar funcionamiento en diferentes dispositivos

#### 5.3 Pruebas de Seguridad
- **Bypass de permisos:** Intentar acceder a módulos/acciones no permitidas
- **Límites de usuarios:** Verificar que se respeten los límites por plan
- **Tokens JWT:** Verificar que incluyan la información correcta

---

## 🚀 ORDEN DE EJECUCIÓN

1. **FASE 1** - Base de Datos (30 min)
2. **FASE 2** - Backend (60 min)
3. **FASE 3** - Frontend (45 min)
4. **FASE 4** - Scripts y Datos (30 min)
5. **FASE 5** - Testing (30 min)

**TIEMPO TOTAL ESTIMADO:** 3 horas y 15 minutos

---

## 📝 NOTAS IMPORTANTES

- **Backup:** Realizar backup completo antes de iniciar
- **Migración gradual:** Aplicar cambios de forma incremental
- **Rollback:** Mantener capacidad de revertir cambios si es necesario
- **Documentación:** Actualizar documentación técnica después de cada fase

---

## ✅ CRITERIOS DE ÉXITO

- [ ] Organizaciones pueden tener plan `basic` o `premium`
- [ ] Usuarios ven solo módulos permitidos por su plan
- [ ] Roles funcionan correctamente (admin, manager, employee)
- [ ] Super-admin puede gestionar todas las organizaciones
- [ ] Límites de usuarios se respetan según el plan
- [ ] Sistema es escalable para futuros planes
