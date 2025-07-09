# 📚 Documentación Unificada - IsoFlow3

## 1. Visión General
IsoFlow3 es un sistema SAAS multi-tenant para gestión de calidad ISO, donde múltiples empresas (organizaciones) usan la misma aplicación con datos aislados. Cada organización tiene sus propios usuarios, departamentos, procesos, etc.

---

## 2. Reglas de Negocio y Relaciones

### 2.1. Multi-Tenant
- **Todas las tablas principales deben tener `organizacion_id`** para asegurar el aislamiento de datos y la seguridad multi-tenant.
- **Usuarios**: Cada usuario pertenece a una organización.
- **Acceso**: Cada usuario solo puede ver y operar sobre los datos de su organización.

### 2.2. Relaciones Principales
- **Organización**
  - Tiene muchos departamentos, puestos, personal, procesos, etc.
- **Departamento**
  - Pertenece a una organización.
  - Tiene muchos puestos.
- **Puesto**
  - Pertenece a un solo departamento.
  - Puede ser responsable de un proceso (solo uno).
  - Puede ser ocupado por varias personas (relación N:M con personal).
- **Personal**
  - Pertenece a una organización.
  - Puede ocupar varios puestos.
- **Proceso**
  - Pertenece a una organización.
  - Tiene un solo puesto responsable.
- **Capacitaciones/Evaluaciones**
  - Se asignan a personal de forma individual.

### 2.3. Eliminación y Existencia de Registros
- **No se elimina una organización**: Si un cliente deja de pagar, simplemente se suspende el acceso. Los datos quedan preservados.
- **Eliminación de departamento**: Los puestos quedan sin departamento asignado. Se debe generar una alerta para reasignar esos puestos.
- **Eliminación de puesto**: El personal queda sin puesto asignado. Se debe alertar para reasignar.
- **Las relaciones no son obligatorias para la existencia de un registro**: Un registro puede existir sin estar relacionado. Las relaciones se crean posteriormente mediante formularios de asignación.
- **Siempre marcar visualmente los registros sin relación** y mostrar alertas para facilitar la gestión.

---

## 3. Reglas de Integridad y Prevención de Bucles
- **No permitir bucles en relaciones**: Ejemplo, un departamento no puede ser su propio padre, ni un puesto su propio subordinado.
- **Validar en backend antes de guardar relaciones** para evitar ciclos.
- **Las relaciones se gestionan por formularios específicos** y pueden ser modificadas en cualquier momento.

---

## 4. Roles y Permisos
- **super_admin**: Acceso total a toda la plataforma, gestión de organizaciones y usuarios globales.
- **admin**: Acceso completo a su organización, gestión de usuarios, departamentos, puestos, procesos, etc.
- **manager**: Gestión operativa de su área, sin acceso a configuración crítica ni gestión de usuarios.
- **employee**: Consulta y participación limitada, sin acceso a configuración ni gestión administrativa.

Ver detalles y matriz de permisos en `SISTEMA_ROLES.md`.

---

## 5. Arquitectura Técnica
- **Base de datos**: Todas las tablas principales tienen `organizacion_id`.
- **Aislamiento de datos**: Todas las consultas y operaciones deben filtrar por `organizacion_id`.
- **Middleware de tenant**: Se asegura que cada request opera solo sobre los datos de la organización del usuario autenticado.
- **Eliminación lógica**: Para organizaciones, se recomienda suspender acceso en vez de borrar datos.

---

## 6. Documentos y Guías Relacionadas
- `README.md`: Descripción general, estructura y recomendaciones técnicas.
- `PLAN_IMPLEMENTACION_MULTI_NIVEL.md`: Fases de implementación multi-tenant y scripts de migración.
- `ADMINISTRACION_ORGANIZACION_USUARIOS.md`: Modelo de administración de organizaciones y usuarios.
- `SISTEMA_ROLES.md`: Definición de roles, permisos y matriz de acceso.
- `ARQUITECTURA_SAAS_MULTITENANT.md`: Detalles técnicos de la arquitectura multi-tenant.
- `docs/flujo-de-hallazgos.md`: Guía de uso del módulo de hallazgos y acciones.

---

## 7. Preguntas y Decisiones Clave
- ¿Qué hacer si un puesto responsable de un proceso es eliminado? (Reasignar o dejar en NULL)
- ¿Qué hacer si una persona es eliminada? (Eliminar solo la relación con puestos, no el personal)
- ¿Mantener historial de asignaciones? (Recomendado para auditoría)
- ¿Cómo alertar visualmente los registros sin relación? (Badges, alertas en tarjetas/listados)

---

## 8. Recomendaciones
- **No obligar a crear relaciones en el alta**: Permitir crear entidades sueltas y luego asignar relaciones.
- **Crear formularios específicos para asignar relaciones** (ej: personal a puesto, puesto a proceso).
- **Validar en backend para evitar bucles y relaciones inválidas**.
- **Documentar y mantener actualizada la estructura y reglas de negocio**.

---

_Este documento resume y unifica la arquitectura, reglas y mejores prácticas para el desarrollo y mantenimiento de IsoFlow3._ 