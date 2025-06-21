# Guía de Estilo y Componentes UI - IsoFlow

Este documento describe los principios de diseño, las reglas y los componentes estándar para la interfaz de usuario (UI) del sistema IsoFlow. El objetivo es asegurar la coherencia, accesibilidad y una experiencia de usuario moderna en todas las partes de la aplicación, alineada con los estándares de calidad ISO 9001.

## 1. Principios Generales de Diseño

*   **Modernidad y Limpieza**: Interfaces visualmente atractivas, con un diseño actual y minimalista.
*   **Claridad y Usabilidad**: La información debe ser fácil de entender y las interacciones intuitivas.
*   **Accesibilidad**: Cumplir con estándares de accesibilidad (WCAG) para asegurar que la aplicación pueda ser utilizada por el mayor número de personas posible.
*   **Diseño Responsivo**: La interfaz debe adaptarse fluidamente a diferentes tamaños de pantalla (escritorio, tablet, móvil).
*   **Consistencia**: Utilizar los mismos patrones de diseño, componentes y estilos en toda la aplicación.
*   **Paleta de Colores**:
    *   **Primario/Acento**: Verde Esmeralda (`#10b981` y variaciones).
    *   **Secundarios**: Grises neutros para texto, fondos y bordes.
    *   **Semántica**: Colores para estados (éxito, error, advertencia, información).
*   **Alineación ISO 9001**: El diseño debe reflejar profesionalismo, orden y eficiencia.

## 2. Vistas Individuales (Single Views)

Ejemplo de referencia: `PuestoSingle.jsx`

*   **Cabecera**:
    *   Título claro de la entidad.
    *   Botones de acción principales (ej. Editar, Volver al listado).
    *   Badge de estado (si aplica).
*   **Layout General**:
    *   Uso preferente de `Card` de shadcn/ui para agrupar información relacionada.
    *   Distribución en una o dos columnas según la cantidad de información.
    *   Espaciado generoso.
*   **Jerarquía de Información**:
    *   Información más importante y resumida al principio.
    *   Detalles agrupados en secciones o pestañas (`Tabs` de shadcn/ui).
*   **Componentes Clave**:
    *   `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
    *   `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
    *   `Badge` para estados y etiquetas.
    *   `Button` para acciones.
    *   Formularios consistentes usando `Input`, `Label`, `Textarea`, `Select` de shadcn/ui.

## 3. Vistas de Listado (Listing Views)

*   **Cabecera Común**:
    *   **Título de la Página**: Grande y claro (ej. "Gestión de Puestos").
    *   **Barra de Búsqueda**: Input de texto con icono de lupa. Placeholder descriptivo (ej. "Buscar puestos...").
    *   **Selector de Vista (Opcional, si ambas vistas están implementadas)**:
        *   Botón para "Vista de Tarjetas" (icono: `LayoutGrid`).
        *   Botón para "Vista de Lista" (icono: `List`).
        *   El botón de la vista activa debe tener un estilo distintivo.
    *   **Botón de Acción Principal**:
        *   Texto: "Nuevo [Nombre de Entidad]" (ej. "Nuevo Puesto").
        *   Icono: `PlusCircle` o similar.
        *   Estilo: Botón primario (verde esmeralda).
    *   **Botón de Exportar (Opcional)**:
        *   Texto: "Exportar".
        *   Icono: `Download` o `FileDown`.
        *   Estilo: Botón secundario.
    *   **Ubicación**: Generalmente, título a la izquierda, acciones (búsqueda, botones) a la derecha o debajo del título.

*   **Vista de Tarjetas**:
    *   **Contenido por Tarjeta**:
        *   Título/Nombre de la entidad.
        *   Información clave resumida (2-3 campos importantes).
        *   Badges de estado o categorías.
    *   **Acciones por Tarjeta**:
        *   Iconos para "Editar" (`Edit3` o `Pencil`), "Eliminar" (`Trash2`).
        *   Opcional: Icono para "Ver Detalles" (`Eye` o `MoreHorizontal`) si la tarjeta no enlaza directamente al detalle.
    *   **Layout**: Múltiples tarjetas en una cuadrícula responsive.

*   **Vista de Lista**:
    *   **Columnas**:
        *   Seleccionar las columnas más relevantes para una vista rápida.
        *   Permitir ordenación por columnas si es posible.
    *   **Acciones por Fila**:
        *   Iconos o botones para "Ver Detalles", "Editar", "Eliminar" al final de la fila.
    *   **Estilo**: Filas claras, con separadores sutiles. Hover para resaltar la fila.

*   **Estado Vacío / Sin Resultados**:
    *   Mensaje claro y amigable (ej. "No se encontraron [entidades] que coincidan con tu búsqueda.").
    *   Opcional: Icono representativo.
    *   Sugerencia de acción (ej. "Haz clic en 'Nuevo [Entidad]' para comenzar.").

## 4. Iconografía (lucide-react)

*   **Nuevo**: `PlusCircle`, `Plus`
*   **Editar**: `Edit3`, `Pencil`
*   **Eliminar/Borrar**: `Trash2`, `XCircle`
*   **Guardar**: `Save`, `CheckCircle`
*   **Cancelar**: `X`, `RotateCcw`
*   **Ver Detalles**: `Eye`, `MoreHorizontal`
*   **Buscar**: `Search`
*   **Exportar**: `Download`, `FileDown`
*   **Importar**: `Upload`, `FileUp`
*   **Vista Tarjeta**: `LayoutGrid`
*   **Vista Lista**: `List`
*   **Filtros**: `Filter`
*   **Configuración**: `Settings`
*   **Usuario**: `User`
*   **Flechas (desplegables, paginación)**: `ChevronDown`, `ChevronUp`, `ChevronLeft`, `ChevronRight`
*   *(Añadir más según sea necesario)*

## 5. Tipografía y Espaciado

*   **Fuente Principal**: La definida en el proyecto (generalmente una sans-serif moderna).
*   **Jerarquía de Títulos**: Usar tamaños y pesos de fuente consistentes para H1, H2, H3, etc.
*   **Espaciado**: Utilizar el sistema de espaciado de Tailwind CSS de forma consistente para márgenes, paddings y espacios entre elementos. Favorecer un espaciado generoso para mejorar la legibilidad.

## 6. Componentes Reutilizables (shadcn/ui y personalizados)

*   Listar aquí los componentes de `shadcn/ui` más utilizados y cualquier componente personalizado clave que se desarrolle para mantener la consistencia.
    *   `Button`
    *   `Card`
    *   `Tabs`
    *   `Input`
    *   `Label`
    *   `Badge`
    *   `Dialog` / `AlertDialog`
    *   `DropdownMenu`
    *   `Collapsible`
    *   *(Añadir más)*

---
Este es un punto de partida. Lo iremos completando y refinando.
