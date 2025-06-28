# Guía de Estilo y Diseño UI/UX - Isoflow3

Este documento establece los estándares de diseño y las mejores prácticas de UI/UX para la aplicación Isoflow3. El objetivo es mantener una experiencia de usuario coherente, intuitiva y profesional en todos los módulos.

---

## 1. Principios Generales

- **Claridad y Simplicidad**: La interfaz debe ser limpia, organizada y fácil de entender. Evitar la sobrecarga de información.
- **Consistencia**: Los componentes y patrones de diseño deben ser reutilizados en toda la aplicación para crear una experiencia predecible.
- **Feedback Visual**: Proporcionar retroalimentación inmediata a las acciones del usuario (hovers, clics, estados de carga, notificaciones).
- **Accesibilidad**: Asegurar que la aplicación sea usable por la mayor cantidad de personas posible, cuidando contrastes y tamaños de fuente.

---

## 2. Paleta de Colores

- **Primario (Teal)**: Usado para acciones principales, enlaces, y elementos activos que requieren atención.
  - `bg-teal-600` para botones principales.
  - `hover:bg-teal-700` para el efecto hover.
  - `text-teal-600` para textos y títulos importantes.
  - `border-teal-500` para bordes activos y de foco.
- **Fondo**: 
  - `bg-gray-50`: Fondo principal para las vistas de la aplicación.
  - `bg-white`: Fondo para tarjetas (`Card`), modales y headers.
- **Texto**:
  - `text-gray-900`: Para títulos principales.
  - `text-gray-700`: Para texto de cuerpo y párrafos.
  - `text-gray-500`: Para subtítulos, descripciones y texto secundario.
- **Botones y Acciones**:
  - **Outline**: `border-gray-300` con texto oscuro.
  - **Destructive**: `bg-red-600` para acciones de eliminación.

---

## 3. Componentes de Listado (Listing)

### 3.1. Encabezado del Listado
- **Estructura**: Un `header` en la parte superior con fondo blanco (`bg-white`) y una sombra sutil (`shadow-sm`).
- **Contenido**:
  - **Izquierda**: Título principal (`text-2xl font-bold`) y un subtítulo descriptivo (`text-sm text-gray-500`).
  - **Derecha**: Botón de acción principal (Ej: "+ Nuevo"), con el color primario (`bg-teal-600`).

### 3.2. Diseño de Tarjeta (Grid View)
- **Contenedor**: `Card` con fondo blanco (`bg-white`), bordes redondeados (`rounded-lg`), un borde sutil (`border`) y sombra (`shadow-sm`).
- **Interactividad**:
  - `cursor-pointer` en toda la tarjeta para indicar que es clicleable.
  - **Efecto Hover**: La sombra se eleva (`hover:shadow-lg`) y el borde se resalta con el color primario (`hover:border-teal-500`). Se aplica una transición suave (`transition-all duration-300`).
  - El título dentro de la tarjeta también cambia de color en hover (`group-hover:text-teal-600`).
- **Footer de la Tarjeta**: Una sección inferior con fondo `bg-gray-50` para acciones secundarias (Editar, Eliminar) que no deben interferir con el clic principal.

---

## 4. Componentes de Vista Individual (Single)

### 4.1. Encabezado Fijo (Header)
- **Comportamiento**: Fijo en la parte superior (`sticky top-0`) para estar siempre accesible.
- **Estructura**: Fondo blanco (`bg-white`) con sombra.
- **Contenido**:
  - **Botón de Volver**: A la izquierda, con un icono (`ArrowLeft`) para regresar al listado.
  - **Título de la Entidad**: Nombre del item que se está viendo.
  - **Botones de Acción**: A la derecha (Editar, Eliminar).

### 4.2. Layout de Contenido
- **Fondo**: `bg-gray-50` para toda la página.
- **Organización**: El contenido se organiza dentro de `Card`s con fondo blanco. Se usa un layout de 2 o 3 columnas, con el contenido principal a la izquierda y una barra lateral (`sidebar`) a la derecha para metadatos o acciones secundarias.
- **Tarjetas de Información**: Para datos clave (ej: Estado, Prioridad), se usan `Card`s pequeñas con un icono, un título (`label`) y el valor resaltado.

---

## 5. Botones y Controles

- **Botón Principal**: `bg-teal-600`, `text-white`, `hover:bg-teal-700`.
- **Botón Secundario (Outline)**: `variant="outline"`, con borde por defecto.
- **Botón Fantasma (Ghost)**: `variant="ghost"` para acciones en menús o iconos sin fondo.
- **Inputs y Selects**: Fondo blanco, borde estándar, y un anillo de foco de color `teal` (`focus:ring-teal-500`, `focus:border-teal-500`).
- **Iconografía**: Se utiliza la librería `lucide-react` para mantener un estilo de iconos consistente y limpio.
