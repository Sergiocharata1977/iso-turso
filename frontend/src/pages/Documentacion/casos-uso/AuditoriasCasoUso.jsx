import React from 'react';

const AuditoriasCasoUso = () => {
  return (
    <div className="p-6 bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Caso de Uso: Gestión de Auditorías</h1>
      <p className="mb-4">Este documento detalla el caso de uso para la gestión de auditorías dentro de IsoFlow3.</p>
      
      <h2 className="text-2xl font-semibold mb-2">Actores</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Auditor Líder</li>
        <li>Auditor Interno</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Descripción</h2>
      <p>El sistema permite planificar, ejecutar y registrar los resultados de las auditorías internas y externas.</p>

    </div>
  );
};

export default AuditoriasCasoUso;
