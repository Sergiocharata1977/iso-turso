import React from 'react';

const TestSimpleComponent = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Componente de Prueba</h1>
      <p className="text-gray-600">Este es un componente de prueba simple para verificar que el sistema de rutas funciona correctamente.</p>
      <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
        ✅ Si puedes ver este mensaje, el sistema de rutas está funcionando correctamente.
      </div>
    </div>
  );
};

export default TestSimpleComponent; 