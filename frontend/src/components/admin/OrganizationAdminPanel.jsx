import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Settings, 
  Activity, 
  Plus,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Building2
} from 'lucide-react';
import { apiService } from '@/services/apiService';
import { authStore } from '@/store/authStore';

const OrganizationAdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const organizationId = authStore.getOrganizationId();
      
      const [usersResponse, orgResponse] = await Promise.all([
        apiService.get(`/api/admin/organization/${organizationId}/users`),
        apiService.get(`/api/admin/organization/${organizationId}`)
      ]);
      
      setUsers(usersResponse.data);
      setOrganization(orgResponse.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'admin': { color: 'bg-blue-100 text-blue-800', icon: UserCheck },
      'manager': { color: 'bg-green-100 text-green-800', icon: Users },
      'employee': { color: 'bg-gray-100 text-gray-800', icon: Users }
    };
    
    const config = roleConfig[role] || roleConfig.employee;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {role.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (isActive) => (
    <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
      {isActive ? 'Activo' : 'Inactivo'}
    </Badge>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando panel de administración...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Administración de Organización
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {organization?.name} - Gestión de usuarios y configuración
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span className="font-medium">{organization?.name}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Usuarios de la Organización ({users.length})</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.is_active)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Organización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre de la Organización</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md"
                      defaultValue={organization?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email de Contacto</label>
                    <input 
                      type="email" 
                      className="w-full p-2 border rounded-md"
                      defaultValue={organization?.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono</label>
                    <input 
                      type="tel" 
                      className="w-full p-2 border rounded-md"
                      defaultValue={organization?.phone}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Plan</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="basic" selected={organization?.plan === 'basic'}>Básico</option>
                      <option value="premium" selected={organization?.plan === 'premium'}>Premium</option>
                      <option value="enterprise" selected={organization?.plan === 'enterprise'}>Empresarial</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full">Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Usuario registrado</p>
                      <p className="text-sm text-gray-600">Juan Pérez se registró en el sistema</p>
                    </div>
                    <span className="text-sm text-gray-500">Hace 2 horas</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auditoría completada</p>
                      <p className="text-sm text-gray-600">Auditoría interna de calidad finalizada</p>
                    </div>
                    <span className="text-sm text-gray-500">Hace 1 día</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationAdminPanel; 