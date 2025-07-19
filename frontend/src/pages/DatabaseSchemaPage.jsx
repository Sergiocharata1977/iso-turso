import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Database, 
  Eye, 
  Link, 
  CheckCircle, 
  BarChart3,
  Settings,
  Download,
  Share2
} from 'lucide-react';
import DatabaseSchemaViewer from '../components/database/DatabaseSchemaViewer';
import ERDDiagram from '../components/database/ERDDiagram';
import SchemaValidator from '../components/database/SchemaValidator';
import SchemaDocumentation from '../components/database/SchemaDocumentation';

const DatabaseSchemaPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [schemaStats, setSchemaStats] = useState({
    totalTables: 16,
    totalColumns: 245,
    totalRelations: 28,
    primaryKeys: 16,
    foreignKeys: 12
  });

  const features = [
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Visualización de Esquemas',
      description: 'Explora la estructura completa de la base de datos con vistas interactivas',
      color: 'text-emerald-600'
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Diagramas ERD',
      description: 'Visualiza las relaciones entre entidades con diagramas interactivos',
      color: 'text-blue-600'
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'Validación de Datos',
      description: 'Valida datos en tiempo real usando esquemas Zod generados automáticamente',
      color: 'text-purple-600'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Análisis de Relaciones',
      description: 'Analiza la complejidad y dependencias entre tablas',
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      title: 'Exportar Esquema',
      description: 'Descarga el esquema completo en formato JSON',
      action: () => console.log('Exportar esquema'),
      icon: <Download className="h-4 w-4" />
    },
    {
      title: 'Generar Documentación',
      description: 'Crea documentación automática del esquema',
      action: () => console.log('Generar documentación'),
      icon: <Share2 className="h-4 w-4" />
    },
    {
      title: 'Validar Integridad',
      description: 'Verifica la integridad referencial del esquema',
      action: () => console.log('Validar integridad'),
      icon: <CheckCircle className="h-4 w-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg">
                  <Database className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Análisis de Base de Datos
                  </h1>
                  <p className="text-slate-600">
                    Herramientas completas para visualizar y analizar el esquema ISOFlow3
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm">
                  {schemaStats.totalTables} tablas
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {schemaStats.totalRelations} relaciones
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="schema">Esquemas</TabsTrigger>
          <TabsTrigger value="erd">Diagrama ERD</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
          <TabsTrigger value="documentation">Documentación</TabsTrigger>
        </TabsList>

          {/* Vista General */}
          <TabsContent value="overview" className="space-y-6">
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Database className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{schemaStats.totalTables}</p>
                      <p className="text-sm text-slate-600">Tablas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{schemaStats.totalColumns}</p>
                      <p className="text-sm text-slate-600">Columnas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Link className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{schemaStats.totalRelations}</p>
                      <p className="text-sm text-slate-600">Relaciones</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{schemaStats.primaryKeys}</p>
                      <p className="text-sm text-slate-600">Claves PK</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Link className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{schemaStats.foreignKeys}</p>
                      <p className="text-sm text-slate-600">Claves FK</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Características principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Características del Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-slate-100 ${feature.color}`}>
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{feature.title}</h4>
                          <p className="text-sm text-slate-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={action.action}
                      >
                        <div className="flex items-center space-x-3">
                          {action.icon}
                          <div className="text-left">
                            <div className="font-medium">{action.title}</div>
                            <div className="text-xs text-slate-500">{action.description}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información del sistema */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Técnica</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Base de datos:</span>
                      <span className="font-medium">SQLite (Turso)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">ORM:</span>
                      <span className="font-medium">Drizzle ORM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Validación:</span>
                      <span className="font-medium">Zod</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Arquitectura:</span>
                      <span className="font-medium">Multi-tenant</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Estándar:</span>
                      <span className="font-medium">ISO 9001</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tablas Principales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {['organizations', 'users', 'personal', 'procesos', 'hallazgos', 'acciones', 'auditorias', 'documentos'].map((table) => (
                      <div key={table} className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
                        <Database className="h-3 w-3 text-emerald-600" />
                        <span className="font-medium">{table}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Esquemas */}
          <TabsContent value="schema">
            <DatabaseSchemaViewer />
          </TabsContent>

          {/* Diagrama ERD */}
          <TabsContent value="erd">
            <ERDDiagram />
          </TabsContent>

          {/* Validador */}
          <TabsContent value="validator">
            <SchemaValidator />
          </TabsContent>

          {/* Documentación */}
          <TabsContent value="documentation">
            <SchemaDocumentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DatabaseSchemaPage; 