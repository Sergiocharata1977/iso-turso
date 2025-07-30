import { useState, useMemo, useCallback } from 'react';

/**
 * Hook personalizado para manejar paginación
 * @param {Array} data - Array de datos a paginar
 * @param {number} itemsPerPage - Número de elementos por página
 * @returns {Object} Objeto con funciones y estado de paginación
 */
export function usePagination(data = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

  // Calcular datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPageState;
    const endIndex = startIndex + itemsPerPageState;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPageState]);

  // Calcular información de paginación
  const paginationInfo = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPageState);
    const startItem = (currentPage - 1) * itemsPerPageState + 1;
    const endItem = Math.min(currentPage * itemsPerPageState, totalItems);

    return {
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage: itemsPerPageState,
      startItem,
      endItem,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [data.length, currentPage, itemsPerPageState]);

  // Funciones de navegación
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, paginationInfo.totalPages)));
  }, [paginationInfo.totalPages]);

  const goToNextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, paginationInfo.hasNextPage]);

  const goToPrevPage = useCallback(() => {
    if (paginationInfo.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, paginationInfo.hasPrevPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(paginationInfo.totalPages);
  }, [paginationInfo.totalPages]);

  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    setItemsPerPageState(newItemsPerPage);
    setCurrentPage(1); // Reset a la primera página
  }, []);

  // Generar array de páginas para mostrar en el paginador
  const getPageNumbers = useCallback((maxVisible = 5) => {
    const { totalPages, currentPage } = paginationInfo;
    const pages = [];
    
    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas si hay pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas alrededor de la página actual
      const halfVisible = Math.floor(maxVisible / 2);
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      // Ajustar si estamos cerca del final
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }, [paginationInfo]);

  return {
    // Datos paginados
    data: paginatedData,
    
    // Información de paginación
    paginationInfo,
    
    // Funciones de navegación
    goToPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    changeItemsPerPage,
    
    // Utilidades
    getPageNumbers,
    
    // Estado actual
    currentPage,
    itemsPerPage: itemsPerPageState,
  };
}

/**
 * Hook para paginación con búsqueda y filtros
 * @param {Array} data - Array de datos
 * @param {Object} options - Opciones de configuración
 * @returns {Object} Objeto con paginación y filtros
 */
export function usePaginationWithFilters(data = [], options = {}) {
  const {
    itemsPerPage = 10,
    searchTerm = '',
    filters = {},
    sortBy = null,
    sortOrder = 'asc'
  } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
  const [filtersState, setFiltersState] = useState(filters);
  const [sortByState, setSortByState] = useState(sortBy);
  const [sortOrderState, setSortOrderState] = useState(sortOrder);

  // Filtrar y ordenar datos
  const filteredData = useMemo(() => {
    let result = [...data];

    // Aplicar búsqueda
    if (searchTermState) {
      result = result.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTermState.toLowerCase())
        )
      );
    }

    // Aplicar filtros
    Object.entries(filtersState).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => {
          if (typeof value === 'string') {
            return String(item[key]).toLowerCase().includes(value.toLowerCase());
          }
          return item[key] === value;
        });
      }
    });

    // Aplicar ordenamiento
    if (sortByState) {
      result.sort((a, b) => {
        const aValue = a[sortByState];
        const bValue = b[sortByState];
        
        if (sortOrderState === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return result;
  }, [data, searchTermState, filtersState, sortByState, sortOrderState]);

  // Usar el hook de paginación con los datos filtrados
  const pagination = usePagination(filteredData, itemsPerPageState);

  // Resetear a la primera página cuando cambien los filtros
  const updateSearchTerm = useCallback((term) => {
    setSearchTermState(term);
    setCurrentPage(1);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFiltersState(newFilters);
    setCurrentPage(1);
  }, []);

  const updateSorting = useCallback((newSortBy, newSortOrder = 'asc') => {
    setSortByState(newSortBy);
    setSortOrderState(newSortOrder);
    setCurrentPage(1);
  }, []);

  return {
    ...pagination,
    // Datos filtrados y paginados
    data: pagination.data,
    
    // Estados de filtros
    searchTerm: searchTermState,
    filters: filtersState,
    sortBy: sortByState,
    sortOrder: sortOrderState,
    
    // Funciones de actualización
    updateSearchTerm,
    updateFilters,
    updateSorting,
    
    // Información adicional
    totalFilteredItems: filteredData.length,
  };
} 