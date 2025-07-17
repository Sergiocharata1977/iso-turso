import React from 'react';

const DocumentosCasoUso = () => {
  return (
    <div className="p-6 bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Caso de Uso: Gestión de Documentos</h1>
      <p className="mb-4">Este documento detalla el caso de uso para la gestión de documentos dentro de IsoFlow3.</p>
      
      <h2 className="text-2xl font-semibold mb-2">Actores</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Administrador de Documentos</li>
        <li>Usuario General</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Descripción</h2>
      <p>El sistema permite controlar las versiones, aprobación y distribución de los documentos del sistema de gestión.</p>

    </div>
  );
};

export default DocumentosCasoUso;
