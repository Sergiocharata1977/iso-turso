import React from 'react';
import { BookOpen, Code, Users, FileText, HelpCircle, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/store/authStore';

const DocumentacionHome = () => {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'super_admin';

  const documentacionSections = [
    {
      id: 'funcional',
      title: '📚 Manual del Usuario',
      description: 'Guías y manuales para usuarios del sistema',
      icon: Users,
      color: 'bg-blue-500',
      items: [
        { title: 'Casos de Uso', description: 'Procedimientos estándar y workflows', path: '/app/documentacion/casos-uso' },
        { title: 'Manual de Usuario', description: 'Guías paso a paso por módulo', path: '/app/documentacion/manual-usuario' },
        { title: 'Soporte y FAQ', description: 'Preguntas frecuentes y solución de problemas', path: '/app/documentacion/soporte' }
      ]
    },
    // Solo mostrar documentación técnica a super administradores
    ...(isSuperAdmin ? [{
      id: 'tecnica',
      title: '🔧 Documentación Técnica',
      description: 'Documentación para desarrolladores y administradores',
      icon: Code,
      color: 'bg-emerald-500',
      items: [
        { title: 'Arquitectura del Sistema', description: 'Estructura, patrones y diseño', path: '/app/documentacion/arquitectura' },
        { title: 'Base de Datos', description: 'Esquemas, relaciones y migraciones', path: '/app/documentacion/base-datos' },
        { title: 'Desarrollo', description: 'Guías de desarrollo y despliegue', path: '/app/documentacion/desarrollo' },
        { title: 'Administración', description: 'Configuración y mantenimiento', path: '/app/documentacion/administracion' }
      ]
    }] : [])
  ];

  const quickActions = [
    {
      title: 'Buscar en Documentación',
      description: 'Búsqueda rápida en toda la documentación',
      icon: Search,
      action: () => console.log('Buscar')
    },
    {
      title: 'Descargar Manual PDF',
      description: 'Descargar manual completo en PDF',
      icon: Download,
      action: () => console.log('Descargar PDF')
    },
    {
      title: 'Soporte Técnico',
      description: 'Contactar al equipo de soporte',
      icon: HelpCircle,
      action: () => console.log('Soporte')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Documentación del Sistema</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Bienvenido a la documentación completa de ISOFlow3. Aquí encontrarás guías para usuarios, 
          documentación técnica para desarrolladores y todo lo necesario para usar el sistema eficientemente.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <action.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Sections */}
      <div className="space-y-6">
        {documentacionSections.map((section) => (
          <div key={section.id} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${section.color} rounded-lg flex items-center justify-center`}>
                <section.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item, index) => (
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
                      Ver Documentación
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas de Documentación</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">15+</div>
            <div className="text-sm text-gray-600">Guías de Usuario</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">8+</div>
            <div className="text-sm text-gray-600">Documentos Técnicos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">25+</div>
            <div className="text-sm text-gray-600">Casos de Uso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">10+</div>
            <div className="text-sm text-gray-600">Preguntas FAQ</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentacionHome;
