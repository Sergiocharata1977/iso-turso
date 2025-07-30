import React from 'react';
import { useQuery } from '@tanstack/react-query';

const TestReactQuerySimple = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['test-simple'],
    queryFn: () => Promise.resolve('React Query funciona sin DevTools'),
  });

  if (isLoading) return <div style={{ padding: '10px', color: 'blue' }}>Probando React Query...</div>;
  if (error) return <div style={{ padding: '10px', color: 'red' }}>Error: {error.message}</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#e8f5e8', margin: '10px', border: '2px solid green' }}>
      <h3>✅ Test de React Query (Sin DevTools)</h3>
      <p><strong>{data}</strong></p>
      <p style={{ fontSize: '12px', color: 'gray' }}>Si ves este mensaje, React Query está funcionando correctamente</p>
    </div>
  );
};

export default TestReactQuerySimple; 