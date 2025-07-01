# Guía del Módulo de Hallazgos

Este documento explica el funcionamiento del módulo de gestión de hallazgos, diseñado para ofrecer una experiencia de usuario fluida y eficiente.

## 1. Vista Principal: Tablero Kanban

La interfaz principal para gestionar los hallazgos es un tablero Kanban. Este tablero organiza los hallazgos en columnas que representan las distintas fases del flujo de trabajo (Detección, Planificación, Ejecución, etc.).

### 1.1. Doble Funcionalidad de las Tarjetas

Cada tarjeta en el Kanban ha sido diseñada con una doble funcionalidad para maximizar la eficiencia:

- **Clic Principal (Acción Rápida):** Al hacer clic en cualquier parte del cuerpo de la tarjeta, se abre un **modal**. Este modal contiene el formulario necesario para ejecutar el siguiente paso del flujo de trabajo (por ejemplo, planificar una acción inmediata, registrar la ejecución, etc.). Esto permite al usuario avanzar en el proceso rápidamente sin salir de la vista del tablero.

- **Botón "Ver Detalles" (Acción Completa):** En la esquina inferior derecha de cada tarjeta, hay un icono de "enlace externo". Al hacer clic en este icono, el usuario es redirigido a la **página de detalle** del hallazgo. Esta vista es ideal para consultar el historial completo, los documentos adjuntos y toda la información asociada al hallazgo.

## 2. Página de Detalle del Hallazgo

La página de detalle ofrece una vista completa de 360 grados de un hallazgo específico.

### 2.1. Pestañas de Información

La información está organizada en tres pestañas:

- **Flujo de Proceso:** Muestra el estado actual del hallazgo y proporciona un botón para realizar la siguiente acción del flujo. Al igual que en el Kanban, este botón abre un **modal** para mantener una experiencia de usuario consistente.
- **Detalles:** Contiene todos los datos descriptivos del hallazgo, como su origen, categoría, fecha de detección, etc.
- **Plan de Acciones:** Muestra un tablero Kanban secundario con las acciones correctivas o preventivas asociadas a ese hallazgo.

## 3. Lógica Centralizada: HallazgoWorkflowManager

La lógica que determina qué formulario mostrar en cada estado del flujo de trabajo está centralizada en el componente `HallazgoWorkflowManager`. Este gestor lee el estado actual del hallazgo y renderiza dinámicamente el componente de formulario apropiado, asegurando que el usuario siempre vea la acción correcta en el momento adecuado.

---

## 4. Módulo de Acciones: Flujo y Experiencia de Usuario

El módulo de Acciones ha sido rediseñado para ofrecer una experiencia visual y de gestión consistente con el módulo de Hallazgos, facilitando el seguimiento y control de las acciones correctivas y de mejora.

### 4.1. Vista Principal: KPIs y Tablero Kanban

- **Tarjetas de Indicadores (KPIs):** En la parte superior de la página se muestran tarjetas con el total de acciones y su distribución por estado (Planificación, Ejecución, Verificación). Esto permite una visión rápida del estado general del sistema de acciones.
- **Selector de Vistas:** El usuario puede alternar entre tres vistas principales: Kanban, Lista y Gráficos.
  - **Kanban:** Organiza las acciones en columnas según su estado de avance, permitiendo mover acciones entre estados mediante drag-and-drop.
  - **Lista:** Muestra todas las acciones en formato de lista detallada.
  - **Gráficos:** Visualiza la distribución de acciones por estado y por prioridad mediante gráficos de barras y circulares.

### 4.2. Interacción con las Tarjetas

- **Clic en la Tarjeta:** Abre un modal con el formulario correspondiente al flujo de trabajo de la acción, permitiendo avanzar en el proceso sin salir de la vista actual.
- **Página de Detalle:** Cada acción cuenta con una página de detalle accesible desde la lista, donde se visualizan todos los datos y el historial de la acción.

### 4.3. Flujo de Trabajo Centralizado

La lógica de los estados y formularios de las acciones está centralizada en el componente `AccionWorkflowManager`, que determina dinámicamente qué formulario mostrar según el estado actual de la acción, asegurando coherencia y facilidad de mantenimiento.

### 4.4. Gráficos de Gestión

La pestaña de gráficos permite visualizar rápidamente:
- **Acciones por Estado:** Gráfico de barras que muestra la cantidad de acciones en cada fase.
- **Acciones por Prioridad:** Gráfico circular con la distribución de acciones según su prioridad (Alta, Media, Baja).
