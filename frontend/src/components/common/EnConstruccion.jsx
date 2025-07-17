import React from 'react';
import { HardHat } from 'lucide-react';

const EnConstruccion = ({ featureName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300">
      <HardHat className="w-16 h-16 text-yellow-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Página en Construcción</h2>
      <p className="text-gray-500 text-center">
        La sección {featureName ? <strong>{featureName}</strong> : 'que buscas'} está siendo desarrollada y estará disponible muy pronto.
      </p>
      <p className="text-gray-500 mt-1">Agradecemos tu paciencia.</p>
    </div>
  );
};

export default EnConstruccion;
