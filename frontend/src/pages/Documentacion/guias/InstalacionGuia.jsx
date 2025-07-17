import React from 'react';
import { Terminal, Package, GitBranch, Cpu, Database, Code2 } from 'lucide-react';

const InstalacionGuia = () => {
  const steps = [
    {
      title: 'Requisitos Previos',
      icon: Cpu,
      items: [
        'Node.js 16.x o superior',
        'npm 8.x o superior',
        'MySQL 8.0 o PostgreSQL 14+',
        'Git'
      ]
    },
    {
      title: 'Clonar el Repositorio',
      icon: GitBranch,
      content: (
        <div className="space-y-2">
          <p>Clona el repositorio de ISO Flow 3.0:</p>
          <div className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code>git clone https://github.com/tu-usuario/isoflow3.git</code>
            </pre>
          </div>
          <p className="text-sm text-gray-600">
            Navega al directorio del proyecto: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">cd isoflow3</code>
          </p>
        </div>
      )
    },
    {
      title: 'Configuración del Backend',
      icon: Database,
      content: (
        <div className="space-y-4">
          <div>
            <p>1. Instala las dependencias:</p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-1 overflow-x-auto">
              <pre className="text-sm">
                <code>cd backend</code>
                <code>npm install</code>
              </pre>
            </div>
          </div>
          <div>
            <p>2. Configura las variables de entorno:</p>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-1 overflow-x-auto">
              <pre className="text-sm text-gray-800">
                <code># Crear archivo .env</code>
                <code>cp .env.example .env</code>
                <code> </code>
                <code># Editar las variables según tu configuración</code>
                <code>DB_HOST=localhost</code>
                <code>DB_PORT=3306</code>
                <code>DB_USER=tu_usuario</code>
                <code>DB_PASSWORD=tu_contraseña</code>
                <code>DB_NAME=isoflow3</code>
                <code>JWT_SECRET=tu_clave_secreta</code>
              </pre>
            </div>
          </div>
          <div>
            <p>3. Inicia la base de datos:</p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-1 overflow-x-auto">
              <pre className="text-sm">
                <code># Para MySQL</code>
                <code>mysql -u root -p &lt; database/schema.sql</code>
                <code> </code>
                <code># Para PostgreSQL</code>
                <code>psql -U postgres -f database/schema.sql</code>
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Configuración del Frontend',
      icon: Code2,
      content: (
        <div className="space-y-4">
          <div>
            <p>1. Instala las dependencias:</p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-1 overflow-x-auto">
              <pre className="text-sm">
                <code>cd ../frontend</code>
                <code>npm install</code>
              </pre>
            </div>
          </div>
          <div>
            <p>2. Configura las variables de entorno:</p>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-1 overflow-x-auto">
              <pre className="text-sm text-gray-800">
                <code># Crear archivo .env</code>
                <code>cp .env.example .env</code>
                <code> </code>
                <code># Configurar la URL de la API</code>
                <code>VITE_API_URL=http://localhost:5000/api</code>
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Iniciar la Aplicación',
      icon: Terminal,
      content: (
        <div className="space-y-4">
          <div>
            <p>1. Inicia el servidor backend:</p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-1 overflow-x-auto">
              <pre className="text-sm">
                <code>cd ../backend</code>
                <code>npm run dev</code>
              </pre>
            </div>
          </div>
          <div>
            <p>2. En otra terminal, inicia el frontend:</p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-1 overflow-x-auto">
              <pre className="text-sm">
                <code>cd ../frontend</code>
                <code>npm run dev</code>
              </pre>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-blue-800 font-medium">¡Listo! La aplicación debería estar disponible en:</p>
            <a 
              href="http://localhost:5173" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              http://localhost:5173
            </a>
          </div>
        </div>
      )
    },
    {
      title: 'Primeros Pasos',
      icon: Package,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
            <h4 className="font-medium text-emerald-800 mb-2">Credenciales por defecto:</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Email:</span> admin@demo.com</p>
              <p><span className="font-medium">Contraseña:</span> admin123</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recomendaciones:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Cambia la contraseña por defecto después del primer inicio de sesión</li>
              <li>Revisa la configuración de la organización</li>
              <li>Configura los departamentos y puestos de trabajo</li>
              <li>Importa o crea los procesos de tu organización</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Guía de Instalación</h1>
        <p className="text-gray-600">
          Sigue estos pasos para configurar e instalar ISO Flow 3.0 en tu entorno local o de producción.
        </p>
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={index} className="border-l-4 border-emerald-500 pl-6 py-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <step.icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
            </div>
            
            {step.items ? (
              <ul className="space-y-2 pl-2">
                {step.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="pl-2">
                {step.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstalacionGuia;
