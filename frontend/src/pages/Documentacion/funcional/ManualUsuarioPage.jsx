import React from 'react';
import { BookOpen, Users, Building, FileText, ClipboardCheck, Target, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ManualUsuarioPage = () => {
  const modulosSistema = [
    {
      id: 'recursos-humanos',
      title: '👥 Recursos Humanos',
      description: 'Gestión completa del personal y capacitaciones',
      icon: Users,
      color: 'bg-blue-500',
      items: [
        { title: 'Personal', description: 'Gestión de empleados y perfiles', path: '/app/personal' },
        { title: 'Departamentos', description: 'Organización por departamentos', path: '/app/departamentos' },
        { title: 'Puestos', description: 'Definición de roles y responsabilidades', path: '/app/puestos' },
        { title: 'Capacitaciones', description: 'Programas de formación y desarrollo', path: '/app/capacitaciones' }
      ]
    },
    {
      id: 'sistema-gestion',
      title: '🏢 Sistema de Gestión',
      description: 'Módulos principales del SGC ISO 9001',
      icon: Building,
      color: 'bg-emerald-500',
      items: [
        { title: 'Auditorías', description: 'Gestión de auditorías internas y externas', path: '/app/auditorias' },
        { title: 'Procesos', description: 'Mapeo y gestión de procesos', path: '/app/procesos' },
        { title: 'Documentos', description: 'Control de documentos del sistema', path: '/app/documentos' },
        { title: 'Normas', description: 'Gestión de normas y estándares', path: '/app/normas' }
      ]
    },
    {
      id: 'planificacion',
      title: '📋 Planificación y Revisión',
      description: 'Planificación estratégica y revisión por la dirección',
      icon: Target,
      color: 'bg-purple-500',
      items: [
        { title: 'Planificación Estratégica', description: 'Planes y objetivos estratégicos', path: '/app/planificacion-estrategica' },
        { title: 'Revisión por la Dirección', description: 'Revisiones gerenciales', path: '/app/revision-direccion' },
        { title: 'Objetivos y Metas', description: 'Gestión de objetivos de calidad', path: '/app/objetivos-metas' },
        { title: 'Política de Calidad', description: 'Política y compromisos', path: '/app/politica-calidad' }
      ]
    },
    {
      id: 'mejora',
      title: '🔧 Mejora Continua',
      description: 'Sistema de mejora y acciones correctivas',
      icon: ClipboardCheck,
      color: 'bg-orange-500',
      items: [
        { title: 'Hallazgos', description: 'Gestión de hallazgos y no conformidades', path: '/app/hallazgos' },
        { title: 'Acciones', description: 'Acciones correctivas y preventivas', path: '/app/acciones' },
        { title: 'Indicadores', description: 'Indicadores de calidad y métricas', path: '/app/indicadores' }
      ]
    },
    {
      id: 'administracion',
      title: '⚙️ Administración',
      description: 'Configuración y administración del sistema',
      icon: Settings,
      color: 'bg-gray-500',
      items: [
        { title: 'Usuarios', description: 'Gestión de usuarios y permisos', path: '/app/usuarios' },
        { title: 'Planes', description: 'Gestión de planes y suscripciones', path: '/app/planes' },
        { title: 'Configuración', description: 'Configuración del sistema', path: '/app/configuracion' }
      ]
    }
  ];

  const guiasRapidas = [
    {
      title: 'Primeros Pasos',
      description: 'Configuración inicial y primeros usos',
      steps: [
        '1. Configurar organización y datos básicos',
        '2. Crear departamentos y estructura',
        '3. Registrar personal inicial',
        '4. Configurar procesos principales'
      ]
    },
    {
      title: 'Gestión Diaria',
      description: 'Operaciones cotidianas del sistema',
      steps: [
        '1. Revisar dashboard y métricas',
        '2. Gestionar hallazgos y acciones',
        '3. Actualizar documentación',
        '4. Programar auditorías'
      ]
    },
    {
      title: 'Reportes y Análisis',
      description: 'Generación de reportes y análisis',
      steps: [
        '1. Acceder a módulo de indicadores',
        '2. Seleccionar período de análisis',
        '3. Generar reportes personalizados',
        '4. Exportar datos para análisis'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Manual del Usuario</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Guía completa para usuarios del sistema ISOFlow3. Aprende a usar todos los módulos 
          y funcionalidades del sistema de gestión de calidad.
        </p>
      </div>

      {/* Módulos del Sistema */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">📚 Módulos del Sistema</h2>
        
        {modulosSistema.map((modulo) => (
          <div key={modulo.id} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${modulo.color} rounded-lg flex items-center justify-center`}>
                <modulo.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{modulo.title}</h3>
                <p className="text-gray-600">{modulo.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modulo.items.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-800">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.location.href = item.path}
                    >
                      Ir al Módulo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Guías Rápidas */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">🚀 Guías Rápidas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guiasRapidas.map((guia, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {guia.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{guia.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {guia.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="text-sm text-gray-700">
                      {step}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Consejos y Mejores Prácticas */}
      <div className="bg-emerald-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Consejos y Mejores Prácticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-emerald-800">Organización</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Mantén la información actualizada regularmente</li>
              <li>• Usa nombres descriptivos para documentos</li>
              <li>• Organiza los procesos por departamentos</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-emerald-800">Eficiencia</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Utiliza los filtros para encontrar información</li>
              <li>• Configura alertas para fechas importantes</li>
              <li>• Exporta reportes regularmente</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Enlaces de Ayuda */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔗 Enlaces Útiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Documentación</h4>
            <div className="space-y-2">
              <Button variant="link" className="p-0 h-auto text-blue-600">
                Casos de Uso Detallados
              </Button>
              <Button variant="link" className="p-0 h-auto text-blue-600">
                FAQ y Preguntas Frecuentes
              </Button>
              <Button variant="link" className="p-0 h-auto text-blue-600">
                Videos Tutoriales
              </Button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Soporte</h4>
            <div className="space-y-2">
              <Button variant="link" className="p-0 h-auto text-blue-600">
                Contactar Soporte Técnico
              </Button>
              <Button variant="link" className="p-0 h-auto text-blue-600">
                Reportar un Problema
              </Button>
              <Button variant="link" className="p-0 h-auto text-blue-600">
                Solicitar Capacitación
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualUsuarioPage; 