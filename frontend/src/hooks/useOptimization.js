import { useCallback, useMemo } from 'react';

/**
 * Hook para optimizar funciones de filtrado
 * @param {Array} data - Array de datos
 * @param {string} searchTerm - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 * @returns {Array} Datos filtrados optimizados
 */
export function useFilteredData(data, searchTerm, filters = {}) {
  return useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let filtered = [...data];
    
    // Aplicar búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(term)
        )
      );
    }
    
    // Aplicar filtros adicionales
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        filtered = filtered.filter(item => {
          if (typeof value === 'string') {
            return String(item[key]).toLowerCase().includes(value.toLowerCase());
          }
          return item[key] === value;
        });
      }
    });
    
    return filtered;
  }, [data, searchTerm, filters]);
}

/**
 * Hook para optimizar funciones de ordenamiento
 * @param {Array} data - Array de datos
 * @param {string} sortBy - Campo por el cual ordenar
 * @param {string} sortOrder - Orden (asc/desc)
 * @returns {Array} Datos ordenados optimizados
 */
export function useSortedData(data, sortBy, sortOrder = 'asc') {
  return useMemo(() => {
    if (!data || data.length === 0 || !sortBy) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, sortBy, sortOrder]);
}

/**
 * Hook para optimizar funciones de cálculo costoso
 * @param {Array} data - Array de datos
 * @param {Function} calculationFn - Función de cálculo
 * @returns {any} Resultado del cálculo optimizado
 */
export function useExpensiveCalculation(data, calculationFn) {
  return useMemo(() => {
    if (!data || data.length === 0) return null;
    return calculationFn(data);
  }, [data, calculationFn]);
}

/**
 * Hook para optimizar funciones de callback
 * @param {Function} callback - Función a optimizar
 * @param {Array} dependencies - Dependencias de la función
 * @returns {Function} Función optimizada con useCallback
 */
export function useOptimizedCallback(callback, dependencies = []) {
  return useCallback(callback, dependencies);
}

/**
 * Hook para optimizar funciones de manejo de eventos
 * @param {Function} handler - Manejador de evento
 * @param {Array} dependencies - Dependencias del manejador
 * @returns {Function} Manejador optimizado
 */
export function useEventHandler(handler, dependencies = []) {
  return useCallback(handler, dependencies);
}

/**
 * Hook para optimizar funciones de búsqueda
 * @param {Array} data - Array de datos
 * @param {string} searchTerm - Término de búsqueda
 * @param {Array} searchFields - Campos donde buscar
 * @returns {Array} Resultados de búsqueda optimizados
 */
export function useSearchResults(data, searchTerm, searchFields = []) {
  return useMemo(() => {
    if (!data || data.length === 0 || !searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    
    return data.filter(item => {
      if (searchFields.length > 0) {
        return searchFields.some(field => 
          String(item[field] || '').toLowerCase().includes(term)
        );
      }
      
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm, searchFields]);
}

/**
 * Hook para optimizar estadísticas de datos
 * @param {Array} data - Array de datos
 * @returns {Object} Estadísticas optimizadas
 */
export function useDataStats(data) {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        percentage: 0
      };
    }
    
    const total = data.length;
    const active = data.filter(item => item.activo !== false).length;
    const inactive = total - active;
    const percentage = total > 0 ? Math.round((active / total) * 100) : 0;
    
    return {
      total,
      active,
      inactive,
      percentage
    };
  }, [data]);
}

/**
 * Hook para optimizar agrupación de datos
 * @param {Array} data - Array de datos
 * @param {string} groupBy - Campo por el cual agrupar
 * @returns {Object} Datos agrupados optimizados
 */
export function useGroupedData(data, groupBy) {
  return useMemo(() => {
    if (!data || data.length === 0 || !groupBy) return {};
    
    return data.reduce((groups, item) => {
      const key = item[groupBy] || 'Sin categoría';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }, [data, groupBy]);
} 