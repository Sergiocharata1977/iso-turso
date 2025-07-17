import React, { useState, useEffect } from 'react';

const AccionesPageSimple = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acciones, setAcciones] = useState([]);

  useEffect(() => {
    console.log('🔄 AccionesPageSimple - Componente montado');
    
    // Simulamos una carga simple
    setTimeout(() => {
      setAcciones([
        { id: 1, titulo: 'Acción de prueba 1', estado: 'planificacion' },
        { id: 2, titulo: 'Acción de prueba 2', estado: 'ejecucion' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Cargando acciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Acciones</h1>
      <p className="text-gray-600 mb-8">Versión simplificada para pruebas</p>
      
      <div className="grid gap-4">
        {acciones.map(accion => (
          <div key={accion.id} className="bg-white p-4 rounded-lg shadow border">
            <h3 className="font-bold text-lg">{accion.titulo}</h3>
            <p className="text-gray-600">Estado: {accion.estado}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-100 text-blue-800 rounded">
        ✅ Componente AccionesPageSimple funcionando correctamente
      </div>
    </div>
  );
};

export default AccionesPageSimple; 