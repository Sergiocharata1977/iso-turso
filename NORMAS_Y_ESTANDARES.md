# 📋 Normas y Estándares - ISOFlow3

**Versión:** 3.0  
**Tipo:** Protocolo Obligatorio  
**Última actualización:** Diciembre 2024

## 🎯 Objetivo

Establecer las normas, estándares y protocolos obligatorios para el desarrollo y mantenimiento del sistema ISOFlow3, garantizando consistencia, seguridad y calidad en todo el proyecto.

---

## 🛡️ PROTOCOLO MULTI-TENANT (OBLIGATORIO)

### **🚨 Reglas Fundamentales**

#### **❌ PROHIBICIONES ABSOLUTAS**
```javascript
❌ NUNCA hacer: WHERE id = ? (sin organization_id)
❌ NUNCA usar: req.user?.organization_id || 1
❌ NUNCA omitir: ensureTenant middleware
❌ NUNCA permitir: operaciones cross-tenant
```

#### **✅ OBLIGACIONES**
```javascript
✅ SIEMPRE usar: ensureTenant middleware
✅ SIEMPRE incluir: organization_id en WHERE clauses
✅ SIEMPRE validar: req.user.organization_id exists
✅ SIEMPRE loggear: operaciones tenant con logTenantOperation
```

### **🔧 Patrón Estándar Obligatorio**

#### **Backend - Estructura de Rutas**
```javascript
import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { ensureTenant, secureQuery, logTenantOperation, checkPermission } from '../middleware/tenantMiddleware.js';

const router = express.Router();

// ✅ OBLIGATORIO: Aplicar middlewares en este orden
router.use(authMiddleware);
router.use(ensureTenant);

// ✅ OBLIGATORIO: Patrón para operaciones GET
router.get('/', async (req, res) => {
  try {
    const query = secureQuery(req);
    
    const result = await tursoClient.execute({
      sql: `SELECT * FROM tabla WHERE ${query.where()} ORDER BY created_at DESC`,
      args: query.args()
    });
    
    logTenantOperation(req, 'GET_TABLA', { count: result.rows.length });
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✅ OBLIGATORIO: Patrón para operaciones POST
router.post('/', async (req, res) => {
  try {
    if (!checkPermission(req, 'employee')) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }

    const query = secureQuery(req);
    const { campo1, campo2 } = req.body;

    const result = await tursoClient.execute({
      sql: 'INSERT INTO tabla (campo1, campo2, organization_id) VALUES (?, ?, ?) RETURNING *',
      args: [campo1, campo2, query.organizationId]
    });

    logTenantOperation(req, 'CREATE_TABLA', { recordId: result.rows[0].id });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

#### **Frontend - Servicios**
```javascript
// ✅ OBLIGATORIO: Todos los servicios deben verificar organization_id
import { authStore } from '../store/authStore.js';

export const serviceName = {
  getAll: async () => {
    const organizationId = authStore.getOrganizationId();
    if (!organizationId) {
      throw new Error('Se requiere organization_id');
    }
    
    return apiService.get('/api/endpoint', {
      params: { organization_id: organizationId }
    });
  },
  
  create: async (data) => {
    const organizationId = authStore.getOrganizationId();
    if (!organizationId) {
      throw new Error('Se requiere organization_id para crear registro');
    }
    
    return apiService.post('/api/endpoint', {
      ...data,
      organization_id: organizationId
    });
  }
};
```

### **🗄️ Base de Datos - Estructura Obligatoria**

#### **Campos Obligatorios en Todas las Tablas**
```sql
-- ✅ OBLIGATORIO en todas las tablas
id                    INTEGER PRIMARY KEY AUTOINCREMENT
organization_id       INTEGER NOT NULL
created_at           TEXT DEFAULT CURRENT_TIMESTAMP
updated_at           TEXT DEFAULT CURRENT_TIMESTAMP
created_by           INTEGER REFERENCES usuarios(id)
updated_by           INTEGER REFERENCES usuarios(id)
is_active            BOOLEAN DEFAULT true

-- ✅ OBLIGATORIO: Índice en organization_id
CREATE INDEX IF NOT EXISTS idx_tabla_organization ON tabla_name(organization_id);
```

#### **Estructura Multi-Tenant**
```
organizations (1) ←→ (N) usuarios
    ↓
Todas las tablas DEBEN tener organization_id
```

### **👥 Sistema de Roles y Permisos**

#### **Jerarquía de Roles**
```javascript
const roleHierarchy = {
  'super_admin': 4,  // Acceso a todas las organizaciones
  'admin': 3,        // Admin de su organización
  'manager': 2,      // Manager de su organización  
  'employee': 1      // Empleado de su organización
};
```

#### **Permisos por Operación**
- **CREATE**: employee+ (excepto usuarios: admin+)
- **READ**: employee+
- **UPDATE**: employee+ (propio), manager+ (todos)
- **DELETE**: admin+

---

## 🎨 ESTÁNDARES DE DISEÑO

### **📁 Organización de Archivos**

#### **Principio Fundamental**
```
TODO POR MÓDULOS
Cada módulo de negocio tiene su propia carpeta
Todos los archivos relacionados van juntos
```

#### **Nomenclatura Estándar**
```
[Modulo]Listing.jsx     # Lista principal con grid/tabla
[Modulo]Single.jsx      # Vista detallada individual
[Modulo]Card.jsx        # Tarjeta para mostrar en grids
[Modulo]Modal.jsx       # Modal de creación/edición
[Modulo]TableView.jsx   # Vista específica de tabla
```

#### **Estructura de Componentes**
```
frontend/src/components/
├── [modulo]/
│   ├── [Modulo]Listing.jsx    # Lista principal
│   ├── [Modulo]Single.jsx     # Vista detallada
│   ├── [Modulo]Card.jsx       # Tarjeta
│   ├── [Modulo]Modal.jsx      # Modal CRUD
│   └── forms/                 # Formularios específicos
│       ├── [Tipo]Form.jsx
│       └── [Otro]Form.jsx
```

### **🎯 Estándares de UI/UX**

#### **Colores Semánticos**
```css
/* Estados */
.success { @apply bg-green-100 text-green-800 border-green-200; }
.warning { @apply bg-yellow-100 text-yellow-800 border-yellow-200; }
.error { @apply bg-red-100 text-red-800 border-red-200; }
.info { @apply bg-blue-100 text-blue-800 border-blue-200; }

/* Prioridades */
.priority-high { @apply bg-red-50 border-red-200; }
.priority-medium { @apply bg-yellow-50 border-yellow-200; }
.priority-low { @apply bg-green-50 border-green-200; }
```

#### **Componentes Estándar**
```jsx
// ✅ Uso de shadcn/ui components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
```

#### **Patrones de Navegación**
```jsx
// ✅ Navegación estándar
<Card 
  className="cursor-pointer hover:shadow-md transition-shadow"
  onClick={() => navigate(`/modulo/${item.id}`)}
>
  <CardContent>
    {/* Contenido de la tarjeta */}
  </CardContent>
</Card>
```

### **📱 Responsividad**
```jsx
// ✅ Clases responsive estándar
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 sm:p-6 lg:p-8">
    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
      Título
    </h2>
  </div>
</div>
```

---

## 💻 ESTÁNDARES DE CÓDIGO

### **📝 Convenciones de Naming**

#### **Variables y Funciones**
```javascript
// ✅ Correcto
const userName = 'Juan';
const getUserData = () => {};
const isUserActive = true;

// ❌ Incorrecto
const user_name = 'Juan';
const get_user_data = () => {};
const UserActive = true;
```

#### **Componentes**
```javascript
// ✅ Correcto
const PersonalListing = () => {};
const PersonalSingle = () => {};
const PersonalCard = () => {};

// ❌ Incorrecto
const personalListing = () => {};
const Personal_Single = () => {};
const personalcard = () => {};
```

#### **Archivos**
```
✅ Correcto:
PersonalListing.jsx
PersonalSingle.jsx
personalService.js
userStore.js

❌ Incorrecto:
personal-listing.jsx
Personal_Single.jsx
personal_service.js
UserStore.js
```

### **🔧 Estructura de Componentes**

#### **Patrón Estándar**
```jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { serviceName } from '@/services/serviceNameService';

const ComponentName = ({ prop1, prop2 }) => {
  // 1. Estados
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Efectos
  useEffect(() => {
    loadData();
  }, []);

  // 3. Funciones
  const loadData = async () => {
    try {
      setLoading(true);
      const result = await serviceName.getAll();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Renderizado
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Título</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Contenido */}
      </CardContent>
    </Card>
  );
};

export default ComponentName;
```

### **🔍 Manejo de Errores**

#### **Patrón Estándar**
```javascript
// ✅ Backend
try {
  const result = await tursoClient.execute({...});
  logTenantOperation(req, 'ACTION', { recordId: result.rows[0].id });
  res.json(result.rows);
} catch (error) {
  console.error('Error específico:', error);
  res.status(500).json({ 
    error: 'Mensaje específico para el usuario',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}

// ✅ Frontend
try {
  const result = await service.operation();
  setData(result.data);
} catch (error) {
  console.error('Error:', error);
  setError(error.response?.data?.error || 'Error desconocido');
}
```

---

## 🔒 ESTÁNDARES DE SEGURIDAD

### **🛡️ Validaciones Obligatorias**

#### **Input Validation**
```javascript
// ✅ Backend - Validar todos los inputs
const { nombre, email, documento } = req.body;

if (!nombre || nombre.trim().length < 2) {
  return res.status(400).json({ error: 'Nombre requerido (min 2 caracteres)' });
}

if (!email || !email.includes('@')) {
  return res.status(400).json({ error: 'Email válido requerido' });
}

if (!documento || documento.length < 7) {
  return res.status(400).json({ error: 'Documento válido requerido' });
}
```

#### **Sanitización**
```javascript
// ✅ Sanitizar inputs
const sanitizedData = {
  nombre: nombre.trim().substring(0, 100),
  email: email.trim().toLowerCase(),
  documento: documento.trim().replace(/[^0-9]/g, '')
};
```

### **🔐 Autenticación y Autorización**

#### **JWT Token Validation**
```javascript
// ✅ Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Para Cada Nueva Ruta Backend**
- [ ] ✅ Importa `authMiddleware` y `tenantMiddleware`
- [ ] ✅ Aplica `router.use(authMiddleware)` y `router.use(ensureTenant)`
- [ ] ✅ Usa `secureQuery(req)` en todas las operaciones
- [ ] ✅ Incluye `organization_id` en todas las consultas
- [ ] ✅ Implementa verificación de permisos con `checkPermission`
- [ ] ✅ Loggea operaciones con `logTenantOperation`
- [ ] ✅ Maneja errores apropiadamente
- [ ] ✅ Valida todos los inputs
- [ ] ✅ Documenta la funcionalidad

### **Para Cada Nueva Tabla**
- [ ] ✅ Tiene columna `organization_id INTEGER NOT NULL`
- [ ] ✅ Tiene índice en `organization_id`
- [ ] ✅ Incluye campos de auditoría estándar
- [ ] ✅ Las FK respetan aislamiento de tenant
- [ ] ✅ Datos de prueba incluyen `organization_id`

### **Para Cada Nuevo Componente**
- [ ] ✅ Sigue nomenclatura estándar
- [ ] ✅ Ubicado en carpeta correcta por módulo
- [ ] ✅ Usa componentes shadcn/ui
- [ ] ✅ Implementa responsive design
- [ ] ✅ Maneja estados de loading y error
- [ ] ✅ Navega correctamente entre vistas

---

## 🎯 CUMPLIMIENTO Y CALIDAD

### **🔍 Métricas de Calidad**
- ✅ **100%** de rutas usan protocolo tenant
- ✅ **100%** de tablas tienen organization_id
- ✅ **0** queries cross-tenant permitidas
- ✅ **100%** de componentes siguen nomenclatura
- ✅ **100%** de servicios verifican organización

### **📊 Indicadores de Éxito**
- 🛡️ **Seguridad**: Aislamiento total entre organizaciones
- 🎨 **Consistencia**: Diseño uniforme en toda la aplicación
- 💻 **Mantenibilidad**: Código limpio y documentado
- 🚀 **Escalabilidad**: Arquitectura preparada para crecimiento

---

## 🚨 VIOLACIONES CRÍTICAS

### **🔴 Errores que Rompen el Sistema**
1. **Omitir organization_id** en queries
2. **No usar ensureTenant** middleware
3. **Permitir cross-tenant** operations
4. **No validar permisos** de usuario
5. **Exponer datos** de otras organizaciones

### **⚠️ Advertencias Importantes**
1. **Nomenclatura inconsistente** dificulta mantenimiento
2. **Componentes en ubicación incorrecta** rompe organización
3. **Falta de validaciones** expone vulnerabilidades
4. **Manejo de errores deficiente** degrada experiencia usuario

---

## 💡 Conclusión

Estas normas y estándares son **OBLIGATORIAS** para todos los desarrollos del proyecto ISOFlow3. Su cumplimiento garantiza:

- 🔒 **Seguridad total** entre organizaciones
- 🎨 **Consistencia visual** y funcional
- 💻 **Código mantenible** y escalable
- 🚀 **Desarrollo eficiente** y predecible

**¡El cumplimiento de estos estándares es fundamental para el éxito del proyecto!** 