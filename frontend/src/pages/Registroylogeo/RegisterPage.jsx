import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, ArrowRight, CheckCircle, Star, Clock, Users, Shield } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    empresa: '',
    telefono: '',
    plan: 'gratis' // gratis, premium
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos según lo que espera el backend
      const registerData = {
        organizationName: formData.empresa || 'Mi Empresa',
        adminName: formData.nombre,
        adminEmail: formData.email,
        adminPassword: formData.password,
        organizationEmail: formData.email,
        organizationPhone: formData.telefono,
        plan: formData.plan === 'gratis' ? 'basic' : 'premium'
      };

      const success = await register(registerData);
      
      if (success) {
        setIsSubmitted(true);
        toast.success('¡Registro exitoso! Bienvenido a ISO Flow');
        
        setTimeout(() => {
          navigate('/app/departamentos');
        }, 2000);
      } else {
        toast.error('Error en el registro');
      }
    } catch (error) {
      toast.error(error.message || 'Error al crear la cuenta');
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'gratis',
      name: 'Plan Gratuito',
      price: 'Gratis',
      duration: '7 días',
      features: [
        'Acceso completo a Recursos Humanos',
        'Gestión de departamentos y personal',
        'Capacitaciones y evaluaciones',
        'Documentación básica',
        'Soporte por email'
      ],
      popular: false,
      icon: Star,
      color: 'emerald'
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      price: '$99/mes',
      duration: 'Ilimitado',
      features: [
        'Todo del plan gratuito',
        'Sistema completo ISO 9001',
        'Auditorías y hallazgos',
        'Procesos y productos',
        'Soporte prioritario 24/7',
        'Backup automático',
        'Integraciones avanzadas'
      ],
      popular: true,
      icon: Shield,
      color: 'blue'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-2xl"
        >
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            ¡Cuenta creada exitosamente!
          </h2>
          <p className="text-slate-600 mb-4">
            Tu cuenta gratuita de ISO Flow está lista
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-emerald-800">
              <strong>Plan Gratuito:</strong> 7 días de acceso completo a Recursos Humanos
            </p>
          </div>
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-900 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 opacity-10 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-slate-700 opacity-10 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-600 opacity-10 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Lado izquierdo - Planes */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">ISO Flow</h1>
                <p className="text-emerald-300">Sistema de Gestión de Calidad</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-6">
              Comienza tu transformación digital
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Elige el plan que mejor se adapte a tus necesidades
            </p>

            <div className="space-y-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    formData.plan === plan.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  }`}
                  onClick={() => setFormData({ ...formData, plan: plan.id })}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <plan.icon className={`w-6 h-6 text-${plan.color}-400`} />
                      <div>
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-emerald-400">{plan.price}</span>
                          <span className="text-slate-400">/ {plan.duration}</span>
                        </div>
                      </div>
                    </div>
                    {plan.popular && (
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Más Popular
                      </span>
                    )}
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <h3 className="text-lg font-semibold mb-2">¿Ya tienes una cuenta?</h3>
              <p className="text-slate-300 mb-4">
                Inicia sesión para acceder a tu panel de control
              </p>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
              >
                <span>Iniciar sesión</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md"
          >
            {/* Logo móvil */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">ISO Flow</h1>
                  <p className="text-emerald-300 text-sm">Sistema de Gestión de Calidad</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Crea tu cuenta
                </h2>
                <p className="text-slate-600">
                  Únete a ISO Flow y transforma tu organización
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="Tu nombre"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    placeholder="+54 11 1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Star className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-semibold text-emerald-800">Plan Seleccionado</h3>
                  </div>
                  <p className="text-sm text-emerald-700">
                    {formData.plan === 'gratis' 
                      ? 'Plan Gratuito: 7 días de acceso completo a Recursos Humanos'
                      : 'Plan Premium: Acceso completo a todas las funcionalidades'
                    }
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <span>Crear cuenta gratuita</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-600">
                  ¿Ya tienes una cuenta?{' '}
                  <Link
                    to="/login"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  Al registrarte, aceptas nuestros{' '}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700">Términos de Servicio</a>
                  {' '}y{' '}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700">Política de Privacidad</a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
