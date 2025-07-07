# Arquitectura de Administración de Organizaciones y Usuarios en IsoFlow3

## 1. Resumen Ejecutivo

Este documento define la nueva arquitectura multi-nivel para la gestión de organizaciones y usuarios en la plataforma IsoFlow3. El objetivo es establecer un modelo SAAS robusto que permita ofrecer diferentes planes de suscripción (niveles de organización) con características distintas, y a su vez, mantener un sistema de roles jerárquico dentro de cada organización.

Este modelo se basa en dos ejes de permisos:

1.  **Nivel de Organización (Plan de Suscripción):** Determina el conjunto de **módulos y características** a los que una organización tiene acceso. Se definen dos niveles: `Básico` y `Premium`.
2.  **Nivel de Usuario (Rol):** Determina las **acciones (Crear, Leer, Actualizar, Eliminar)** que un usuario puede realizar sobre los módulos y datos a los que su organización tiene acceso. Se definen tres roles principales: `Admin`, `Manager`, `Employee`.

---

## 2. Modelo de Niveles de Organización (Planes)

La tabla `organizations` en la base de datos contendrá una columna `plan` (`'basic'` o `'premium'`).

### Nivel Básico (`basic`)

Diseñado para pequeñas empresas y equipos que necesitan una gestión de calidad esencial.

**Módulos Incluidos:**
- **Recursos Humanos:**
  - Gestión de Personal (ABM)
  - Gestión de Puestos (ABM)
  - Gestión de Departamentos (ABM)
- **Sistema de Gestión:**
  - Gestión de Procesos (ABM)
  - Gestión de Documentos (ABM)
- **Dashboard y Reportes Básicos**

**Limitaciones:**
- Máximo 10 usuarios por organización.
- Sin acceso a módulos avanzados (Auditorías, Indicadores, Acciones Correctivas).
- Soporte estándar por email.

### Nivel Premium (`premium`)

Diseñado para empresas que buscan una gestión de calidad completa y herramientas avanzadas de mejora continua.

**Módulos Incluidos:**
- **Todos los módulos del plan Básico.**
- **Módulos Avanzados:**
  - **Planificación y Revisión:**
    - Gestión de Objetivos y Metas (ABM)
    - Gestión de Indicadores (KPIs) (ABM)
  - **Auditorías:**
    - Planificación y ejecución de Auditorías Internas (ABM)
    - Gestión de Hallazgos (ABM)
  - **Mejora Continua:**
    - Gestión de Acciones Correctivas y Preventivas (ABM)
    - Análisis de Causa Raíz
  - **Atención al Cliente:**
    - Registro y seguimiento de Quejas y Reclamos (ABM)
- **Dashboard y Reportes Avanzados**

**Beneficios Adicionales:**
- Usuarios ilimitados.
- Acceso completo a todos los módulos.
- Soporte prioritario (chat y email).
- Asistente ISO con IA (funcionalidad completa).

---

## 3. Modelo de Niveles de Usuario (Roles)

Los roles definen los permisos *dentro* de los módulos a los que la organización tiene acceso según su plan.

### Rol: Administrador (`admin`)

**Propósito:** Gestión completa de la configuración de la organización.

**Permisos:**
- **Control Total (CRUD):** Tiene permisos de Crear, Leer, Actualizar y Eliminar en **todos los módulos habilitados por el plan de la organización**.
- **Gestión de Usuarios:** Puede invitar, crear, modificar y eliminar a otros usuarios (`Manager`, `Employee`) dentro de su organización.
- **Configuración:** Puede modificar los datos de la organización (nombre, etc.).
- **Suscripción:** Puede ver y gestionar el plan de la organización (ej. solicitar upgrade).

### Rol: Gerente (`manager`)

**Propósito:** Gestión operativa de áreas o procesos específicos.

**Permisos:**
- **Control Operativo (CRUD):** Tiene permisos de Crear, Leer, Actualizar y Eliminar sobre los datos de los módulos operativos (ej. puede crear un nuevo `Proceso`, registrar una `Acción Correctiva`, etc.).
- **Sin Acceso a Configuración Crítica:** No puede gestionar usuarios, modificar la configuración de la organización ni cambiar el plan de suscripción.
- **Visibilidad Completa:** Puede ver todos los datos de los módulos a los que tiene acceso.

### Rol: Empleado (`employee`)

**Propósito:** Consulta de información y participación en procesos.

**Permisos:**
- **Solo Lectura (Read-Only):** Por defecto, solo tiene permisos para leer la información de los módulos (ej. consultar un `Documento`, ver un `Proceso`).
- **Participación Limitada:** Puede tener permisos de escritura en módulos específicos donde se requiere su participación (ej. completar un registro de `Capacitación`, recibir una `Comunicación`).
- **Sin Acceso a Configuración:** No puede ver ni modificar ninguna configuración del sistema.

---

## 4. Super Administrador (Rol a Nivel de Plataforma)

Existirá un rol especial, `super_admin`, que no pertenece a ninguna organización y opera a nivel de toda la plataforma IsoFlow3.

**Responsabilidades:**
- Crear, modificar y eliminar organizaciones.
- Asignar y cambiar el plan (`Básico`, `Premium`) a cualquier organización.
- Monitorear el estado de la plataforma.
- No interviene en la gestión interna de las organizaciones.
