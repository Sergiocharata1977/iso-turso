# 📋 Reglas y Normas Generales para Relaciones SGC

## 🎯 **Propósito del Sistema de Relaciones**

La tabla `relaciones_sgc` es un sistema genérico para manejar **cualquier tipo de relación** entre entidades del sistema ISO 9001. Permite conectar diferentes tipos de registros sin necesidad de crear tablas específicas para cada relación.

## 🏗️ **Estructura de la Tabla `relaciones_sgc`**

```sql
relaciones_sgc:
├── id: INTEGER PRIMARY KEY AUTOINCREMENT
├── organization_id: INTEGER UNIQUE NOT NULL
├── origen_tipo: TEXT UNIQUE NOT NULL
├── origen_id: INTEGER UNIQUE NOT NULL
├── destino_tipo: TEXT UNIQUE NOT NULL
├── destino_id: INTEGER UNIQUE NOT NULL
├── descripcion: TEXT
├── fecha_creacion: NUMERIC DEFAULT (CURRENT_TIMESTAMP)
└── usuario_creador: TEXT
```

## 📝 **Tipos de Relaciones Estándar**

### **1. Reuniones ↔ Documentos**
```javascript
{
  origen_tipo: 'reunion',
  origen_id: 'reunion_123',
  destino_tipo: 'documento',
  destino_id: 'doc_456',
  descripcion: 'Documento adjunto a la reunión'
}
```

### **2. Hallazgos ↔ Acciones**
```javascript
{
  origen_tipo: 'hallazgo',
  origen_id: 'hallazgo_789',
  destino_tipo: 'accion',
  destino_id: 'accion_101',
  descripcion: 'Acción correctiva para el hallazgo'
}
```

### **3. Procesos ↔ Documentos**
```javascript
{
  origen_tipo: 'proceso',
  origen_id: 'proceso_202',
  destino_tipo: 'documento',
  destino_id: 'doc_303',
  descripcion: 'Procedimiento del proceso'
}
```

### **4. Personal ↔ Puestos**
```javascript
{
  origen_tipo: 'personal',
  origen_id: 'personal_404',
  destino_tipo: 'puesto',
  destino_id: 'puesto_505',
  descripcion: 'Puesto asignado al personal'
}
```

### **5. Auditorías ↔ Hallazgos**
```javascript
{
  origen_tipo: 'auditoria',
  origen_id: 'auditoria_606',
  destino_tipo: 'hallazgo',
  destino_id: 'hallazgo_707',
  descripcion: 'Hallazgo encontrado en la auditoría'
}
```

## 🔧 **Reglas de Nomenclatura**

### **Tipos de Origen (`origen_tipo`):**
- ✅ `reunion` - Reuniones
- ✅ `hallazgo` - Hallazgos
- ✅ `proceso` - Procesos
- ✅ `personal` - Personal
- ✅ `auditoria` - Auditorías
- ✅ `documento` - Documentos
- ✅ `norma` - Normas
- ✅ `accion` - Acciones
- ✅ `indicador` - Indicadores
- ✅ `objetivo` - Objetivos

### **Tipos de Destino (`destino_tipo`):**
- ✅ `documento` - Documentos
- ✅ `accion` - Acciones
- ✅ `puesto` - Puestos
- ✅ `departamento` - Departamentos
- ✅ `hallazgo` - Hallazgos
- ✅ `norma` - Normas
- ✅ `proceso` - Procesos
- ✅ `personal` - Personal

## 📋 **Reglas de Validación**

### **1. Unicidad de Relaciones**
```sql
UNIQUE (organization_id, origen_tipo, origen_id, destino_tipo, destino_id)
```
- **No se pueden duplicar relaciones** entre los mismos registros
- Cada organización puede tener sus propias relaciones

### **2. Integridad Referencial**
- El `origen_id` debe existir en la tabla correspondiente al `origen_tipo`
- El `destino_id` debe existir en la tabla correspondiente al `destino_tipo`

### **3. Organización**
- Todas las relaciones pertenecen a una `organization_id`
- Las consultas deben filtrar por `organization_id`

## 🚀 **Cómo Crear Relaciones**

### **Frontend (JavaScript):**
```javascript
import { relacionesService } from './relacionesService.js';

// Crear relación reunión ↔ documento
await relacionesService.create({
  origen_tipo: 'reunion',
  origen_id: 'reunion_123',
  destino_tipo: 'documento',
  destino_id: 'doc_456',
  descripcion: 'Documento adjunto a la reunión'
});

// Crear relación hallazgo ↔ acción
await relacionesService.create({
  origen_tipo: 'hallazgo',
  origen_id: 'hallazgo_789',
  destino_tipo: 'accion',
  destino_id: 'accion_101',
  descripcion: 'Acción correctiva para el hallazgo'
});
```

### **Backend (SQL):**
```sql
INSERT INTO relaciones_sgc (
  organization_id, origen_tipo, origen_id, destino_tipo, destino_id, descripcion, usuario_creador
) VALUES (
  1, 'reunion', 'reunion_123', 'documento', 'doc_456', 'Documento adjunto', 'usuario@email.com'
);
```

## 🔍 **Cómo Consultar Relaciones**

### **1. Obtener todas las relaciones de un origen:**
```javascript
const relaciones = await relacionesService.getByOrigenTipo('reunion');
```

### **2. Obtener relaciones específicas:**
```javascript
const documentosReunion = await relacionesService.getByOrigenTipo('reunion')
  .then(relaciones => relaciones.filter(r => r.origen_id === 'reunion_123'));
```

### **3. Obtener relaciones por destino:**
```javascript
const relacionesDocumento = await relacionesService.getByDestinoTipo('documento');
```

## 🗑️ **Cómo Eliminar Relaciones**

```javascript
// Eliminar relación específica
await relacionesService.delete(relacionId);

// Eliminar todas las relaciones de un origen
const relaciones = await relacionesService.getByOrigenTipo('reunion');
for (const relacion of relaciones) {
  await relacionesService.delete(relacion.id);
}
```

## 📊 **Casos de Uso Comunes**

### **1. Reuniones con Documentos**
- **Propósito:** Adjuntar documentos a reuniones
- **Ejemplo:** Acta de reunión, presentaciones, acuerdos

### **2. Hallazgos con Acciones**
- **Propósito:** Vincular acciones correctivas a hallazgos
- **Ejemplo:** Acción para corregir no conformidad

### **3. Procesos con Documentos**
- **Propósito:** Asociar procedimientos a procesos
- **Ejemplo:** Manual de procedimientos del proceso

### **4. Personal con Puestos**
- **Propósito:** Asignar puestos al personal
- **Ejemplo:** Relación empleado-puesto

### **5. Auditorías con Hallazgos**
- **Propósito:** Registrar hallazgos de auditorías
- **Ejemplo:** No conformidades encontradas

## ⚠️ **Consideraciones Importantes**

### **1. Performance**
- Las consultas complejas pueden ser lentas
- Usar índices apropiados
- Considerar paginación para grandes volúmenes

### **2. Seguridad**
- Validar permisos antes de crear/eliminar relaciones
- Filtrar siempre por `organization_id`
- Sanitizar inputs

### **3. Mantenimiento**
- Documentar nuevos tipos de relaciones
- Mantener consistencia en nomenclatura
- Revisar relaciones huérfanas periódicamente

## 🔄 **Migración de Relaciones Existentes**

Si tienes tablas de relaciones específicas, puedes migrarlas:

```sql
-- Ejemplo: Migrar reuniones_documentos a relaciones_sgc
INSERT INTO relaciones_sgc (
  organization_id, origen_tipo, origen_id, destino_tipo, destino_id, descripcion
)
SELECT 
  1, 'reunion', reunion_id, 'documento', documento_id, 'Migrado desde reuniones_documentos'
FROM reuniones_documentos;
```

## 📈 **Métricas y Reportes**

### **Relaciones más comunes:**
```sql
SELECT origen_tipo, destino_tipo, COUNT(*) as total
FROM relaciones_sgc 
WHERE organization_id = 1
GROUP BY origen_tipo, destino_tipo
ORDER BY total DESC;
```

### **Relaciones recientes:**
```sql
SELECT * FROM relaciones_sgc 
WHERE organization_id = 1
ORDER BY fecha_creacion DESC
LIMIT 10;
```

---

## 🎯 **Resumen de Reglas Clave**

1. **✅ Usar nomenclatura estándar** para `origen_tipo` y `destino_tipo`
2. **✅ Siempre incluir `organization_id`** en las consultas
3. **✅ Validar existencia** de registros origen y destino
4. **✅ Documentar descripciones** claras de las relaciones
5. **✅ Evitar duplicados** usando la restricción UNIQUE
6. **✅ Mantener consistencia** en el formato de IDs
7. **✅ Usar el servicio existente** `relacionesService.js`

---

*Este documento debe actualizarse cuando se agreguen nuevos tipos de relaciones o se modifiquen las reglas existentes.* 