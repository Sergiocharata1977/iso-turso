import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Building, Briefcase, ClipboardCheck, FolderOpen } from 'lucide-react';

const CasosUsoList = () => {
  const navigate = useNavigate();

  const casosUso = [
    {
      id: 'usuarios',
      codigo: 'CU-001',
      titulo: 'Gestión de Usuarios',
      descripcion: 'Administración completa de usuarios del sistema',
      actor: 'Administrador',
      icon: Users,
      path: '/documentacion/casos-uso/usuarios'
    },
    {
      id: 'departamentos',
      codigo: 'CU-002',
      titulo: 'Gestión de Departamentos',
      descripcion: 'Creación y administración de departamentos organizacionales',
      actor: 'Administrador',
      icon: Building,
      path: '/documentacion/casos-uso/departamentos'
    },
    {
      id: 'procesos',
      codigo: 'CU-003',
      titulo: 'Gestión de Procesos',
      descripcion: 'Definición y control de procesos del SGC',
      actor: 'Responsable de Calidad',
      icon: Briefcase,
      path: '/documentacion/casos-uso/procesos'
    },
    {
      id: 'auditorias',
      codigo: 'CU-004',
      titulo: 'Gestión de Auditorías',
      descripcion: 'Planificación y ejecución de auditorías internas',
      actor: 'Auditor',
      icon: ClipboardCheck,
      path: '/documentacion/casos-uso/auditorias'
    },
    {
      id: 'documentos',
      codigo: 'CU-005',
      titulo: 'Gestión de Documentos',
      descripcion: 'Control y versionado de documentación del SGC',
      actor: 'Usuario',
      icon: FolderOpen,
      path: '/documentacion/casos-uso/documentos'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Casos de Uso</h1>
      <p className="text-gray-600 mb-8">
        Documentación detallada de todos los casos de uso del sistema ISO Flow 3.0
      </p>

      <div className="grid gap-4">
        {casosUso.map((caso) => (
          <button
            key={caso.id}
            onClick={() => navigate(caso.path)}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                <caso.icon className="h-6 w-6 text-gray-600 group-hover:text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-mono text-gray-500">{caso.codigo}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{caso.titulo}</h3>
                </div>
                <p className="text-gray-600 mb-2">{caso.descripcion}</p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Actor principal:</span> {caso.actor}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CasosUsoList;
