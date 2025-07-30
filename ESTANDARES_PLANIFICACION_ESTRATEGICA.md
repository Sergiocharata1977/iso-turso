# ESTÁNDARES Y NORMAS PARA PLANIFICACIÓN ESTRATÉGICA CON CALENDARIO
## Sistema IsoFlow3 - ISO 9001:2015

### 📋 OBJETIVO
Establecer reglas y normas estándar para que todos los registros del sistema IsoFlow3 puedan ser consumidos de manera uniforme por el sistema de planificación estratégica con calendario, garantizando consistencia en el manejo de estados y trazabilidad completa.

---

## 🎯 MÓDULOS ANALIZADOS Y ESTANDARIZADOS

### 1. **AUDITORÍAS** 
- **Estado actual**: Implementado con estados personalizados
- **Estados estándar**: `planificacion` → `ejecucion` → `terminado`
- **Campos calendario**: `fecha_inicio`, `fecha_fin`, `fecha_planificada`
- **Responsable**: `auditor_lider`
- **Consumo**: Integración con calendario para programación de auditorías

### 2. **CAPACITACIONES**
- **Estado actual**: Implementado con estados básicos
- **Estados estándar**: `planificacion` → `ejecucion` → `terminado`
- **Campos calendario**: `fecha_inicio`, `fecha_fin`, `fecha_programada`
- **Responsable**: `instructor_principal`
- **Consumo**: Programación automática en calendario organizacional

### 3. **COMPETENCIAS (Evaluación de Competencias)**
- **Estado actual**: Implementado básico
- **Estados estándar**: `planificacion` → `ejecucion` → `terminado`
- **Campos calendario**: `fecha_evaluacion`, `fecha_vencimiento`, `proxima_evaluacion`
- **Responsable**: `evaluador_asignado`
- **Consumo**: Ciclo automático de evaluaciones periódicas

### 4. **REUNIONES**
- **Estado actual**: Implementado con estados básicos
- **Estados estándar**: `planificacion` → `ejecucion` → `terminado`
- **Campos calendario**: `fecha`, `hora`, `duracion_estimada`
- **Responsable**: `organizador_reunion`
- **Consumo**: Integración directa con calendario organizacional

### 5. **PLANIFICACIÓN DE PRODUCTOS**
- **Estado actual**: Implementado básico
- **Estados estándar**: `planificacion` → `ejecucion` → `terminado`
- **Campos calendario**: `fecha_lanzamiento`, `fecha_desarrollo`, `fecha_revision`
- **Responsable**: `product_manager`
- **Consumo**: Roadmap de productos en calendario estratégico

### 6. **REGISTROS FUTUROS**
- Cualquier nuevo registro debe seguir estos estándares
- Implementación obligatoria de campos estándar
- Integración automática con sistema de calendario

---

## 📊 ESTÁNDAR DE ESTADOS UNIFICADO

### **ESTADOS PRINCIPALES** (Obligatorios para todos los registros)

#### 🟡 **PLANIFICACIÓN**
- **Código**: `planificacion`
- **Descripción**: Registro en fase de planificación y preparación
- **Características**:
  - Fechas tentativas
  - Recursos en asignación
  - Documentación en preparación
  - Responsables definidos

#### 🔵 **EJECUCIÓN** 
- **Código**: `ejecucion`
- **Descripción**: Registro en fase de ejecución activa
- **Características**:
  - Fechas confirmadas
  - Recursos asignados
  - Actividades en progreso
  - Seguimiento activo

#### 🟢 **TERMINADO**
- **Código**: `terminado`
- **Descripción**: Registro completado exitosamente
- **Características**:
  - Objetivos cumplidos
  - Resultados documentados
  - Evaluación completada
  - Archivado para consulta

### **ESTADOS ADICIONALES** (Opcionales según contexto)

#### 🔴 **CANCELADO**
- **Código**: `cancelado`
- **Descripción**: Registro cancelado antes de completarse
- **Uso**: Cuando se cancela por decisión estratégica

#### 🟠 **SUSPENDIDO**
- **Código**: `suspendido`
- **Descripción**: Registro temporalmente suspendido
- **Uso**: Pausa temporal por recursos o prioridades

#### ⚪ **BORRADOR**
- **Código**: `borrador`
- **Descripción**: Registro en preparación inicial
- **Uso**: Antes de pasar a planificación

---

## 🗓️ CAMPOS ESTÁNDAR DE CALENDARIO

### **CAMPOS OBLIGATORIOS** (Todos los registros)

```sql
-- Campos de fechas estándar
fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
fecha_inicio DATE,
fecha_fin DATE,
estado VARCHAR(20) DEFAULT 'planificacion',
responsable_principal VARCHAR(100),
organization_id INTEGER NOT NULL,

-- Campos de seguimiento
progreso INTEGER DEFAULT 0, -- Porcentaje 0-100
prioridad VARCHAR(10) DEFAULT 'media', -- alta, media, baja
```

### **CAMPOS OPCIONALES** (Según tipo de registro)

```sql
-- Para registros con horarios específicos
hora_inicio TIME,
hora_fin TIME,
duracion_minutos INTEGER,

-- Para registros recurrentes
es_recurrente BOOLEAN DEFAULT FALSE,
frecuencia_recurrencia VARCHAR(20), -- diaria, semanal, mensual, anual
proxima_ocurrencia DATE,

-- Para registros con ubicación
ubicacion VARCHAR(200),
modalidad VARCHAR(20), -- presencial, virtual, hibrida

-- Para registros con participantes
participantes_requeridos TEXT, -- JSON array
participantes_confirmados TEXT, -- JSON array
```

---

## 🔗 SISTEMA DE RELACIONES ESTÁNDAR

### **TABLA DE RELACIONES SGC**
```sql
CREATE TABLE IF NOT EXISTS relaciones_sgc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origen_tipo VARCHAR(50) NOT NULL, -- auditoria, capacitacion, reunion, etc.
    origen_id VARCHAR(50) NOT NULL,
    destino_tipo VARCHAR(50) NOT NULL, -- proceso, documento, personal, etc.
    destino_id VARCHAR(50) NOT NULL,
    tipo_relacion VARCHAR(50) NOT NULL, -- asociado_a, requiere, genera, etc.
    organization_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **TIPOS DE RELACIONES ESTÁNDAR**
- `asociado_a`: Relación general de asociación
- `requiere`: El origen requiere el destino
- `genera`: El origen genera el destino
- `participa_en`: Personal que participa
- `documenta`: Documentos relacionados
- `evalua`: Procesos que se evalúan
- `mejora`: Acciones de mejora derivadas

---

## 📈 INTEGRACIÓN CON PLANIFICACIÓN ESTRATÉGICA

### **CONSUMO ESTÁNDAR POR EL CALENDARIO**

#### 1. **Query Base para Todos los Registros**
```sql
SELECT 
    '{tipo_registro}' as tipo,
    id,
    titulo as nombre,
    descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
    responsable_principal,
    prioridad,
    progreso
FROM {tabla_registro}
WHERE organization_id = ? 
    AND estado IN ('planificacion', 'ejecucion')
    AND fecha_inicio >= ?
    AND fecha_fin <= ?
ORDER BY fecha_inicio ASC;
```

#### 2. **Vista Unificada de Calendario**
```sql
CREATE VIEW IF NOT EXISTS vista_calendario_estrategico AS
SELECT * FROM (
    SELECT 'auditoria' as tipo, id, titulo as nombre, fecha_inicio, fecha_fin, estado, responsable_principal FROM auditorias WHERE organization_id = ?
    UNION ALL
    SELECT 'capacitacion' as tipo, id, titulo as nombre, fecha_inicio, fecha_fin, estado, responsable_principal FROM capacitaciones WHERE organization_id = ?
    UNION ALL
    SELECT 'reunion' as tipo, id, titulo as nombre, fecha, fecha as fecha_fin, estado, organizador_reunion FROM reuniones WHERE organization_id = ?
    UNION ALL
    SELECT 'evaluacion_competencia' as tipo, id, nombre, fecha_evaluacion, fecha_vencimiento, estado, evaluador_asignado FROM evaluaciones_competencias WHERE organization_id = ?
    UNION ALL
    SELECT 'producto' as tipo, id, nombre, fecha_lanzamiento, fecha_revision, estado, product_manager FROM productos WHERE organization_id = ?
) 
ORDER BY fecha_inicio ASC;
```

---

## 🛠️ REGLAS DE IMPLEMENTACIÓN

### **PARA DESARROLLADORES**

#### 1. **Creación de Nuevos Registros**
```javascript
// Estructura mínima obligatoria
const nuevoRegistro = {
    id: generateUUID(),
    titulo: string,
    descripcion: string,
    fecha_inicio: date,
    fecha_fin: date,
    estado: 'planificacion', // Estado inicial obligatorio
    responsable_principal: string,
    organization_id: number,
    progreso: 0,
    prioridad: 'media'
};
```

#### 2. **Transiciones de Estado**
```javascript
// Función estándar para cambio de estados
function cambiarEstado(registroId, nuevoEstado, userId) {
    const estadosValidos = ['planificacion', 'ejecucion', 'terminado', 'cancelado', 'suspendido'];
    
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error('Estado no válido');
    }
    
    // Validar transiciones permitidas
    const transicionesPermitidas = {
        'planificacion': ['ejecucion', 'cancelado', 'suspendido'],
        'ejecucion': ['terminado', 'cancelado', 'suspendido'],
        'suspendido': ['planificacion', 'ejecucion', 'cancelado'],
        'terminado': [], // Estado final
        'cancelado': [] // Estado final
    };
    
    // Lógica de validación y actualización
    // ...
}
```

#### 3. **API Endpoints Estándar**
```javascript
// Endpoints obligatorios para todos los módulos
GET /api/{modulo}/calendario?inicio={fecha}&fin={fecha}
GET /api/{modulo}/estados
PUT /api/{modulo}/{id}/estado
GET /api/{modulo}/planificacion-estrategica
```

### **PARA ADMINISTRADORES**

#### 1. **Configuración de Estados por Módulo**
- Cada módulo puede tener estados adicionales específicos
- Los 3 estados principales son obligatorios
- Configuración en tabla `configuracion_estados`

#### 2. **Permisos y Roles**
- Solo usuarios con rol `planificador` pueden cambiar estados
- Usuarios con rol `ejecutor` pueden actualizar progreso
- Administradores tienen acceso completo

#### 3. **Reportes y Métricas**
- Dashboard unificado de todos los registros por estado
- Métricas de cumplimiento por tipo de registro
- Alertas automáticas por vencimientos

---

## 📋 CHECKLIST DE CUMPLIMIENTO

### **Para Cada Módulo Existente**
- [ ] ✅ Campos estándar de calendario implementados
- [ ] ✅ Estados estándar configurados
- [ ] ✅ API endpoints de calendario creados
- [ ] ✅ Integración con vista unificada
- [ ] ✅ Validaciones de transición de estados
- [ ] ✅ Documentación específica del módulo

### **Para Nuevos Módulos**
- [ ] 📋 Seguir estructura de campos obligatorios
- [ ] 📋 Implementar estados estándar desde el inicio
- [ ] 📋 Crear endpoints de integración
- [ ] 📋 Documentar estados específicos adicionales
- [ ] 📋 Pruebas de integración con calendario
- [ ] 📋 Configurar permisos y roles

---

## 🚀 PRÓXIMOS PASOS

### **FASE 1: ESTANDARIZACIÓN** (Semana 1-2)
1. Actualizar módulos existentes con campos estándar
2. Implementar transiciones de estado unificadas
3. Crear vista unificada de calendario
4. Documentar APIs de integración

### **FASE 2: INTEGRACIÓN** (Semana 3-4)
1. Desarrollar dashboard de planificación estratégica
2. Implementar calendario unificado
3. Crear reportes de seguimiento
4. Configurar alertas automáticas

### **FASE 3: OPTIMIZACIÓN** (Semana 5-6)
1. Optimizar consultas de vista unificada
2. Implementar cache para mejor rendimiento
3. Crear herramientas de análisis predictivo
4. Documentación completa para usuarios

---

## 📞 CONTACTO Y SOPORTE

**Desarrollador Principal**: Sistema IsoFlow3  
**Versión del Documento**: 1.0  
**Fecha de Creación**: 29 de Julio, 2025  
**Última Actualización**: 29 de Julio, 2025  

---

*Este documento es parte del Sistema de Gestión de Calidad ISO 9001:2015 y debe ser revisado trimestralmente para asegurar su vigencia y aplicabilidad.*
