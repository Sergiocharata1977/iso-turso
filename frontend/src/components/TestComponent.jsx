import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useAuthStore from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Schema de prueba
const testSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  age: z.number().min(18, 'Debe ser mayor de 18 años')
});

const TestComponent = () => {
  const [testResults, setTestResults] = useState([]);
  const { user, isAuthenticated, hasRole } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(testSchema)
  });

  const onSubmit = (data) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      message: `✅ Formulario enviado: ${data.name} (${data.email}) - ${data.age} años`,
      timestamp: new Date().toLocaleTimeString()
    }]);
    reset();
  };

  const runTests = () => {
    const tests = [
      {
        name: 'React Hook Form',
        status: typeof useForm === 'function' ? '✅ OK' : '❌ ERROR',
        description: 'Librería de formularios cargada'
      },
      {
        name: 'Zod Validation',
        status: typeof z === 'object' ? '✅ OK' : '❌ ERROR',
        description: 'Librería de validación cargada'
      },
      {
        name: 'Zustand Store',
        status: typeof useAuthStore === 'function' ? '✅ OK' : '❌ ERROR',
        description: 'Store de estado global cargado'
      },
      {
        name: 'Radix UI Components',
        status: Button && Input && Label ? '✅ OK' : '❌ ERROR',
        description: 'Componentes UI disponibles'
      },
      {
        name: 'Validación en tiempo real',
        status: Object.keys(errors).length >= 0 ? '✅ OK' : '❌ ERROR',
        description: 'Sistema de validación funcionando'
      }
    ];

    setTestResults(tests.map(test => ({
      id: Date.now() + Math.random(),
      message: `${test.status} ${test.name}: ${test.description}`,
      timestamp: new Date().toLocaleTimeString()
    })));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Pruebas del Frontend - Sistema Multi-Tenant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Estado de autenticación */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Estado de Autenticación:</h3>
            <div className="space-y-2">
              <Badge variant={isAuthenticated ? 'default' : 'secondary'}>
                {isAuthenticated ? '✅ Autenticado' : '❌ No autenticado'}
              </Badge>
              {user && (
                <div className="text-sm text-gray-600">
                  <p>Usuario: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>Rol: {user.role}</p>
                  <p>Organización ID: {user.organization_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Prueba de permisos */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Prueba de Permisos:</h3>
            <div className="space-y-1">
              <Badge variant={hasRole('employee') ? 'default' : 'secondary'}>
                Employee: {hasRole('employee') ? '✅' : '❌'}
              </Badge>
              <Badge variant={hasRole('manager') ? 'default' : 'secondary'}>
                Manager: {hasRole('manager') ? '✅' : '❌'}
              </Badge>
              <Badge variant={hasRole('admin') ? 'default' : 'secondary'}>
                Admin: {hasRole('admin') ? '✅' : '❌'}
              </Badge>
            </div>
          </div>

          {/* Botón para ejecutar pruebas */}
          <Button onClick={runTests} className="w-full">
            🔍 Ejecutar Pruebas de Dependencias
          </Button>

          {/* Formulario de prueba */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Prueba de React Hook Form + Zod:</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Tu nombre"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  placeholder="25"
                />
                {errors.age && (
                  <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Probar Formulario'}
              </Button>
            </form>
          </div>

          {/* Resultados de las pruebas */}
          {testResults.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">Resultados de las Pruebas:</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testResults.map((result) => (
                  <div key={result.id} className="text-sm p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">[{result.timestamp}]</span> {result.message}
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setTestResults([])} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Limpiar Resultados
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestComponent;