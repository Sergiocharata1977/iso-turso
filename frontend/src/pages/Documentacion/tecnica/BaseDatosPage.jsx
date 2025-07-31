import React from 'react';
import { Database, Table, Key, Link, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BaseDatosPage = () => {
  const tablasSistema = [
    {
      nombre: 'organizations',
      descripcion: 'Organizaciones del sistema multi-tenant',
      campos: ['id', 'name', 'email', 'created_at', 'updated_at'],
      color: 'bg-blue-500'
    },
    {
      nombre: 'usuarios',
      descripcion: 'Usuarios del sistema con roles y permisos',
      campos: ['id', 'name', 'email', 'role', 'organization_id', 'created_at'],
      color: 'bg-green-500'
    },
    {
      nombre: 'departamentos',
      descripcion: 'Estructura organizacional por departamentos',
      campos: ['id', 'nombre', 'descripcion', 'organization_id', 'created_at'],
      color: 'bg-purple-500'
    },
    {
      nombre: 'personal',
      descripcion: 'Empleados y personal de la organización',
      campos: ['id', 'nombre', 'email', 'departamento_id', 'puesto_id', 'organization_id'],
      color: 'bg-orange-500'
    },
    {
      nombre: 'auditorias',
      descripcion: 'Registro de auditorías internas y externas',
      campos: ['id', 'tipo', 'fecha', 'auditor', 'estado', 'organization_id'],
      color: 'bg-red-500'
    },
    {
      nombre: 'hallazgos',
      descripcion: 'Hallazgos y no conformidades del sistema',
      campos: ['id', 'descripcion', 'estado', 'responsable', 'organization_id'],
      color: 'bg-yellow-500'
    }
  ];

  const relacionesPrincipales = [
    {
      tabla: 'organizations',
      relacion: '1:N',
      con: 'usuarios',
      descripcion: 'Una organización puede tener múltiples usuarios'
    },
    {
      tabla: 'organizations',
      relacion: '1:N',
      con: 'departamentos',
      descripcion: 'Una organización puede tener múltiples departamentos'
    },
    {
      tabla: 'departamentos',
      relacion: '1:N',
      con: 'personal',
      descripcion: 'Un departamento puede tener múltiples empleados'
    },
    {
      tabla: 'usuarios',
      relacion: '1:N',
      con: 'auditorias',
      descripcion: 'Un usuario puede realizar múltiples auditorías'
    }
  ];

  const configuracionBD = [
    {
      titulo: 'Multi-Tenant',
      descripcion: 'Aislamiento de datos por organización',
      detalles: [
        'Cada tabla incluye organization_id',
        'Filtros automáticos por tenant',
        'Middleware de autenticación por organización'
      ]
    },
    {
      titulo: 'Índices',
      descripcion: 'Optimización de consultas',
      detalles: [
        'Índice en organization_id en todas las tablas',
        'Índices en campos de búsqueda frecuente',
        'Índices en relaciones foreign key'
      ]
    },
    {
      titulo: 'Auditoría',
      descripcion: 'Trazabilidad de cambios',
      detalles: [
        'Campos created_at y updated_at automáticos',
        'Registro de usuario que realiza cambios',
        'Historial de modificaciones'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
            <Database className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Base de Datos</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Documentación técnica de la estructura de base de datos, relaciones, 
          índices y configuración del sistema ISOFlow3.
        </p>
      </div>

      {/* Configuración de Base de Datos */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">⚙️ Configuración</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {configuracionBD.map((config, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {config.titulo}
                </CardTitle>
                <p className="text-sm text-gray-600">{config.descripcion}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {config.detalles.map((detalle, detalleIndex) => (
                    <li key={detalleIndex} className="text-sm text-gray-700 flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>{detalle}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tablas del Sistema */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Tablas del Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tablasSistema.map((tabla, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${tabla.color} rounded-lg flex items-center justify-center`}>
                    <Table className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {tabla.nombre}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{tabla.descripcion}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Campos principales:</h4>
                  <div className="flex flex-wrap gap-1">
                    {tabla.campos.map((campo, campoIndex) => (
                      <Badge key={campoIndex} variant="secondary" className="text-xs">
                        {campo}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Relaciones */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">🔗 Relaciones Principales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relacionesPrincipales.map((relacion, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Link className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-800">
                      {relacion.tabla} → {relacion.con}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {relacion.relacion}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">{relacion.descripcion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Estructura Multi-Tenant */}
      <div className="bg-emerald-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🏢 Estructura Multi-Tenant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-emerald-800 mb-2">Aislamiento de Datos</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Cada organización tiene su propio espacio de datos</li>
              <li>• organization_id presente en todas las tablas</li>
              <li>• Middleware automático de filtrado por tenant</li>
              <li>• Sin acceso cross-tenant</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-800 mb-2">Seguridad</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Validación de permisos por organización</li>
              <li>• Roles jerárquicos (super_admin, admin, manager, employee)</li>
              <li>• Auditoría de todas las operaciones</li>
              <li>• Encriptación de datos sensibles</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Optimización */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 Optimización</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Índices</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• organization_id en todas las tablas</li>
              <li>• Campos de búsqueda frecuente</li>
              <li>• Relaciones foreign key</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Consultas</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Prepared statements</li>
              <li>• Paginación automática</li>
              <li>• Filtros optimizados</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Mantenimiento</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Backups automáticos</li>
              <li>• Limpieza de datos antiguos</li>
              <li>• Monitoreo de rendimiento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseDatosPage; 