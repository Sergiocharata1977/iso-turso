import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Users, Building2, FileText, Shield, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const PlanesListing = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suscripcionActual, setSuscripcionActual] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Función temporal de debug
  const debugAuth = async () => {
    try {
      const response = await fetch('/api/suscripciones/debug', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      console.log('🔍 DEBUG AUTH:', data);
      console.log('🔍 Usuario actual:', user);
    } catch (error) {
      console.error('🔍 DEBUG AUTH ERROR:', error);
    }
  };

  useEffect(() => {
    cargarPlanes();
    cargarSuscripcionActual();
    debugAuth(); // Llamar debug temporalmente
  }, []);

  const cargarPlanes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/planes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar planes');
      }

      const data = await response.json();
      setPlanes(data.data || []);
    } catch (error) {
      console.error('Error al cargar planes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los planes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarSuscripcionActual = async () => {
    try {
      const response = await fetch('/api/suscripciones/organizacion/actual', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSuscripcionActual(data.data);
      }
    } catch (error) {
      console.error('Error al cargar suscripción actual:', error);
    }
  };

  const suscribirseAPlan = async (planId) => {
    try {
      const response = await fetch('/api/suscripciones', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan_id: planId,
          fecha_inicio: new Date().toISOString().split('T')[0],
          periodo: 'mensual'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('🔍 Error response:', errorData);
        
        // Si ya existe una suscripción, mostrar información más específica
        if (errorData.message && errorData.message.includes('Ya existe una suscripción activa')) {
          throw new Error('Ya tienes una suscripción activa. Puedes cambiar de plan desde tu perfil.');
        }
        
        throw new Error(errorData.message || 'Error al suscribirse');
      }

      const data = await response.json();
      toast({
        title: "Éxito",
        description: "Suscripción creada correctamente",
        variant: "default"
      });

      // Recargar la suscripción actual
      cargarSuscripcionActual();
    } catch (error) {
      console.error('Error al suscribirse:', error);
      toast({
        title: "Error",
        description: error.message || "Error al suscribirse al plan",
        variant: "destructive"
      });
    }
  };

  const cambiarPlan = async (nuevoPlanId) => {
    try {
      console.log('🔄 Iniciando cambio de plan:', { 
        planActual: suscripcionActual?.plan_id, 
        nuevoPlan: nuevoPlanId 
      });

      // Primero cancelar la suscripción actual
      if (suscripcionActual) {
        console.log('🔄 Cancelando suscripción actual:', suscripcionActual.id);
        const cancelResponse = await fetch(`/api/suscripciones/${suscripcionActual.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!cancelResponse.ok) {
          const cancelError = await cancelResponse.json();
          console.error('Error al cancelar suscripción:', cancelError);
          throw new Error(`Error al cancelar suscripción: ${cancelError.message}`);
        }

        console.log('✅ Suscripción actual cancelada');
      }

      // Luego crear la nueva suscripción
      console.log('🔄 Creando nueva suscripción para plan:', nuevoPlanId);
      await suscribirseAPlan(nuevoPlanId);
      
      // Recargar la suscripción actual
      await cargarSuscripcionActual();
      
      toast({
        title: "Éxito",
        description: "Plan cambiado correctamente",
        variant: "default"
      });
    } catch (error) {
      console.error('Error al cambiar plan:', error);
      toast({
        title: "Error",
        description: error.message || "Error al cambiar de plan",
        variant: "destructive"
      });
    }
  };

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case 'gratuito':
        return <Shield className="h-6 w-6 text-gray-500" />;
      case 'básico':
        return <Users className="h-6 w-6 text-blue-500" />;
      case 'profesional':
        return <Building2 className="h-6 w-6 text-purple-500" />;
      case 'empresarial':
        return <Star className="h-6 w-6 text-yellow-500" />;
      default:
        return <Zap className="h-6 w-6 text-emerald-500" />;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName.toLowerCase()) {
      case 'gratuito':
        return 'bg-gray-100 text-gray-800';
      case 'básico':
        return 'bg-blue-100 text-blue-800';
      case 'profesional':
        return 'bg-purple-100 text-purple-800';
      case 'empresarial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-emerald-100 text-emerald-800';
    }
  };

  const isPlanActual = (planId) => {
    return suscripcionActual?.plan_id === planId;
  };

  const esPlanGratuito = (planId) => {
    const plan = planes.find(p => p.id === planId);
    return plan?.es_plan_gratuito || false;
  };

  const obtenerPlanesDisponibles = () => {
    // Si no hay suscripción actual, mostrar todos los planes
    if (!suscripcionActual) {
      return planes;
    }

    // Si hay suscripción actual, filtrar el plan actual y mostrar solo los de cambio
    return planes.filter(plan => plan.id !== suscripcionActual.plan_id);
  };

  const obtenerPlanActual = () => {
    if (!suscripcionActual) return null;
    return planes.find(plan => plan.id === suscripcionActual.plan_id);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const planActual = obtenerPlanActual();
  const planesDisponibles = obtenerPlanesDisponibles();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {suscripcionActual ? 'Cambiar Plan' : 'Planes Disponibles'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {suscripcionActual 
            ? 'Elige un nuevo plan para tu organización'
            : 'Elige el plan que mejor se adapte a las necesidades de tu organización'
          }
        </p>
      </div>

      {/* Mostrar plan actual si existe */}
      {planActual && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Tu Plan Actual
          </h2>
          <Card className="border-2 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {getPlanIcon(planActual.nombre)}
              </div>
              <CardTitle className="text-xl text-emerald-800 dark:text-emerald-200">
                {planActual.nombre}
              </CardTitle>
              <div className="flex justify-center items-baseline gap-1">
                <span className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
                  ${planActual.precio_mensual}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">/mes</span>
              </div>
              <Badge className="bg-emerald-500 text-white mt-2">
                Plan Activo
              </Badge>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Estado: {suscripcionActual.estado} • 
                Inicio: {new Date(suscripcionActual.fecha_inicio).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mostrar planes disponibles para cambio */}
      {planesDisponibles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {suscripcionActual ? 'Planes Disponibles para Cambio' : 'Planes Disponibles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planesDisponibles.map((plan) => (
              <Card 
                key={plan.id} 
                className="relative transition-all duration-200 hover:shadow-lg"
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    {getPlanIcon(plan.nombre)}
                  </div>
                  <CardTitle className="text-xl">{plan.nombre}</CardTitle>
                  <div className="flex justify-center items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      ${plan.precio_mensual}
                    </span>
                    <span className="text-gray-500">/mes</span>
                  </div>
                  {plan.precio_anual > 0 && (
                    <p className="text-sm text-gray-500">
                      ${plan.precio_anual}/año (2 meses gratis)
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {plan.descripcion}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Hasta {plan.max_usuarios} usuarios</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span>Hasta {plan.max_departamentos} departamentos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>Hasta {plan.max_documentos} documentos</span>
                    </div>
                  </div>

                  {plan.caracteristicas && (
                    <div className="space-y-1">
                      {JSON.parse(plan.caracteristicas).map((caracteristica, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span>{caracteristica}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    className={`w-full ${
                      esPlanGratuito(plan.id)
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={() => suscripcionActual ? cambiarPlan(plan.id) : suscribirseAPlan(plan.id)}
                  >
                    {suscripcionActual ? (
                      <>
                        Cambiar a {plan.nombre}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      esPlanGratuito(plan.id) ? 'Comenzar Gratis' : 'Suscribirse'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje si no hay planes disponibles para cambio */}
      {suscripcionActual && planesDisponibles.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No hay otros planes disponibles</h3>
            <p>Ya tienes el plan más alto disponible. Contacta con soporte para opciones personalizadas.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanesListing; 