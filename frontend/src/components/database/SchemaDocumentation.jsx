import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, 
  Download, 
  Copy, 
  CheckCircle,
  Database,
  Link,
  Code,
  BookOpen
} from 'lucide-react';
import { schema, schemaRelations } from '../../lib/schema';

const SchemaDocumentation = () => {
  const [copiedSection, setCopiedSection] = useState(null);

  // Generar documentación completa del esquema
  const documentation = useMemo(() => {
    const tables = Object.entries(schema).map(([tableName, table]) => {
      const columns = Object.entries(table).map(([columnName, column]) => ({
        name: columnName,
        type: column.dataType,
        required: column.notNull,
        primary: column.primaryKey,
        unique: column.unique,
        hasDefault: column.hasDefault,
        isForeignKey: column.references !== undefined
      }));

      const tableRelations = schemaRelations[`${tableName}Relations`] || {};
      const relationCount = Object.keys(tableRelations).length;

      return {
        name: tableName,
        displayName: tableName.charAt(0).toUpperCase() + tableName.slice(1),
        description: getTableDescription(tableName),
        columns,
        relationCount,
        relations: Object.entries(tableRelations).map(([relationName, relation]) => ({
          name: relationName,
          type: relation.references ? 'foreign' : 'many',
          targetTable: relation.references?.[0]?.table || relation.fields?.[0]?.table
        }))
      };
    });

    return {
      tables,
      totalTables: tables.length,
      totalColumns: tables.reduce((sum, table) => sum + table.columns.length, 0),
      totalRelations: tables.reduce((sum, table) => sum + table.relationCount, 0),
      generatedAt: new Date().toISOString()
    };
  }, []);

  // Obtener descripción de tabla
  function getTableDescription(tableName) {
    const descriptions = {
      organizations: 'Tabla principal para el sistema multi-tenant. Contiene información de las organizaciones que utilizan el sistema.',
      users: 'Usuarios del sistema con roles y permisos. Vinculados a una organización específica.',
      departamentos: 'Estructura organizacional de departamentos dentro de cada organización.',
      puestos: 'Definición de puestos de trabajo y sus competencias requeridas.',
      personal: 'Información completa del personal de la organización.',
      procesos: 'Procesos del sistema de gestión de calidad ISO 9001.',
      hallazgos: 'Hallazgos de auditorías y no conformidades detectadas.',
      acciones: 'Acciones correctivas y preventivas derivadas de hallazgos.',
      auditorias: 'Programa y ejecución de auditorías internas y externas.',
      documentos: 'Gestión documental del sistema de calidad.',
      indicadores: 'Indicadores de calidad y rendimiento de procesos.',
      mediciones: 'Mediciones y valores de los indicadores de calidad.',
      capacitaciones: 'Programa de capacitación del personal.',
      evaluaciones: 'Evaluaciones de desempeño y competencias.',
      objetivos: 'Objetivos de calidad de la organización.',
      productos: 'Productos y servicios de la organización.'
    };
    return descriptions[tableName] || 'Tabla del sistema de gestión de calidad ISO 9001.';
  }

  // Copiar texto al portapapeles
  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Generar documentación en Markdown
  const generateMarkdown = () => {
    let markdown = `# Documentación del Esquema de Base de Datos - ISOFlow3

## Resumen Ejecutivo

- **Total de tablas:** ${documentation.totalTables}
- **Total de columnas:** ${documentation.totalColumns}
- **Total de relaciones:** ${documentation.totalRelations}
- **Generado el:** ${new Date(documentation.generatedAt).toLocaleString('es-ES')}

## Estructura de la Base de Datos

### Arquitectura Multi-Tenant

El sistema utiliza una arquitectura multi-tenant donde cada organización tiene su propio espacio de datos aislado mediante el campo \`organization_id\` presente en todas las tablas principales.

### Tablas Principales

`;

    documentation.tables.forEach(table => {
      markdown += `#### ${table.displayName}

**Descripción:** ${table.description}

**Columnas:**
`;

      table.columns.forEach(column => {
        const badges = [];
        if (column.primary) badges.push('PK');
        if (column.required) badges.push('NOT NULL');
        if (column.unique) badges.push('UNIQUE');
        if (column.isForeignKey) badges.push('FK');
        
        markdown += `- \`${column.name}\` (${column.type})${badges.length > 0 ? ` - ${badges.join(', ')}` : ''}\n`;
      });

      if (table.relations.length > 0) {
        markdown += `\n**Relaciones:**\n`;
        table.relations.forEach(relation => {
          markdown += `- ${relation.name}: ${relation.type === 'foreign' ? 'FK' : '1:N'} → ${relation.targetTable}\n`;
        });
      }

      markdown += '\n---\n\n';
    });

    return markdown;
  };

  // Generar documentación en SQL
  const generateSQL = () => {
    let sql = `-- ===============================================
-- ESQUEMA DE BASE DE DATOS ISOFLOW3
-- Generado automáticamente el ${new Date(documentation.generatedAt).toLocaleString('es-ES')}
-- ===============================================

-- Total de tablas: ${documentation.totalTables}
-- Total de columnas: ${documentation.totalColumns}
-- Total de relaciones: ${documentation.totalRelations}

`;

    documentation.tables.forEach(table => {
      sql += `-- ===============================================
-- TABLA: ${table.name.toUpperCase()}
-- Descripción: ${table.description}
-- ===============================================

CREATE TABLE ${table.name} (
`;

      const columnDefinitions = table.columns.map(column => {
        let definition = `  ${column.name} ${column.type.toUpperCase()}`;
        
        if (column.primary) {
          definition += ' PRIMARY KEY';
          if (column.type === 'integer') {
            definition += ' AUTOINCREMENT';
          }
        }
        
        if (column.required && !column.primary) {
          definition += ' NOT NULL';
        }
        
        if (column.unique && !column.primary) {
          definition += ' UNIQUE';
        }
        
        if (column.hasDefault) {
          definition += ' DEFAULT NULL';
        }
        
        return definition;
      });

      sql += columnDefinitions.join(',\n') + '\n);\n\n';

      // Agregar índices
      const indexes = table.columns
        .filter(col => col.isForeignKey || col.name === 'organization_id')
        .map(col => `CREATE INDEX idx_${table.name}_${col.name} ON ${table.name}(${col.name});`);

      if (indexes.length > 0) {
        sql += '-- Índices\n';
        indexes.forEach(index => {
          sql += index + '\n';
        });
        sql += '\n';
      }
    });

    return sql;
  };

  // Generar documentación en JSON
  const generateJSON = () => {
    return JSON.stringify({
      metadata: {
        title: 'Esquema de Base de Datos ISOFlow3',
        version: '1.0.0',
        generatedAt: documentation.generatedAt,
        totalTables: documentation.totalTables,
        totalColumns: documentation.totalColumns,
        totalRelations: documentation.totalRelations
      },
      tables: documentation.tables.map(table => ({
        name: table.name,
        displayName: table.displayName,
        description: table.description,
        columns: table.columns,
        relations: table.relations
      }))
    }, null, 2);
  };

  // Exportar documentación
  const exportDocumentation = (format) => {
    let content, filename, mimeType;

    switch (format) {
      case 'markdown':
        content = generateMarkdown();
        filename = `isoflow3-schema-docs-${new Date().toISOString().split('T')[0]}.md`;
        mimeType = 'text/markdown';
        break;
      case 'sql':
        content = generateSQL();
        filename = `isoflow3-schema-${new Date().toISOString().split('T')[0]}.sql`;
        mimeType = 'text/sql';
        break;
      case 'json':
        content = generateJSON();
        filename = `isoflow3-schema-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-emerald-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Documentación del Esquema</h1>
            <p className="text-slate-600">Generación automática de documentación técnica</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => exportDocumentation('markdown')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Markdown
          </Button>
          <Button onClick={() => exportDocumentation('sql')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            SQL
          </Button>
          <Button onClick={() => exportDocumentation('json')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">{documentation.totalTables}</p>
                <p className="text-sm text-slate-600">Tablas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{documentation.totalColumns}</p>
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
                <p className="text-2xl font-bold">{documentation.totalRelations}</p>
                <p className="text-sm text-slate-600">Relaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-slate-600">Formatos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="tables">Tablas Detalladas</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
          <TabsTrigger value="sql">SQL</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>

        {/* Vista General */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Esquema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Arquitectura Multi-Tenant</h3>
                  <p className="text-slate-600">
                    El sistema utiliza una arquitectura multi-tenant donde cada organización tiene su propio espacio de datos aislado mediante el campo <code>organization_id</code> presente en todas las tablas principales.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Estándar ISO 9001</h3>
                  <p className="text-slate-600">
                    La estructura de la base de datos está diseñada para cumplir con los requisitos del estándar ISO 9001 para sistemas de gestión de calidad.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tecnologías Utilizadas</h3>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li><strong>Base de datos:</strong> SQLite (Turso)</li>
                    <li><strong>ORM:</strong> Drizzle ORM</li>
                    <li><strong>Validación:</strong> Zod</li>
                    <li><strong>Frontend:</strong> React + TypeScript</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tablas Detalladas */}
        <TabsContent value="tables" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {documentation.tables.map((table) => (
              <Card key={table.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{table.displayName}</span>
                    <Badge variant="secondary">{table.columns.length} cols</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{table.description}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Columnas</h4>
                    <div className="space-y-1">
                      {table.columns.map((column) => (
                        <div key={column.name} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                          <span className="font-medium">{column.name}</span>
                          <div className="flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs">{column.type}</Badge>
                            {column.primary && <Badge variant="default" className="text-xs">PK</Badge>}
                            {column.required && <Badge variant="secondary" className="text-xs">NOT NULL</Badge>}
                            {column.unique && <Badge variant="outline" className="text-xs">UNIQUE</Badge>}
                            {column.isForeignKey && <Badge variant="destructive" className="text-xs">FK</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {table.relations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Relaciones</h4>
                      <div className="space-y-1">
                        {table.relations.map((relation) => (
                          <div key={relation.name} className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
                            <span className="font-medium">{relation.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {relation.type === 'foreign' ? 'FK' : '1:N'} → {relation.targetTable}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Markdown */}
        <TabsContent value="markdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Documentación en Markdown</span>
                <Button 
                  onClick={() => copyToClipboard(generateMarkdown(), 'markdown')} 
                  variant="outline" 
                  size="sm"
                >
                  {copiedSection === 'markdown' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-2">
                    {copiedSection === 'markdown' ? 'Copiado' : 'Copiar'}
                  </span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-100 p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap">
                {generateMarkdown()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SQL */}
        <TabsContent value="sql" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Scripts SQL</span>
                <Button 
                  onClick={() => copyToClipboard(generateSQL(), 'sql')} 
                  variant="outline" 
                  size="sm"
                >
                  {copiedSection === 'sql' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-2">
                    {copiedSection === 'sql' ? 'Copiado' : 'Copiar'}
                  </span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
                {generateSQL()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JSON */}
        <TabsContent value="json" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Esquema en JSON</span>
                <Button 
                  onClick={() => copyToClipboard(generateJSON(), 'json')} 
                  variant="outline" 
                  size="sm"
                >
                  {copiedSection === 'json' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-2">
                    {copiedSection === 'json' ? 'Copiado' : 'Copiar'}
                  </span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-900 text-yellow-400 p-4 rounded-lg overflow-auto text-sm">
                {generateJSON()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchemaDocumentation; 