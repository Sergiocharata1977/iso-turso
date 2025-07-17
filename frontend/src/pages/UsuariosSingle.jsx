import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX,
  Crown,
  Shield,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { usuariosService } from '../services/usuarios';

const UsuariosSingle = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 📊 Estados para estadísticas
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    managers: 0,
    employees: 0,
    active: 0
  });

  // 🎯 Cargar usuarios
  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuariosService.getAll();
      const usuariosData = response.users || [];
      setUsuarios(usuariosData);
      
      // Calcular estadísticas
      const newStats = {
        total: usuariosData.length,
        admins: usuariosData.filter(u => u.role === 'admin').length,
        managers: usuariosData.filter(u => u.role === 'manager').length,
        employees: usuariosData.filter(u => u.role === 'employee').length,
        active: usuariosData.filter(u => u.is_active !== 0).length
      };
      setStats(newStats);
      
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  // 🔍 Filtrar usuarios
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || usuario.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // 🎨 Obtener color del rol
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'employee': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 🎯 Obtener icono del rol
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3" />;
      case 'manager': return <Shield className="h-3 w-3" />;
      case 'employee': return <User className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  // 🗑️ Eliminar usuario
  const handleDeleteUser = async (userId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;
    
    try {
      await usuariosService.delete(userId);
      toast.success('Usuario eliminado exitosamente');
      loadUsuarios();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      toast.error('Error al eliminar usuario');
    }
  };

  // 📝 Formulario de nuevo usuario
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await usuariosService.create(newUser);
      toast.success('Usuario creado exitosamente');
      setIsCreateModalOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'employee' });
      loadUsuarios();
    } catch (error) {
      console.error('Error creando usuario:', error);
      toast.error('Error al crear usuario');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* 📊 Header con estadísticas */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600 mt-1">Sistema de administración de usuarios multi-tenant</p>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">👤 Employee</SelectItem>
                        <SelectItem value="manager">🎯 Manager</SelectItem>
                        <SelectItem value="admin">👑 Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">Crear Usuario</Button>
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* 📊 Cards de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
                  </div>
                  <Crown className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Managers</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.managers}</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Empleados</p>
                    <p className="text-2xl font-bold text-green-600">{stats.employees}</p>
                  </div>
                  <User className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Activos</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 🔍 Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">👑 Admin</SelectItem>
                <SelectItem value="manager">🎯 Manager</SelectItem>
                <SelectItem value="employee">👤 Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 👥 Lista de usuarios */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsuarios.map((usuario) => (
              <Card key={usuario.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={usuario.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {usuario.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{usuario.name}</h3>
                        <p className="text-sm text-gray-500">{usuario.email}</p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(usuario);
                          setIsEditModalOpen(true);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteUser(usuario.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rol:</span>
                      <Badge className={`${getRoleColor(usuario.role)} flex items-center gap-1`}>
                        {getRoleIcon(usuario.role)}
                        {usuario.role === 'admin' ? 'Admin' : 
                         usuario.role === 'manager' ? 'Manager' : 'Employee'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estado:</span>
                      <Badge className={usuario.is_active !== 0 ? 
                        'bg-green-100 text-green-800 border-green-200' : 
                        'bg-red-100 text-red-800 border-red-200'}>
                        {usuario.is_active !== 0 ? (
                          <>
                            <UserCheck className="h-3 w-3 mr-1" />
                            Activo
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3 mr-1" />
                            Inactivo
                          </>
                        )}
                      </Badge>
                    </div>

                    {usuario.created_at && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Creado:</span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(usuario.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredUsuarios.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
            <p className="text-gray-500">
              {searchTerm || filterRole !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primer usuario'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosSingle;
