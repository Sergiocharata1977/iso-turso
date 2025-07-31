# 🎯 Casos de Uso - ISOFlow3

**Versión:** 3.0  
**Tipo:** Documento de Referencia  
**Última actualización:** Diciembre 2024  
**Cumplimiento:** ISO 9001

## 🎯 Descripción General

Este documento define todos los casos de uso del sistema ISOFlow3, estableciendo los escenarios de uso reales para cada módulo y funcionalidad. Cada caso de uso incluye actores, precondiciones, flujo de eventos y resultados esperados.

---

## 👥 ACTORES DEL SISTEMA

### **🎭 Actores Principales**

#### **Super Administrador (Super Admin)**
- **Descripción**: Administrador del sistema multi-tenant
- **Responsabilidades**: Gestión de organizaciones, configuración global
- **Permisos**: Acceso total a todas las organizaciones

#### **Administrador (Admin)**
- **Descripción**: Administrador de una organización específica
- **Responsabilidades**: Gestión completa de su organización
- **Permisos**: Acceso total a su organización

#### **Gerente (Manager)**
- **Descripción**: Gerente de área o departamento
- **Responsabilidades**: Supervisión de procesos y personal
- **Permisos**: Gestión de su área, reportes, aprobaciones

#### **Empleado (Employee)**
- **Descripción**: Usuario operativo del sistema
- **Responsabilidades**: Ejecución de tareas diarias
- **Permisos**: Acceso limitado a módulos asignados

---

## 📋 CASOS DE USO POR MÓDULO

## 🏢 GESTIÓN DE ORGANIZACIONES

### **CU-001: Crear Nueva Organización**
- **Actor**: Super Admin
- **Precondiciones**: Usuario autenticado como super admin
- **Flujo Principal**:
  1. Super Admin accede al panel de administración
  2. Selecciona "Crear Organización"
  3. Completa formulario con datos de la organización
  4. Sistema valida información
  5. Sistema crea organización y espacio de datos aislado
  6. Sistema notifica creación exitosa
- **Resultado**: Nueva organización creada con aislamiento total de datos
- **Postcondiciones**: Organización lista para configuración inicial

### **CU-002: Configurar Organización**
- **Actor**: Admin
- **Precondiciones**: Organización creada, usuario autenticado como admin
- **Flujo Principal**:
  1. Admin accede a configuración de organización
  2. Define información básica (logo, colores, datos fiscales)
  3. Configura departamentos y estructura organizacional
  4. Establece políticas de calidad
  5. Sistema guarda configuración
- **Resultado**: Organización configurada según necesidades específicas

---

## 👥 RECURSOS HUMANOS

### **CU-003: Gestionar Personal**
- **Actor**: Admin/Manager
- **Precondiciones**: Usuario autenticado con permisos de RRHH
- **Flujo Principal**:
  1. Usuario accede al módulo de Personal
  2. Visualiza lista de empleados con filtros y búsqueda
  3. Puede crear, editar o ver detalles de empleados
  4. Sistema valida datos y mantiene integridad
- **Resultado**: Gestión completa del personal de la organización

### **CU-004: Registrar Nuevo Empleado**
- **Actor**: Admin/Manager
- **Precondiciones**: Usuario autenticado con permisos de RRHH
- **Flujo Principal**:
  1. Usuario selecciona "Agregar Empleado"
  2. Completa formulario con datos personales y laborales
  3. Asigna departamento y puesto
  4. Sube foto de perfil (opcional)
  5. Sistema valida información
  6. Sistema crea registro y notifica
- **Resultado**: Nuevo empleado registrado en el sistema

### **CU-005: Ver Perfil Detallado de Empleado**
- **Actor**: Admin/Manager/Employee
- **Precondiciones**: Empleado existe en el sistema
- **Flujo Principal**:
  1. Usuario busca empleado por nombre o ID
  2. Accede a vista detallada del empleado
  3. Visualiza información personal, laboral y de desarrollo
  4. Puede ver historial de capacitaciones y evaluaciones
- **Resultado**: Información completa del empleado disponible

---

## 🎓 CAPACITACIONES

### **CU-006: Crear Capacitación**
- **Actor**: Admin/Manager
- **Precondiciones**: Usuario autenticado con permisos de capacitación
- **Flujo Principal**:
  1. Usuario accede al módulo de Capacitaciones
  2. Selecciona "Nueva Capacitación"
  3. Define título, objetivos y contenido
  4. Selecciona participantes objetivo
  5. Programa fecha y horario
  6. Asigna instructor
  7. Sistema crea capacitación en estado "Planificada"
- **Resultado**: Capacitación creada y lista para preparación

### **CU-007: Gestionar Flujo Kanban de Capacitaciones**
- **Actor**: Admin/Manager/Instructor
- **Precondiciones**: Capacitaciones existentes en el sistema
- **Flujo Principal**:
  1. Usuario accede al tablero Kanban
  2. Visualiza capacitaciones por estado (Planificación, En Preparación, En Evaluación, Completada)
  3. Arrastra capacitaciones entre estados según progreso
  4. Sistema actualiza estado y notifica cambios
  5. Sistema registra transiciones en auditoría
- **Resultado**: Seguimiento visual del progreso de capacitaciones

### **CU-008: Evaluar Capacitación**
- **Actor**: Instructor/Admin
- **Precondiciones**: Capacitación en estado "En Evaluación"
- **Flujo Principal**:
  1. Usuario accede a capacitación específica
  2. Aplica evaluaciones de conocimiento a participantes
  3. Recopila feedback de satisfacción
  4. Analiza resultados y efectividad
  5. Genera reporte de cumplimiento
  6. Marca capacitación como "Completada"
- **Resultado**: Evaluación completa y capacitación finalizada

---

## 📊 EVALUACIONES DE PERSONAL

### **CU-009: Programar Evaluación Individual**
- **Actor**: Admin/Manager
- **Precondiciones**: Empleado registrado en el sistema
- **Flujo Principal**:
  1. Usuario accede al módulo de Evaluaciones
  2. Selecciona "Nueva Evaluación Individual"
  3. Selecciona empleado a evaluar
  4. Define fecha de evaluación y evaluador
  5. Selecciona competencias y objetivos a evaluar
  6. Sistema programa evaluación y notifica
- **Resultado**: Evaluación programada y notificada

### **CU-010: Realizar Autoevaluación**
- **Actor**: Employee
- **Precondiciones**: Evaluación programada para el empleado
- **Flujo Principal**:
  1. Empleado recibe notificación de autoevaluación
  2. Accede al formulario de autoevaluación
  3. Completa evaluación de sus competencias y logros
  4. Identifica áreas de mejora y propone objetivos
  5. Sistema guarda autoevaluación
- **Resultado**: Autoevaluación completada y disponible para supervisor

### **CU-011: Evaluación por Supervisor**
- **Actor**: Manager
- **Precondiciones**: Autoevaluación completada
- **Flujo Principal**:
  1. Manager accede a evaluación pendiente
  2. Revisa autoevaluación del empleado
  3. Evalúa desempeño y competencias
  4. Documenta observaciones y feedback
  5. Identifica necesidades de capacitación
  6. Propone plan de desarrollo
- **Resultado**: Evaluación completa lista para reunión de feedback

---

## 🔍 HALLAZGOS Y ACCIONES CORRECTIVAS

### **CU-012: Registrar Hallazgo**
- **Actor**: Cualquier empleado
- **Precondiciones**: Usuario autenticado en el sistema
- **Flujo Principal**:
  1. Usuario identifica no conformidad u oportunidad de mejora
  2. Accede al módulo de Hallazgos
  3. Selecciona "Nuevo Hallazgo"
  4. Completa formulario con descripción y clasificación
  5. Adjunta evidencias (fotos, documentos)
  6. Asigna responsable del proceso
  7. Sistema crea hallazgo en estado "Detectado"
- **Resultado**: Hallazgo registrado y asignado para análisis

### **CU-013: Analizar Hallazgo**
- **Actor**: Responsable del proceso
- **Precondiciones**: Hallazgo asignado al usuario
- **Flujo Principal**:
  1. Usuario recibe notificación de hallazgo asignado
  2. Accede al hallazgo para análisis
  3. Analiza causas raíz del problema
  4. Evalúa impacto en procesos
  5. Determina criticidad y prioridad
  6. Propone acciones correctivas
  7. Sistema actualiza estado a "En Análisis"
- **Resultado**: Análisis completo del hallazgo

### **CU-014: Planificar Acciones Correctivas**
- **Actor**: Manager/Responsable del proceso
- **Precondiciones**: Hallazgo analizado
- **Flujo Principal**:
  1. Usuario accede a hallazgo analizado
  2. Crea plan de acción correctiva
  3. Asigna responsables específicos
  4. Establece cronograma de ejecución
  5. Define recursos necesarios
  6. Aproba plan de acción
  7. Sistema actualiza estado a "Planificando Acciones"
- **Resultado**: Plan de acción aprobado y listo para ejecución

### **CU-015: Ejecutar Acciones Correctivas**
- **Actor**: Responsable asignado
- **Precondiciones**: Plan de acción aprobado
- **Flujo Principal**:
  1. Usuario accede a acciones asignadas
  2. Implementa acciones correctivas según plan
  3. Registra avance en el sistema
  4. Documenta cambios realizados
  5. Comunica progreso a stakeholders
  6. Sistema actualiza estado a "En Ejecución"
- **Resultado**: Acciones implementadas y documentadas

### **CU-016: Verificar Efectividad**
- **Actor**: Auditor/Manager
- **Precondiciones**: Acciones ejecutadas
- **Flujo Principal**:
  1. Usuario accede a hallazgo para verificación
  2. Verifica efectividad de acciones implementadas
  3. Evalúa cumplimiento de objetivos
  4. Documenta resultados obtenidos
  5. Cierra hallazgo oficialmente
  6. Sistema actualiza estado a "Cerrado"
- **Resultado**: Hallazgo verificado y cerrado

---

## 📋 PROCESOS DE CALIDAD

### **CU-017: Definir Proceso**
- **Actor**: Admin/Manager
- **Precondiciones**: Usuario autenticado con permisos de procesos
- **Flujo Principal**:
  1. Usuario accede al módulo de Procesos
  2. Selecciona "Nuevo Proceso"
  3. Define nombre, objetivo y alcance
  4. Establece responsable del proceso
  5. Define indicadores de desempeño
  6. Crea documentación del proceso
  7. Sistema crea proceso y notifica
- **Resultado**: Proceso definido y documentado

### **CU-018: Medir Indicadores**
- **Actor**: Responsable del proceso
- **Precondiciones**: Proceso con indicadores definidos
- **Flujo Principal**:
  1. Usuario accede a proceso específico
  2. Selecciona indicador a medir
  3. Ingresa datos de medición
  4. Sistema calcula métricas automáticamente
  5. Genera gráficos y tendencias
  6. Sistema registra medición en historial
- **Resultado**: Indicadores actualizados y analizados

### **CU-019: Analizar Desviaciones**
- **Actor**: Manager/Responsable del proceso
- **Precondiciones**: Indicadores con desviaciones detectadas
- **Flujo Principal**:
  1. Usuario accede a reportes de indicadores
  2. Identifica desviaciones de objetivos
  3. Analiza causas de desviaciones
  4. Propone acciones de mejora
  5. Crea hallazgos si es necesario
  6. Sistema registra análisis
- **Resultado**: Análisis de desviaciones y plan de mejora

---

## 📄 DOCUMENTOS

### **CU-020: Subir Documento**
- **Actor**: Admin/Manager
- **Precondiciones**: Usuario autenticado con permisos de documentos
- **Flujo Principal**:
  1. Usuario accede al módulo de Documentos
  2. Selecciona "Subir Documento"
  3. Completa metadatos del documento
  4. Selecciona archivo a subir
  5. Asigna categoría y proceso relacionado
  6. Sistema valida archivo y lo almacena
  7. Sistema crea registro del documento
- **Resultado**: Documento subido y registrado en el sistema

### **CU-021: Buscar y Consultar Documentos**
- **Actor**: Cualquier empleado
- **Precondiciones**: Documentos disponibles en el sistema
- **Flujo Principal**:
  1. Usuario accede al módulo de Documentos
  2. Utiliza filtros de búsqueda (categoría, proceso, fecha)
  3. Visualiza lista de documentos disponibles
  4. Selecciona documento para consultar
  5. Sistema muestra metadatos y permite descarga
  6. Sistema registra consulta en auditoría
- **Resultado**: Documento consultado y descargado

---

## 🔍 AUDITORÍAS INTERNAS

### **CU-022: Planificar Auditoría**
- **Actor**: Admin/Auditor líder
- **Precondiciones**: Usuario autenticado con permisos de auditoría
- **Flujo Principal**:
  1. Usuario accede al módulo de Auditorías
  2. Selecciona "Nueva Auditoría"
  3. Define alcance y objetivos
  4. Selecciona equipo auditor
  5. Programa fechas y horarios
  6. Notifica a áreas a auditar
  7. Sistema crea auditoría y notifica
- **Resultado**: Auditoría planificada y programada

### **CU-023: Ejecutar Auditoría**
- **Actor**: Equipo auditor
- **Precondiciones**: Auditoría planificada
- **Flujo Principal**:
  1. Equipo auditor accede a auditoría programada
  2. Realiza reunión de apertura
  3. Ejecuta auditoría según plan
  4. Recopila evidencias
  5. Documenta hallazgos
  6. Realiza reunión de cierre
  7. Sistema registra ejecución
- **Resultado**: Auditoría ejecutada y hallazgos documentados

### **CU-024: Generar Informe de Auditoría**
- **Actor**: Auditor líder
- **Precondiciones**: Auditoría ejecutada
- **Flujo Principal**:
  1. Usuario accede a auditoría ejecutada
  2. Elabora informe con hallazgos
  3. Clasifica hallazgos por severidad
  4. Propone acciones correctivas
  5. Envía informe a responsables
  6. Sistema genera reporte final
- **Resultado**: Informe de auditoría generado y distribuido

---

## 🎯 OBJETIVOS DE CALIDAD

### **CU-025: Definir Objetivos**
- **Actor**: Admin/Manager
- **Precondiciones**: Usuario autenticado con permisos de objetivos
- **Flujo Principal**:
  1. Usuario accede al módulo de Objetivos
  2. Selecciona "Nuevo Objetivo"
  3. Define objetivo específico y medible
  4. Establece indicadores de seguimiento
  5. Define responsable y cronograma
  6. Sistema crea objetivo y notifica
- **Resultado**: Objetivo definido y asignado

### **CU-026: Seguimiento de Objetivos**
- **Actor**: Responsable del objetivo
- **Precondiciones**: Objetivo definido
- **Flujo Principal**:
  1. Usuario accede a objetivos asignados
  2. Actualiza progreso del objetivo
  3. Registra avances y obstáculos
  4. Sistema calcula porcentaje de cumplimiento
  5. Genera alertas si hay desviaciones
- **Resultado**: Seguimiento actualizado del objetivo

---

## 📊 DASHBOARD Y REPORTES

### **CU-027: Visualizar Dashboard**
- **Actor**: Cualquier empleado
- **Precondiciones**: Usuario autenticado
- **Flujo Principal**:
  1. Usuario accede al dashboard principal
  2. Visualiza métricas clave de la organización
  3. Revisa indicadores de calidad
  4. Consulta alertas y notificaciones
  5. Accede a reportes rápidos
- **Resultado**: Visión general del estado de la organización

### **CU-028: Generar Reporte Personalizado**
- **Actor**: Admin/Manager
- **Precondiciones**: Usuario autenticado con permisos de reportes
- **Flujo Principal**:
  1. Usuario accede al módulo de Reportes
  2. Selecciona tipo de reporte
  3. Define filtros y parámetros
  4. Selecciona período de análisis
  5. Sistema genera reporte
  6. Usuario puede exportar en diferentes formatos
- **Resultado**: Reporte personalizado generado y exportado

---

## 🎓 COMPETENCIAS

### **CU-029: Gestionar Competencias**
- **Actor**: Admin/Manager
- **Precondiciones**: Usuario autenticado con permisos de competencias
- **Flujo Principal**:
  1. Usuario accede al módulo de Competencias
  2. Define competencias requeridas por puesto
  3. Asigna competencias a empleados
  4. Establece niveles de competencia
  5. Sistema mantiene matriz de competencias
- **Resultado**: Sistema de competencias configurado

### **CU-030: Evaluar Competencias**
- **Actor**: Manager/Evaluador
- **Precondiciones**: Competencias definidas
- **Flujo Principal**:
  1. Usuario accede a evaluación de competencias
  2. Selecciona empleado y competencias a evaluar
  3. Aplica instrumentos de evaluación
  4. Registra resultados y observaciones
  5. Sistema actualiza matriz de competencias
- **Resultado**: Competencias evaluadas y actualizadas

---

## 🎫 TICKETS Y SOPORTE

### **CU-031: Crear Ticket**
- **Actor**: Cualquier empleado
- **Precondiciones**: Usuario autenticado
- **Flujo Principal**:
  1. Usuario accede al módulo de Tickets
  2. Selecciona "Nuevo Ticket"
  3. Describe problema o solicitud
  4. Asigna prioridad y categoría
  5. Sistema crea ticket y asigna responsable
- **Resultado**: Ticket creado y asignado

### **CU-032: Gestionar Tickets**
- **Actor**: Admin/Manager/Responsable
- **Precondiciones**: Tickets asignados al usuario
- **Flujo Principal**:
  1. Usuario accede a tickets asignados
  2. Revisa detalles del ticket
  3. Actualiza estado y progreso
  4. Comunica con solicitante
  5. Cierra ticket cuando se resuelve
- **Resultado**: Ticket gestionado y resuelto

---

## 📝 ENCUESTAS

### **CU-033: Crear Encuesta**
- **Actor**: Admin/Manager
- **Precondiciones**: Usuario autenticado con permisos de encuestas
- **Flujo Principal**:
  1. Usuario accede al módulo de Encuestas
  2. Selecciona "Nueva Encuesta"
  3. Define preguntas y opciones de respuesta
  4. Selecciona participantes objetivo
  5. Programa fecha de envío
  6. Sistema crea encuesta y programa envío
- **Resultado**: Encuesta creada y programada

### **CU-034: Responder Encuesta**
- **Actor**: Participante
- **Precondiciones**: Encuesta enviada al usuario
- **Flujo Principal**:
  1. Usuario recibe notificación de encuesta
  2. Accede al formulario de encuesta
  3. Responde preguntas según instrucciones
  4. Envía respuestas
  5. Sistema registra participación
- **Resultado**: Encuesta respondida y registrada

---

## 📅 CALENDARIO Y EVENTOS

### **CU-035: Gestionar Eventos**
- **Actor**: Admin/Manager
- **Precondiciones**: Usuario autenticado con permisos de calendario
- **Flujo Principal**:
  1. Usuario accede al módulo de Calendario
  2. Crea nuevo evento (reunión, capacitación, auditoría)
  3. Define fecha, hora y participantes
  4. Sistema programa evento y notifica
- **Resultado**: Evento creado y programado

### **CU-036: Consultar Calendario**
- **Actor**: Cualquier empleado
- **Precondiciones**: Usuario autenticado
- **Flujo Principal**:
  1. Usuario accede al calendario
  2. Visualiza eventos programados
  3. Filtra por tipo de evento
  4. Consulta detalles de eventos
- **Resultado**: Calendario consultado y eventos visualizados

---

## 🔔 NOTIFICACIONES

### **CU-037: Recibir Notificaciones**
- **Actor**: Cualquier empleado
- **Precondiciones**: Usuario autenticado
- **Flujo Principal**:
  1. Sistema detecta evento que requiere notificación
  2. Genera notificación según configuración
  3. Envía notificación al usuario
  4. Usuario recibe notificación en tiempo real
  5. Usuario puede marcar como leída
- **Resultado**: Usuario notificado de eventos relevantes

---

## 🎯 CASOS DE USO ESPECIALES

### **CU-038: Migración de Datos**
- **Actor**: Super Admin
- **Precondiciones**: Sistema configurado y funcionando
- **Flujo Principal**:
  1. Super Admin accede a herramientas de migración
  2. Selecciona datos a migrar
  3. Valida integridad de datos
  4. Ejecuta proceso de migración
  5. Sistema verifica migración exitosa
- **Resultado**: Datos migrados correctamente

### **CU-039: Backup y Restauración**
- **Actor**: Super Admin
- **Precondiciones**: Sistema configurado
- **Flujo Principal**:
  1. Super Admin accede a herramientas de backup
  2. Programa backup automático
  3. Sistema ejecuta backup según programación
  4. Almacena backup en ubicación segura
  5. Notifica completado
- **Resultado**: Backup realizado y almacenado

---

## 📊 MÉTRICAS DE USO

### **🎯 Indicadores de Adopción**
- **Usuarios activos** por organización
- **Módulos más utilizados** por tipo de usuario
- **Frecuencia de uso** por funcionalidad
- **Tiempo promedio** de sesión

### **📈 Indicadores de Efectividad**
- **Tiempo de resolución** de hallazgos
- **Cumplimiento** de objetivos de calidad
- **Efectividad** de capacitaciones
- **Satisfacción** de usuarios

---

## 💡 Conclusión

Este documento de casos de uso proporciona una guía completa de todas las funcionalidades disponibles en ISOFlow3, estableciendo claramente:

- 🎯 **Escenarios de uso** para cada módulo
- 👥 **Responsabilidades** de cada actor
- 🔄 **Flujos de trabajo** estandarizados
- 📊 **Resultados esperados** de cada operación
- 🛡️ **Cumplimiento** de estándares ISO 9001

**¡Estos casos de uso son la base para el uso efectivo del sistema!** 