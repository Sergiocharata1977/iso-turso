## 🔄 Tipo de Cambio

- [ ] 🐛 Bug fix (cambio que soluciona un problema)
- [ ] ✨ Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] 💥 Breaking change (cambio que puede romper funcionalidad existente)
- [ ] 📚 Documentación (cambios solo en documentación)
- [ ] 🎨 Estilo (cambios de formato, sin cambios en lógica)
- [ ] ♻️ Refactorización (cambios de código sin agregar funcionalidad ni corregir bugs)
- [ ] ⚡ Performance (cambios que mejoran el rendimiento)
- [ ] 🧪 Tests (agregar tests faltantes o corregir tests existentes)

## 📋 Descripción

Descripción clara y concisa de los cambios realizados.

## 🎯 Problema Relacionado

Fixes #(issue_number)

## 🔧 Cambios Realizados

### Backend
- [ ] Cambios en rutas/controladores
- [ ] Cambios en middleware
- [ ] Cambios en base de datos
- [ ] Cambios en servicios
- [ ] Cambios en autenticación/autorización

### Frontend
- [ ] Cambios en componentes
- [ ] Cambios en servicios
- [ ] Cambios en rutas
- [ ] Cambios en estilos
- [ ] Cambios en hooks/utils

### Otros
- [ ] Cambios en documentación
- [ ] Cambios en configuración
- [ ] Cambios en scripts
- [ ] Cambios en dependencias

## 🛡️ Protocolo Multi-Tenant

**¿Este cambio afecta el protocolo multi-tenant?**
- [ ] No afecta el multi-tenancy
- [ ] Respeta el protocolo multi-tenant existente
- [ ] Mejora el protocolo multi-tenant
- [ ] Requiere cambios en el protocolo multi-tenant

**Si afecta multi-tenancy, confirma:**
- [ ] Usa `ensureTenant` middleware
- [ ] Usa `secureQuery` para filtrar por organization_id
- [ ] Incluye `logTenantOperation` para auditoría
- [ ] Verifica permisos con `checkPermission`
- [ ] Todas las queries incluyen organization_id

## 📊 Impacto

**¿Qué módulos se ven afectados?**
- [ ] 👥 RRHH (Personal, Capacitaciones, Evaluaciones)
- [ ] 📊 Procesos (Gestión de procesos, Indicadores, Objetivos)
- [ ] 🔍 Calidad (Hallazgos, Acciones correctivas, Auditorías)
- [ ] 📋 Documentos (Control documental, Normas)
- [ ] 🎯 Otros (Productos, Tickets, Encuestas)
- [ ] 🏗️ Arquitectura (Base de datos, API, Seguridad)
- [ ] 🎨 UI/UX (Interfaz, Diseño, Experiencia)

## 🧪 Testing

**¿Cómo se probaron estos cambios?**
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Tests manuales
- [ ] Tests de regresión
- [ ] Tests de multi-tenancy

**Describe las pruebas realizadas:**
```
Descripción de las pruebas realizadas para verificar que los cambios funcionan correctamente.
```

## 📱 Responsive Design

**¿Se verificó el responsive design?**
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] No aplica (solo backend)

## 🎨 Estándares de Código

**¿Se siguieron los estándares del proyecto?**
- [ ] Nomenclatura correcta ([Modulo]Component.jsx)
- [ ] Ubicación correcta (components/[modulo]/)
- [ ] Uso de shadcn/ui components
- [ ] Manejo de errores implementado
- [ ] Loading states incluidos
- [ ] Validaciones de inputs

## 📋 Checklist

### Código
- [ ] Mi código sigue las convenciones de estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, especialmente en áreas difíciles de entender
- [ ] He realizado los cambios correspondientes en la documentación
- [ ] Mis cambios no generan nuevas advertencias

### Testing
- [ ] He agregado tests que prueban que mi corrección es efectiva o que mi funcionalidad funciona
- [ ] Los tests unitarios nuevos y existentes pasan localmente con mis cambios
- [ ] He probado el aislamiento multi-tenant

### Documentación
- [ ] He actualizado la documentación relevante
- [ ] He actualizado los comentarios en el código
- [ ] He verificado que los links en la documentación funcionen

### Seguridad
- [ ] He verificado que no hay vulnerabilidades de seguridad
- [ ] He validado todos los inputs de usuario
- [ ] He verificado el aislamiento entre organizaciones

## 📸 Screenshots

Si hay cambios visuales, agregar screenshots del antes y después.

### Antes
<!-- Agregar screenshot del estado anterior -->

### Después
<!-- Agregar screenshot del estado nuevo -->

## 🔄 Migración/Rollback

**¿Se requieren pasos especiales para desplegar estos cambios?**
- [ ] No requiere pasos especiales
- [ ] Requiere migración de base de datos
- [ ] Requiere cambios en variables de entorno
- [ ] Requiere actualización de dependencias

**Instrucciones de migración:**
```bash
# Agregar instrucciones específicas si es necesario
```

**Plan de rollback:**
```bash
# Agregar plan de rollback si es necesario
```

## 📋 Información Adicional

Cualquier información adicional que sea relevante para la revisión.

---

**⚠️ Antes de crear el PR:**
- [ ] He seguido [NORMAS_Y_ESTANDARES.md](NORMAS_Y_ESTANDARES.md)
- [ ] He probado localmente que todo funciona
- [ ] He verificado que respeta el protocolo multi-tenant
- [ ] He incluido tests apropiados
- [ ] He actualizado la documentación necesaria 