# 📋 Documentación del Sistema de Administración Multi-Nivel

## 🎯 **Resumen Ejecutivo**

El sistema ISOFlow3 implementa una arquitectura de administración multi-nivel que permite gestionar organizaciones y usuarios de forma jerárquica, cumpliendo con los estándares ISO 9001 para sistemas de gestión de calidad.

---

## 🏗️ **Arquitectura del Sistema**

### **Niveles de Administración**

#### **Nivel 4: Super Administrador (super_admin)**
- **Acceso:** Global a toda la plataforma
- **Funcionalidades:**
  - Gestión de organizaciones (crear, editar, eliminar)
  - Gestión global de usuarios (crear, editar, eliminar)
  - Monitoreo de features por organización
  - Estadísticas globales del sistema
- **Rutas:** `/admin/super`
- **Componente:** `SuperAdminPanel.jsx`

#### **Nivel 3: Administrador de Organización (admin)**
- **Acceso:** Limitado a su organización específica
- **Funcionalidades:**
  - Gestión de usuarios de su organización
  - Configuración de procesos internos
  - Gestión de documentos organizacionales
  - Reportes de cumplimiento
- **Rutas:** `/admin/organization`
- **Componente:** `OrganizationAdminPanel.jsx`

#### **Nivel 2: Manager (manager)**
- **Acceso:** Departamento específico dentro de la organización
- **Funcionalidades:**
  - Gestión de personal del departamento
  - Supervisión de procesos
  - Reportes departamentales

#### **Nivel 1: Empleado (employee)**
- **Acceso:** Solo a sus tareas asignadas
- **Funcionalidades:**
  - Visualización de documentos
  - Registro de actividades
  - Participación en procesos

---

## 🔐 **Sistema de Autenticación y Autorización**

### **Credenciales de Acceso**

#### **Super Administrador**
```
Email: admin@isoflow3.com
Contraseña: admin123
Rol: super_admin
Organización: ISOFlow3 Platform (ID: 3)
```

#### **Administrador Demo**
```
Email: admin@demo.com
Contraseña: admin123
Rol: admin
Organización: Demo Organization (ID: 2)
```

### **Mensajes de Error Personalizados**

#### **Backend (authController.js)**
- **Email no registrado:** `"El email ingresado no está registrado en el sistema"`
- **Contraseña incorrecta:** `"La contraseña ingresada es incorrecta"`
- **Campos faltantes:** `"Email y contraseña son requeridos"`

### **Middleware de Autorización**

#### **Backend (admin.routes.js)**
```javascript
// Rutas Super Admin (Nivel 4)
router.get('/organizations', requireSuperAdmin, getAllOrganizations);
router.post('/organizations', requireSuperAdmin, createOrganization);
router.get('/users', requireSuperAdmin, getAllUsers);
router.post('/users', requireSuperAdmin, createUser);

// Rutas Admin de Organización (Nivel 3)
router.get('/organization/users', requireAdmin, getOrganizationUsers);
router.post('/organization/users', requireAdmin, createOrganizationUser);
```

---

## 🎨 **Interfaz de Usuario**

### **Menú de Navegación (Sidebar.jsx)**

#### **Filtrado por Roles**
```javascript
// Los items del menú se filtran dinámicamente según el rol del usuario
if (item.show && !item.show()) {
  return null; // No mostrar este item
}
```

#### **Estructura del Menú**
- **Planificación y Revisión** (todos los roles)
- **Recursos Humanos** (admin, manager)
  - Departamentos
  - Puestos
  - Personal
  - Capacitaciones
  - Evaluaciones
- **Gestión de Calidad** (admin, manager)
  - Normas
  - Documentos
- **Administración** (solo super_admin)
  - Panel Super Administrador
  - Gestión Global

### **Panel de Usuario (TopBar.jsx)**

#### **Elementos del Menú de Usuario**
- **Avatar:** Inicial del usuario en círculo
- **Información:** Nombre y rol del usuario
- **Opciones:**
  - Mi Cuenta
  - Perfil
  - Configuración
  - Cerrar Sesión
- **Iconos Adicionales:**
  - Notificaciones (con contador)
  - Toggle de tema (claro/oscuro)

---

## 🗄️ **Base de Datos**

### **Tablas Principales**

#### **usuarios**
```sql
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'manager', 'employee')),
  organization_id INTEGER,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

#### **organizations**
```sql
CREATE TABLE organizations (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  plan TEXT DEFAULT 'basic',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### **organization_features**
```sql
CREATE TABLE organization_features (
  id INTEGER PRIMARY KEY,
  organization_id INTEGER,
  feature_name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

---

## 🔧 **Scripts de Configuración**

### **Generación de Contraseñas (generate-passwords.js)**
```javascript
// Script para generar contraseñas hash para usuarios existentes
const passwords = {
  'admin@demo.com': 'admin123',
  'admin@isoflow3.com': 'admin123'
};
```

### **Creación de Super Administrador**
```javascript
// Script para crear el primer super administrador
const superAdmin = {
  name: 'Super Administrador',
  email: 'admin@isoflow3.com',
  password: 'admin123',
  role: 'super_admin',
  organization_id: 3
};
```

---

## 🚀 **Funcionalidades Implementadas**

### **Super Administrador**
- ✅ Panel de administración global
- ✅ Gestión de organizaciones (CRUD)
- ✅ Gestión global de usuarios (CRUD)
- ✅ Visualización de estadísticas
- ✅ Control de features por organización

### **Administrador de Organización**
- ✅ Panel de administración organizacional
- ✅ Gestión de usuarios de la organización
- ✅ Configuración de procesos internos
- ✅ Gestión de documentos

### **Sistema de Autenticación**
- ✅ Login con validación de credenciales
- ✅ Mensajes de error personalizados
- ✅ JWT tokens (access + refresh)
- ✅ Middleware de autorización por roles
- ✅ Logout seguro

### **Interfaz de Usuario**
- ✅ Menú dinámico según rol del usuario
- ✅ Panel de usuario con opciones
- ✅ Notificaciones y toggle de tema
- ✅ Navegación responsiva

---

## 📊 **Estadísticas del Sistema**

### **Usuarios Actuales**
- **Super Administrador:** 1 usuario
- **Administrador Demo:** 1 usuario
- **Total:** 2 usuarios activos

### **Organizaciones**
- **ISOFlow3 Platform:** Organización principal
- **Demo Organization:** Organización de prueba
- **Total:** 2 organizaciones

### **Features Habilitadas**
- Gestión de usuarios
- Gestión de documentos
- Gestión de procesos
- Gestión de auditorías
- Reportes básicos

---

## 🔮 **Próximos Pasos**

### **Funcionalidades Pendientes**
1. **Gestión de Productos y Servicios** (ISO 9001)
2. **Sistema de Estados para Productos**
3. **Workflow de Aprobaciones**
4. **Reportes Avanzados**
5. **Integración con APIs Externas**

### **Mejoras Sugeridas**
1. **Auditoría de Acciones:** Log de todas las operaciones administrativas
2. **Backup Automático:** Sistema de respaldo de datos
3. **Notificaciones Push:** Alertas en tiempo real
4. **Multi-idioma:** Soporte para múltiples idiomas
5. **API REST:** Documentación completa de APIs

---

## 📞 **Soporte y Contacto**

Para soporte técnico o consultas sobre el sistema de administración:
- **Email:** admin@isoflow3.com
- **Documentación:** Este archivo
- **Repositorio:** ISOFlow3 Master

---

*Documentación generada el: $(date)*
*Versión del sistema: 1.0.0* 