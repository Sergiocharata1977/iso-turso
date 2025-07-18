import React from 'react';

const TestSimpleComponent = () => {
  console.log('TestSimpleComponent: Renderizando');
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">
        Componente de Prueba Simple
      </h1>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <p>✅ Este componente se renderiza correctamente</p>
        <p>Si puedes ver este mensaje, el problema no está en el sistema de rutas</p>
      </div>
    </div>
  );
};

export default TestSimpleComponent; 