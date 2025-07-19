import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Database, 
  Table, 
  Link, 
  Eye, 
  EyeOff, 
  Search,
  Filter,
  Download,
  Info
} from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { schema, schemaRelations } from '../../lib/schema';

const DatabaseSchemaViewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [showRelations, setShowRelations] = useState(true);
  const [filterType, setFilterType] = useState('all');

  // Extraer información de las tablas del esquema
  const tables = useMemo(() => {
    return Object.entries(schema).map(([tableName, table]) => {
      const columns = Object.entries(table).map(([columnName, column]) => ({
        name: columnName,
        type: column.dataType,
        isPrimary: column.primaryKey,
        isRequired: column.notNull,
        isUnique: column.unique,
        hasDefault: column.hasDefault,
        isForeignKey: column.references !== undefined
      }));

      return {
        name: tableName,
        displayName: tableName.charAt(0).toUpperCase() + tableName.slice(1),
        columns,
        relationCount: Object.keys(schemaRelations[`${tableName}Relations`] || {}).length
      };
    });
  }, []);

  // Filtrar tablas según el término de búsqueda
  const filteredTables = useMemo(() => {
    return tables.filter(table => {
      const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          table.displayName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      if (filterType === 'with-relations') return matchesSearch && table.relationCount > 0;
      if (filterType === 'core') {
        const coreTables = ['organizations', 'users', 'personal', 'procesos', 'hallazgos'];
        return matchesSearch && coreTables.includes(table.name);
      }
      
      return matchesSearch;
    });
  }, [tables, searchTerm, filterType]);

  // Obtener relaciones para una tabla específica
  const getTableRelations = (tableName) => {
    const tableRelations = schemaRelations[`${tableName}Relations`];
    if (!tableRelations) return [];

    return Object.entries(tableRelations).map(([relationName, relation]) => ({
      name: relationName,
      type: relation.references ? 'foreign' : 'many',
      targetTable: relation.references?.[0]?.table || relation.fields?.[0]?.table
    }));
  };

  // Generar estadísticas del esquema
  const schemaStats = useMemo(() => {
    const totalTables = tables.length;
    const totalColumns = tables.reduce((sum, table) => sum + table.columns.length, 0);
    const totalRelations = tables.reduce((sum, table) => sum + table.relationCount, 0);
    const primaryKeys = tables.reduce((sum, table) => 
      sum + table.columns.filter(col => col.isPrimary).length, 0);
    const foreignKeys = tables.reduce((sum, table) => 
      sum + table.columns.filter(col => col.isForeignKey).length, 0);

    return {
      totalTables,
      totalColumns,
      totalRelations,
      primaryKeys,
      foreignKeys
    };
  }, [tables]);

  // Exportar esquema como JSON
  const exportSchema = () => {
    const schemaData = {
      tables: tables.map(table => ({
        name: table.name,
        displayName: table.displayName,
        columns: table.columns,
        relations: getTableRelations(table.name)
      })),
      stats: schemaStats,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(schemaData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isoflow3-schema-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="h-8 w-8 text-emerald-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Esquema de Base de Datos</h1>
            <p className="text-slate-600">Visualización y análisis de la estructura ISOFlow3</p>
          </div>
        </div>
        <Button onClick={exportSchema} variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Exportar</span>
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Table className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">{schemaStats.totalTables}</p>
                <p className="text-sm text-slate-600">Tablas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{schemaStats.totalColumns}</p>
                <p className="text-sm text-slate-600">Columnas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Link className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{schemaStats.totalRelations}</p>
                <p className="text-sm text-slate-600">Relaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{schemaStats.primaryKeys}</p>
                <p className="text-sm text-slate-600">Claves Primarias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Link className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{schemaStats.foreignKeys}</p>
                <p className="text-sm text-slate-600">Claves Foráneas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar tablas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="filter" className="text-sm font-medium">Filtrar:</Label>
          <select
            id="filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Todas las tablas</option>
            <option value="core">Tablas principales</option>
            <option value="with-relations">Con relaciones</option>
          </select>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowRelations(!showRelations)}
          className="flex items-center space-x-2"
        >
          {showRelations ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{showRelations ? 'Ocultar' : 'Mostrar'} relaciones</span>
        </Button>
      </div>

      {/* Contenido principal */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Vista de Cuadrícula</TabsTrigger>
          <TabsTrigger value="list">Vista de Lista</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTables.map((table) => (
              <Card 
                key={table.name}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTable?.name === table.name ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => setSelectedTable(table)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="flex items-center space-x-2">
                      <Table className="h-5 w-5 text-emerald-600" />
                      <span>{table.displayName}</span>
                    </span>
                    {table.relationCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {table.relationCount} rel
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">
                      {table.columns.length} columnas
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {table.columns.slice(0, 3).map((column) => (
                        <Badge key={column.name} variant="outline" className="text-xs">
                          {column.name}
                        </Badge>
                      ))}
                      {table.columns.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{table.columns.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-2">
            {filteredTables.map((table) => (
              <Card 
                key={table.name}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTable?.name === table.name ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => setSelectedTable(table)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Table className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h3 className="font-semibold">{table.displayName}</h3>
                        <p className="text-sm text-slate-600">
                          {table.columns.length} columnas • {table.relationCount} relaciones
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {table.columns.filter(col => col.isPrimary).map(col => (
                        <Badge key={col.name} variant="default" className="text-xs">
                          PK: {col.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedTable ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Detalles de la tabla */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Table className="h-5 w-5 text-emerald-600" />
                    <span>{selectedTable.displayName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Columnas</h4>
                    <div className="space-y-2">
                      {selectedTable.columns.map((column) => (
                        <div key={column.name} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{column.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {column.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            {column.isPrimary && (
                              <Badge variant="default" className="text-xs">PK</Badge>
                            )}
                            {column.isRequired && (
                              <Badge variant="secondary" className="text-xs">NOT NULL</Badge>
                            )}
                            {column.isUnique && (
                              <Badge variant="outline" className="text-xs">UNIQUE</Badge>
                            )}
                            {column.isForeignKey && (
                              <Badge variant="destructive" className="text-xs">FK</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Relaciones */}
              {showRelations && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Link className="h-5 w-5 text-purple-600" />
                      <span>Relaciones</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getTableRelations(selectedTable.name).length > 0 ? (
                      <div className="space-y-2">
                        {getTableRelations(selectedTable.name).map((relation) => (
                          <div key={relation.name} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                            <span className="font-medium">{relation.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {relation.type === 'foreign' ? 'FK' : '1:N'} → {relation.targetTable}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-600 text-sm">No hay relaciones definidas para esta tabla.</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Table className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Selecciona una tabla para ver sus detalles</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseSchemaViewer; 