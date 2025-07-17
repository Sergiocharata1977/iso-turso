import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Code, Database, Shield, ArrowRight, Cpu } from 'lucide-react';

const ArquitecturaHome = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Visión General',
      description: 'Descripción general de la arquitectura del sistema ISO Flow 3.0',
      icon: Layers,
      path: '/documentacion/arquitectura/vision-general',
      color: 'emerald'
    },
    {
      title: 'Frontend',
      description: 'Arquitectura y componentes de la interfaz de usuario',
      icon: Code,
      path: '/documentacion/arquitectura/frontend',
      color: 'blue'
    },
    {
      title: 'Backend',
      description: 'Estructura de la API y servicios del servidor',
      icon: Cpu,
      path: '/documentacion/arquitectura/backend',
      color: 'purple'
    },
    {
      title: 'Base de Datos',
      description: 'Modelo de datos y esquema de la base de datos',
      icon: Database,
      path: '/documentacion/arquitectura/base-datos',
      color: 'orange'
    },
    {
      title: 'Seguridad',
      description: 'Arquitectura de seguridad y controles de acceso',
      icon: Shield,
      path: '/documentacion/arquitectura/seguridad',
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
      blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
      red: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Arquitectura del Sistema</h1>
      <p className="text-gray-600 mb-8">
        Documentación técnica detallada de la arquitectura de ISO Flow 3.0
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {sections.map((section) => (
          <button
            key={section.path}
            onClick={() => navigate(section.path)}
            className={`p-6 rounded-lg border-2 transition-all ${getColorClasses(section.color)} group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <section.icon className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>
                <p className="text-left opacity-80">
                  {section.description}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Diagrama de Arquitectura
        </h2>
        <div className="bg-white p-4 rounded border border-gray-200">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">
              [Diagrama de arquitectura del sistema]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArquitecturaHome;
