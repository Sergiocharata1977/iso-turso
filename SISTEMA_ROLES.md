# 🔐 SISTEMA DE ROLES - ISOFLOW3 SAAS

## 📋 DEFINICIÓN DE ROLES Y PERMISOS

### 👑 **SUPER-ADMIN** (Rol: `super-admin`)
**Descripción:** Administrador global del sistema SAAS multi-tenant

**Permisos:**
- ✅ **Acceso Total** - Ve y gestiona TODO sin restricciones
- ✅ **Gestión de Organizaciones** - Crear, editar, eliminar empresas
- ✅ **Gestión de Super-Usuarios** - Crear/eliminar admins de empresa
- ✅ **Configuración Global** - Parámetros del sistema
- ✅ **Monitoreo y Auditoría** - Logs y métricas globales

**Módulos Visibles:**
- 🔧 Panel de Control Global
- 🏢 Gestión de Organizaciones
- 👥 Gestión de Super-Usuarios
- 📊 Métricas y Reportes Globales
- ⚙️ Configuración del Sistema

---

### 🎯 **ADMIN** (Rol: `admin`)
**Descripción:** Administrador de empresa/organización

**Permisos:**
- ✅ **Acceso Completo a su Organización** - Ve todos los módulos de su empresa
- ✅ **Gestión de Usuarios** - CRUD de usuarios de su empresa
- ✅ **Gestión de ABM** - Todos los módulos administrativos
- ✅ **Configuración de Empresa** - Parámetros de su organización
- ✅ **Reportes y Auditorías** - De su empresa

**Módulos Visibles:**
- 📊 **Tablero Central**
- 👥 **Gestión de Usuarios**
- 🏢 **Departamentos** (CRUD)
- 💼 **Puestos** (CRUD)
- 👤 **Personal** (CRUD)
- 🔍 **Auditorías** (CRUD)
- 📋 **Procesos** (CRUD)
- 📄 **Documentos** (CRUD)
- 🎯 **Objetivos** (CRUD)
- 📈 **Indicadores** (CRUD)
- 📊 **Mediciones** (CRUD)
- ⚡ **Acciones** (CRUD)
- 🔍 **Hallazgos** (CRUD)
- 📅 **Calendario**
- 💬 **Comunicaciones**
- 📋 **Encuestas**
- 🎫 **Tickets**
- 📦 **Productos**
- 🎓 **Capacitaciones**
- 📝 **Evaluaciones**
- ⚙️ **Configuración**

---

### 👤 **MANAGER** (Rol: `manager`)
**Descripción:** Gerente/Supervisor de área

**Permisos:**
- ✅ **Gestión Operativa** - ABM de su área de responsabilidad
- ✅ **Supervisión de Personal** - Ve y gestiona su equipo
- ✅ **Auditorías y Mejoras** - Gestiona procesos de mejora
- ❌ **NO Gestión de Usuarios** - No puede crear/eliminar usuarios
- ❌ **NO Configuración** - No accede a configuración del sistema

**Módulos Visibles:**
- 📊 **Tablero Central**
- 🏢 **Departamentos** (Solo lectura)
- 💼 **Puestos** (Solo lectura)
- 👤 **Personal** (CRUD de su área)
- 🔍 **Auditorías** (CRUD)
- 📋 **Procesos** (CRUD de su área)
- 📄 **Documentos** (Lectura/Edición)
- 🎯 **Objetivos** (CRUD de su área)
- 📈 **Indicadores** (CRUD de su área)
- 📊 **Mediciones** (CRUD)
- ⚡ **Acciones** (CRUD)
- 🔍 **Hallazgos** (CRUD)
- 📅 **Calendario**
- 💬 **Comunicaciones**
- 📋 **Encuestas** (Crear/Gestionar)
- 🎫 **Tickets** (CRUD)
- 📦 **Productos** (Solo lectura)
- 🎓 **Capacitaciones** (CRUD de su área)
- 📝 **Evaluaciones** (CRUD de su área)

---

### 📝 **EMPLOYEE** (Rol: `employee`)
**Descripción:** Empleado estándar

**Permisos:**
- ✅ **Consulta de Información** - Ve información relevante a su trabajo
- ✅ **Participación Activa** - Responde encuestas, reporta hallazgos
- ✅ **Comunicación** - Accede a comunicaciones y calendario
- ❌ **NO Gestión** - No puede crear/editar registros administrativos
- ❌ **NO ABM** - No accede a módulos administrativos

**Módulos Visibles:**
- 📊 **Tablero Central** (Solo lectura)
- 👤 **Mi Perfil** (Solo su información)
- 📋 **Procesos** (Solo lectura)
- 📄 **Documentos** (Solo lectura)
- 🎯 **Objetivos** (Solo lectura)
- 📈 **Indicadores** (Solo lectura)
- 🔍 **Hallazgos** (Crear reportes)
- 📅 **Calendario** (Solo lectura)
- 💬 **Comunicaciones** (Lectura/Respuesta)
- 📋 **Encuestas** (Solo responder)
- 🎫 **Tickets** (Crear/Ver propios)
- 📦 **Productos** (Solo lectura)
- 🎓 **Capacitaciones** (Ver asignadas)
- 📝 **Evaluaciones** (Completar propias)

---

## 🛡️ REGLAS DE PROTECCIÓN DEL MENÚ

### **MÓDULOS CRÍTICOS PROTEGIDOS**
Los siguientes módulos **NUNCA** deben ser eliminados del menú:

1. 🏢 **Departamentos**
2. 💼 **Puestos** 
3. 👤 **Personal**
4. 🔍 **Auditorías**
5. 📋 **Procesos**
6. 🎯 **Objetivos**
7. 📈 **Indicadores**
8. 📊 **Mediciones**
9. ⚡ **Acciones**
10. 🔍 **Hallazgos**

### **MECANISMO DE PROTECCIÓN**
- ✅ **Comentarios de Protección** en el código
- ✅ **Validación de Integridad** al cargar el menú
- ✅ **Backup Automático** de configuración de menú
- ✅ **Logs de Cambios** en módulos críticos

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### **Función de Validación de Roles:**
```javascript
const hasPermission = (userRole, moduleId, action = 'read') => {
  const permissions = {
    'super-admin': ['*'], // Acceso total
    'admin': ['all-modules'], // Todos los módulos de su org
    'manager': ['operational-modules'], // Módulos operativos
    'employee': ['read-only-modules'] // Solo lectura
  };
  
  return validateAccess(userRole, moduleId, action, permissions);
};
```

### **Módulos por Categoría:**
- **all-modules:** Todos los ABM y funcionalidades
- **operational-modules:** ABM operativos (Personal, Auditorías, etc.)
- **read-only-modules:** Solo consulta de información

---

## 📊 MATRIZ DE PERMISOS

| Módulo | Super-Admin | Admin | Manager | Employee |
|--------|-------------|-------|---------|----------|
| Usuarios | ✅ CRUD | ✅ CRUD | ❌ | ❌ |
| Departamentos | ✅ CRUD | ✅ CRUD | 👁️ Read | ❌ |
| Puestos | ✅ CRUD | ✅ CRUD | 👁️ Read | ❌ |
| Personal | ✅ CRUD | ✅ CRUD | ✅ CRUD* | 👁️ Propio |
| Auditorías | ✅ CRUD | ✅ CRUD | ✅ CRUD | ❌ |
| Procesos | ✅ CRUD | ✅ CRUD | ✅ CRUD* | 👁️ Read |
| Documentos | ✅ CRUD | ✅ CRUD | ✅ Edit | 👁️ Read |
| Objetivos | ✅ CRUD | ✅ CRUD | ✅ CRUD* | 👁️ Read |
| Indicadores | ✅ CRUD | ✅ CRUD | ✅ CRUD* | 👁️ Read |
| Mediciones | ✅ CRUD | ✅ CRUD | ✅ CRUD | ❌ |
| Acciones | ✅ CRUD | ✅ CRUD | ✅ CRUD | ❌ |
| Hallazgos | ✅ CRUD | ✅ CRUD | ✅ CRUD | ✅ Create |
| Comunicaciones | ✅ CRUD | ✅ CRUD | ✅ CRUD | 👁️ Read |
| Encuestas | ✅ CRUD | ✅ CRUD | ✅ CRUD | 📝 Answer |
| Tickets | ✅ CRUD | ✅ CRUD | ✅ CRUD | ✅ Own |
| Productos | ✅ CRUD | ✅ CRUD | 👁️ Read | 👁️ Read |
| Capacitaciones | ✅ CRUD | ✅ CRUD | ✅ CRUD* | 👁️ Own |
| Evaluaciones | ✅ CRUD | ✅ CRUD | ✅ CRUD* | 📝 Own |

**Leyenda:**
- ✅ **CRUD:** Crear, Leer, Actualizar, Eliminar
- 👁️ **Read:** Solo lectura
- 📝 **Answer/Own:** Solo responder/ver propios
- ❌ **No Access:** Sin acceso
- **\*:** Solo de su área/departamento

---

## 🚨 NOTAS IMPORTANTES

1. **Multi-Tenant:** Cada organización ve solo sus datos
2. **Jerarquía:** Los roles superiores heredan permisos de los inferiores
3. **Seguridad:** Validación tanto en frontend como backend
4. **Auditoría:** Todos los cambios se registran en logs
5. **Flexibilidad:** Los permisos pueden ajustarse por organización

---

**Fecha de Creación:** 2025-01-05  
**Versión:** 1.0  
**Estado:** Activo  
**Próxima Revisión:** 2025-02-05
