import React, { useState, useEffect } from 'react';
import { usuariosService } from '../services/usuarios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, User } from 'lucide-react';

const UsersPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });

  // Solo admin puede acceder a esta página
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('[DEBUG] Cargando usuarios...');
      const response = await usuariosService.getAll();
      console.log('[DEBUG] Respuesta de usuarios:', response);
      
      if (response && response.users) {
        setUsers(response.users);
        console.log('[DEBUG] Usuarios cargados exitosamente:', response.users.length);
      } else {
        console.warn('[DEBUG] Respuesta inesperada:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('[DEBUG] Error cargando usuarios:', error);
      toast({
        title: 'Error',
        description: `No se pudieron cargar los usuarios: ${error.message}`,
        variant: 'destructive',
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      console.log('[DEBUG] Creando usuario:', formData);
      
      // Crear el usuario en el backend
      const response = await usuariosService.create(formData);
      console.log('[DEBUG] Usuario creado exitosamente:', response);
      
      // Actualización optimista: agregar el usuario a la lista inmediatamente
      const newUser = {
        id: response.user?.id || Date.now(), // Usar ID del backend o temporal
        name: formData.name,
        email: formData.email,
        role: formData.role,
        is_active: 1,
        created_at: new Date().toISOString()
      };
      
      setUsers(prevUsers => [newUser, ...prevUsers]);
      
      // Cerrar modal y limpiar formulario
      setIsCreateModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'employee' });
      
      // Mostrar mensaje de éxito
      toast({
        title: '✓ Usuario Creado',
        description: 'El usuario ha sido creado exitosamente.',
        variant: 'success',
      });
      
      // Recargar usuarios en segundo plano para sincronizar con el servidor
      try {
        console.log('[DEBUG] Sincronizando lista de usuarios...');
        await loadUsers();
      } catch (refreshError) {
        console.warn('[DEBUG] Error al sincronizar lista (esto es normal, el usuario ya fue agregado):', refreshError);
        // No mostrar error al usuario ya que la actualización optimista ya funcionó
      }
      
    } catch (error) {
      console.error('[DEBUG] Error creando usuario:', error);
      
      // Error: Mostrar mensaje pero NO cerrar modal
      const errorMessage = error.message || 'No se pudo crear el usuario.';
      
      toast({
        title: '⚠️ Error al Crear Usuario',
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Si es error de email duplicado, resaltar el campo email
      if (errorMessage.includes('email')) {
        document.getElementById('email')?.focus();
      }
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      delete updateData.password; // No actualizar contraseña en edición
      
      console.log('[DEBUG] Actualizando usuario:', selectedUser.id, updateData);
      
      await usuariosService.update(selectedUser.id, updateData);
      
      // Actualización optimista
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === selectedUser.id 
            ? { ...u, ...updateData }
            : u
        )
      );
      
      toast({
        title: 'Usuario Actualizado',
        description: 'El usuario ha sido actualizado exitosamente.',
        variant: 'success',
      });
      
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setFormData({ name: '', email: '', password: '', role: 'employee' });
      
      // Sincronizar con el servidor en segundo plano
      try {
        await loadUsers();
      } catch (refreshError) {
        console.warn('[DEBUG] Error al sincronizar después de editar:', refreshError);
      }
      
    } catch (error) {
      console.error('[DEBUG] Error actualizando usuario:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar el usuario.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`¿Estás seguro de que quieres desactivar al usuario ${userName}?`)) {
      try {
        console.log('[DEBUG] Desactivando usuario:', userId);
        
        await usuariosService.delete(userId);
        
        // Actualización optimista
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId 
              ? { ...u, is_active: 0 }
              : u
          )
        );
        
        toast({
          title: 'Usuario Desactivado',
          description: 'El usuario ha sido desactivado exitosamente.',
          variant: 'success',
        });
        
        // Sincronizar con el servidor en segundo plano
        try {
          await loadUsers();
        } catch (refreshError) {
          console.warn('[DEBUG] Error al sincronizar después de desactivar:', refreshError);
        }
        
      } catch (error) {
        console.error('[DEBUG] Error desactivando usuario:', error);
        toast({
          title: 'Error',
          description: error.message || 'No se pudo desactivar el usuario.',
          variant: 'destructive',
        });
      }
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setIsEditModalOpen(true);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'super_admin': return 'Super Admin';
      case 'manager': return 'Gerente';
      default: return 'Empleado';
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Acceso Denegado</CardTitle>
            <CardDescription className="text-center">
              No tienes permisos para acceder a la gestión de usuarios.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios de tu organización</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Agrega un nuevo usuario a tu organización.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Empleado</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Crear Usuario
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No hay usuarios registrados</p>
              </CardContent>
            </Card>
          ) : (
            users.map((userItem) => (
              <Card key={userItem.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{userItem.name}</h3>
                      <p className="text-sm text-gray-600">{userItem.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getRoleBadgeColor(userItem.role)}>
                          {getRoleLabel(userItem.role)}
                        </Badge>
                        {userItem.is_active === 0 && (
                          <Badge variant="secondary">Inactivo</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(userItem)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(userItem.id, userItem.name)}
                      disabled={userItem.id === user?.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modal de Edición de Usuario */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica los datos del usuario seleccionado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre Completo</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Correo Electrónico</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Rol</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Empleado</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Actualizar Usuario
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
