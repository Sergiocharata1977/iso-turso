# 🏢 ARQUITECTURA SAAS MULTI-TENANT - IsoFlow3

## 🎯 VISIÓN GENERAL

IsoFlow3 es un sistema **SAAS (Software as a Service) multi-tenant** para gestión de calidad ISO, donde múltiples empresas pueden usar la misma aplicación con datos completamente aislados.

## 🏗️ MODELO DE ARQUITECTURA

### 1. **Estructura Multi-Tenant**
```
┌─────────────────────────────────────────┐
│           SUPER ADMINISTRADOR           │
│         (Usuario Maestro)               │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐    ┌───▼───┐    ┌───▼───┐
│ ORG 1 │    │ ORG 2 │    │ ORG N │
│       │    │       │    │       │
│Users  │    │Users  │    │Users  │
│Data   │    │Data   │    │Data   │
│Config │    │Config │    │Config │
└───────┘    └───────┘    └───────┘
```

### 2. **Niveles de Usuario**

#### 🔴 **SUPER ADMINISTRADOR (Usuario Maestro)**
- **Alcance**: Todo el sistema
- **Permisos**:
  - Crear/eliminar organizaciones
  - Gestionar administradores de empresa
  - Configurar planes y límites
  - Acceso a métricas globales
  - Mantenimiento del sistema

#### 🟡 **ADMINISTRADOR DE EMPRESA**
- **Alcance**: Su organización únicamente
- **Permisos**:
  - Gestionar usuarios de su empresa
  - Configurar módulos y permisos
  - Acceso a todos los datos de su organización
  - Configurar integraciones

#### 🟢 **USUARIO ESTÁNDAR**
- **Alcance**: Módulos asignados de su organización
- **Permisos**:
  - Acceso según roles asignados
  - CRUD en módulos autorizados
  - Solo datos de su organización

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### Tabla: `organizations` (Nueva)
```sql
CREATE TABLE organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    plan_type TEXT NOT NULL DEFAULT 'basic', -- basic, premium, enterprise
    max_users INTEGER DEFAULT 10,
    status TEXT NOT NULL DEFAULT 'active', -- active, suspended, cancelled
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    settings JSON -- Configuraciones específicas de la empresa
);
```

### Tabla: `usuarios` (Modificada)
```sql
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    rol TEXT NOT NULL, -- super_admin, org_admin, user
    permissions JSON, -- Permisos específicos por módulo
    status TEXT NOT NULL DEFAULT 'active', -- active, inactive, suspended
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_login TEXT,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    UNIQUE(email, organization_id) -- Email único por organización
);
```

### Tabla: `user_sessions` (Nueva)
```sql
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

## 🔐 SISTEMA DE ROLES Y PERMISOS

### Definición de Roles
```javascript
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORG_ADMIN: 'org_admin', 
  USER: 'user'
};

const PERMISSIONS = {
  // Gestión de usuarios
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  
  // Módulos de calidad
  PROCESSES_MANAGE: 'processes:manage',
  DOCUMENTS_MANAGE: 'documents:manage',
  AUDITS_MANAGE: 'audits:manage',
  INDICATORS_MANAGE: 'indicators:manage',
  
  // Configuración
  ORG_SETTINGS: 'org:settings',
  SYSTEM_CONFIG: 'system:config'
};
```

## 🛡️ AISLAMIENTO DE DATOS

### 1. **Row-Level Security (RLS)**
Cada consulta debe incluir filtro por `organization_id`:

```sql
-- ❌ INCORRECTO
SELECT * FROM procesos;

-- ✅ CORRECTO
SELECT * FROM procesos WHERE organization_id = ?;
```

### 2. **Middleware de Tenant**
```javascript
// middleware/tenantMiddleware.js
export const ensureTenant = (req, res, next) => {
  const { organization_id } = req.user;
  req.tenant = { organization_id };
  next();
};

// Uso en rutas
app.use('/api', authenticateToken, ensureTenant);
```

### 3. **Query Builder Seguro**
```javascript
// lib/secureQuery.js
export class SecureQuery {
  constructor(organizationId) {
    this.organizationId = organizationId;
  }
  
  select(table, conditions = {}) {
    return db.execute({
      sql: `SELECT * FROM ${table} WHERE organization_id = ? AND ${buildWhere(conditions)}`,
      args: [this.organizationId, ...Object.values(conditions)]
    });
  }
}
```

## 🚀 PLAN DE IMPLEMENTACIÓN

### Fase 1: Estructura Base ✅
- [x] Identificar tablas críticas
- [x] Implementar sistema de protección BD
- [x] Documentar protocolo de seguridad

### Fase 2: Multi-Tenant (En Progreso)
- [ ] Crear tabla `organizations`
- [ ] Modificar tabla `usuarios` 
- [ ] Implementar middleware de tenant
- [ ] Crear sistema de roles y permisos

### Fase 3: Super Admin
- [ ] Crear interfaz de super administrador
- [ ] Panel de gestión de organizaciones
- [ ] Métricas y monitoreo global
- [ ] Sistema de planes y límites

### Fase 4: Migración de Datos
- [ ] Script de migración para datos existentes
- [ ] Asignación de organización por defecto
- [ ] Verificación de integridad de datos

## 🔧 CONFIGURACIÓN DE DESARROLLO

### Variables de Entorno Adicionales
```env
# Existentes
DATABASE_URL=libsql://your-database-url
TURSO_DB_TOKEN=your-auth-token
PORT=5000

# Nuevas para Multi-Tenant
SUPER_ADMIN_EMAIL=admin@isoflow3.com
SUPER_ADMIN_PASSWORD=secure_password_here
DEFAULT_ORG_NAME=Demo Organization
JWT_SECRET=your-jwt-secret
SESSION_TIMEOUT=24h
```

### Comandos de Gestión
```bash
# Crear organización
node scripts/create-organization.js --name "Empresa ABC" --plan premium

# Crear super admin
node scripts/create-super-admin.js

# Migrar datos existentes
node scripts/migrate-to-multitenant.js

# Verificar integridad
node scripts/verify-tenant-isolation.js
```

## 📊 MÉTRICAS Y MONITOREO

### Dashboard Super Admin
- Número total de organizaciones
- Usuarios activos por organización
- Uso de recursos por tenant
- Métricas de rendimiento
- Alertas de seguridad

### Logs de Auditoría
- Accesos entre organizaciones
- Cambios de permisos
- Creación/eliminación de usuarios
- Operaciones administrativas

## 🔒 SEGURIDAD ADICIONAL

### 1. **Validación de Tenant**
- Verificar que el usuario pertenece a la organización
- Validar permisos en cada operación
- Logs de acceso entre organizaciones

### 2. **Backup por Organización**
- Backups separados por tenant
- Restauración selectiva
- Cumplimiento de GDPR/LOPD

### 3. **Rate Limiting por Tenant**
- Límites de API por organización
- Prevención de abuso de recursos
- Alertas de uso excesivo

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **Crear scripts de migración multi-tenant**
2. **Implementar middleware de aislamiento**
3. **Desarrollar panel de super administrador**
4. **Probar aislamiento de datos**
5. **Documentar APIs multi-tenant**

**🏢 Esta arquitectura garantiza escalabilidad, seguridad y aislamiento completo entre organizaciones en el sistema SAAS.**
