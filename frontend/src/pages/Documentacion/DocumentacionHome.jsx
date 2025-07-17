import React from 'react';
import { BookOpen } from 'lucide-react';

const DocumentacionHome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300">
      <BookOpen className="w-16 h-16 text-emerald-500 mb-4" />
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido a la Documentación</h2>
      <p className="text-gray-600 text-center max-w-md">
        Utiliza el menú de la izquierda para navegar por las diferentes secciones.
        Actualmente, todas las secciones se encuentran en construcción y estarán disponibles próximamente.
      </p>
    </div>
  );
};

export default DocumentacionHome;
