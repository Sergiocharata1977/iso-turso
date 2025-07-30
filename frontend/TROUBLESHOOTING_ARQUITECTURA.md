# 🔧 Guía de Solución de Problemas - Arquitectura

## Problemas Comunes y Soluciones

### 1. Error de JSX en archivos .js

**Problema**:
```
ERROR: The JSX syntax extension is not currently enabled
File: useQueryClient.js
```

**Causa**: Archivos con sintaxis JSX que tienen extensión `.js` en lugar de `.jsx`

**Solución**:
1. Renombrar el archivo de `.js` a `.jsx`
2. Actualizar las importaciones para usar la extensión correcta

```bash
# Renombrar archivo
mv useQueryClient.js useQueryClient.jsx

# Actualizar importación en App.jsx
import { QueryProvider } from './hooks/useQueryClient.jsx';
```

### 2. Error de React Query no encontrado

**Problema**:
```
Module not found: Can't resolve '@tanstack/react-query'
```

**Solución**:
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 3. Error de Provider no encontrado

**Problema**:
```
QueryProvider is not a function
```

**Causa**: Importación incorrecta o archivo no encontrado

**Solución**:
```javascript
// Verificar que la importación sea correcta
import { QueryProvider } from './hooks/useQueryClient.jsx';

// Asegurarse de que el archivo existe
// Verificar que el archivo useQueryClient.jsx existe en la ruta correcta
```

### 4. Error de Toast no definido

**Problema**:
```
toast is not defined
```

**Solución**:
```javascript
import { useToast } from '@/components/ui/use-toast';

const { toast } = useToast();
```

### 5. Bucles infinitos en useEffect

**Problema**: El componente se re-renderiza infinitamente

**Causa**: Dependencias incorrectas en useEffect

**Solución**:
```javascript
// ❌ Incorrecto - causa bucle infinito
useEffect(() => {
  // código
}, [toast]); // toast cambia en cada render

// ✅ Correcto - usar el hook personalizado
const { setToastRef } = useToastEffect();

useEffect(() => {
  setToastRef(toast);
}, [toast]);
```

### 6. Error de ErrorHandler no encontrado

**Problema**:
```
Module not found: Can't resolve '@/lib/errorHandler'
```

**Solución**:
1. Verificar que el archivo existe: `frontend/src/lib/errorHandler.js`
2. Verificar la configuración de alias en `vite.config.js`:

```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

### 7. Error de servicios no encontrados

**Problema**:
```
Module not found: Can't resolve '@/services/departamentosServiceWithQuery'
```

**Solución**:
1. Verificar que el archivo existe
2. Usar la ruta relativa si es necesario:

```javascript
// En lugar de
import { useDepartamentos } from '@/services/departamentosServiceWithQuery';

// Usar
import { useDepartamentos } from '../services/departamentosServiceWithQuery';
```

### 8. Error de React Query DevTools

**Problema**:
```
ReactQueryDevtools is not a function
```

**Solución**:
```bash
npm install @tanstack/react-query-devtools
```

### 9. Error de caché no actualizado

**Problema**: Los datos no se actualizan después de una mutación

**Solución**:
```javascript
// Usar invalidateQueries para refrescar datos
const queryClient = useQueryClient();
queryClient.invalidateQueries(['departamentos']);

// O usar el hook personalizado que lo hace automáticamente
const { mutate: updateDepartamento } = useUpdateDepartamento();
```

### 10. Error de dependencias circulares

**Problema**:
```
Circular dependency detected
```

**Solución**:
1. Revisar las importaciones circulares
2. Usar importaciones dinámicas cuando sea necesario:

```javascript
// En lugar de importación estática
import { departamentosService } from './departamentosService';

// Usar importación dinámica
const { departamentosService } = await import('./departamentosService');
```

## Verificación de Instalación

### 1. Verificar dependencias instaladas
```bash
npm list @tanstack/react-query
npm list @tanstack/react-query-devtools
```

### 2. Verificar archivos creados
```bash
ls src/lib/errorHandler.js
ls src/hooks/useToastEffect.js
ls src/hooks/useQueryClient.jsx
ls src/services/*ServiceWithQuery.js
```

### 3. Verificar configuración de Vite
```bash
cat vite.config.js
```

## Comandos de Limpieza

### 1. Limpiar caché de npm
```bash
npm cache clean --force
```

### 2. Eliminar node_modules y reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
```

### 3. Limpiar caché de Vite
```bash
rm -rf frontend/node_modules/.vite
```

### 4. Reiniciar servidor de desarrollo
```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar
npm run dev
```

## Verificación de Funcionamiento

### 1. Verificar que React Query funciona
```javascript
// En cualquier componente
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['test'],
  queryFn: () => Promise.resolve('test')
});
```

### 2. Verificar que el ErrorHandler funciona
```javascript
import { useErrorHandler } from '@/lib/errorHandler';

const { handleError } = useErrorHandler(toast);
```

### 3. Verificar que los servicios funcionan
```javascript
import { useDepartamentos } from '@/services/departamentosServiceWithQuery';

const { data: departamentos } = useDepartamentos();
```

## Logs de Depuración

### 1. Habilitar logs de React Query
```javascript
// En el QueryProvider
<QueryClientProvider client={queryClient}>
  {children}
  {process.env.NODE_ENV === 'development' && (
    <ReactQueryDevtools initialIsOpen={true} />
  )}
</QueryClientProvider>
```

### 2. Habilitar logs de errores
```javascript
// En errorHandler.js
console.error(`[${errorType}] ${title}:`, error);
```

### 3. Verificar logs del navegador
- Abrir DevTools (F12)
- Ir a la pestaña Console
- Buscar errores relacionados con React Query o imports

## Contacto y Soporte

Si encuentras problemas que no están cubiertos en esta guía:

1. **Revisar logs**: Verificar la consola del navegador y terminal
2. **Verificar versiones**: Asegurarse de que las dependencias estén actualizadas
3. **Documentar el problema**: Incluir mensajes de error completos
4. **Probar en entorno limpio**: Crear un nuevo proyecto para aislar el problema

## Recursos Adicionales

- [Documentación de React Query](https://tanstack.com/query/latest)
- [Documentación de Vite](https://vitejs.dev/)
- [Guía de JSX](https://react.dev/learn/writing-markup-with-jsx) 