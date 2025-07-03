import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMessages } from '@/services/messageService'; // Asumimos que crearemos este servicio

const ComunicacionesPage = () => {
  const { data: messages, isLoading, isError, error } = useQuery({
    queryKey: ['messages'],
    queryFn: getMessages
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Comunicaciones Internas</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Nuevo Mensaje
        </button>
      </div>

      {isLoading && <p>Cargando mensajes...</p>}
      {isError && <p className="text-red-500">Error al cargar mensajes: {error.message}</p>}

      {messages && (
        <div className="bg-white shadow-md rounded-lg">
          <ul className="divide-y divide-gray-200">
            {messages.map(message => (
              <li key={message.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <p className="font-semibold">{message.subject}</p>
                  <p className="text-sm text-gray-500">De: {message.sender_name}</p>
                </div>
                <p className="text-sm text-gray-600">Recibido: {new Date(message.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {messages && messages.length === 0 && (
          <p>No tienes mensajes.</p>
      )}
    </div>
  );
};

export default ComunicacionesPage;
