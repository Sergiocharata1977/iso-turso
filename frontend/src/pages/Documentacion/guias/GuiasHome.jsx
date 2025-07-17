import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Settings, Users, FileText, Clock, CheckCircle } from 'lucide-react';

const GuiasHome = () => {
  const guides = [
    {
      title: 'Guía de Instalación',
      description: 'Sigue esta guía paso a paso para configurar ISO Flow 3.0 en tu entorno local o de producción.',
      icon: Settings,
      path: '/documentacion/guias/instalacion',
      category: 'Primeros Pasos',
      duration: '15 min',
      completed: true
    },
    {
      title: 'Configuración Inicial',
      description: 'Aprende a configurar tu organización, departamentos y usuarios después de la instalación.',
      icon: Users,
      path: '/documentacion/guias/configuracion',
      category: 'Primeros Pasos',
      duration: '10 min',
      completed: false
    },
    {
      title: 'Gestión de Documentos',
      description: 'Aprende a subir, organizar y gestionar documentos en el sistema.',
      icon: FileText,
      path: '/documentacion/guias/gestion-documentos',
      category: 'Funcionalidades Principales',
      duration: '20 min',
      completed: false
    },
    {
      title: 'Flujos de Trabajo',
      description: 'Configura y personaliza los flujos de trabajo de aprobación de documentos.',
      icon: Clock,
      path: '/documentacion/guias/flujos-trabajo',
      category: 'Funcionalidades Principales',
      duration: '25 min',
      completed: false
    },
    {
      title: 'API y Personalización',
      description: 'Guía para desarrolladores sobre cómo extender y personalizar ISO Flow 3.0.',
      icon: Code,
      path: '/documentacion/guias/api-personalizacion',
      category: 'Desarrollo',
      duration: '30 min',
      completed: false
    },
    {
      title: 'Buenas Prácticas',
      description: 'Recomendaciones y mejores prácticas para el uso efectivo de ISO Flow 3.0.',
      icon: CheckCircle,
      path: '/documentacion/guias/buenas-practicas',
      category: 'Recursos Adicionales',
      duration: '15 min',
      completed: false
    }
  ];

  // Agrupar guías por categoría
  const guidesByCategory = guides.reduce((acc, guide) => {
    if (!acc[guide.category]) {
      acc[guide.category] = [];
    }
    acc[guide.category].push(guide);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Guías y Tutoriales</h1>
        <p className="mt-2 text-gray-600">
          Aprende a utilizar ISO Flow 3.0 con nuestras guías paso a paso y tutoriales detallados.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Guías Disponibles</h2>
          <p className="mt-1 text-sm text-gray-500">
            Selecciona una guía para comenzar a aprender sobre las funcionalidades del sistema.
          </p>
        </div>

        <div className="border-t border-gray-200">
          {Object.entries(guidesByCategory).map(([category, categoryGuides]) => (
            <div key={category} className="border-b border-gray-200 last:border-b-0">
              <div className="px-4 py-3 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900">{category}</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {categoryGuides.map((guide) => (
                  <li key={guide.path}>
                    <Link
                      to={guide.path}
                      className="block hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                              <guide.icon className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-base font-medium text-gray-900">
                                {guide.title}
                                {guide.completed && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Completado
                                  </span>
                                )}
                              </h4>
                              <p className="text-sm text-gray-500">{guide.description}</p>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {guide.duration}
                            </span>
                            <span className="mt-1 text-xs text-gray-500">
                              {guide.completed ? 'Completado' : 'Pendiente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <BookOpen className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">¿No encuentras lo que buscas?</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Visita nuestra{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 underline">
                  documentación completa
                </a>{' '}
                o{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 underline">
                  contáctanos
                </a>{' '}
                si necesitas ayuda adicional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuiasHome;
