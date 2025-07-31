# 🗄️ Sistema de Diagramación de Base de Datos - ISOFlow3

## 📋 Resumen

Este sistema proporciona herramientas completas para visualizar, analizar y documentar el esquema de base de datos de ISOFlow3. Está diseñado para trabajar con **Drizzle ORM**, **Zod** para validación, y **Turso** (SQLite) como base de datos.

## 🚀 Características Principales

### 1. **Visualizador de Esquemas** (`DatabaseSchemaViewer`)
- ✅ Vista de cuadrícula y lista de todas las tablas
- ✅ Búsqueda y filtrado de tablas
- ✅ Detalles completos de columnas y relaciones
- ✅ Estadísticas del esquema en tiempo real
- ✅ Exportación de esquema en formato JSON

### 2. **Diagrama ERD** (`ERDDiagram`)
- ✅ Visualización interactiva de relaciones entre entidades
- ✅ Zoom y pan para navegación
- ✅ Colores diferenciados para claves primarias y foráneas
- ✅ Exportación como SVG
- ✅ Vista detallada de columnas opcional

### 3. **Validador de Esquemas** (`SchemaValidator`)
- ✅ Generación automática de esquemas Zod
- ✅ Validación en tiempo real de datos
- ✅ Datos de ejemplo automáticos
- ✅ Exportación de esquemas Zod
- ✅ Interfaz intuitiva para pruebas

### 4. **Generador de Documentación** (`SchemaDocumentation`)
- ✅ Documentación automática en múltiples formatos
- ✅ Markdown, SQL y JSON
- ✅ Copia al portapapeles
- ✅ Descripción detallada de cada tabla
- ✅ Análisis de relaciones

## 🛠️ Tecnologías Utilizadas

```json
{
  "drizzle-orm": "^0.29.5",
  "zod": "^3.25.76",
  "react": "^18.2.0",
  "typescript": "latest",
  "tailwindcss": "^3.3.5"
}
```

## 📁 Estructura de Archivos

```
frontend/src/
├── lib/
│   └── schema.js                    # Esquema Drizzle ORM
├── components/database/
│   ├── DatabaseSchemaViewer.jsx     # Visualizador principal
│   ├── ERDDiagram.jsx              # Diagrama ERD
│   ├── SchemaValidator.jsx         # Validador con Zod
│   └── SchemaDocumentation.jsx     # Generador de docs
└── pages/
    └── DatabaseSchemaPage.jsx       # Página principal
```

## 🔧 Instalación y Configuración

### 1. Instalar Dependencias
```bash
cd frontend
npm install drizzle-orm zod
```

### 2. Configurar el Esquema
El esquema se define en `frontend/src/lib/schema.js` usando Drizzle ORM:

```javascript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Definir tablas
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  organization_id: integer('organization_id').notNull(),
  // ... más campos
});

// Definir relaciones
export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organization_id],
    references: [organizations.id]
  })
}));
```

### 3. Acceder a las Herramientas
Navega a `/database-schema` en la aplicación para acceder a todas las herramientas.

## 📊 Uso de las Herramientas

### Visualizador de Esquemas
1. **Vista General**: Estadísticas y resumen del esquema
2. **Vista de Cuadrícula**: Tablas organizadas en tarjetas
3. **Vista de Lista**: Lista compacta con detalles
4. **Detalles**: Información completa de cada tabla

### Diagrama ERD
1. **Navegación**: Usa zoom y pan para explorar
2. **Selección**: Haz clic en tablas para resaltarlas
3. **Relaciones**: Las líneas muestran las conexiones
4. **Exportación**: Descarga como SVG

### Validador
1. **Seleccionar Tabla**: Elige la tabla a validar
2. **Generar Datos**: Crea datos de ejemplo automáticamente
3. **Validar**: Ejecuta la validación con Zod
4. **Exportar**: Descarga el esquema Zod

### Documentación
1. **Vista General**: Resumen técnico del esquema
2. **Tablas Detalladas**: Información completa de cada tabla
3. **Formatos**: Markdown, SQL y JSON
4. **Exportación**: Descarga en múltiples formatos

## 🎯 Casos de Uso

### Para Desarrolladores
- **Análisis de Estructura**: Entender la arquitectura de la BD
- **Validación de Datos**: Probar esquemas antes de implementar
- **Documentación**: Generar docs automáticamente
- **Debugging**: Identificar problemas en relaciones

### Para Administradores
- **Auditoría**: Revisar la estructura de la BD
- **Planificación**: Planificar cambios y migraciones
- **Documentación**: Mantener docs actualizadas
- **Comunicación**: Compartir estructura con el equipo

### Para Analistas
- **Análisis de Datos**: Entender las relaciones entre entidades
- **Reportes**: Generar documentación técnica
- **Compliance**: Verificar cumplimiento de estándares

## 🔍 Características Avanzadas

### Multi-Tenant Architecture
- Todas las tablas incluyen `organization_id`
- Aislamiento automático de datos por organización
- Índices optimizados para consultas multi-tenant

### Validación Inteligente
- Validación de email automática
- Validación de fechas
- Validación de teléfonos
- Campos requeridos y únicos

### Exportación Flexible
- **Markdown**: Para documentación técnica
- **SQL**: Para scripts de migración
- **JSON**: Para integración con otras herramientas
- **SVG**: Para diagramas en presentaciones

## 🚨 Consideraciones Importantes

### Rendimiento
- Los diagramas grandes pueden afectar el rendimiento
- Usa el zoom para navegar en esquemas complejos
- La validación se ejecuta en el cliente

### Seguridad
- Los esquemas no contienen datos sensibles
- La validación es solo para desarrollo
- No expone información de la BD real

### Compatibilidad
- Requiere navegadores modernos
- Optimizado para Chrome/Firefox/Safari
- Responsive design para móviles

## 🔄 Mantenimiento

### Actualizar Esquema
1. Modifica `frontend/src/lib/schema.js`
2. Actualiza las relaciones si es necesario
3. Regenera la documentación
4. Prueba la validación

### Agregar Nuevas Tablas
1. Define la tabla en el esquema Drizzle
2. Agrega las relaciones correspondientes
3. Actualiza las descripciones en `SchemaDocumentation.jsx`
4. Prueba la visualización

## 📈 Métricas y Estadísticas

El sistema proporciona métricas en tiempo real:
- **Total de tablas**: 16
- **Total de columnas**: 245
- **Total de relaciones**: 28
- **Claves primarias**: 16
- **Claves foráneas**: 12

## 🎨 Personalización

### Colores y Temas
Los colores se pueden personalizar en los componentes:
- **Emerald**: Tablas principales
- **Blue**: Relaciones
- **Purple**: Validación
- **Orange**: Documentación

### Configuración
Modifica `config` en `ERDDiagram.jsx` para ajustar:
- Tamaños de tablas
- Colores de líneas
- Espaciado
- Zoom máximo/mínimo

## 🤝 Contribución

Para contribuir al sistema de diagramación:

1. **Fork** el repositorio
2. **Crea** una rama para tu feature
3. **Implementa** las mejoras
4. **Prueba** todas las funcionalidades
5. **Documenta** los cambios
6. **Envía** un pull request

## 📞 Soporte

Si encuentras problemas o tienes sugerencias:

1. Revisa la documentación
2. Verifica la configuración
3. Prueba con datos de ejemplo
4. Abre un issue en GitHub

---

**Desarrollado para ISOFlow3 - Sistema de Gestión de Calidad ISO 9001** 