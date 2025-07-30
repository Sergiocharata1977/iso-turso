import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableSkeleton } from './skeleton';

/**
 * Componente de tabla reutilizable con filtros y ordenamiento
 */
const DataTable = React.memo(({
  data = [],
  columns = [],
  loading = false,
  searchable = true,
  sortable = true,
  filterable = true,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron datos",
  actions = true,
  className = "",
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({});

  // Filtrar datos
  const filteredData = useMemo(() => {
    let result = [...data];

    // Aplicar búsqueda
    if (searchTerm && searchable) {
      result = result.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => {
          if (typeof value === 'string') {
            return String(item[key]).toLowerCase().includes(value.toLowerCase());
          }
          return item[key] === value;
        });
      }
    });

    return result;
  }, [data, searchTerm, filters, searchable]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredData, sortColumn, sortDirection, sortable]);

  // Manejar ordenamiento
  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Manejar filtros
  const handleFilter = (columnKey, value) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSortColumn(null);
    setSortDirection('asc');
  };

  // Renderizar celda
  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item);
    }
    
    const value = item[column.key];
    
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString('es-ES');
    }
    
    if (column.type === 'status') {
      const statusColors = {
        activo: 'bg-green-100 text-green-800',
        inactivo: 'bg-red-100 text-red-800',
        pendiente: 'bg-yellow-100 text-yellow-800',
        default: 'bg-gray-100 text-gray-800'
      };
      
      const colorClass = statusColors[value?.toLowerCase()] || statusColors.default;
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
          {value}
        </span>
      );
    }
    
    return value;
  };

  // Renderizar header de columna
  const renderColumnHeader = (column) => {
    const isSorted = sortColumn === column.key;
    const isAsc = sortDirection === 'asc';
    
    return (
      <th 
        key={column.key}
        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
          sortable ? 'cursor-pointer' : ''
        }`}
        onClick={() => handleSort(column.key)}
      >
        <div className="flex items-center space-x-1">
          <span>{column.label}</span>
          {sortable && isSorted && (
            isAsc ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </th>
    );
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header con búsqueda y filtros */}
      {(searchable || filterable) && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between space-x-4">
            {searchable && (
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
            
            {filterable && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map(renderColumnHeader)}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (actions ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <tr 
                  key={item.id || index}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map(column => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {renderCell(item, column)}
                    </td>
                  ))}
                  
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(item)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem 
                              onClick={() => onDelete(item)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable; 