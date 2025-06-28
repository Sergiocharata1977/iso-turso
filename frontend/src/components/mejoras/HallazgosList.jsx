import React from 'react';
import HallazgoCard from './HallazgoCard';

const HallazgosList = ({ hallazgos, onCardClick }) => {
  if (!hallazgos || hallazgos.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 dark:bg-slate-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">No se encontraron hallazgos</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Parece que no hay nada por aquí. ¡Intenta crear un nuevo hallazgo!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {hallazgos.map((hallazgo) => (
        <HallazgoCard 
          key={hallazgo.id}
          hallazgo={hallazgo}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default HallazgosList;
