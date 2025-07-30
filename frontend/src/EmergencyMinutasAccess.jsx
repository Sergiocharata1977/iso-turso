import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente de emergencia totalmente independiente
const EmergencyMinutasAccess = () => {
  const [minutas, setMinutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMinutas = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/minutas');
        setMinutas(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error al cargar minutas:', err);
        setError('No se pudieron cargar las minutas. Error: ' + (err.message || 'Desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchMinutas();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #0ea5e9', paddingBottom: '10px' }}>
        Acceso de Emergencia a Minutas
      </h1>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando minutas...
        </div>
      )}
      
      {error && (
        <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          {error}
        </div>
      )}
      
      {!loading && !error && minutas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
          No hay minutas disponibles.
        </div>
      )}
      
      {!loading && !error && minutas.length > 0 && (
        <div>
          <h2 style={{ color: '#4b5563', marginBottom: '15px' }}>Lista de Minutas ({minutas.length})</h2>
          <div>
            {minutas.map(minuta => (
              <div key={minuta.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '5px',
                padding: '15px',
                marginBottom: '15px',
                background: '#f9fafb'
              }}>
                <h3 style={{ color: '#0ea5e9', marginTop: '0' }}>{minuta.titulo}</h3>
                <p style={{ margin: '10px 0', color: '#6b7280' }}>
                  <strong>Responsable:</strong> {minuta.responsable}
                </p>
                <p style={{ margin: '10px 0' }}>{minuta.descripcion}</p>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '10px' }}>
                  Creado: {new Date(minuta.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyMinutasAccess;
