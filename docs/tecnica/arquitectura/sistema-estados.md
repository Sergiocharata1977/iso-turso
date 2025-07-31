# 🎯 Sistema de Estados - ISOFlow3

## 📋 **DESCRIPCIÓN GENERAL**

Este documento describe el sistema de estados implementado en ISOFlow3, que permite el seguimiento y control de todos los registros del sistema a través de un flujo de trabajo estandarizado.

---

## 🔄 **ESTADOS IMPLEMENTADOS**

### **1. ACCIONES (Actions)**

#### **Estados Principales**
```javascript
export const ACCION_ESTADOS = {
  PLANIFICACION: 'p1_planificacion_accion',
  EJECUCION: 'e2_ejecucion_accion',
  PLANIFICACION_VERIFICACION: 'v3_planificacion_verificacion',
  EJECUCION_VERIFICACION: 'v4_ejecucion_verificacion',
  CERRADA: 'c5_cerrada',
};
```

#### **Flujo de Trabajo**
```javascript
export const accionWorkflow = {
  [ACCION_ESTADOS.PLANIFICACION]: {
    label: 'Planificación',
    color: 'bg-blue-100 text-blue-800',
    nextState: ACCION_ESTADOS.EJECUCION,
  },
  [ACCION_ESTADOS.EJECUCION]: {
    label: 'Ejecución',
    color: 'bg-yellow-100 text-yellow-800',
    nextState: ACCION_ESTADOS.PLANIFICACION_VERIFICACION,
  },
  [ACCION_ESTADOS.PLANIFICACION_VERIFICACION]: {
    label: 'Planificación Verificación',
    color: 'bg-purple-100 text-purple-800',
    nextState: ACCION_ESTADOS.EJECUCION_VERIFICACION,
  },
  [ACCION_ESTADOS.EJECUCION_VERIFICACION]: {
    label: 'Ejecución Verificación',
    color: 'bg-orange-100 text-orange-800',
    nextState: ACCION_ESTADOS.CERRADA,
  },
  [ACCION_ESTADOS.CERRADA]: {
    label: 'Cerrada',
    color: 'bg-green-100 text-green-800',
    nextState: null,
  },
};
```

### **2. HALLAZGOS (Findings)**

#### **Estados por Etapa**
```javascript
export const ESTADOS = {
  // 1. Detección
  D1_INICIADO: 'd1_iniciado',
  D2_CON_ACCION_INMEDIATA: 'd2_con_accion_inmediata',
  D3_CORREGIDO_PARCIAL: 'd3_corregido_parcial',
  D4_CORREGIDO_COMPLETO: 'd4_corregido_completo',
  
  // 2. Tratamiento
  T1_EN_ANALISIS: 't1_en_analisis',
  T2_NO_REQUIERE_ACCION: 't2_no_requiere_accion',
  T3_PENDIENTE_IMPLEMENTACION: 't3_pendiente_implementacion',
  T4_EN_IMPLEMENTACION: 't4_en_implementacion',
  T5_IMPLEMENTACION_FINALIZADA: 't5_implementacion_finalizada',

  // 3. Control y Verificación
  C1_PENDIENTE_VERIFICACION: 'c1_pendiente_verificacion',
  C2_EN_VERIFICACION: 'c2_en_verificacion',
  C3_VERIFICADO_SATISFACTORIO: 'c3_verificado_satisfactorio',
  C4_VERIFICADO_INSATISFACTORIO: 'c4_verificado_insatisfactorio',
  C5_CERRADO: 'c5_cerrado',
};
```

#### **Etapas del Workflow**
```javascript
export const stages = [
  { 
    id: 'deteccion', 
    title: 'Detección',
    estados: ['d1_iniciado', 'd2_accion_inmedita-programada', 'd3_accion_inmedita-finalizada'] 
  },
  { 
    id: 'analisis', 
    title: 'Análisis',
    estados: ['t1_en_analisis', 't2_no_requiere_accion', 't3_requiere_accion'] 
  },
  { 
    id: 'planificacion_accion', 
    title: 'Planificación Acción',
    estados: ['p1_planificacion_accion'] 
  },
  { 
    id: 'ejecucion_accion', 
    title: 'Ejecución Acción',
    estados: ['e2_ejecucion_accion'] 
  },
  { 
    id: 'verificacion', 
    title: 'Verificación',
    estados: ['v3_planificacion_verificacion', 'v4_ejecucion_verificacion'] 
  },
  { 
    id: 'cierre', 
    title: 'Cierre',
    estados: ['c5_cerrado', 'c5_cerrada'] 
  },
];
```

### **3. CAPACITACIONES**

#### **Estados Implementados**
```javascript
// Estados básicos para capacitaciones
const estadosCapacitacion = {
  planificacion: 'planificacion',
  ejecucion: 'ejecucion',
  terminado: 'terminado',
  cancelado: 'cancelado'
};
```

---

## 🎨 **COMPONENTES UI IMPLEMENTADOS**

### **Badge de Estado**
```jsx
const EstadoBadge = ({ estado, className = "" }) => {
  const getEstadoConfig = (estado) => {
    const configs = {
      'planificacion': { label: 'Planificación', color: 'bg-blue-100 text-blue-800' },
      'ejecucion': { label: 'Ejecución', color: 'bg-yellow-100 text-yellow-800' },
      'terminado': { label: 'Terminado', color: 'bg-green-100 text-green-800' },
      'cancelado': { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    };
    return configs[estado] || { label: estado, color: 'bg-gray-100 text-gray-800' };
  };

  const config = getEstadoConfig(estado);
  
  return (
    <Badge className={`${config.color} ${className}`}>
      {config.label}
    </Badge>
  );
};
```

### **Filtros por Estado**
```jsx
const FiltroEstados = ({ estados, estadoSeleccionado, onCambioEstado }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {estados.map(estado => (
        <Button
          key={estado.value}
          variant={estadoSeleccionado === estado.value ? "default" : "outline"}
          size="sm"
          onClick={() => onCambioEstado(estado.value)}
        >
          {estado.label}
        </Button>
      ))}
    </div>
  );
};
```

---

## 📊 **ESTADÍSTICAS Y MÉTRICAS**

### **Contadores por Estado**
```javascript
const getEstadisticasEstados = (registros) => {
  return {
    planificacion: registros.filter(r => r.estado === 'planificacion').length,
    ejecucion: registros.filter(r => r.estado === 'ejecucion').length,
    terminado: registros.filter(r => r.estado === 'terminado').length,
    total: registros.length
  };
};
```

### **Dashboard de Estados**
```jsx
const DashboardEstados = ({ estadisticas }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Planificación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.planificacion}</div>
        </CardContent>
      </Card>
      {/* ... otros estados */}
    </div>
  );
};
```

---

## 🔧 **IMPLEMENTACIÓN TÉCNICA**

### **Base de Datos**
```sql
-- Campo estándar en todas las tablas
estado VARCHAR(50) DEFAULT 'planificacion',
fecha_estado DATETIME DEFAULT CURRENT_TIMESTAMP,
usuario_estado INTEGER REFERENCES usuarios(id),

-- Índice para consultas por estado
CREATE INDEX IF NOT EXISTS idx_tabla_estado ON tabla_name(estado);
```

### **API Backend**
```javascript
// Actualización de estado
router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    const result = await tursoClient.execute({
      sql: `UPDATE tabla SET estado = ?, fecha_estado = CURRENT_TIMESTAMP, usuario_estado = ? WHERE id = ? AND organization_id = ?`,
      args: [estado, req.user.id, id, req.user.organization_id]
    });
    
    res.json({ success: true, message: 'Estado actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});
```

---

## 📋 **ESTÁNDARES DE USO**

### **Reglas Obligatorias**
1. **Todos los registros** deben tener un estado
2. **Estados iniciales** deben ser consistentes
3. **Transiciones** deben seguir el workflow definido
4. **Auditoría** de cambios de estado obligatoria

### **Convenciones de Nomenclatura**
- Estados en **minúsculas** con guiones bajos
- Prefijos numéricos para orden: `p1_`, `e2_`, `v3_`
- Nombres descriptivos: `planificacion`, `ejecucion`, `terminado`

---

*Documentación actualizada: Enero 2025*
*Sistema implementado y funcionando en producción* 