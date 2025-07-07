import React, { useState } from 'react';

const UsuarioForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    role: initialData.role || 'user',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium">Rol</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Guardar
      </button>
    </form>
  );
};

export default UsuarioForm;
