# Plan de Acción para Solucionar Errores en el Módulo de Mejoras

## 1. Diagnóstico del Problema

Los errores `500 (Internal Server Error)` que aparecen al cargar (`GET /api/hallazgos/`) y al crear (`POST /api/hallazgos/`) un nuevo hallazgo indican un problema crítico en el **backend**.

La causa principal es una **inconsistencia entre el código de la aplicación y la estructura de la base de datos**.

- **El Código:** Las rutas en `backend/routes/mejoras.routes.js` han sido actualizadas para que esperen y utilicen una columna llamada `titulo` en la tabla `hallazgos`.
- **La Base de Datos:** La tabla `hallazgos` en tu base de datos remota (Turso) **no tiene esta columna `titulo`**. 

Cuando el backend intenta ejecutar una consulta SQL que incluye el campo `titulo` (ya sea para leer o escribir), la base de datos devuelve un error porque no encuentra esa columna. Este error no es manejado por el código y se convierte en el error 500 que ves en el navegador.

## 2. Archivos y Funciones Involucradas

- **`backend/routes/mejoras.routes.js`**: 
  - La ruta `GET /` intenta hacer un `SELECT` de la columna `titulo`.
  - La ruta `POST /` intenta hacer un `INSERT` en la columna `titulo`.
  - Ambas operaciones fallan, causando los errores 500.

- **`frontend/src/pages/MejorasPage.jsx`**: 
  - La función `fetchHallazgos` llama al servicio para obtener los datos, lo que dispara el error `GET`.

- **`frontend/src/components/mejoras/NuevoHallazgoModal.jsx`**: 
  - La función `handleSubmit` llama al servicio para crear un nuevo hallazgo, disparando el error `POST`.

- **`frontend/src/services/hallazgosService.js`**: 
  - Las funciones `getAllHallazgos` y `createHallazgo` realizan las llamadas a la API que fallan.

## 3. Plan de Acción para la Solución

La solución **no se puede implementar únicamente desde el código**. Es necesario modificar la estructura de tu base de datos directamente para alinearla con lo que el código espera.

Sigue estos pasos:

### Paso 1: Abrir una Terminal

Abre una nueva terminal o línea de comandos en tu sistema (CMD, PowerShell, Git Bash, etc.).

### Paso 2: Modificar la Base de Datos

Ejecuta el siguiente comando para conectar con tu base de datos Turso y añadir la columna que falta. Este comando es la solución directa al problema.

```bash
turso db shell isoflow-db "ALTER TABLE hallazgos ADD COLUMN titulo TEXT NOT NULL DEFAULT 'Sin Título'"
```

**Notas Importantes:**
- He asumido que el nombre de tu base de datos es `isoflow-db`. Si no estás seguro, puedes listar tus bases de datos con el comando `turso db list` y reemplazar `isoflow-db` por el nombre correcto.
- He añadido `NOT NULL DEFAULT 'Sin Título'` para asegurar que la columna se cree correctamente y que cualquier registro antiguo que no tuviera título reciba un valor por defecto.

### Paso 3: Reiniciar y Probar

1.  **Detén el servidor del backend** si se está ejecutando (usualmente con `Ctrl + C` en la terminal donde lo iniciaste).
2.  **Vuelve a iniciar el servidor del backend** (ej. `npm run dev`).
3.  En tu navegador, **refresca la página de "Mejoras"** (puedes usar `Ctrl + F5` para una recarga completa sin caché).

## 4. Verificación

Después de seguir los pasos anteriores:
- La página de "Mejoras" debería cargar **sin ningún error 500**.
- El formulario para crear un "Nuevo Hallazgo" debería funcionar y **guardar el nuevo registro** en la base de datos.

Si el problema persiste, asegúrate de que el comando del Paso 2 se ejecutó sin errores.
