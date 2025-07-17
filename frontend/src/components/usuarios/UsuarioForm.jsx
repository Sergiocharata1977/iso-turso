import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

const UsuarioForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    password: '',
    role: initialData.role || 'employee',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Si es edición y no hay password, no enviarlo
    const submitData = { ...formData };
    if (isEditing && !submitData.password) {
      delete submitData.password;
    }
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre Completo</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ingresa el nombre completo"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="usuario@empresa.com"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">
          Contraseña {isEditing && '(dejar vacío para mantener actual)'}
        </Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          required={!isEditing}
        />
      </div>
      
      <div>
        <Label htmlFor="role">Rol</Label>
        <Select value={formData.role} onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employee">👤 Empleado</SelectItem>
            <SelectItem value="manager">🎯 Gerente</SelectItem>
            <SelectItem value="admin">👑 Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
};

export default UsuarioForm;
