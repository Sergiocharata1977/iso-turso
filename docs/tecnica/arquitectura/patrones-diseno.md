# 🎨 Patrones de Diseño - ISOFlow3

## 📋 **DESCRIPCIÓN GENERAL**

Este documento describe los patrones de diseño implementados en ISOFlow3, basados en las mejores prácticas y la arquitectura real del sistema.

---

## 🏗️ **ARQUITECTURA MULTI-TENANT**

### **Patrón de Aislamiento por Organización**

#### **Estructura de Base de Datos**
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

#### **Middleware de Autenticación**
```javascript
// ✅ Patrón estándar para todas las rutas
import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { ensureTenant, secureQuery, logTenantOperation } from '../middleware/tenantMiddleware.js';

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
```

### **Sistema de Roles Jerárquico**
```javascript
const roleHierarchy = {
  'super_admin': 4,  // Acceso a todas las organizaciones
  'admin': 3,        // Admin de su organización
  'manager': 2,      // Manager de su organización  
  'employee': 1      // Empleado de su organización
};

// Permisos por Operación
const permissions = {
  CREATE: 'employee+', // employee y superior
  READ: 'employee+',   // employee y superior
  UPDATE: 'employee+', // propio: employee, todos: manager+
  DELETE: 'admin+'     // admin y superior
};
```

---

## 🎨 **PATRONES DE COMPONENTES**

### **Estructura de Componentes por Módulo**
```
frontend/src/components/
├── [modulo]/
│   ├── [Modulo]Listing.jsx    # Lista principal con grid/tabla
│   ├── [Modulo]Single.jsx     # Vista detallada individual
│   ├── [Modulo]Card.jsx       # Tarjeta para mostrar en grids
│   ├── [Modulo]Modal.jsx      # Modal de creación/edición
│   ├── [Modulo]TableView.jsx  # Vista específica de tabla
│   └── forms/                 # Formularios específicos
│       ├── [Tipo]Form.jsx
│       └── [Otro]Form.jsx
```

### **Patrón de Componente Listing**
```jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const ModuloListing = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await moduloService.getAll();
      setData(response);
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Módulo</h1>
        <Button onClick={() => setShowModal(true)}>
          Agregar Nuevo
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(item => (
          <ModuloCard 
            key={item.id} 
            item={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

### **Patrón de Servicio API**
```javascript
import { authStore } from '../store/authStore.js';

export const moduloService = {
  getAll: async () => {
    const organizationId = authStore.getOrganizationId();
    if (!organizationId) {
      throw new Error('Se requiere organization_id');
    }
    
    return apiService.get('/api/modulo', {
      params: { organization_id: organizationId }
    });
  },
  
  create: async (data) => {
    const organizationId = authStore.getOrganizationId();
    if (!organizationId) {
      throw new Error('Se requiere organization_id para crear registro');
    }
    
    return apiService.post('/api/modulo', {
      ...data,
      organization_id: organizationId
    });
  },

  update: async (id, data) => {
    const organizationId = authStore.getOrganizationId();
    return apiService.put(`/api/modulo/${id}`, {
      ...data,
      organization_id: organizationId
    });
  },

  delete: async (id) => {
    const organizationId = authStore.getOrganizationId();
    return apiService.delete(`/api/modulo/${id}`, {
      params: { organization_id: organizationId }
    });
  }
};
```

---

## 🎯 **PATRONES DE UI/UX**

### **Colores Semánticos**
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

### **Componentes Estándar**
```jsx
// ✅ Uso de shadcn/ui components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
```

### **Patrón de Navegación**
```jsx
// ✅ Navegación estándar
<Card 
  className="cursor-pointer hover:shadow-md transition-shadow"
  onClick={() => navigate(`/modulo/${item.id}`)}
>
  <CardContent>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold">{item.titulo}</h3>
        <p className="text-sm text-gray-600">{item.descripcion}</p>
      </div>
      <Badge variant={getEstadoVariant(item.estado)}>
        {item.estado}
      </Badge>
    </div>
  </CardContent>
</Card>
```

### **Responsividad**
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

## 🔧 **PATRONES DE CÓDIGO**

### **Convenciones de Naming**
```javascript
// ✅ Variables y Funciones
const userName = 'Juan';
const getUserData = () => {};
const isUserActive = true;

// ✅ Componentes
const PersonalListing = () => {};
const PersonalSingle = () => {};
const PersonalCard = () => {};

// ✅ Archivos
PersonalListing.jsx
PersonalSingle.jsx
personalService.js
userStore.js
```

### **Patrón de Hooks Personalizados**
```javascript
// ✅ Hook para gestión de estado
const useModuloData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await moduloService.getAll();
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async (itemData) => {
    try {
      const newItem = await moduloService.create(itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    createItem
  };
};
```

### **Patrón de Manejo de Errores**
```javascript
// ✅ Manejo centralizado de errores
const handleError = (error, context = '') => {
  console.error(`Error en ${context}:`, error);
  
  const message = error.response?.data?.message || error.message || 'Error desconocido';
  
  toast({
    title: "Error",
    description: message,
    variant: "destructive"
  });
};

// ✅ Uso en componentes
try {
  await moduloService.create(data);
  toast({
    title: "Éxito",
    description: "Registro creado correctamente"
  });
} catch (error) {
  handleError(error, 'crear módulo');
}
```

---

## 📊 **PATRONES DE DATOS**

### **Estructura de Respuesta API**
```javascript
// ✅ Respuesta estándar
{
  success: true,
  data: [...],
  message: "Operación exitosa",
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    pages: 10
  }
}

// ✅ Respuesta de error
{
  success: false,
  error: "Mensaje de error",
  code: "ERROR_CODE"
}
```

### **Patrón de Filtros**
```javascript
// ✅ Filtros dinámicos
const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);
  
  return {
    filters,
    updateFilter,
    clearFilters
  };
};
```

---

## 🚀 **PATRONES DE OPTIMIZACIÓN**

### **React.memo para Componentes**
```jsx
// ✅ Componentes optimizados
const ModuloCard = React.memo(({ item, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent>
        <h3 className="font-semibold">{item.titulo}</h3>
        <p className="text-sm text-gray-600">{item.descripcion}</p>
        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={() => onEdit(item)}>
            Editar
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
```

### **useCallback para Funciones**
```jsx
// ✅ Funciones optimizadas
const handleEdit = useCallback((item) => {
  setSelectedItem(item);
  setShowModal(true);
}, []);

const handleDelete = useCallback(async (id) => {
  if (confirm('¿Estás seguro de eliminar este elemento?')) {
    try {
      await moduloService.delete(id);
      setData(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Éxito",
        description: "Elemento eliminado correctamente"
      });
    } catch (error) {
      handleError(error, 'eliminar elemento');
    }
  }
}, []);
```

---

## 📋 **ESTÁNDARES DE IMPLEMENTACIÓN**

### **Reglas Obligatorias**
1. **Multi-tenant**: Siempre incluir `organization_id`
2. **Autenticación**: Usar middleware en todas las rutas
3. **Validación**: Validar datos en frontend y backend
4. **Errores**: Manejo centralizado de errores
5. **Performance**: Usar React.memo y useCallback
6. **Responsive**: Diseño mobile-first

### **Checklist de Implementación**
- [ ] Middleware de autenticación aplicado
- [ ] Organization_id incluido en queries
- [ ] Componentes optimizados con React.memo
- [ ] Manejo de errores implementado
- [ ] Diseño responsive verificado
- [ ] Tests básicos escritos

---

*Documentación actualizada: Enero 2025*
*Patrones implementados y funcionando en producción* 