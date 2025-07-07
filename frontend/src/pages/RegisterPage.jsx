import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, AlertCircle, Building } from 'lucide-react';
import { toast } from 'sonner';
import { registerSchema } from '../schemas/authSchemas';
import { authService } from '../services/authService';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organizationName: '',
      userName: '',
      userEmail: '',
      userPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Eliminar confirmPassword antes de enviar
      const { confirmPassword, ...registerData } = data;
      
      const response = await authService.register(registerData);
      
      // Si llegamos aquí sin error, el registro fue exitoso
      if (response.status === 200 || response.status === 201) {
        toast.success('¡Registro exitoso! Organización y usuario creados correctamente.');
        console.log('Registro exitoso:', response.data);
        
        // Redirigir al login para que el usuario inicie sesión
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.data?.message || 'Error al registrar la cuenta');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        // Error del servidor (4xx, 5xx)
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           `Error del servidor (${error.response.status})`;
        toast.error(errorMessage);
      } else if (error.request) {
        // Error de red
        toast.error('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        // Otro tipo de error
        toast.error('Error inesperado. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Registra tu organización y crea tu cuenta de administrador
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Organization Name */}
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                <Building className="inline h-4 w-4 mr-1" />
                Nombre de la Organización
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('organizationName')}
                  type="text"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
                    errors.organizationName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Mi Empresa S.A."
                />
                {errors.organizationName && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.organizationName && (
                <p className="mt-2 text-sm text-red-600">{errors.organizationName.message}</p>
              )}
            </div>

            {/* User Name */}
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                Nombre Completo del Administrador
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('userName')}
                  type="text"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
                    errors.userName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Juan Pérez"
                />
                {errors.userName && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.userName && (
                <p className="mt-2 text-sm text-red-600">{errors.userName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('userEmail')}
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
                    errors.userEmail ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="admin@miempresa.com"
                />
                {errors.userEmail && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.userEmail && (
                <p className="mt-2 text-sm text-red-600">{errors.userEmail.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('userPassword')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm pr-10 ${
                    errors.userPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.userPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.userPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm pr-10 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando cuenta...
                  </div>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Crear Cuenta
                  </>
                )}
              </button>
            </div>

            {/* Link to Login */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-emerald-600 hover:text-emerald-500"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
