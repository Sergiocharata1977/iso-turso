import React from 'react';
import { Settings, Shield, Users, Database, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdministracionPage = () => {
  const rolesSistema = [
    {
      rol: 'super_admin',
      descripcion: 'Administrador del sistema multi-tenant',
      permisos: [
        'Acceso a todas las organizaciones',
        'Crear y gestionar organizaciones',
        'Configuración global del sistema',
        'Acceso a logs y métricas',
        'Gestión de planes y suscripciones'
      ],
      color: 'bg-red-500'
    },
    {
      rol: 'admin',
      descripcion: 'Administrador de una organización',
      permisos: [
        'Gestión completa de su organización',
        'Crear y gestionar usuarios',
        'Configurar departamentos y puestos',
        'Acceso a todos los módulos',
        'Generar reportes ejecutivos'
      ],
      color: 'bg-blue-500'
    },
    {
      rol: 'manager',
      descripcion: 'Gerente de área o departamento',
      permisos: [
        'Supervisar procesos de su área',
        'Gestionar personal asignado',
        'Aprobar acciones y hallazgos',
        'Generar reportes de área',
        'Configurar indicadores'
      ],
      color: 'bg-green-500'
    },
    {
      rol: 'employee',
      descripcion: 'Usuario operativo del sistema',
      permisos: [
        'Acceso a módulos asignados',
        'Crear y gestionar registros',
        'Ver reportes de su área',
        'Participar en auditorías',
        'Actualizar información personal'
      ],
      color: 'bg-gray-500'
    }
  ];

  const configuracionesSistema = [
    {
      categoria: 'Seguridad',
      items: [
        { nombre: 'Autenticación JWT', descripcion: 'Tokens de sesión seguros' },
        { nombre: 'Roles y Permisos', descripcion: 'Control granular de acceso' },
        { nombre: 'Encriptación', descripcion: 'Datos sensibles encriptados' },
        { nombre: 'Auditoría', descripcion: 'Log de todas las operaciones' }
      ]
    },
    {
      categoria: 'Multi-Tenant',
      items: [
        { nombre: 'Aislamiento de Datos', descripcion: 'Separación por organización' },
        { nombre: 'Middleware Tenant', descripcion: 'Filtros automáticos' },
        { nombre: 'Configuración por Org', descripcion: 'Personalización por tenant' },
        { nombre: 'Límites de Plan', descripcion: 'Control de recursos por plan' }
      ]
    },
    {
      categoria: 'Rendimiento',
      items: [
        { nombre: 'Caché', descripcion: 'Optimización de consultas' },
        { nombre: 'Índices BD', descripcion: 'Consultas optimizadas' },
        { nombre: 'Lazy Loading', descripcion: 'Carga bajo demanda' },
        { nombre: 'Compresión', descripcion: 'Reducción de tamaño de datos' }
      ]
    }
  ];

  const tareasMantenimiento = [
    {
      titulo: 'Backup Diario',
      descripcion: 'Respaldo automático de base de datos',
      frecuencia: 'Diario',
      duracion: '5 minutos',
      icon: Database
    },
    {
      titulo: 'Limpieza de Logs',
      descripcion: 'Eliminar logs antiguos del sistema',
      frecuencia: 'Semanal',
      duracion: '10 minutos',
      icon: Activity
    },
    {
      titulo: 'Verificación de Seguridad',
      descripcion: 'Revisar accesos y permisos',
      frecuencia: 'Mensual',
      duracion: '30 minutos',
      icon: Shield
    },
    {
      titulo: 'Actualización de Sistema',
      descripcion: 'Instalar actualizaciones de seguridad',
      frecuencia: 'Mensual',
      duracion: '1 hora',
      icon: Settings
    }
  ];

  const monitoreo = [
    {
      metrica: 'Uptime del Sistema',
      valor: '99.9%',
      estado: 'excelente',
      descripcion: 'Tiempo de actividad del sistema'
    },
    {
      metrica: 'Usuarios Activos',
      valor: '150+',
      estado: 'bueno',
      descripcion: 'Usuarios concurrentes promedio'
    },
    {
      metrica: 'Tiempo de Respuesta',
      valor: '< 2s',
      estado: 'excelente',
      descripcion: 'Tiempo promedio de respuesta API'
    },
    {
      metrica: 'Espacio en Disco',
      valor: '75%',
      estado: 'advertencia',
      descripcion: 'Uso de almacenamiento'
    }
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'excelente': return 'text-green-600 bg-green-100';
      case 'bueno': return 'text-blue-600 bg-blue-100';
      case 'advertencia': return 'text-yellow-600 bg-yellow-100';
      case 'critico': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-500 rounded-lg flex items-center justify-center">
            <Settings className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Administración del Sistema</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configuración, mantenimiento, seguridad y monitoreo del sistema ISOFlow3. 
          Guías para administradores y super administradores.
        </p>
      </div>

      {/* Roles y Permisos */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">👥 Roles y Permisos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rolesSistema.map((rol, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${rol.color} rounded-lg flex items-center justify-center`}>
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {rol.rol.replace('_', ' ').toUpperCase()}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{rol.descripcion}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Permisos:</h4>
                  <ul className="space-y-1">
                    {rol.permisos.map((permiso, permisoIndex) => (
                      <li key={permisoIndex} className="text-sm text-gray-700 flex items-start space-x-2">
                        <span className="text-blue-500">•</span>
                        <span>{permiso}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Configuraciones */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">⚙️ Configuraciones del Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {configuracionesSistema.map((config, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {config.categoria}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {config.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-800">{item.nombre}</div>
                      <div className="text-sm text-gray-600">{item.descripcion}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tareas de Mantenimiento */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">🔧 Tareas de Mantenimiento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tareasMantenimiento.map((tarea, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <tarea.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {tarea.titulo}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{tarea.descripcion}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">Frecuencia: {tarea.frecuencia}</div>
                    <div className="text-sm text-gray-600">Duración: {tarea.duracion}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Programar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monitoreo */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Monitoreo del Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {monitoreo.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-800">
                    {item.metrica}
                  </CardTitle>
                  <Badge className={getEstadoColor(item.estado)}>
                    {item.estado.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {item.valor}
                </div>
                <p className="text-sm text-gray-600">{item.descripcion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Alertas y Notificaciones */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Alertas y Notificaciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Alertas Automáticas</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Uso de disco > 80%</li>
              <li>• Tiempo de respuesta > 5s</li>
              <li>• Errores de autenticación</li>
              <li>• Intentos de acceso no autorizado</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Notificaciones</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Backup completado exitosamente</li>
              <li>• Nuevos usuarios registrados</li>
              <li>• Auditorías programadas</li>
              <li>• Actualizaciones del sistema</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Acciones de Emergencia */}
      <div className="bg-red-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🚨 Acciones de Emergencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-red-800 mb-2">Sistema Caído</h4>
            <ol className="text-sm text-gray-700 space-y-1">
              <li>1. Verificar logs del servidor</li>
              <li>2. Reiniciar servicios críticos</li>
              <li>3. Restaurar desde backup</li>
              <li>4. Notificar a usuarios</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-red-800 mb-2">Brecha de Seguridad</h4>
            <ol className="text-sm text-gray-700 space-y-1">
              <li>1. Bloquear acceso sospechoso</li>
              <li>2. Cambiar credenciales críticas</li>
              <li>3. Revisar logs de acceso</li>
              <li>4. Notificar a administradores</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-red-800 mb-2">Pérdida de Datos</h4>
            <ol className="text-sm text-gray-700 space-y-1">
              <li>1. Detener escrituras en BD</li>
              <li>2. Restaurar último backup</li>
              <li>3. Verificar integridad</li>
              <li>4. Replicar datos perdidos</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministracionPage; 