import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import auditService from '@/services/auditService'; // Importar el nuevo servicio

const RegistroActividad = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['auditLogs', page],
    queryFn: () => auditService.getAuditLogs({ page, limit: 15 }),
    keepPreviousData: true,
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Actividad</CardTitle>
        <CardDescription>Bitácora de acciones recientes en la organización</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Cargando...</div>
        ) : isError ? (
           <div className="text-center py-8 text-red-500">
             <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
             <p>Error al cargar la actividad</p>
             <p className="text-sm text-gray-600">{error.message}</p>
           </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay actividad registrada aún</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Fecha</th>
                    <th className="px-4 py-2 text-left font-semibold">Usuario</th>
                    <th className="px-4 py-2 text-left font-semibold">Acción</th>
                    <th className="px-4 py-2 text-left font-semibold">Recurso</th>
                    <th className="px-4 py-2 text-left font-semibold">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} className="border-b dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-2 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-2">{log.user_name || log.user_email || 'Sistema'}</td>
                      <td className="px-4 py-2">
                        <Badge variant="secondary" className="capitalize">{log.action.toLowerCase()}</Badge>
                      </td>
                      <td className="px-4 py-2 capitalize">{log.resource_type.toLowerCase()}</td>
                      <td className="px-4 py-2 text-xs text-gray-500 truncate" title={log.details}>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Paginación */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600">
                Página {pagination.page} de {pagination.pages}
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={page === pagination.pages || !pagination.pages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};


const DashboardPage = () => {
  const { user, token, hasRole, isAdmin, isManager } = useAuthStore();
  const [stats, setStats] = useState({
    users: 0,
    processes: 0,
    documents: 0,
    activeActions: 0,
    completedActions: 0,
    pendingAudits: 0
  });
  const [tab, setTab] = useState('resumen');

  // Función para obtener estadísticas de la organización
  const fetchOrgStats = async () => {
    try {
      const [usersRes, processesRes] = await Promise.all([
        fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/procesos', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const usersData = usersRes.ok ? await usersRes.json() : { users: [] };
      const processesData = processesRes.ok ? await processesRes.json() : [];

      setStats({
        users: usersData.users?.length || 0,
        processes: processesData.length || 0,
        documents: 0, // Se puede agregar después
        activeActions: 0, // Se puede agregar después
        completedActions: 0, // Se puede agregar después
        pendingAudits: 0 // Se puede agregar después
      });
    } catch (error) {
      console.error('Error fetching organization stats:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrgStats();
    }
  }, [token]);

  const quickActions = [
    {
      title: 'Gestionar Usuarios',
      description: 'Administrar usuarios de la organización',
      icon: Users,
      href: '/usuarios',
      color: 'bg-blue-500',
      visible: isAdmin()
    },
    {
      title: 'Ver Procesos',
      description: 'Gestionar procesos organizacionales',
      icon: Activity,
      href: '/procesos',
      color: 'bg-green-500',
      visible: hasRole('manager')
    },
    {
      title: 'Documentos',
      description: 'Revisar documentación del SGC',
      icon: FileText,
      href: '/documentos',
      color: 'bg-purple-500',
      visible: true
    },
    {
      title: 'Calendario',
      description: 'Ver eventos y actividades',
      icon: Calendar,
      href: '/calendario',
      color: 'bg-orange-500',
      visible: true
    }
  ];

  const statCards = [
    {
      title: 'Usuarios Activos',
      value: stats.users,
      description: 'Miembros de la organización',
      icon: Users,
      color: 'text-blue-600',
      visible: isManager()
    },
    {
      title: 'Procesos',
      value: stats.processes,
      description: 'Procesos definidos',
      icon: Activity,
      color: 'text-green-600',
      visible: true
    },
    {
      title: 'Documentos',
      value: stats.documents,
      description: 'Documentos del SGC',
      icon: FileText,
      color: 'text-purple-600',
      visible: true
    },
    {
      title: 'Acciones Pendientes',
      value: stats.activeActions,
      description: 'Requieren atención',
      icon: AlertTriangle,
      color: 'text-orange-600',
      visible: hasRole('manager')
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="actividad">Registro de Actividad</TabsTrigger>
        </TabsList>
        <TabsContent value="resumen">
      {/* Header con información de la organización */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            Bienvenido, {user?.name} - {user?.organization_name || 'Tu Organización'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Building className="h-3 w-3" />
            <span>Org ID: {user?.organization_id}</span>
          </Badge>
          
          <Badge 
            variant={user?.role === 'admin' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {user?.role === 'admin' ? '👑 Admin' : 
             user?.role === 'manager' ? '🎯 Manager' : 
             '👤 Employee'}
          </Badge>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.filter(card => card.visible).map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Acceso directo a las funciones principales según tu rol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.filter(action => action.visible).map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => window.location.href = action.href}
              >
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información del sistema multi-tenant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Información del Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Tu Organización</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>ID: {user?.organization_id}</p>
                <p>Nombre: {user?.organization_name || 'No disponible'}</p>
                <p>Tu rol: {user?.role}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Permisos</h4>
              <div className="space-y-1">
                <Badge variant={hasRole('employee') ? 'default' : 'secondary'} size="sm">
                  {hasRole('employee') ? '✅' : '❌'} Empleado
                </Badge>
                <Badge variant={hasRole('manager') ? 'default' : 'secondary'} size="sm">
                  {hasRole('manager') ? '✅' : '❌'} Gerente
                </Badge>
                <Badge variant={hasRole('admin') ? 'default' : 'secondary'} size="sm">
                  {hasRole('admin') ? '✅' : '❌'} Administrador
                </Badge>
              </div>
            </div>
          </div>

          {/* Indicador de aislamiento de datos */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Aislamiento de Datos Activo
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Solo puedes ver y gestionar datos de tu organización (ID: {user?.organization_id})
            </p>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
        <TabsContent value="actividad">
          <RegistroActividad />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage; 