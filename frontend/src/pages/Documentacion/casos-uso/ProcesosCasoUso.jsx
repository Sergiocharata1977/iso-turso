import React from 'react';

const ProcesosCasoUso = () => {
  return (
    <div className="p-6 bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Caso de Uso: Gestión de Procesos</h1>
      <p className="mb-4">Este documento detalla el caso de uso para la gestión de procesos dentro de IsoFlow3.</p>
      
      <h2 className="text-2xl font-semibold mb-2">Actores</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Administrador</li>
        <li>Gerente de Calidad</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Descripción</h2>
      <p>El sistema permite a los usuarios autorizados crear, visualizar, editar y eliminar procesos del sistema de gestión de calidad.</p>

    </div>
  );
};

export default ProcesosCasoUso;
